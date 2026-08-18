"""
Core Data Models for LLC Builder
"""
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional
import uuid


class LLCStatus(Enum):
    DRAFT = "draft"
    PAYMENT_PENDING = "payment_pending"
    PAYMENT_COMPLETE = "payment_complete"
    FILING_IN_PROGRESS = "filing_in_progress"
    FILING_COMPLETE = "filing_complete"
    EMAIL_CREATED = "email_created"
    WEBSITE_PENDING = "website_pending"
    WEBSITE_COMPLETE = "website_complete"
    DELIVERED = "delivered"
    FAILED = "failed"


class PaymentStatus(Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"


class WebsiteDesignStatus(Enum):
    NOT_REQUESTED = "not_requested"
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETE = "complete"
    DECLINED = "declined"


@dataclass
class BusinessInfo:
    """Core business information for LLC formation"""
    # Required fields
    business_name: str
    state: str
    owner_name: str
    owner_email: str
    owner_phone: str
    owner_address: str
    
    # Optional fields
    business_purpose: str = "Any lawful business activity"
    management_structure: str = "member-managed"  # member-managed or manager-managed
    effective_date: Optional[str] = None  # If delayed effective date desired
    
    # Registered Agent
    registered_agent_name: Optional[str] = None
    registered_agent_address: Optional[str] = None
    use_our_registered_agent: bool = True  # We provide registered agent service
    
    # Banking & Financial
    ein_needed: bool = True
    bank_account_needed: bool = True
    loan_proposal_needed: bool = False
    loan_amount: Optional[float] = None
    loan_purpose: Optional[str] = None
    
    # Upsells
    website_design: bool = False
    website_pages: int = 5
    website_features: list = field(default_factory=list)
    
    # Metadata
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)


@dataclass
class LLCFormation:
    """Complete LLC formation record"""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    business_info: BusinessInfo = None
    
    # Status tracking
    status: LLCStatus = LLCStatus.DRAFT
    current_step: int = 1
    total_steps: int = 6
    
    # Pricing
    state_filing_fee: float = 0.0
    base_formation_fee: float = 199.00
    registered_agent_fee: float = 99.00  # Annual
    ein_service_fee: float = 50.00
    website_design_fee: float = 0.00
    subtotal: float = 0.0
    revenue_share_amount: float = 0.0  # Amount to platform owner
    total: float = 0.0
    
    # Payment
    payment_intent_id: Optional[str] = None
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_amount: float = 0.0
    payment_date: Optional[datetime] = None
    
    # Documents generated
    articles_of_organization_pdf: Optional[str] = None
    operating_agreement_pdf: Optional[str] = None
    business_model_pdf: Optional[str] = None
    loan_proposal_pdf: Optional[str] = None
    payment_receipt_pdf: Optional[str] = None
    
    # Email
    business_email: Optional[str] = None
    email_created: bool = False
    email_credentials: Optional[dict] = None
    
    # Filing
    filing_confirmation_number: Optional[str] = None
    filing_date: Optional[datetime] = None
    ein_number: Optional[str] = None
    
    # Website
    website_design_status: WebsiteDesignStatus = WebsiteDesignStatus.NOT_REQUESTED
    website_url: Optional[str] = None
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    
    # Lead tracking
    lead_source: str = "direct"
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None


@dataclass
class LeadRecord:
    """Lead tracking for platform owner"""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    llc_id: str = ""
    
    # Customer info
    business_name: str = ""
    owner_name: str = ""
    owner_email: str = ""
    owner_phone: str = ""
    state: str = ""
    
    # Financial
    total_revenue: float = 0.0
    platform_revenue: float = 0.0  # Your cut
    website_revenue: float = 0.0  # Pure profit upsell
    
    # Status
    status: LLCStatus = LLCStatus.DRAFT
    payment_status: PaymentStatus = PaymentStatus.PENDING
    
    # Source tracking
    lead_source: str = "direct"
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    converted_at: Optional[datetime] = None
    
    # Notes
    notes: str = ""