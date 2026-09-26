#!/usr/bin/env python3
"""
Shopify Admin API Wrapper
Typed wrappers for products, inventory, orders, themes, etc.
"""

import os
import json
import requests
from pathlib import Path
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import logging

from shopify_token_refresh import get_auth_headers

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================
# CONFIGURATION
# ============================================================
STORE_DOMAIN = "hornshalosshop.myshopify.com"
API_VERSION = "2026-07"
BASE_URL = f"https://{STORE_DOMAIN}/admin/api/{API_VERSION}"

# ============================================================
# DATA CLASSES
# ============================================================

@dataclass
class ProductImage:
    src: str
    alt_text: str = ""
    position: int = 1

@dataclass
class ProductVariant:
    title: str = "Default Title"
    price: str = "0.00"
    sku: str = ""
    inventory_quantity: int = 0
    inventory_management: str = "shopify"
    inventory_policy: str = "deny"
    fulfillment_service: str = "manual"
    weight: float = 0.0
    weight_unit: str = "g"
    requires_shipping: bool = True
    taxable: bool = True
    barcode: str = ""

@dataclass
class Product:
    title: str
    body_html: str = ""
    vendor: str = "Horns & Halos"
    product_type: str = "Apparel"
    tags: str = ""
    status: str = "active"  # active, draft, archived
    images: List[ProductImage] = None
    variants: List[ProductVariant] = None
    options: List[Dict] = None

    def __post_init__(self):
        if self.images is None:
            self.images = []
        if self.variants is None:
            self.variants = [ProductVariant()]
        if self.options is None:
            self.options = [{"name": "Title", "values": ["Default Title"]}]


# ============================================================
# API CLIENT
# ============================================================

class ShopifyAPI:
    """Shopify Admin REST API client with auto-refresh."""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()

    def _request(
        self,
        method: str,
        endpoint: str,
        data: dict = None,
        params: dict = None,
        force_refresh: bool = False,
    ) -> dict:
        """Make authenticated request with auto-refresh on 401."""
        url = f"{self.base_url}{endpoint}"
        headers = get_auth_headers(force_refresh)

        for attempt in range(2):  # retry once on 401
            response = self.session.request(
                method, url, headers=headers, json=data, params=params, timeout=30
            )
            if response.status_code == 401 and attempt == 0:
                logger.warning("Token expired, refreshing...")
                headers = get_auth_headers(force_refresh=True)
                continue
            response.raise_for_status()
            return response.json() if response.content else {}

        response.raise_for_status()
        return {}

    # ---------- PRODUCTS ----------

    def create_product(self, product: Product) -> dict:
        """Create a new product."""
        payload = {"product": self._product_to_dict(product)}
        return self._request("POST", "/products.json", data=payload)

    def get_product(self, product_id: int) -> dict:
        """Get product by ID."""
        return self._request("GET", f"/products/{product_id}.json")

    def update_product(self, product_id: int, product: Product) -> dict:
        """Update existing product."""
        payload = {"product": self._product_to_dict(product, include_id=True)}
        return self._request("PUT", f"/products/{product_id}.json", data=payload)

    def delete_product(self, product_id: int) -> bool:
        """Delete product."""
        self._request("DELETE", f"/products/{product_id}.json")
        return True

    def list_products(self, limit: int = 50, **filters) -> List[dict]:
        """List products with optional filters."""
        params = {"limit": limit, **filters}
        return self._request("GET", "/products.json", params=params).get("products", [])

    def _product_to_dict(self, product: Product, include_id: bool = False) -> dict:
        """Convert Product dataclass to Shopify API dict."""
        d = {
            "title": product.title,
            "body_html": product.body_html,
            "vendor": product.vendor,
            "product_type": product.product_type,
            "tags": product.tags,
            "status": product.status,
            "images": [asdict(img) for img in product.images],
            "variants": [asdict(var) for var in product.variants],
            "options": product.options,
        }
        if include_id:
            d["id"] = product.id  # type: ignore
        return d

    # ---------- INVENTORY ----------

    def get_inventory_level(self, inventory_item_id: int, location_id: int) -> dict:
        """Get inventory level for item at location."""
        params = {"inventory_item_ids": inventory_item_id, "location_ids": location_id}
        return self._request("GET", "/inventory_levels.json", params=params)

    def set_inventory_level(
        self, inventory_item_id: int, location_id: int, available: int
    ) -> dict:
        """Set inventory level (adjusts available quantity)."""
        data = {
            "location_id": location_id,
            "inventory_item_id": inventory_item_id,
            "available": available,
        }
        return self._request("POST", "/inventory_levels/set.json", data=data)

    def adjust_inventory_level(
        self, inventory_item_id: int, location_id: int, adjustment: int
    ) -> dict:
        """Adjust inventory level by delta."""
        data = {
            "location_id": location_id,
            "inventory_item_id": inventory_item_id,
            "available_adjustment": adjustment,
        }
        return self._request("POST", "/inventory_levels/adjust.json", data=data)

    def get_locations(self) -> List[dict]:
        """Get all locations."""
        return self._request("GET", "/locations.json").get("locations", [])

    # ---------- ORDERS ----------

    def get_order(self, order_id: int) -> dict:
        """Get order by ID."""
        return self._request("GET", f"/orders/{order_id}.json")

    def list_orders(self, limit: int = 50, **filters) -> List[dict]:
        """List orders with filters."""
        params = {"limit": limit, **filters}
        return self._request("GET", "/orders.json", params=params).get("orders", [])

    def fulfill_order(
        self,
        order_id: int,
        line_items: List[Dict],
        tracking_number: str = "",
        tracking_company: str = "",
        notify_customer: bool = True,
    ) -> dict:
        """Create fulfillment for order."""
        fulfillment = {
            "location_id": line_items[0].get("location_id") if line_items else None,
            "line_items": line_items,
            "tracking_number": tracking_number,
            "tracking_company": tracking_company,
            "notify_customer": notify_customer,
        }
        return self._request(
            "POST", f"/orders/{order_id}/fulfillments.json", data={"fulfillment": fulfillment}
        )

    # ---------- MEDIA / FILES ----------

    def upload_file(self, file_path: str, filename: str = None) -> dict:
        """Upload file to Shopify (returns file object)."""
        if filename is None:
            filename = Path(file_path).name

        # First, create file reference
        create_resp = self._request(
            "POST",
            "/files.json",
            data={"file": {"original_filename": filename, "content_type": "image"}},
        )
        file_id = create_resp.get("file", {}).get("id")

        # Upload actual file (simplified - real implementation needs staged uploads)
        logger.warning("File upload requires staged uploads - use GraphQL for production")
        return create_resp

    def create_product_media(self, product_id: int, media_url: str, alt_text: str = "") -> dict:
        """Add media (image/video) to product."""
        data = {
            "media": [
                {
                    "media_content_type": "IMAGE",
                    "original_source": media_url,
                    "alt": alt_text,
                }
            ]
        }
        return self._request("POST", f"/products/{product_id}/media.json", data=data)

    # ---------- THEMES ----------

    def list_themes(self) -> List[dict]:
        """List all themes."""
        return self._request("GET", "/themes.json").get("themes", [])

    def get_theme(self, theme_id: int) -> dict:
        """Get theme by ID."""
        return self._request("GET", f"/themes/{theme_id}.json")

    def create_theme(self, name: str, role: str = "unpublished") -> dict:
        """Create new theme."""
        data = {"theme": {"name": name, "role": role}}
        return self._request("POST", "/themes.json", data=data)

    def update_theme_assets(self, theme_id: int, assets: List[Dict]) -> dict:
        """Update theme assets (templates, sections, snippets)."""
        data = {"assets": assets}
        return self._request("PUT", f"/themes/{theme_id}/assets.json", data=data)

    # ---------- CUSTOMERS ----------

    def get_customer(self, customer_id: int) -> dict:
        """Get customer by ID."""
        return self._request("GET", f"/customers/{customer_id}.json")

    def list_customers(self, limit: int = 50, **filters) -> List[dict]:
        """List customers."""
        params = {"limit": limit, **filters}
        return self._request("GET", "/customers.json", params=params).get("customers", [])

    # ---------- UTILITIES ----------

    def test_connection(self) -> bool:
        """Test API connection."""
        try:
            self._request("GET", "/shop.json")
            return True
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False


# Singleton
_api_client: Optional[ShopifyAPI] = None


def get_api() -> ShopifyAPI:
    """Get singleton API client."""
    global _api_client
    if _api_client is None:
        _api_client = ShopifyAPI()
    return _api_client


# Convenience functions
def create_product(product: Product) -> dict:
    return get_api().create_product(product)


def get_product(product_id: int) -> dict:
    return get_api().get_product(product_id)


def update_product(product_id: int, product: Product) -> dict:
    return get_api().update_product(product_id, product)


def list_products(**kwargs) -> List[dict]:
    return get_api().list_products(**kwargs)


def set_inventory(inventory_item_id: int, location_id: int, available: int) -> dict:
    return get_api().set_inventory_level(inventory_item_id, location_id, available)


def fulfill_order(order_id: int, line_items: List[Dict], **kwargs) -> dict:
    return get_api().fulfill_order(order_id, line_items, **kwargs)


def upload_media(product_id: int, media_url: str, alt_text: str = "") -> dict:
    return get_api().create_product_media(product_id, media_url, alt_text)


if __name__ == "__main__":
    api = ShopifyAPI()
    if api.test_connection():
        print("✅ Shopify API connection successful")
        shop = api._request("GET", "/shop.json")
        print(f"   Shop: {shop.get('shop', {}).get('name')}")
    else:
        print("❌ Connection failed")