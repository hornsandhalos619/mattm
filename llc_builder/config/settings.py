"""
LLC Builder Configuration
Centralized settings for the application
"""
import os
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

BASE_DIR = Path(__file__).parent.parent

@dataclass
class Settings:
    # Application
    APP_NAME: str = "LLC Builder Pro"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/data/llc_builder.db")
    
    # Stripe Payment Processing
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "pk_test_...")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_...")
    
    # Revenue Share - YOUR CUT
    REVENUE_SHARE_PERCENTAGE: float = 0.15  # 15% to you
    WEBSITE_DESIGN_PRICE: float = 2500.00  # Pure profit upsell
    WEBSITE_REVENUE_SHARE: float = 1.00  # 100% to you (pure profit)
    
    # Base LLC formation fee (varies by state)
    BASE_FORMATION_FEE: float = 199.00
    
    # Email Service (Mailgun, SendGrid, or Gmail SMTP)
    EMAIL_PROVIDER: str = os.getenv("EMAIL_PROVIDER", "mailgun")  # mailgun, sendgrid, gmail
    MAILGUN_API_KEY: str = os.getenv("MAILGUN_API_KEY", "")
    MAILGUN_DOMAIN: str = os.getenv("MAILGUN_DOMAIN", "")
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    GMAIL_USER: str = os.getenv("GMAIL_USER", "")
    GMAIL_APP_PASSWORD: str = os.getenv("GMAIL_APP_PASSWORD", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "noreply@llcbuilderpro.com")
    
    # State filing fees (as of 2024)
    STATE_FEES: dict = None
    
    # PDF Output
    PDF_OUTPUT_DIR: Path = BASE_DIR / "app" / "pdfs"
    
    # Lead Tracking
    LEAD_CSV_PATH: Path = BASE_DIR / "data" / "leads.csv"
    
    def __post_init__(self):
        if self.STATE_FEES is None:
            self.STATE_FEES = {
                "AL": 200, "AK": 250, "AZ": 50, "AR": 45, "CA": 70,
                "CO": 50, "CT": 120, "DE": 90, "FL": 125, "GA": 100,
                "HI": 50, "ID": 100, "IL": 150, "IN": 95, "IA": 50,
                "KS": 160, "KY": 40, "LA": 100, "ME": 175, "MD": 100,
                "MA": 500, "MI": 50, "MN": 155, "MS": 50, "MO": 50,
                "MT": 70, "NE": 100, "NV": 75, "NH": 100, "NJ": 125,
                "NM": 50, "NY": 200, "NC": 125, "ND": 135, "OH": 99,
                "OK": 100, "OR": 100, "PA": 125, "RI": 150, "SC": 110,
                "SD": 150, "TN": 300, "TX": 300, "UT": 54, "VT": 125,
                "VA": 100, "WA": 200, "WV": 100, "WI": 130, "WY": 100,
            }
        
        # Ensure directories exist
        self.PDF_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        self.LEAD_CSV_PATH.parent.mkdir(parents=True, exist_ok=True)


settings = Settings()