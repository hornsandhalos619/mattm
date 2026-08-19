"""
Website Design Upsell Module
Handles the website design upsell option for LLC formation
"""
from typing import Dict, Any, Optional
from dataclasses import dataclass
from .models import WebsiteDesignOption
from .config import Settings

logger = logging.getLogger(__name__)

@dataclass
class WebsitePackage:
    name: str
    price: float
    pages: int
    features: list[str]
    includes_hosting: bool
    includes_domain: bool
    support_months: int

class WebsiteUpsellService:
    def __init__(self):
        self.settings = Settings()
        self.packages = self._initialize_packages()
    
    def _initialize_packages(self) -> Dict[str, WebsitePackage]:
        """Initialize available website design packages"""
        return {
            'basic': WebsitePackage(
                name='Basic Website',
                price=self.settings.website_basic_price,
                pages=5,
                features=[
                    'Mobile responsive design',
                    'Contact form',
                    'Basic SEO setup',
                    'Google Analytics integration',
                    'Social media links'
                ],
                includes_hosting=False,
                includes_domain=False,
                support_months=1
            ),
            'professional': WebsitePackage(
                name='Professional Website',
                price=self.settings.website_professional_price,
                pages=10,
                features=[
                    'Mobile responsive design',
                    'Contact form with CRM integration',
                    'Advanced SEO setup',
                    'Google Analytics & Search Console',
                    'Social media integration',
                    'Blog section',
                    'Email newsletter signup',
                    'Basic e-commerce ready'
                ],
                includes_hosting=True,
                includes_domain=True,
                support_months=3
            ),
            'premium': WebsitePackage(
                name='Premium Website',
                price=self.settings.website_premium_price,
                pages=20,
                features=[
                    'Custom mobile responsive design',
                    'Advanced contact form with CRM',
                    'Enterprise SEO setup',
                    'Google Analytics, Search Console, Tag Manager',
                    'Social media integration with feeds',
                    'Professional blog with categories',
                    'Email marketing automation',
                    'Full e-commerce functionality',
                    'Member login area',
                    'Multi-language support ready'
                ],
                includes_hosting=True,
                includes_domain=True,
                support_months=6
            )
        }
    
    def get_available_packages(self) -> Dict[str, WebsitePackage]:
        """Get all available website packages"""
        return self.packages.copy()
    
    def get_package(self, package_name: str) -> Optional[WebsitePackage]:
        """Get a specific website package"""
        return self.packages.get(package_name.lower())
    
    def calculate_upsell_price(self, package_name: str) -> float:
        """Calculate the price for a website upsell package"""
        package = self.get_package(package_name)
        if package:
            return package.price
        return 0.0
    
    def get_upsell_recommendation(self, business_type: str, budget: float = None) -> Dict[str, Any]:
        """Get website package recommendation based on business type and budget"""
        recommendations = []
        
        for package_key, package in self.packages.items():
            score = 0
            reasons = []
            
            # Budget consideration
            if budget and package.price <= budget:
                score += 30
                reasons.append(f"Within budget of ${budget}")
            elif not budget:
                score += 20  # No budget constraint
            
            # Business type suitability
            if business_type == 'ecommerce' and package_key in ['professional', 'premium']:
                score += 25
                reasons.append("Good for ecommerce businesses")
            elif business_type in ['consulting', 'service'] and package_key in ['basic', 'professional']:
                score += 20
                reasons.append("Suitable for service-based businesses")
            elif business_type == 'retail' and package_key == 'premium':
                score += 25
                reasons.append("Ideal for retail businesses with ecommerce needs")
            elif business_type == 'restaurant' and package_key in ['professional', 'premium']:
                score += 20
                reasons.append("Good for restaurants with menu and reservation features")
            elif business_type == 'creative' and package_key == 'premium':
                score += 20
                reasons.append("Ideal for creative portfolios")
            
            # Features consideration
            if 'blog' in package.features and business_type in ['consulting', 'marketing', 'media']:
                score += 15
                reasons.append("Includes blog for content marketing")
            
            if 'e-commerce' in ' '.join(package.features).lower() and business_type in ['retail', 'ecommerce']:
                score += 20
                reasons.append("Includes ecommerce functionality")
            
            recommendations.append({
                'package_key': package_key,
                'package_name': package.name,
                'price': package.price,
                'pages': package.pages,
                'features': package.features,
                'includes_hosting': package.includes_hosting,
                'includes_domain': package.includes_domain,
                'support_months': package.support_months,
                'score': score,
                'reasons': reasons
            })
        
        # Sort by score descending
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        return {
            'business_type': business_type,
            'budget': budget,
            'recommendations': recommendations[:3],  # Top 3
            'best_value': recommendations[0] if recommendations else None
        }

# Singleton instance
website_upsell_service = WebsiteUpsellService()