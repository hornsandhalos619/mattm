"""
PDF Generation for LLC Builder
Creates professional PDFs for business model, loan proposal, payment records, and legal documents
"""
from fpdf import FPDF
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
import json

from config.settings import settings
from app.models import LLCFormation, BusinessInfo


class PDFGenerator:
    """Professional PDF document generator"""
    
    def __init__(self):
        self.output_dir = settings.PDF_OUTPUT_DIR
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def _create_base_pdf(self, title: str, formation: LLCFormation) -> FPDF:
        """Create a base PDF with consistent branding"""
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=25)
        pdf.add_page()
        
        # Header with logo area
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(30, 58, 95)  # Dark blue
        pdf.cell(0, 15, title, ln=True, align="C")
        
        # Subtitle
        pdf.set_font("Helvetica", "", 12)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(0, 8, f"{formation.business_info.business_name} | {formation.business_info.state}", ln=True, align="C")
        
        # Separator line
        pdf.set_draw_color(30, 58, 95)
        pdf.set_line_width(0.5)
        pdf.line(20, pdf.get_y() + 3, 190, pdf.get_y() + 3)
        pdf.ln(10)
        
        # Document info
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(0, 5, f"Document ID: {formation.id} | Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", ln=True, align="C")
        pdf.ln(5)
        
        return pdf
    
    def _add_section_header(self, pdf: FPDF, title: str):
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(30, 58, 95)
        pdf.cell(0, 10, title, ln=True)
        pdf.set_draw_color(30, 58, 95)
        pdf.set_line_width(0.3)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)
    
    def _add_field(self, pdf: FPDF, label: str, value: str, bold_value: bool = False):
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(60, 60, 60)
        pdf.cell(55, 7, f"{label}:")
        pdf.set_font("Helvetica", "B" if bold_value else "", 10)
        pdf.set_text_color(30, 30, 30)
        pdf.cell(0, 7, value, ln=True)
    
    def _add_body_text(self, pdf: FPDF, text: str):
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(50, 50, 50)
        pdf.multi_cell(0, 5.5, text)
        pdf.ln(2)
    
    def generate_business_model(self, formation: LLCFormation) -> str:
        """Generate comprehensive business model PDF"""
        pdf = self._create_base_pdf("BUSINESS MODEL CANVAS", formation)
        info = formation.business_info
        
        # Executive Summary
        self._add_section_header(pdf, "1. EXECUTIVE SUMMARY")
        self._add_body_text(pdf, 
            f"{info.business_name} is a newly formed Limited Liability Company (LLC) organized under the laws of "
            f"the State of {info.state}. The company will be {info.management_structure.replace('-', ' ')} "
            f"by {info.owner_name}. The primary business purpose is: {info.business_purpose}."
        )
        
        # Company Overview
        self._add_section_header(pdf, "2. COMPANY OVERVIEW")
        self._add_field(pdf, "Legal Name", info.business_name)
        self._add_field(pdf, "State of Formation", info.state)
        self._add_field(pdf, "Entity Type", "Limited Liability Company (LLC)")
        self._add_field(pdf, "Management Structure", info.management_structure.replace('-', ' ').title())
        self._add_field(pdf, "Business Purpose", info.business_purpose)
        if info.effective_date:
            self._add_field(pdf, "Effective Date", info.effective_date)
        pdf.ln(3)
        
        # Ownership Structure
        self._add_section_header(pdf, "3. OWNERSHIP & MANAGEMENT")
        self._add_field(pdf, "Owner/Member", info.owner_name)
        self._add_field(pdf, "Owner Email", info.owner_email)
        self._add_field(pdf, "Owner Phone", info.owner_phone)
        self._add_field(pdf, "Owner Address", info.owner_address)
        pdf.ln(3)
        
        # Value Proposition
        self._add_section_header(pdf, "4. VALUE PROPOSITION")
        self._add_body_text(pdf,
            f"{info.business_name} delivers value by providing [products/services] to [target market]. "
            f"The company's competitive advantage lies in [unique differentiators]. As an LLC, the business "
            f"offers limited liability protection to its members while maintaining operational flexibility "
            f"and pass-through taxation benefits."
        )
        
        # Target Market
        self._add_section_header(pdf, "5. TARGET MARKET & CUSTOMER SEGMENTS")
        self._add_body_text(pdf,
            "Primary Target Market: [Define primary customer segment]\n"
            "Secondary Target Market: [Define secondary customer segment]\n"
            "Geographic Focus: [Local/Regional/National/International]\n"
            "Customer Pain Points: [Key problems your business solves]"
        )
        
        # Revenue Model
        self._add_section_header(pdf, "6. REVENUE MODEL")
        self._add_body_text(pdf,
            "Primary Revenue Streams:\n"
            "  1. [Product/Service 1] - $[Price] per [unit/subscription/project]\n"
            "  2. [Product/Service 2] - $[Price] per [unit/subscription/project]\n"
            "  3. [Product/Service 3] - $[Price] per [unit/subscription/project]\n\n"
            "Pricing Strategy: [Cost-plus / Value-based / Competitive / Penetration]\n"
            "Payment Terms: [Net 30 / Net 15 / Upon Delivery / Subscription]\n"
            "Projected Monthly Revenue (Month 1-3): $[Amount]\n"
            "Projected Monthly Revenue (Month 4-12): $[Amount]"
        )
        
        # Cost Structure
        self._add_section_header(pdf, "7. COST STRUCTURE")
        self._add_body_text(pdf,
            "Fixed Costs:\n"
            "  - LLC Formation & Filing: ${:.2f}\n"
            "  - Registered Agent (Annual): ${:.2f}\n"
            "  - EIN Service: ${:.2f}\n"
            "  - Business Licenses & Permits: $[Amount]\n"
            "  - Insurance: $[Amount]/month\n"
            "  - Rent/Office: $[Amount]/month\n"
            "  - Software & Tools: $[Amount]/month\n\n"
            "Variable Costs:\n"
            "  - Cost of Goods Sold: [%] of revenue\n"
            "  - Marketing & Advertising: [%] of revenue\n"
            "  - Transaction Fees: [%] of revenue\n"
            "  - Contractor/Freelancer Costs: $[Amount]".format(
                formation.state_filing_fee,
                formation.registered_agent_fee,
                formation.ein_service_fee
            )
        )
        
        # Key Activities & Resources
        self._add_section_header(pdf, "8. KEY ACTIVITIES & RESOURCES")
        self._add_body_text(pdf,
            "Key Activities:\n"
            "  1. Product/Service Development & Delivery\n"
            "  2. Sales & Marketing\n"
            "  3. Customer Support & Relationship Management\n"
            "  4. Financial Management & Compliance\n"
            "  5. Operations & Process Improvement\n\n"
            "Key Resources:\n"
            "  - Intellectual Property (Trademarks, Copyrights, Trade Secrets)\n"
            "  - Human Capital (Owner expertise, key personnel)\n"
            "  - Technology Stack (Website, CRM, Accounting Software)\n"
            "  - Financial Capital (Startup funds, credit lines)\n"
            "  - Strategic Partnerships"
        )
        
        # Marketing & Growth Strategy
        self._add_section_header(pdf, "9. MARKETING & GROWTH STRATEGY")
        self._add_body_text(pdf,
            "Phase 1 - Launch (Months 1-3):\n"
            "  - Complete legal formation and obtain EIN\n"
            "  - Set up business banking and accounting\n"
            "  - Launch minimum viable product/service\n"
            "  - Begin local networking and referral program\n\n"
            "Phase 2 - Growth (Months 4-12):\n"
            "  - Implement digital marketing (SEO, PPC, Social Media)\n"
            "  - Develop strategic partnerships\n"
            "  - Expand service offerings based on customer feedback\n"
            "  - Hire first employee/contractor\n\n"
            "Phase 3 - Scale (Year 2+):\n"
            "  - Geographic expansion\n"
            "  - Product line extension\n"
            "  - Strategic acquisitions or partnerships\n"
            "  - Build management team"
        )
        
        # Financial Projections
        self._add_section_header(pdf, "10. FINANCIAL PROJECTIONS (12 MONTHS)")
        self._add_body_text(pdf,
            "Month 1-3 (Startup):\n"
            "  Revenue: $[0-5,000] | Expenses: $[3,000-8,000] | Net: $[Negative]\n"
            "  Cash Burn: $[Amount]/month | Runway: [Months]\n\n"
            "Month 4-6 (Traction):\n"
            "  Revenue: $[5,000-15,000] | Expenses: $[4,000-10,000] | Net: $[Positive]\n"
            "  Customer Acquisition Cost: $[Amount] | LTV: $[Amount]\n\n"
            "Month 7-12 (Growth):\n"
            "  Revenue: $[15,000-50,000] | Expenses: $[8,000-20,000] | Net: $[Positive]\n"
            "  Monthly Recurring Revenue: $[Amount] | Churn Rate: [%]\n\n"
            "Year 1 Total Projected Revenue: $[Amount]\n"
            "Year 1 Projected Net Profit: $[Amount]\n"
            "Break-even Point: Month [X]"
        )
        
        # Risk Analysis
        self._add_section_header(pdf, "11. RISK ANALYSIS & MITIGATION")
        risks = [
            ("Market Risk", "Low demand for product/service", "Validate with MVP, customer interviews"),
            ("Financial Risk", "Insufficient cash flow", "Maintain 6-month reserve, line of credit"),
            ("Legal/Compliance Risk", "Regulatory changes, lawsuits", "Legal counsel, insurance, compliance calendar"),
            ("Operational Risk", "Key person dependency", "Document processes, cross-training"),
            ("Competitive Risk", "New entrants, price wars", "Build moats, brand loyalty, IP protection"),
        ]
        for risk, desc, mitigation in risks:
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(60, 60, 60)
            pdf.cell(0, 7, f"  {risk}: {desc}", ln=True)
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(100, 100, 100)
            pdf.cell(0, 5, f"    Mitigation: {mitigation}", ln=True)
        pdf.ln(3)
        
        # Footer
        pdf.ln(10)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, f"Prepared by LLC Builder Pro | Document ID: {formation.id} | Confidential", ln=True, align="C")
        
        # Save
        filename = f"business_model_{formation.id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        filepath = self.output_dir / filename
        pdf.output(str(filepath))
        return str(filepath)
    
    def generate_loan_proposal(self, formation: LLCFormation) -> Optional[str]:
        """Generate loan proposal PDF if requested"""
        if not formation.business_info.loan_proposal_needed or not formation.business_info.loan_amount:
            return None
        
        pdf = self._create_base_pdf("LOAN PROPOSAL", formation)
        info = formation.business_info
        
        # Loan Summary
        self._add_section_header(pdf, "LOAN REQUEST SUMMARY")
        self._add_field(pdf, "Borrower", info.business_name)
        self._add_field(pdf, "Requested Amount", f"${info.loan_amount:,.2f}")
        self._add_field(pdf, "Loan Purpose", info.loan_purpose or "General working capital and growth")
        self._add_field(pdf, "Proposed Term", "3-5 years (36-60 months)")
        self._add_field(pdf, "Proposed Interest Rate", "Market rate (Prime + 2-4%)")
        self._add_field(pdf, "Collateral", "Business assets, personal guarantee")
        pdf.ln(3)
        
        # Business Description
        self._add_section_header(pdf, "BUSINESS DESCRIPTION")
        self._add_body_text(pdf,
            f"{info.business_name} is a {info.state} Limited Liability Company formed for the purpose of "
            f"{info.business_purpose.lower()}. The company is {info.management_structure.replace('-', ' ')} "
            f"by {info.owner_name}."
        )
        
        # Use of Funds
        self._add_section_header(pdf, "USE OF FUNDS")
        loan_amount = info.loan_amount
        allocations = [
            ("Equipment & Technology", loan_amount * 0.30),
            ("Working Capital (3-6 months)", loan_amount * 0.25),
            ("Marketing & Customer Acquisition", loan_amount * 0.20),
            ("Legal, Licenses & Compliance", loan_amount * 0.10),
            ("Contingency Reserve", loan_amount * 0.15),
        ]
        for category, amount in allocations:
            self._add_field(pdf, f"  {category}", f"${amount:,.2f}", bold_value=True)
        pdf.ln(3)
        
        # Repayment Plan
        self._add_section_header(pdf, "REPAYMENT PLAN")
        monthly_payment = loan_amount * 0.025  # Rough estimate
        self._add_body_text(pdf,
            f"Proposed Monthly Payment: ${monthly_payment:,.2f}\n"
            f"Loan Term: 48 months\n"
            f"Total Interest (est.): ${loan_amount * 0.08 * 4:,.2f}\n"
            f"Total Repayment: ${loan_amount + loan_amount * 0.08 * 4:,.2f}\n\n"
            f"Repayment Source: Business operating cash flow\n"
            f"Debt Service Coverage Ratio (Projected): 1.5x - 2.0x\n"
            f"Personal Guarantee: {info.owner_name} (Owner/Member)"
        )
        
        # Financial Statements (Projected)
        self._add_section_header(pdf, "PROJECTED FINANCIAL STATEMENTS")
        self._add_body_text(pdf,
            "INCOME STATEMENT PROJECTION (Annual)\n"
            "Year 1      Year 2      Year 3\n"
            f"Revenue     ${loan_amount*1.5:,.0f}   ${loan_amount*3:,.0f}   ${loan_amount*5:,.0f}\n"
            f"COGS        ${loan_amount*0.5:,.0f}   ${loan_amount*1.0:,.0f}   ${loan_amount*1.8:,.0f}\n"
            f"Gross Profit ${loan_amount*1.0:,.0f}  ${loan_amount*2.0:,.0f}   ${loan_amount*3.2:,.0f}\n"
            f"OpEx        ${loan_amount*0.7:,.0f}   ${loan_amount*1.2:,.0f}   ${loan_amount*2.0:,.0f}\n"
            f"Debt Service ${loan_amount*0.3:,.0f}  ${loan_amount*0.3:,.0f}   ${loan_amount*0.3:,.0f}\n"
            f"Net Income  ${loan_amount*0.0:,.0f}   ${loan_amount*0.5:,.0f}   ${loan_amount*0.9:,.0f}\n\n"
            "BALANCE SHEET HIGHLIGHTS (Post-Funding)\n"
            f"Cash: ${loan_amount:,.2f} | Total Assets: ${loan_amount*1.2:,.2f}\n"
            f"Total Liabilities: ${loan_amount:,.2f} | Member Equity: ${loan_amount*0.2:,.2f}\n"
            f"Debt-to-Equity Ratio: 5.0:1 (improving to <2:1 by Year 2)"
        )
        
        # Collateral & Guarantees
        self._add_section_header(pdf, "COLLATERAL & GUARANTEES")
        self._add_body_text(pdf,
            "Primary Collateral:\n"
            "  - All business assets (equipment, inventory, accounts receivable)\n"
            "  - Intellectual property and trademarks\n"
            "  - Business bank accounts and cash reserves\n\n"
            "Personal Guarantee:\n"
            f"  - {info.owner_name}, Managing Member\n"
            "  - Unlimited personal guarantee for full loan amount\n"
            "  - Personal financial statement available upon request\n\n"
            "Insurance:\n"
            "  - General Liability: $1,000,000/$2,000,000\n"
            "  - Professional Liability: $1,000,000 (if applicable)\n"
            "  - Key Person Life Insurance: [Amount matching loan]"
        )
        
        # Footer
        pdf.ln(10)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, f"Prepared by LLC Builder Pro | Document ID: {formation.id} | Confidential - For Lender Review Only", ln=True, align="C")
        
        filename = f"loan_proposal_{formation.id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        filepath = self.output_dir / filename
        pdf.output(str(filepath))
        return str(filepath)
    
    def generate_payment_receipt(self, formation: LLCFormation) -> str:
        """Generate payment receipt PDF"""
        pdf = self._create_base_pdf("PAYMENT RECEIPT", formation)
        
        self._add_section_header(pdf, "TRANSACTION DETAILS")
        self._add_field(pdf, "Receipt Number", f"RCP-{formation.id}-{datetime.now().strftime('%Y%m%d')}")
        self._add_field(pdf, "Date", datetime.now().strftime('%B %d, %Y'))
        self._add_field(pdf, "Payment Status", formation.payment_status.value.replace('_', ' ').title())
        if formation.payment_date:
            self._add_field(pdf, "Payment Date", formation.payment_date.strftime('%B %d, %Y at %I:%M %p'))
        if formation.payment_intent_id:
            self._add_field(pdf, "Transaction ID", formation.payment_intent_id)
        pdf.ln(3)
        
        # Customer Info
        self._add_section_header(pdf, "CUSTOMER INFORMATION")
        self._add_field(pdf, "Business Name", formation.business_info.business_name)
        self._add_field(pdf, "Owner Name", formation.business_info.owner_name)
        self._add_field(pdf, "Email", formation.business_info.owner_email)
        self._add_field(pdf, "Phone", formation.business_info.owner_phone)
        pdf.ln(3)
        
        # Line Items
        self._add_section_header(pdf, "SERVICES RENDERED")
        
        # Table header
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_fill_color(30, 58, 95)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(100, 8, "Description", border=1, fill=True)
        pdf.cell(30, 8, "Qty", border=1, fill=True, align="C")
        pdf.cell(30, 8, "Unit Price", border=1, fill=True, align="R")
        pdf.cell(30, 8, "Total", border=1, fill=True, align="R", ln=True)
        
        items = [
            ("State Filing Fee ({})".format(formation.business_info.state), 1, formation.state_filing_fee),
            ("LLC Formation Service", 1, formation.base_formation_fee),
            ("Registered Agent Service (1 Year)", 1 if formation.registered_agent_fee > 0 else 0, formation.registered_agent_fee),
            ("EIN Obtainment Service", 1 if formation.ein_service_fee > 0 else 0, formation.ein_service_fee),
            ("Website Design & Development", 1 if formation.website_design_fee > 0 else 0, formation.website_design_fee),
        ]
        
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(30, 30, 30)
        for desc, qty, price in items:
            if qty > 0:
                pdf.cell(100, 7, desc, border=1)
                pdf.cell(30, 7, str(qty), border=1, align="C")
                pdf.cell(30, 7, f"${price:,.2f}", border=1, align="R")
                pdf.cell(30, 7, f"${price * qty:,.2f}", border=1, align="R", ln=True)
        
        # Totals
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(100, 7, "", border=0)
        pdf.cell(30, 7, "", border=0)
        pdf.cell(30, 7, "Subtotal:", border=0, align="R")
        pdf.cell(30, 7, f"${formation.subtotal:,.2f}", border=0, align="R", ln=True)
        
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(100, 8, "", border=0)
        pdf.cell(30, 8, "", border=0)
        pdf.cell(30, 8, "TOTAL PAID:", border=0, align="R")
        pdf.cell(30, 8, f"${formation.total:,.2f}", border=0, align="R", ln=True)
        pdf.ln(5)
        
        # Payment Method
        self._add_section_header(pdf, "PAYMENT METHOD")
        self._add_body_text(pdf, "Credit Card via Stripe (Secure)")
        if formation.payment_intent_id:
            self._add_body_text(pdf, f"Stripe Payment Intent: {formation.payment_intent_id}")
        pdf.ln(3)
        
        # Platform Revenue Note (internal)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, f"Platform Revenue Share: ${formation.revenue_share_amount:,.2f} ({settings.REVENUE_SHARE_PERCENTAGE*100:.0f}% + website upsell)", ln=True, align="R")
        
        # Footer
        pdf.ln(10)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, f"LLC Builder Pro | Receipt ID: {formation.id} | Thank you for your business!", ln=True, align="C")
        
        filename = f"payment_receipt_{formation.id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        filepath = self.output_dir / filename
        pdf.output(str(filepath))
        return str(filepath)
    
    def generate_articles_of_organization(self, formation: LLCFormation) -> str:
        """Generate Articles of Organization template (state-specific)"""
        pdf = self._create_base_pdf("ARTICLES OF ORGANIZATION", formation)
        info = formation.business_info
        
        state = info.state
        
        # State-specific header
        self._add_section_header(pdf, f"STATE OF {state.upper()}")
        self._add_section_header(pdf, "ARTICLES OF ORGANIZATION")
        self._add_section_header(pdf, f"OF\n{info.business_name.upper()}")
        pdf.ln(5)
        
        # Article 1: Name
        self._add_section_header(pdf, "ARTICLE I: NAME")
        self._add_body_text(pdf,
            f"The name of this limited liability company is {info.business_name}. "
            f"The name complies with the naming requirements of the {state} Limited Liability Company Act."
        )
        
        # Article 2: Purpose
        self._add_section_header(pdf, "ARTICLE II: PURPOSE")
        self._add_body_text(pdf,
            f"The purpose for which this limited liability company is organized is to engage in any lawful "
            f"act or activity for which a limited liability company may be organized under the {state} "
            f"Limited Liability Company Act, including but not limited to: {info.business_purpose}."
        )
        
        # Article 3: Registered Agent
        self._add_section_header(pdf, "ARTICLE III: REGISTERED AGENT")
        if info.use_our_registered_agent:
            agent_name = "LLC Builder Pro Registered Agent Services"
            agent_address = f"[Registered Agent Address in {state}]"
        else:
            agent_name = info.registered_agent_name or "[Registered Agent Name]"
            agent_address = info.registered_agent_address or "[Registered Agent Address]"
        
        self._add_field(pdf, "Registered Agent Name", agent_name)
        self._add_field(pdf, "Registered Agent Address", agent_address)
        pdf.ln(3)
        
        # Article 4: Management
        self._add_section_header(pdf, "ARTICLE IV: MANAGEMENT")
        mgmt_text = "member-managed" if info.management_structure == "member-managed" else "manager-managed"
        self._add_body_text(pdf,
            f"This limited liability company shall be {mgmt_text}. "
            f"The members shall have the authority to bind the company in accordance with the Operating Agreement."
        )
        
        # Article 5: Duration
        self._add_section_header(pdf, "ARTICLE V: DURATION")
        self._add_body_text(pdf,
            "The period of duration of this limited liability company is perpetual."
        )
        
        # Article 6: Organizer
        self._add_section_header(pdf, "ARTICLE VI: ORGANIZER")
        self._add_body_text(pdf,
            f"The name and address of the organizer is:\n\n"
            f"  {info.owner_name}\n"
            f"  {info.owner_address}\n\n"
            f"The organizer affirms that the foregoing statements are true and correct."
        )
        
        # Effective Date
        if info.effective_date:
            self._add_section_header(pdf, "ARTICLE VII: EFFECTIVE DATE")
            self._add_body_text(pdf,
                f"This Articles of Organization shall become effective on {info.effective_date}."
            )
        
        # Signature Block
        pdf.ln(10)
        self._add_section_header(pdf, "EXECUTION")
        self._add_body_text(pdf,
            "IN WITNESS WHEREOF, the undersigned has executed these Articles of Organization "
            f"on this _____ day of _______________, 20____.\n\n\n"
            f"_________________________________________\n"
            f"  {info.owner_name}, Organizer\n\n"
            f"STATE OF {state.upper()}\n"
            f"COUNTY OF _______________\n\n"
            f"The foregoing instrument was acknowledged before me this _____ day of "
            f"_______________, 20____, by {info.owner_name}, who is personally known to me "
            f"or has produced _______________ as identification.\n\n\n"
            f"_________________________________________\n"
            f"  Notary Public\n"
            f"  My Commission Expires: _______________"
        )
        
        # Footer
        pdf.ln(10)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, f"Template by LLC Builder Pro | Document ID: {formation.id} | File with {state} Secretary of State", ln=True, align="C")
        
        filename = f"articles_of_organization_{formation.id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        filepath = self.output_dir / filename
        pdf.output(str(filepath))
        return str(filepath)
    
    def generate_operating_agreement(self, formation: LLCFormation) -> str:
        """Generate Operating Agreement template"""
        pdf = self._create_base_pdf("OPERATING AGREEMENT", formation)
        info = formation.business_info
        
        self._add_section_header(pdf, f"OPERATING AGREEMENT OF\n{info.business_name.upper()}")
        pdf.ln(5)
        
        # Section 1: Formation
        self._add_section_header(pdf, "SECTION 1: FORMATION")
        self._add_body_text(pdf,
            f"1.1 Name. The name of the company is {info.business_name} (the \"Company\").\n\n"
            f"1.2 Formation. The Company was formed as a limited liability company under the laws of the "
            f"State of {info.state} on the date the Articles of Organization were filed with the "
            f"{state} Secretary of State.\n\n"
            f"1.3 Purpose. The purpose of the Company is {info.business_purpose.lower()}.\n\n"
            f"1.4 Principal Office. The principal office of the Company shall be located at "
            f"{info.owner_address}, or such other location as the Members may determine.\n\n"
            f"1.5 Registered Agent. The registered agent of the Company is as stated in the Articles "
            f"of Organization."
        )
        
        # Section 2: Members
        self._add_section_header(pdf, "SECTION 2: MEMBERS")
        self._add_body_text(pdf,
            f"2.1 Initial Member. The initial Member of the Company is:\n\n"
            f"  Name: {info.owner_name}\n"
            f"  Address: {info.owner_address}\n"
            f"  Capital Contribution: $[Amount]\n"
            f"  Membership Interest: 100%\n\n"
            f"2.2 Additional Members. Additional Members may be admitted only with the unanimous "
            f"written consent of all existing Members.\n\n"
            f"2.3 Liability of Members. The Members shall not be personally liable for the debts, "
            f"obligations, or liabilities of the Company solely by reason of being a Member."
        )
        
        # Section 3: Management
        self._add_section_header(pdf, f"SECTION 3: MANAGEMENT ({info.management_structure.upper().replace('-', ' ')})")
        if info.management_structure == "member-managed":
            self._add_body_text(pdf,
                "3.1 Member Management. The Company shall be managed by its Members. Each Member shall "
                "have the authority to bind the Company in the ordinary course of business.\n\n"
                "3.2 Voting. Each Member shall have voting rights proportional to their Membership "
                "Interest. Decisions requiring Member approval shall be made by a majority of Membership "
                "Interests, except as otherwise required by law or this Agreement.\n\n"
                "3.3 Meetings. Members may hold meetings at such times and places as determined by the "
                "Members. Actions may be taken without a meeting by unanimous written consent."
            )
        else:
            self._add_body_text(pdf,
                "3.1 Manager Management. The Company shall be managed by one or more Managers appointed "
                "by the Members. The initial Manager(s) shall be designated by the Members.\n\n"
                "3.2 Authority of Managers. The Managers shall have full authority to manage the business "
                "and affairs of the Company, including the authority to bind the Company.\n\n"
                "3.3 Member Rights. Members shall have the right to vote on: (a) amendment of this "
                "Agreement, (b) admission of new Members, (c) dissolution of the Company, and (d) sale "
                "of all or substantially all of the Company's assets."
            )
        
        # Section 4: Capital Contributions
        self._add_section_header(pdf, "SECTION 4: CAPITAL CONTRIBUTIONS")
        self._add_body_text(pdf,
            "4.1 Initial Contributions. Each Member shall contribute capital to the Company as set forth "
            "in Section 2.1.\n\n"
            "4.2 Additional Contributions. No Member shall be required to make additional capital "
            "contributions unless agreed to in writing by all Members.\n\n"
            "4.3 Capital Accounts. The Company shall maintain a capital account for each Member in "
            "accordance with Treasury Regulations Section 1.704-1(b)."
        )
        
        # Section 5: Allocations & Distributions
        self._add_section_header(pdf, "SECTION 5: ALLOCATIONS AND DISTRIBUTIONS")
        self._add_body_text(pdf,
            "5.1 Allocations. Profits and losses shall be allocated to the Members in proportion to their "
            "Membership Interests.\n\n"
            "5.2 Distributions. The Company may make distributions to Members at such times and in such "
            "amounts as determined by the Members (or Managers, if manager-managed), subject to the "
            "limitations of the Act. Distributions shall be made in proportion to Membership Interests.\n\n"
            "5.3 Tax Distributions. The Company shall make distributions to Members at least annually "
            "in an amount sufficient to cover each Member's estimated tax liability attributable to "
            "the Company's income."
        )
        
        # Section 6: Transfer of Interests
        self._add_section_header(pdf, "SECTION 6: TRANSFER OF MEMBERSHIP INTERESTS")
        self._add_body_text(pdf,
            "6.1 Restrictions. No Member may sell, assign, transfer, or otherwise dispose of any "
            "Membership Interest without the prior written consent of all other Members.\n\n"
            "6.2 Right of First Refusal. If a Member desires to transfer a Membership Interest, the "
            "Company and the other Members shall have a right of first refusal to purchase the "
            "Interest on the same terms and conditions.\n\n"
            "6.3 Permitted Transfers. A Member may transfer a Membership Interest to a revocable trust "
            "for estate planning purposes without consent, provided the Member remains the beneficial owner."
        )
        
        # Section 7: Dissolution
        self._add_section_header(pdf, "SECTION 7: DISSOLUTION AND WINDING UP")
        self._add_body_text(pdf,
            "7.1 Events of Dissolution. The Company shall dissolve upon: (a) unanimous written consent "
            "of all Members, (b) entry of a decree of judicial dissolution, or (c) the occurrence of "
            "any other event specified in the Act.\n\n"
            "7.2 Winding Up. Upon dissolution, the Company shall wind up its affairs, liquidate its "
            "assets, pay its debts, and distribute the remaining assets to Members in proportion to "
            "their Membership Interests."
        )
        
        # Section 8: General Provisions
        self._add_section_header(pdf, "SECTION 8: GENERAL PROVISIONS")
        self._add_body_text(pdf,
            "8.1 Governing Law. This Agreement shall be governed by the laws of the State of "
            f"{info.state}.\n\n"
            "8.2 Amendment. This Agreement may be amended only by a written instrument signed by all Members.\n\n"
            "8.3 Severability. If any provision of this Agreement is held invalid, the remaining "
            "provisions shall continue in full force and effect.\n\n"
            "8.4 Entire Agreement. This Agreement constitutes the entire agreement among the Members "
            "with respect to the subject matter hereof.\n\n"
            "8.5 Counterparts. This Agreement may be executed in counterparts, each of which shall be "
            "deemed an original."
        )
        
        # Signature Block
        pdf.ln(10)
        self._add_section_header(pdf, "SIGNATURES")
        self._add_body_text(pdf,
            "IN WITNESS WHEREOF, the undersigned has executed this Operating Agreement as of the date "
            "first written above.\n\n\n"
            f"_________________________________________\n"
            f"  {info.owner_name}, Member\n\n"
            f"Date: _______________"
        )
        
        # Footer
        pdf.ln(10)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, f"Template by LLC Builder Pro | Document ID: {formation.id} | Keep with Company Records", ln=True, align="C")
        
        filename = f"operating_agreement_{formation.id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        filepath = self.output_dir / filename
        pdf.output(str(filepath))
        return str(filepath)
    
    def generate_all_pdfs(self, formation: LLCFormation) -> Dict[str, str]:
        """Generate all PDFs for a formation"""
        results = {}
        
        results['business_model'] = self.generate_business_model(formation)
        results['articles_of_organization'] = self.generate_articles_of_organization(formation)
        results['operating_agreement'] = self.generate_operating_agreement(formation)
        results['payment_receipt'] = self.generate_payment_receipt(formation)
        
        if formation.business_info.loan_proposal_needed:
            results['loan_proposal'] = self.generate_loan_proposal(formation)
        
        return results


pdf_generator = PDFGenerator()