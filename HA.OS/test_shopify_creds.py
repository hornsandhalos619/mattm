#!/usr/bin/env python3
"""
Test Shopify credentials and token fetch.
Run this once the app is installed on the store.
"""

import sys
from pathlib import Path
import os
sys.path.insert(0, str(Path(__file__).parent))

from shopify_token_refresh import ShopifyTokenManager, get_access_token, get_auth_headers
from shopify_api import ShopifyAPI, get_api

def test_token():
    """Test token fetch."""
    print("Testing token fetch...")
    tm = ShopifyTokenManager()
    try:
        token = tm.get_token()
        print(f"✅ Token obtained: {token[:20]}...")
        print(f"   Full token length: {len(token)}")
        return token
    except Exception as e:
        print(f"❌ Token fetch failed: {e}")
        return None

def test_api(token: str = None):
    """Test API calls."""
    print("\nTesting API connection...")
    api = ShopifyAPI()
    try:
        if api.test_connection():
            print("✅ API connection successful")
            shop = api._request("GET", "/shop.json")
            print(f"   Shop: {shop.get('shop', {}).get('name')}")
            print(f"   Domain: {shop.get('shop', {}).get('myshopify_domain')}")
            print(f"   Plan: {shop.get('shop', {}).get('plan_display_name')}")
            return True
        else:
            print("❌ API test_connection returned False")
            return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def test_product_crud():
    """Test product create/read/update."""
    print("\nTesting product CRUD...")
    api = get_api()
    from shopify_api import Product, ProductImage, ProductVariant

    # Create test product
    test_product = Product(
        title="Test Product - DELETE ME",
        body_html="<p>This is a test product for API verification.</p>",
        vendor="Horns & Halos",
        product_type="Test",
        tags="test,api,verify",
        status="draft",
        variants=[ProductVariant(price="19.99", sku="TEST-001", inventory_quantity=5)],
    )

    try:
        created = api.create_product(test_product)
        product_id = created.get("product", {}).get("id")
        print(f"✅ Created product ID: {product_id}")

        # Read it back
        fetched = api.get_product(product_id)
        print(f"✅ Fetched product: {fetched.get('product', {}).get('title')}")

        # Update
        test_product.title = "Test Product UPDATED - DELETE ME"
        updated = api.update_product(product_id, test_product)
        print(f"✅ Updated product: {updated.get('product', {}).get('title')}")

        # Delete
        api.delete_product(product_id)
        print(f"✅ Deleted product {product_id}")

        return True
    except Exception as e:
        print(f"❌ Product CRUD failed: {e}")
        return False

def main():
    print("=" * 60)
    print("SHOPIFY CREDENTIALS TEST")
    print("=" * 60)
    print(f"Store: {os.getenv('SHOPIFY_STORE_DOMAIN', 'horns-and-halos-3.myshopify.com')}")
    print(f"Client ID: {os.getenv('SHOPIFY_CLIENT_ID', '23b3aeed5a810226429101f4b7ff4d84')}")
    print(f"Client Secret: {'*' * 20} (from env var SHOPIFY_CLIENT_SECRET)")
    print("=" * 60)

    token = test_token()
    if not token:
        print("\n⚠️  Token fetch failed - app may not be installed yet")
        print("   Complete the distribution method + install steps first")
        return 1

    if not test_api(token):
        print("\n⚠️  API test failed - check app installation and scopes")
        return 1

    # Only test CRUD if basic API works
    if test_product_crud():
        print("\n" + "=" * 60)
        print("🎉 ALL TESTS PASSED - Ready for production!")
        print("=" * 60)
        return 0
    else:
        print("\n⚠️  CRUD tests failed - check scopes")
        return 1

if __name__ == "__main__":
    sys.exit(main())