#!/usr/bin/env python3
"""
Horns & Halos Dropship Sync
Pulls products from Spreadshop (or other POD) and creates/updates Shopify listings.
Integrates with Product Line bot (botline.py) for brand assets.
"""

import os
import json
import requests
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import time

from shopify_api import ShopifyAPI, Product, ProductImage, ProductVariant, get_api
from shopify_token_refresh import get_access_token

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================
# CONFIGURATION
# ============================================================

# Spreadshop API (adjust based on actual API)
SPREADSHOP_API_BASE = "https://api.spreadshop.net/v1"  # placeholder
SPREADSHOP_SHOP_ID = os.getenv("SPREADSHOP_SHOP_ID", "")
SPREADSHOP_API_KEY = os.getenv("SPREADSHOP_API_KEY", "")

# Local paths
BOTLINE_OUTPUT_DIR = Path(__file__).parent.parent / "HA.OS" / "productline" / "output"
HAVENLY_PRODUCTS_FILE = Path(__file__).parent.parent / "havenly" / "data" / "products.json"
SHOPIFY_CSV_OUTPUT = Path(__file__).parent.parent / "HA.OS" / "productline" / "shopify_export.csv"

# Brand config
BRAND_VENDOR = "Horns & Halos"
BRAND_TAGS = "streetwear,horns,halos,duality,limited"
DEFAULT_PRODUCT_TYPE = "Apparel"

# Sync settings
SYNC_INTERVAL_HOURS = 6
MAX_PRODUCTS_PER_SYNC = 50


@dataclass
class SpreadshopProduct:
    """Normalized product from Spreadshop."""
    external_id: str
    name: str
    description: str
    base_price: float
    currency: str = "USD"
    images: List[str] = None
    variants: List[Dict] = None
    categories: List[str] = None

    def __post_init__(self):
        if self.images is None:
            self.images = []
        if self.variants is None:
            self.variants = []
        if self.categories is None:
            self.categories = []


class SpreadshopClient:
    """Client for Spreadshop API."""

    def __init__(self, shop_id: str = SPREADSHOP_SHOP_ID, api_key: str = SPREADSHOP_API_KEY):
        self.shop_id = shop_id
        self.api_key = api_key
        self.session = requests.Session()
        if api_key:
            self.session.headers.update({"Authorization": f"Bearer {api_key}"})

    def fetch_products(self, limit: int = 100) -> List[SpreadshopProduct]:
        """Fetch products from Spreadshop."""
        # NOTE: This is a placeholder - replace with actual Spreadshop API calls
        logger.warning("Spreadshop API not configured - returning mock data")
        return self._mock_products()

    def _mock_products(self) -> List[SpreadshopProduct]:
        """Mock data for testing."""
        return [
            SpreadshopProduct(
                external_id="spread_001",
                name="Horns Rising Tee",
                description="Light breaks through darkness. Premium cotton tee featuring the Horns Rising design.",
                base_price=24.99,
                images=[
                    "https://example.com/horns-rising-front.png",
                    "https://example.com/horns-rising-back.png",
                ],
                variants=[
                    {"size": "S", "color": "Black", "sku": "HR-BLK-S"},
                    {"size": "M", "color": "Black", "sku": "HR-BLK-M"},
                    {"size": "L", "color": "Black", "sku": "HR-BLK-L"},
                    {"size": "XL", "color": "Black", "sku": "HR-BLK-XL"},
                ],
                categories=["Tees", "Horns Collection"],
            ),
            SpreadshopProduct(
                external_id="spread_002",
                name="Halos Descending Hoodie",
                description="Embrace the shadows. Heavyweight hoodie with Halos Descending artwork.",
                base_price=49.99,
                images=[
                    "https://example.com/halos-hoodie-front.png",
                    "https://example.com/halos-hoodie-back.png",
                ],
                variants=[
                    {"size": "S", "color": "Charcoal", "sku": "HD-CHR-S"},
                    {"size": "M", "color": "Charcoal", "sku": "HD-CHR-M"},
                    {"size": "L", "color": "Charcoal", "sku": "HD-CHR-L"},
                    {"size": "XL", "color": "Charcoal", "sku": "HD-CHR-XL"},
                ],
                categories=["Hoodies", "Halos Collection"],
            ),
        ]


class DropshipSync:
    """Main sync orchestrator."""

    def __init__(self):
        self.api = get_api()
        self.spreadshop = SpreadshopClient()
        self.seen_products: Dict[str, int] = {}  # external_id -> shopify_product_id
        self.load_mapping()

    def load_mapping(self):
        """Load external_id -> shopify_id mapping."""
        mapping_file = Path(__file__).parent / ".product_mapping.json"
        if mapping_file.exists():
            self.seen_products = json.loads(mapping_file.read_text())

    def save_mapping(self):
        """Save external_id -> shopify_id mapping."""
        mapping_file = Path(__file__).parent / ".product_mapping.json"
        mapping_file.write_text(json.dumps(self.seen_products, indent=2))

    def convert_to_shopify_product(self, sp: SpreadshopProduct) -> Product:
        """Convert Spreadshop product to Shopify Product."""
        # Use botline-generated assets if available
        botline_assets = self._get_botline_assets(sp.external_id)

        images = []
        for i, img_url in enumerate(sp.images):
            images.append(ProductImage(
                src=img_url,
                alt_text=f"{sp.name} - view {i+1}",
                position=i+1,
            ))

        variants = []
        for var in sp.variants:
            variants.append(ProductVariant(
                title=f"{var.get('size', '')} / {var.get('color', '')}".strip(" /"),
                price=str(sp.base_price),
                sku=var.get("sku", f"{sp.external_id}-{var.get('size', '')}-{var.get('color', '')}"),
                inventory_quantity=100,  # POD = unlimited
                inventory_management="shopify",
                inventory_policy="continue",  # allow oversell for POD
            ))

        # Build description with brand story
        body_html = f"""
<div class="product-description">
  <p>{sp.description}</p>
  <hr>
  <h3>The Horns & Halos Philosophy</h3>
  <p>Every design tells a story of duality — the horn and the halo, the shadow and the light.
  We don't choose sides. We wear both.</p>
  <p><strong>Printed on demand</strong> — each piece made when you order it.</p>
  <ul>
    <li>Premium materials</li>
    <li>Eco-friendly inks</li>
    <li>Ships worldwide</li>
  </ul>
</div>
"""

        tags = f"{BRAND_TAGS},{','.join(sp.categories)}"

        return Product(
            title=sp.name,
            body_html=body_html,
            vendor=BRAND_VENDOR,
            product_type=DEFAULT_PRODUCT_TYPE,
            tags=tags,
            status="active",
            images=images,
            variants=variants,
            options=[{"name": "Size", "values": sorted(set(v.get("size", "") for v in sp.variants))}],
        )

    def _get_botline_assets(self, external_id: str) -> Dict:
        """Check for botline-generated assets (mockups, enhanced images)."""
        # Look for botline output matching this product
        asset_dir = BOTLINE_OUTPUT_DIR / external_id
        if asset_dir.exists():
            return {
                "mockups": list(asset_dir.glob("*mockup*.png")),
                "enhanced_images": list(asset_dir.glob("*enhanced*.png")),
            }
        return {}

    def sync_product(self, sp: SpreadshopProduct) -> Dict[str, Any]:
        """Sync single product to Shopify."""
        shopify_product = self.convert_to_shopify_product(sp)

        if sp.external_id in self.seen_products:
            # Update existing
            product_id = self.seen_products[sp.external_id]
            try:
                result = self.api.update_product(product_id, shopify_product)
                logger.info(f"Updated product {product_id}: {sp.name}")
                return {"action": "updated", "product_id": product_id, "external_id": sp.external_id}
            except Exception as e:
                logger.error(f"Failed to update {sp.external_id}: {e}")
                return {"action": "error", "external_id": sp.external_id, "error": str(e)}
        else:
            # Create new
            try:
                result = self.api.create_product(shopify_product)
                product_id = result.get("product", {}).get("id")
                if product_id:
                    self.seen_products[sp.external_id] = product_id
                    self.save_mapping()
                    logger.info(f"Created product {product_id}: {sp.name}")
                    return {"action": "created", "product_id": product_id, "external_id": sp.external_id}
                else:
                    raise ValueError("No product ID in response")
            except Exception as e:
                logger.error(f"Failed to create {sp.external_id}: {e}")
                return {"action": "error", "external_id": sp.external_id, "error": str(e)}

    def full_sync(self, limit: int = MAX_PRODUCTS_PER_SYNC) -> Dict[str, Any]:
        """Run full sync cycle."""
        logger.info("Starting dropship sync...")
        start_time = time.time()

        spreadshop_products = self.spreadshop.fetch_products(limit=limit)
        logger.info(f"Fetched {len(spreadshop_products)} products from Spreadshop")

        results = {"created": 0, "updated": 0, "errors": 0, "details": []}

        for sp in spreadshop_products:
            result = self.sync_product(sp)
            results["details"].append(result)
            if result["action"] == "created":
                results["created"] += 1
            elif result["action"] == "updated":
                results["updated"] += 1
            else:
                results["errors"] += 1

            # Rate limiting
            time.sleep(0.5)

        results["duration_seconds"] = round(time.time() - start_time, 2)
        results["timestamp"] = datetime.utcnow().isoformat()

        logger.info(f"Sync complete: {results['created']} created, {results['updated']} updated, {results['errors']} errors")
        return results

    def export_to_havenly(self, results: Dict = None):
        """Export products to havenly/data/products.json for storefront."""
        all_products = []
        for ext_id, shopify_id in self.seen_products.items():
            try:
                product = self.api.get_product(shopify_id)
                all_products.append(product.get("product", {}))
            except Exception as e:
                logger.warning(f"Failed to fetch {ext_id}: {e}")

        HAVENLY_PRODUCTS_FILE.parent.mkdir(parents=True, exist_ok=True)
        HAVENLY_PRODUCTS_FILE.write_text(json.dumps({"products": all_products}, indent=2))
        logger.info(f"Exported {len(all_products)} products to {HAVENLY_PRODUCTS_FILE}")

    def export_shopify_csv(self, results: Dict = None):
        """Export products in Shopify CSV format for bulk import."""
        import csv

        all_products = []
        for ext_id, shopify_id in self.seen_products.items():
            try:
                product = self.api.get_product(shopify_id)
                all_products.append(product.get("product", {}))
            except Exception as e:
                logger.warning(f"Failed to fetch {ext_id}: {e}")

        if not all_products:
            return

        SHOPIFY_CSV_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

        with open(SHOPIFY_CSV_OUTPUT, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            # Shopify CSV header
            writer.writerow([
                "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags",
                "Published", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
                "Option3 Name", "Option3 Value", "Variant SKU", "Variant Grams", "Variant Inventory Tracker",
                "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service",
                "Variant Price", "Variant Compare At Price", "Variant Requires Shipping",
                "Variant Taxable", "Variant Barcode", "Image Src", "Image Position",
                "Image Alt Text", "Gift Card", "SEO Title", "SEO Description",
                "Google Shopping / Google Product Category", "Google Shopping / Gender",
                "Google Shopping / Age Group", "Google Shopping / MPN",
                "Google Shopping / AdWords Grouping", "Google Shopping / AdWords Labels",
                "Google Shopping / Condition", "Google Shopping / Custom Product",
                "Google Shopping / Custom Label 0", "Google Shopping / Custom Label 1",
                "Google Shopping / Custom Label 2", "Google Shopping / Custom Label 3",
                "Google Shopping / Custom Label 4", "Variant Image", "Variant Weight Unit",
                "Variant Tax Code", "Cost per item", "Status"
            ])

            for p in all_products:
                handle = p.get("handle", p.get("title", "").lower().replace(" ", "-"))
                for i, variant in enumerate(p.get("variants", [])):
                    row = [
                        handle if i == 0 else "",
                        p.get("title") if i == 0 else "",
                        p.get("body_html") if i == 0 else "",
                        p.get("vendor") if i == 0 else "",
                        "",  # Product Category
                        p.get("product_type") if i == 0 else "",
                        p.get("tags") if i == 0 else "",
                        "TRUE" if p.get("status") == "active" else "FALSE",
                        "Size" if i == 0 else "",
                        variant.get("option1", "") if i == 0 else "",
                        "Color" if i == 0 else "",
                        variant.get("option2", "") if i == 0 else "",
                        "",
                        "",
                        variant.get("sku", ""),
                        int(variant.get("weight", 0) * 1000),
                        "shopify",
                        variant.get("inventory_quantity", 0),
                        "continue",
                        "manual",
                        variant.get("price", "0.00"),
                        "",
                        "TRUE" if variant.get("requires_shipping") else "FALSE",
                        "TRUE" if variant.get("taxable") else "FALSE",
                        variant.get("barcode", ""),
                        p.get("images", [{}])[0].get("src", "") if i == 0 else "",
                        "1" if i == 0 else "",
                        p.get("images", [{}])[0].get("alt", "") if i == 0 else "",
                        "FALSE",
                        "",
                        "",
                        "", "", "", "", "", "", "", "", "", "",
                        "",
                        "g",
                        "",
                        variant.get("price", "0.00"),
                        "active"
                    ]
                    writer.writerow(row)

        logger.info(f"Exported Shopify CSV to {SHOPIFY_CSV_OUTPUT}")


# ============================================================
# SCHEDULED JOB ENTRY POINT
# ============================================================

def run_sync():
    """Entry point for cron/scheduled job."""
    sync = DropshipSync()
    results = sync.full_sync()
    sync.export_to_havenly(results)
    sync.export_shopify_csv(results)

    # Log results
    log_file = Path(__file__).parent / "logs" / "dropship_sync.log"
    log_file.parent.mkdir(parents=True, exist_ok=True)
    with open(log_file, "a") as f:
        f.write(json.dumps(results) + "\n")

    return results


if __name__ == "__main__":
    # Test connection first
    api = get_api()
    if api.test_connection():
        print("✅ Shopify connected")
        results = run_sync()
        print(f"Sync results: {results}")
    else:
        print("❌ Shopify connection failed - check credentials")