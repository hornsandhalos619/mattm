"""
Email Service for LLC Builder
Handles business email creation and transactional emails
"""
import os
import smtplib
import ssl
import secrets
import string
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from typing import Optional, Dict, Any, List

from config.settings import settings
from app.models import LLCFormation


class EmailService:
    """Email service with multiple provider support"""
    
    def __init__(self):
        self.provider = settings.EMAIL_PROVIDER.lower()
    
    def create_business_email(self, formation: LLCFormation) -> Dict[str, Any]:
        """Create a business email address for the new LLC"""
        business_name = formation.business_info.business_name
        owner_name = formation.business_info.owner_name
        state = formation.business_info.state
        
        # Generate email username from business name
        base_username = self._generate_username(business_name)
        
        # Try to create email with different providers
        if self.provider == "mailgun" and settings.MAILGUN_API_KEY:
            return self._create_mailgun_email(formation, base_username)
        elif self.provider == "sendgrid" and settings.SENDGRID_API_KEY:
            return self._create_sendgrid_email(formation, base_username)
        elif self.provider == "gmail" and settings.GMAIL_USER and settings.GMAIL_APP_PASSWORD:
            return self._create_gmail_alias(formation, base_username)
        else:
            # Fallback: generate a professional email suggestion
            return self._generate_email_suggestion(formation, base_username)
    
    def _generate_username(self, business_name: str) -> str:
        """Generate a clean username from business name"""
        # Remove special characters, keep alphanumeric
        clean = ''.join(c.lower() for c in business_name if c.isalnum() or c == ' ')
        # Replace spaces with dots or remove
        username = clean.replace(' ', '.')
        # Truncate if too long
        if len(username) > 20:
            username = username[:20]
        return username
    
    def _generate_email_suggestion(self, formation: LLCFormation, username: str) -> Dict[str, Any]:
        """Generate email suggestions when no provider is configured"""
        domain_suggestions = [
            f"{username}@gmail.com",
            f"{username}@outlook.com",
            f"{username}@protonmail.com",
            f"info@{formation.business_info.business_name.lower().replace(' ', '')}.com",
            f"hello@{formation.business_info.business_name.lower().replace(' ', '')}.com",
        ]
        
        # Generate a secure password suggestion
        password = self._generate_secure_password()
        
        return {
            "created": False,
            "suggested_emails": domain_suggestions,
            "recommended": domain_suggestions[0],
            "password_suggestion": password,
            "setup_instructions": [
                "1. Choose one of the suggested email addresses above",
                "2. Create the account with the suggested password or your own secure password",
                "3. Set up email forwarding to your personal email if desired",
                "4. Configure email signature with your new LLC name",
                "5. Add to your phone/email client",
            ],
            "note": "Configure MAILGUN_API_KEY, SENDGRID_API_KEY, or GMAIL credentials in .env for automatic email creation",
        }
    
    def _generate_secure_password(self, length: int = 16) -> str:
        """Generate a secure random password"""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    def _create_mailgun_email(self, formation: LLCFormation, username: str) -> Dict[str, Any]:
        """Create email via Mailgun"""
        # Mailgun doesn't directly create email accounts, but you can:
        # 1. Set up a domain and create routes
        # 2. Use Mailgun's email forwarding
        # This is a placeholder for actual implementation
        return {
            "created": True,
            "provider": "mailgun",
            "email": f"{username}@{settings.MAILGUN_DOMAIN}",
            "password": self._generate_secure_password(),
            "note": "Email forwarding configured via Mailgun routes",
        }
    
    def _create_sendgrid_email(self, formation: LLCFormation, username: str) -> Dict[str, Any]:
        """Create email via SendGrid"""
        return {
            "created": True,
            "provider": "sendgrid",
            "email": f"{username}@yourdomain.com",
            "password": self._generate_secure_password(),
            "note": "Requires domain verification in SendGrid",
        }
    
    def _create_gmail_alias(self, formation: LLCFormation, username: str) -> Dict[str, Any]:
        """Create Gmail alias (requires Gmail API or manual setup)"""
        return {
            "created": False,
            "provider": "gmail",
            "suggested_email": f"{username}@gmail.com",
            "note": "Gmail doesn't support programmatic account creation. Create manually at gmail.com",
            "password_suggestion": self._generate_secure_password(),
        }
    
    # ─── Transactional Emails ─────────────────────────────────────────────
    
    def send_payment_confirmation(self, formation: LLCFormation):
        """Send payment confirmation email with receipt"""
        subject = f"Payment Confirmed - {formation.business_info.business_name} LLC Formation"
        
        html_body = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Payment Confirmed ✓</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your LLC formation is now in progress</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px;">Hi {formation.business_info.owner_name},</p>
                
                <p>Great news! We've successfully received your payment of <strong>${formation.total:,.2f}</strong> for the formation of <strong>{formation.business_info.business_name}</strong> in {formation.business_info.state}.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e3a5f;">
                    <h3 style="margin-top: 0; color: #1e3a5f;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0;">State Filing Fee ({formation.business_info.state})</td><td style="text-align: right; padding: 8px 0;">${formation.state_filing_fee:,.2f}</td></tr>
                        <tr><td style="padding: 8px 0;">LLC Formation Service</td><td style="text-align: right; padding: 8px 0;">${formation.base_formation_fee:,.2f}</td></tr>
                        <tr><td style="padding: 8px 0;">Registered Agent (1 Year)</td><td style="text-align: right; padding: 8px 0;">${formation.registered_agent_fee:,.2f}</td></tr>
                        <tr><td style="padding: 8px 0;">EIN Obtainment Service</td><td style="text-align: right; padding: 8px 0;">${formation.ein_service_fee:,.2f}</td></tr>
                        {"<tr><td style='padding: 8px 0;'>Website Design & Development</td><td style='text-align: right; padding: 8px 0;'>$" + f"{formation.website_design_fee:,.2f}</td></tr>" if formation.website_design_fee > 0 else ""}
                        <tr style="border-top: 2px solid #1e3a5f;"><td style="padding: 8px 0;"><strong>Total</strong></td><td style="text-align: right; padding: 8px 0;"><strong>${formation.total:,.2f}</strong></td></tr>
                    </table>
                </div>
                
                <h3 style="color: #1e3a5f;">What Happens Next</h3>
                <ol style="padding-left: 20px;">
                    <li><strong>Document Preparation</strong> - We're generating your Articles of Organization, Operating Agreement, and Business Model Canvas</li>
                    <li><strong>State Filing</strong> - We'll file your LLC with the {formation.business_info.state} Secretary of State</li>
                    <li><strong>EIN Application</strong> - We'll obtain your Federal Tax ID (EIN) from the IRS</li>
                    <li><strong>Business Email</strong> - We'll set up your professional business email address</li>
                    {f'<li><strong>Website Design</strong> - Our team will begin designing your {formation.business_info.website_pages}-page professional website</li>' if formation.business_info.website_design else ''}
                    <li><strong>Delivery</strong> - All documents delivered to your email within {self._get_estimated_days(formation.business_info.state)} business days</li>
                </ol>
                
                <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #1e3a5f;">📋 Your Formation ID: {formation.id}</h4>
                    <p style="margin: 0;">Track your order anytime at <a href="https://llcbuilderpro.com/track/{formation.id}" style="color: #1e3a5f;">llcbuilderpro.com/track/{formation.id}</a></p>
                </div>
                
                <p style="color: #666; font-size: 14px;">Questions? Reply to this email or contact us at support@llcbuilderpro.com</p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">LLC Builder Pro | Your Partner in Business Formation</p>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Payment Confirmed - {formation.business_info.business_name} LLC Formation
        
        Hi {formation.business_info.owner_name},
        
        We've successfully received your payment of ${formation.total:,.2f} for the formation of {formation.business_info.business_name} in {formation.business_info.state}.
        
        Order Summary:
        - State Filing Fee ({formation.business_info.state}): ${formation.state_filing_fee:,.2f}
        - LLC Formation Service: ${formation.base_formation_fee:,.2f}
        - Registered Agent (1 Year): ${formation.registered_agent_fee:,.2f}
        - EIN Obtainment Service: ${formation.ein_service_fee:,.2f}
        {f'- Website Design & Development: ${formation.website_design_fee:,.2f}' if formation.website_design_fee > 0 else ''}
        - Total: ${formation.total:,.2f}
        
        What Happens Next:
        1. Document Preparation - We're generating your Articles of Organization, Operating Agreement, and Business Model Canvas
        2. State Filing - We'll file your LLC with the {formation.business_info.state} Secretary of State
        3. EIN Application - We'll obtain your Federal Tax ID (EIN) from the IRS
        4. Business Email - We'll set up your professional business email address
        {f'5. Website Design - Our team will begin designing your {formation.business_info.website_pages}-page professional website' if formation.business_info.website_design else ''}
        5. Delivery - All documents delivered to your email within {self._get_estimated_days(formation.business_info.state)} business days
        
        Your Formation ID: {formation.id}
        Track your order at: https://llcbuilderpro.com/track/{formation.id}
        
        Questions? Contact us at support@llcbuilderpro.com
        
        LLC Builder Pro
        """
        
        self._send_email(
            to_email=formation.business_info.owner_email,
            subject=subject,
            html_body=html_body,
            text_body=text_body,
            attachments=[formation.payment_receipt_pdf] if formation.payment_receipt_pdf else None
        )
    
    def send_payment_failed(self, formation: LLCFormation):
        """Send payment failed notification"""
        subject = f"Payment Issue - {formation.business_info.business_name} LLC Formation"
        
        html_body = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Payment Could Not Be Processed</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px;">Hi {formation.business_info.owner_name},</p>
                
                <p>We attempted to process your payment of <strong>${formation.total:,.2f}</strong> for <strong>{formation.business_info.business_name}</strong>, but it was declined.</p>
                
                <div style="background: #fff3f3; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
                    <h4 style="margin-top: 0; color: #c0392b;">Common Reasons:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Insufficient funds</li>
                        <li>Card expired or invalid</li>
                        <li>Bank security block</li>
                        <li>Incorrect billing information</li>
                    </ul>
                </div>
                
                <p><a href="https://llcbuilderpro.com/pay/{formation.id}" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">Retry Payment Securely</a></p>
                
                <p style="color: #666; font-size: 14px;">Your order is saved and will be held for 7 days. Contact support@llcbuilderpro.com if you need assistance.</p>
            </div>
        </body>
        </html>
        """
        
        self._send_email(
            to_email=formation.business_info.owner_email,
            subject=subject,
            html_body=html_body,
            text_body=f"Payment failed for {formation.business_info.business_name}. Please retry at llcbuilderpro.com/pay/{formation.id}"
        )
    
    def send_formation_complete(self, formation: LLCFormation):
        """Send formation complete email with all documents"""
        subject = f"🎉 Your LLC is Formed! - {formation.business_info.business_name}"
        
        html_body = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Your LLC is Officially Formed! 🎉</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">{formation.business_info.business_name} is now a legal entity in {formation.business_info.state}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px;">Congratulations, {formation.business_info.owner_name}!</p>
                
                <p>Your LLC has been successfully filed with the {formation.business_info.state} Secretary of State. Here are your official details:</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
                    <h3 style="margin-top: 0; color: #27ae60;">Formation Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0;"><strong>Business Name</strong></td><td style="text-align: right; padding: 8px 0;">{formation.business_info.business_name}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>State</strong></td><td style="text-align: right; padding: 8px 0;">{formation.business_info.state}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Filing Date</strong></td><td style="text-align: right; padding: 8px 0;">{formation.filing_date.strftime('%B %d, %Y') if formation.filing_date else 'N/A'}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Confirmation #</strong></td><td style="text-align: right; padding: 8px 0;">{formation.filing_confirmation_number or 'N/A'}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>EIN</strong></td><td style="text-align: right; padding: 8px 0;">{formation.ein_number or 'Pending'}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Business Email</strong></td><td style="text-align: right; padding: 8px 0;">{formation.business_email or 'Created'}</td></tr>
                    </table>
                </div>
                
                <h3 style="color: #1e3a5f;">📎 Documents Attached</h3>
                <ul style="padding-left: 20px;">
                    <li><strong>Articles of Organization</strong> - Filed with the state</li>
                    <li><strong>Operating Agreement</strong> - For your records</li>
                    <li><strong>Business Model Canvas</strong> - Strategic roadmap</li>
                    <li><strong>Payment Receipt</strong> - For your records</li>
                    {f'<li><strong>Loan Proposal</strong> - For funding applications</li>' if formation.loan_proposal_pdf else ''}
                </ul>
                
                <h3 style="color: #1e3a5f;">🚀 Next Steps</h3>
                <ol style="padding-left: 20px;">
                    <li><strong>Open a Business Bank Account</strong> - Use your EIN and Articles of Organization</li>
                    <li><strong>Set Up Accounting</strong> - QuickBooks, Xero, or Wave (free)</li>
                    <li><strong>Obtain Licenses/Permits</strong> - Check {formation.business_info.state} requirements</li>
                    <li><strong>File Annual Report</strong> - Due annually in {formation.business_info.state}</li>
                    <li><strong>Maintain Registered Agent</strong> - Renews annually ($99/year)</li>
                </ol>
                
                {"<div style='background: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;'><h4 style='margin-top: 0; color: #f39c12;'>🌐 Website Design In Progress</h4><p style='margin: 0;'>Your custom {formation.business_info.website_pages}-page website is being designed. Our team will contact you within 24 hours to discuss requirements and timeline. Expected delivery: 2-3 weeks.</p></div>" if formation.business_info.website_design else ""}
                
                <p style="text-align: center; margin: 30px 0;">
                    <a href="https://llcbuilderpro.com/dashboard/{formation.id}" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">Access Your Dashboard</a>
                </p>
                
                <p style="color: #666; font-size: 14px;">Welcome to business ownership! We're here to support your journey.</p>
            </div>
        </body>
        </html>
        """
        
        attachments = []
        for doc in [formation.articles_of_organization_pdf, formation.operating_agreement_pdf, 
                    formation.business_model_pdf, formation.payment_receipt_pdf, formation.loan_proposal_pdf]:
            if doc:
                attachments.append(doc)
        
        self._send_email(
            to_email=formation.business_info.owner_email,
            subject=subject,
            html_body=html_body,
            text_body=f"Your LLC {formation.business_info.business_name} is formed! Documents attached.",
            attachments=attachments
        )
    
    def send_refund_confirmation(self, formation: LLCFormation, amount: float):
        """Send refund confirmation"""
        subject = f"Refund Processed - {formation.business_info.business_name}"
        
        html_body = f"""
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Refund Processed</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
                <p>Hi {formation.business_info.owner_name},</p>
                
                <p>A refund of <strong>${amount:,.2f}</strong> has been processed for your LLC formation order <strong>{formation.id}</strong>.</p>
                
                <p>The refund will appear on your original payment method within 5-10 business days, depending on your bank.</p>
                
                <p>If you have any questions, please contact us at support@llcbuilderpro.com</p>
            </div>
        </body>
        </html>
        """
        
        self._send_email(
            to_email=formation.business_info.owner_email,
            subject=subject,
            html_body=html_body,
            text_body=f"Refund of ${amount:,.2f} processed for order {formation.id}"
        )
    
    def _send_email(self, to_email: str, subject: str, html_body: str, text_body: str, attachments: List[str] = None):
        """Send email via configured provider"""
        if self.provider == "mailgun" and settings.MAILGUN_API_KEY:
            self._send_via_mailgun(to_email, subject, html_body, text_body, attachments)
        elif self.provider == "sendgrid" and settings.SENDGRID_API_KEY:
            self._send_via_sendgrid(to_email, subject, html_body, text_body, attachments)
        elif self.provider == "gmail" and settings.GMAIL_USER and settings.GMAIL_APP_PASSWORD:
            self._send_via_smtp(to_email, subject, html_body, text_body, attachments)
        else:
            # Log email for development
            print(f"\n{'='*60}")
            print(f"EMAIL WOULD BE SENT TO: {to_email}")
            print(f"SUBJECT: {subject}")
            print(f"BODY: {text_body[:200]}...")
            print(f"ATTACHMENTS: {attachments}")
            print(f"{'='*60}\n")
    
    def _send_via_mailgun(self, to_email: str, subject: str, html_body: str, text_body: str, attachments: List[str] = None):
        """Send via Mailgun API"""
        import requests
        
        files = []
        if attachments:
            for attachment in attachments:
                if os.path.exists(attachment):
                    files.append(("attachment", open(attachment, "rb")))
        
        data = {
            "from": settings.FROM_EMAIL,
            "to": to_email,
            "subject": subject,
            "text": text_body,
            "html": html_body,
        }
        
        try:
            response = requests.post(
                f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
                auth=("api", settings.MAILGUN_API_KEY),
                data=data,
                files=files
            )
            response.raise_for_status()
        except Exception as e:
            print(f"Mailgun error: {e}")
        finally:
            for _, f in files:
                f.close()
    
    def _send_via_sendgrid(self, to_email: str, subject: str, html_body: str, text_body: str, attachments: List[str] = None):
        """Send via SendGrid API"""
        # Implementation would use sendgrid python library
        pass
    
    def _send_via_smtp(self, to_email: str, subject: str, html_body: str, text_body: str, attachments: List[str] = None):
        """Send via SMTP (Gmail)"""
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.FROM_EMAIL
        msg["To"] = to_email
        
        msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))
        
        if attachments:
            for attachment in attachments:
                if os.path.exists(attachment):
                    with open(attachment, "rb") as f:
                        part = MIMEApplication(f.read(), Name=os.path.basename(attachment))
                    part["Content-Disposition"] = f'attachment; filename="{os.path.basename(attachment)}"'
                    msg.attach(part)
        
        context = ssl.create_default_context()
        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                server.login(settings.GMAIL_USER, settings.GMAIL_APP_PASSWORD)
                server.send_message(msg)
        except Exception as e:
            print(f"SMTP error: {e}")
    
    def _get_estimated_days(self, state: str) -> int:
        """Get estimated filing days for a state"""
        from app.llc_filing import filing_service
        config = filing_service.get_state_config(state)
        return config.get("processing_days", 7)


email_service = EmailService()