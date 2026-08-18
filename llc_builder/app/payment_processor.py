"""
Payment Processing with Stripe + Revenue Sharing
Handles payments, webhooks, and automatic revenue distribution
"""
import os
import stripe
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import dataclass

from config.settings import settings
from app.models import LLCFormation, PaymentStatus
from app.database import db


@dataclass
class PaymentResult:
    success: bool
    payment_intent_id: Optional[str] = None
    client_secret: Optional[str] = None
    error: Optional[str] = None
    amount: float = 0.0


class PaymentProcessor:
    """Stripe payment processing with revenue sharing"""
    
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        self.webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    
    def create_payment_intent(self, formation: LLCFormation) -> PaymentResult:
        """Create a Stripe PaymentIntent for the formation"""
        try:
            # Calculate amount in cents
            amount_cents = int(formation.total * 100)
            
            # Create payment intent with metadata
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency="usd",
                automatic_payment_methods={"enabled": True},
                metadata={
                    "formation_id": formation.id,
                    "business_name": formation.business_info.business_name,
                    "owner_email": formation.business_info.owner_email,
                    "state": formation.business_info.state,
                    "platform_revenue_share": str(formation.revenue_share_amount),
                },
                receipt_email=formation.business_info.owner_email,
                description=f"LLC Formation: {formation.business_info.business_name} ({formation.business_info.state})",
            )
            
            # Update formation with payment intent
            formation.payment_intent_id = intent.id
            formation.payment_status = PaymentStatus.PENDING
            formation.payment_amount = formation.total
            db.save_formation(formation)
            
            return PaymentResult(
                success=True,
                payment_intent_id=intent.id,
                client_secret=intent.client_secret,
                amount=formation.total,
            )
            
        except stripe.error.StripeError as e:
            return PaymentResult(success=False, error=str(e))
        except Exception as e:
            return PaymentResult(success=False, error=f"Payment processing error: {str(e)}")
    
    def confirm_payment(self, payment_intent_id: str) -> PaymentResult:
        """Confirm a payment intent (for manual confirmation if needed)"""
        try:
            intent = stripe.PaymentIntent.confirm(payment_intent_id)
            
            if intent.status == "succeeded":
                self._handle_successful_payment(intent)
                return PaymentResult(success=True, payment_intent_id=intent.id)
            else:
                return PaymentResult(
                    success=False, 
                    payment_intent_id=intent.id, 
                    error=f"Payment status: {intent.status}"
                )
                
        except stripe.error.StripeError as e:
            return PaymentResult(success=False, error=str(e))
    
    def handle_webhook(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """Handle Stripe webhook events"""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, self.webhook_secret
            )
        except ValueError:
            return {"error": "Invalid payload", "status": 400}
        except stripe.error.SignatureVerificationError:
            return {"error": "Invalid signature", "status": 400}
        
        # Handle specific event types
        if event["type"] == "payment_intent.succeeded":
            self._handle_successful_payment(event["data"]["object"])
        elif event["type"] == "payment_intent.payment_failed":
            self._handle_failed_payment(event["data"]["object"])
        elif event["type"] == "charge.refunded":
            self._handle_refund(event["data"]["object"])
        
        return {"status": "success"}
    
    def _handle_successful_payment(self, intent: Dict[str, Any]):
        """Process successful payment"""
        formation_id = intent["metadata"].get("formation_id")
        if not formation_id:
            return
        
        formation = db.get_formation(formation_id)
        if not formation:
            return
        
        # Update formation
        formation.payment_status = PaymentStatus.SUCCEEDED
        formation.payment_date = datetime.now()
        formation.payment_amount = intent["amount"] / 100
        formation.status = LLCStatus.PAYMENT_COMPLETE
        formation.current_step = 3  # Move to filing step
        formation.updated_at = datetime.now()
        
        db.save_formation(formation)
        
        # Generate payment receipt PDF
        from app.pdf_generator import pdf_generator
        receipt_path = pdf_generator.generate_payment_receipt(formation)
        formation.payment_receipt_pdf = receipt_path
        db.save_formation(formation)
        
        # Send confirmation email
        from app.email_service import email_service
        email_service.send_payment_confirmation(formation)
        
        # Trigger next step: filing
        from app.llc_filing import filing_service
        filing_service.start_filing(formation)
    
    def _handle_failed_payment(self, intent: Dict[str, Any]):
        """Process failed payment"""
        formation_id = intent["metadata"].get("formation_id")
        if not formation_id:
            return
        
        formation = db.get_formation(formation_id)
        if not formation:
            return
        
        formation.payment_status = PaymentStatus.FAILED
        formation.status = LLCStatus.FAILED
        formation.updated_at = datetime.now()
        db.save_formation(formation)
        
        # Notify customer
        from app.email_service import email_service
        email_service.send_payment_failed(formation)
    
    def _handle_refund(self, charge: Dict[str, Any]):
        """Process refund"""
        payment_intent_id = charge.get("payment_intent")
        if not payment_intent_id:
            return
        
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        formation_id = intent["metadata"].get("formation_id")
        if not formation_id:
            return
        
        formation = db.get_formation(formation_id)
        if not formation:
            return
        
        formation.payment_status = PaymentStatus.REFUNDED
        formation.status = LLCStatus.FAILED
        formation.updated_at = datetime.now()
        db.save_formation(formation)
        
        # Notify customer
        from app.email_service import email_service
        email_service.send_refund_confirmation(formation, charge["amount_refunded"] / 100)
    
    def calculate_revenue_distribution(self, formation: LLCFormation) -> Dict[str, float]:
        """Calculate how revenue should be distributed"""
        total = formation.total
        platform_share = formation.revenue_share_amount
        
        # Breakdown
        state_fees = formation.state_filing_fee
        service_fees = formation.base_formation_fee + formation.ein_service_fee
        registered_agent = formation.registered_agent_fee
        website = formation.website_design_fee
        
        # Your revenue (platform share)
        your_revenue = platform_share
        
        # Operational costs (what goes to services)
        operational_costs = state_fees + registered_agent  # Pass-through costs
        
        # Net service revenue (after your cut and pass-through costs)
        net_service_revenue = total - your_revenue - operational_costs
        
        return {
            "total_collected": total,
            "your_revenue": your_revenue,
            "platform_percentage": settings.REVENUE_SHARE_PERCENTAGE * 100,
            "website_pure_profit": website * settings.WEBSITE_REVENUE_SHARE if website > 0 else 0,
            "state_filing_fees": state_fees,
            "registered_agent_cost": registered_agent,
            "service_revenue": net_service_revenue,
            "stripe_fees_estimate": total * 0.029 + 0.30,  # 2.9% + $0.30
        }
    
    def create_checkout_session(self, formation: LLCFormation, success_url: str, cancel_url: str) -> Optional[str]:
        """Create a Stripe Checkout Session for hosted payment page"""
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": f"LLC Formation: {formation.business_info.business_name}",
                            "description": f"Complete LLC formation in {formation.business_info.state} with all documents",
                        },
                        "unit_amount": int(formation.total * 100),
                    },
                    "quantity": 1,
                }],
                mode="payment",
                success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=cancel_url,
                customer_email=formation.business_info.owner_email,
                metadata={
                    "formation_id": formation.id,
                    "business_name": formation.business_info.business_name,
                },
            )
            return session.url
        except stripe.error.StripeError as e:
            print(f"Checkout session error: {e}")
            return None


payment_processor = PaymentProcessor()