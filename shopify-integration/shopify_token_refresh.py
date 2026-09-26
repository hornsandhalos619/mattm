#!/usr/bin/env python3
"""
Shopify OAuth Token Auto-Refresh
Handles 24-hour token expiry with client_credentials grant.
"""

import os
import time
import json
import requests
from pathlib import Path
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================
# CONFIGURATION - Load from environment variables
# ============================================================
import os
CLIENT_ID = os.getenv("SHOPIFY_CLIENT_ID", "23b3aeed5a810226429101f4b7ff4d84")
CLIENT_SECRET = os.getenv("SHOPIFY_CLIENT_SECRET", "shpss_***REDACTED***")
STORE_DOMAIN = os.getenv("SHOPIFY_STORE_DOMAIN", "hornshalosshop.myshopify.com")
TOKEN_URL = f"https://{STORE_DOMAIN}/admin/oauth/access_token"

# Token storage
TOKEN_FILE = Path(__file__).parent / ".shopify_token.json"
TOKEN_EXPIRY_BUFFER = 300  # 5 minutes before expiry


class ShopifyTokenManager:
    """Manages Shopify OAuth tokens with auto-refresh."""

    def __init__(
        self,
        client_id: str = CLIENT_ID,
        client_secret: str = CLIENT_SECRET,
        token_url: str = TOKEN_URL,
        token_file: Path = TOKEN_FILE,
    ):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = token_url
        self.token_file = token_file
        self._access_token: Optional[str] = None
        self._expires_at: float = 0

    def _load_cached_token(self) -> bool:
        """Load token from cache if valid."""
        if not self.token_file.exists():
            return False
        try:
            data = json.loads(self.token_file.read_text())
            self._access_token = data.get("access_token")
            self._expires_at = data.get("expires_at", 0)
            if time.time() < (self._expires_at - TOKEN_EXPIRY_BUFFER):
                logger.info("Using cached token")
                return True
        except Exception as e:
            logger.warning(f"Failed to load cached token: {e}")
        return False

    def _save_token(self, access_token: str, expires_in: int):
        """Save token to cache."""
        self._access_token = access_token
        self._expires_at = time.time() + expires_in
        data = {
            "access_token": access_token,
            "expires_at": self._expires_at,
            "expires_in": expires_in,
        }
        self.token_file.write_text(json.dumps(data))
        logger.info(f"Token saved, expires in {expires_in}s")

    def fetch_new_token(self) -> str:
        """Fetch new access token from Shopify."""
        logger.info("Fetching new access token...")
        response = requests.post(
            self.token_url,
            data={
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        access_token = data["access_token"]
        expires_in = data.get("expires_in", 86400)  # default 24h
        self._save_token(access_token, expires_in)
        return access_token

    def get_token(self, force_refresh: bool = False) -> str:
        """Get valid access token, refreshing if needed."""
        if force_refresh or not self._load_cached_token():
            return self.fetch_new_token()
        return self._access_token

    def headers(self, force_refresh: bool = False) -> dict:
        """Get Authorization headers for API calls."""
        token = self.get_token(force_refresh)
        return {
            "X-Shopify-Access-Token": token,
            "Content-Type": "application/json",
        }


# Singleton instance
_token_manager: Optional[ShopifyTokenManager] = None


def get_token_manager() -> ShopifyTokenManager:
    """Get or create singleton token manager."""
    global _token_manager
    if _token_manager is None:
        _token_manager = ShopifyTokenManager()
    return _token_manager


def get_access_token(force_refresh: bool = False) -> str:
    """Convenience function to get access token."""
    return get_token_manager().get_token(force_refresh)


def get_auth_headers(force_refresh: bool = False) -> dict:
    """Convenience function to get auth headers."""
    return get_token_manager().headers(force_refresh)


if __name__ == "__main__":
    # Test token fetch
    tm = ShopifyTokenManager()
    token = tm.get_token()
    print(f"✅ Token obtained: {token[:20]}...")
    print(f"   Expires at: {tm._expires_at}")