"""
Database Layer for LLC Builder
SQLite for leads and formations, CSV export for platform owner
"""
import sqlite3
import csv
import json
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict, Any
from contextlib import contextmanager

from config.settings import settings
from app.models import LLCFormation, BusinessInfo, LeadRecord, LLCStatus, PaymentStatus, WebsiteDesignStatus


class Database:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or str(settings.DATABASE_URL.replace("sqlite:///", ""))
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_db()
    
    def _init_db(self):
        with self._conn() as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS llc_formations (
                    id TEXT PRIMARY KEY,
                    business_name TEXT NOT NULL,
                    state TEXT NOT NULL,
                    owner_name TEXT NOT NULL,
                    owner_email TEXT NOT NULL,
                    owner_phone TEXT NOT NULL,
                    owner_address TEXT NOT NULL,
                    business_purpose TEXT,
                    management_structure TEXT,
                    effective_date TEXT,
                    registered_agent_name TEXT,
                    registered_agent_address TEXT,
                    use_our_registered_agent BOOLEAN DEFAULT 1,
                    ein_needed BOOLEAN DEFAULT 1,
                    bank_account_needed BOOLEAN DEFAULT 1,
                    loan_proposal_needed BOOLEAN DEFAULT 0,
                    loan_amount REAL,
                    loan_purpose TEXT,
                    website_design BOOLEAN DEFAULT 0,
                    website_pages INTEGER DEFAULT 5,
                    website_features TEXT,
                    
                    status TEXT DEFAULT 'draft',
                    current_step INTEGER DEFAULT 1,
                    total_steps INTEGER DEFAULT 6,
                    
                    state_filing_fee REAL DEFAULT 0,
                    base_formation_fee REAL DEFAULT 199,
                    registered_agent_fee REAL DEFAULT 99,
                    ein_service_fee REAL DEFAULT 50,
                    website_design_fee REAL DEFAULT 0,
                    subtotal REAL DEFAULT 0,
                    revenue_share_amount REAL DEFAULT 0,
                    total REAL DEFAULT 0,
                    
                    payment_intent_id TEXT,
                    payment_status TEXT DEFAULT 'pending',
                    payment_amount REAL DEFAULT 0,
                    payment_date TEXT,
                    
                    articles_of_organization_pdf TEXT,
                    operating_agreement_pdf TEXT,
                    business_model_pdf TEXT,
                    loan_proposal_pdf TEXT,
                    payment_receipt_pdf TEXT,
                    
                    business_email TEXT,
                    email_created BOOLEAN DEFAULT 0,
                    email_credentials TEXT,
                    
                    filing_confirmation_number TEXT,
                    filing_date TEXT,
                    ein_number TEXT,
                    
                    website_design_status TEXT DEFAULT 'not_requested',
                    website_url TEXT,
                    
                    created_at TEXT,
                    updated_at TEXT,
                    completed_at TEXT,
                    
                    lead_source TEXT DEFAULT 'direct',
                    utm_source TEXT,
                    utm_medium TEXT,
                    utm_campaign TEXT,
                    
                    business_info_json TEXT
                );
                
                CREATE TABLE IF NOT EXISTS lead_records (
                    id TEXT PRIMARY KEY,
                    llc_id TEXT,
                    business_name TEXT,
                    owner_name TEXT,
                    owner_email TEXT,
                    owner_phone TEXT,
                    state TEXT,
                    total_revenue REAL DEFAULT 0,
                    platform_revenue REAL DEFAULT 0,
                    website_revenue REAL DEFAULT 0,
                    status TEXT DEFAULT 'draft',
                    payment_status TEXT DEFAULT 'pending',
                    lead_source TEXT DEFAULT 'direct',
                    utm_source TEXT,
                    utm_medium TEXT,
                    utm_campaign TEXT,
                    created_at TEXT,
                    updated_at TEXT,
                    converted_at TEXT,
                    notes TEXT
                );
                
                CREATE INDEX IF NOT EXISTS idx_llc_owner_email ON llc_formations(owner_email);
                CREATE INDEX IF NOT EXISTS idx_llc_status ON llc_formations(status);
                CREATE INDEX IF NOT EXISTS idx_lead_llc_id ON lead_records(llc_id);
                CREATE INDEX IF NOT EXISTS idx_lead_created ON lead_records(created_at);
            """)
    
    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def save_formation(self, formation: LLCFormation) -> LLCFormation:
        with self._conn() as conn:
            # Calculate pricing if not set
            if formation.subtotal == 0:
                self._calculate_pricing(formation)
            
            business_info_json = json.dumps({
                "business_name": formation.business_info.business_name,
                "state": formation.business_info.state,
                "owner_name": formation.business_info.owner_name,
                "owner_email": formation.business_info.owner_email,
                "owner_phone": formation.business_info.owner_phone,
                "owner_address": formation.business_info.owner_address,
                "business_purpose": formation.business_info.business_purpose,
                "management_structure": formation.business_info.management_structure,
                "effective_date": formation.business_info.effective_date,
                "registered_agent_name": formation.business_info.registered_agent_name,
                "registered_agent_address": formation.business_info.registered_agent_address,
                "use_our_registered_agent": formation.business_info.use_our_registered_agent,
                "ein_needed": formation.business_info.ein_needed,
                "bank_account_needed": formation.business_info.bank_account_needed,
                "loan_proposal_needed": formation.business_info.loan_proposal_needed,
                "loan_amount": formation.business_info.loan_amount,
                "loan_purpose": formation.business_info.loan_purpose,
                "website_design": formation.business_info.website_design,
                "website_pages": formation.business_info.website_pages,
                "website_features": formation.business_info.website_features,
            })
            
            conn.execute("""
                INSERT OR REPLACE INTO llc_formations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                formation.id,
                formation.business_info.business_name,
                formation.business_info.state,
                formation.business_info.owner_name,
                formation.business_info.owner_email,
                formation.business_info.owner_phone,
                formation.business_info.owner_address,
                formation.business_info.business_purpose,
                formation.business_info.management_structure,
                formation.business_info.effective_date,
                formation.business_info.registered_agent_name,
                formation.business_info.registered_agent_address,
                formation.business_info.use_our_registered_agent,
                formation.business_info.ein_needed,
                formation.business_info.bank_account_needed,
                formation.business_info.loan_proposal_needed,
                formation.business_info.loan_amount,
                formation.business_info.loan_purpose,
                formation.business_info.website_design,
                formation.business_info.website_pages,
                json.dumps(formation.business_info.website_features),
                
                formation.status.value,
                formation.current_step,
                formation.total_steps,
                
                formation.state_filing_fee,
                formation.base_formation_fee,
                formation.registered_agent_fee,
                formation.ein_service_fee,
                formation.website_design_fee,
                formation.subtotal,
                formation.revenue_share_amount,
                formation.total,
                
                formation.payment_intent_id,
                formation.payment_status.value,
                formation.payment_amount,
                formation.payment_date.isoformat() if formation.payment_date else None,
                
                formation.articles_of_organization_pdf,
                formation.operating_agreement_pdf,
                formation.business_model_pdf,
                formation.loan_proposal_pdf,
                formation.payment_receipt_pdf,
                
                formation.business_email,
                formation.email_created,
                json.dumps(formation.email_credentials) if formation.email_credentials else None,
                
                formation.filing_confirmation_number,
                formation.filing_date.isoformat() if formation.filing_date else None,
                formation.ein_number,
                
                formation.website_design_status.value,
                formation.website_url,
                
                formation.created_at.isoformat(),
                formation.updated_at.isoformat(),
                formation.completed_at.isoformat() if formation.completed_at else None,
                
                formation.lead_source,
                formation.utm_source,
                formation.utm_medium,
                formation.utm_campaign,
                
                business_info_json,
            ))
            
            # Update or create lead record
            self._upsert_lead_record(formation)
            
        return formation
    
    def _calculate_pricing(self, formation: LLCFormation):
        state_fee = settings.STATE_FEES.get(formation.business_info.state, 100)
        formation.state_filing_fee = state_fee
        formation.base_formation_fee = settings.BASE_FORMATION_FEE
        formation.registered_agent_fee = 99.00 if formation.business_info.use_our_registered_agent else 0
        formation.ein_service_fee = 50.00 if formation.business_info.ein_needed else 0
        formation.website_design_fee = settings.WEBSITE_DESIGN_PRICE if formation.business_info.website_design else 0
        
        formation.subtotal = (
            formation.state_filing_fee +
            formation.base_formation_fee +
            formation.registered_agent_fee +
            formation.ein_service_fee +
            formation.website_design_fee
        )
        
        # Revenue share calculation
        platform_cut = formation.subtotal * settings.REVENUE_SHARE_PERCENTAGE
        website_pure_profit = formation.website_design_fee * settings.WEBSITE_REVENUE_SHARE
        formation.revenue_share_amount = platform_cut + website_pure_profit
        formation.total = formation.subtotal
    
    def _upsert_lead_record(self, formation: LLCFormation):
        lead = LeadRecord(
            id=f"LEAD-{formation.id}",
            llc_id=formation.id,
            business_name=formation.business_info.business_name,
            owner_name=formation.business_info.owner_name,
            owner_email=formation.business_info.owner_email,
            owner_phone=formation.business_info.owner_phone,
            state=formation.business_info.state,
            total_revenue=formation.total,
            platform_revenue=formation.revenue_share_amount,
            website_revenue=formation.website_design_fee * settings.WEBSITE_REVENUE_SHARE if formation.business_info.website_design else 0,
            status=formation.status,
            payment_status=formation.payment_status,
            lead_source=formation.lead_source,
            utm_source=formation.utm_source,
            utm_medium=formation.utm_medium,
            utm_campaign=formation.utm_campaign,
        )
        
        with self._conn() as conn:
            conn.execute("""
                INSERT OR REPLACE INTO lead_records VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lead.id, lead.llc_id, lead.business_name, lead.owner_name,
                lead.owner_email, lead.owner_phone, lead.state,
                lead.total_revenue, lead.platform_revenue, lead.website_revenue,
                lead.status.value, lead.payment_status.value, lead.lead_source,
                lead.utm_source, lead.utm_medium, lead.utm_campaign,
                lead.created_at.isoformat(), lead.updated_at.isoformat(),
                lead.converted_at.isoformat() if lead.converted_at else None,
                lead.notes,
            ))
    
    def get_formation(self, formation_id: str) -> Optional[LLCFormation]:
        with self._conn() as conn:
            row = conn.execute("SELECT * FROM llc_formations WHERE id = ?", (formation_id,)).fetchone()
            if not row:
                return None
            return self._row_to_formation(row)
    
    def get_formations(self, limit: int = 100, offset: int = 0, status: LLCStatus = None) -> List[LLCFormation]:
        with self._conn() as conn:
            query = "SELECT * FROM llc_formations"
            params = []
            if status:
                query += " WHERE status = ?"
                params.append(status.value)
            query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])
            
            rows = conn.execute(query, params).fetchall()
            return [self._row_to_formation(row) for row in rows]
    
    def get_leads(self, limit: int = 100, offset: int = 0) -> List[LeadRecord]:
        with self._conn() as conn:
            rows = conn.execute(
                "SELECT * FROM lead_records ORDER BY created_at DESC LIMIT ? OFFSET ?", 
                (limit, offset)
            ).fetchall()
            return [self._row_to_lead(row) for row in rows]
    
    def export_leads_csv(self, output_path: str = None) -> str:
        """Export leads to CSV for platform owner"""
        output_path = output_path or str(settings.LEAD_CSV_PATH)
        leads = self.get_leads(limit=10000)
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Lead ID', 'LLC ID', 'Business Name', 'Owner Name', 'Owner Email',
                'Owner Phone', 'State', 'Total Revenue', 'Platform Revenue',
                'Website Revenue', 'Status', 'Payment Status', 'Lead Source',
                'UTM Source', 'UTM Medium', 'UTM Campaign', 'Created At',
                'Updated At', 'Converted At', 'Notes'
            ])
            for lead in leads:
                writer.writerow([
                    lead.id, lead.llc_id, lead.business_name, lead.owner_name,
                    lead.owner_email, lead.owner_phone, lead.state,
                    lead.total_revenue, lead.platform_revenue, lead.website_revenue,
                    lead.status.value, lead.payment_status.value, lead.lead_source,
                    lead.utm_source, lead.utm_medium, lead.utm_campaign,
                    lead.created_at.isoformat(), lead.updated_at.isoformat(),
                    lead.converted_at.isoformat() if lead.converted_at else '',
                    lead.notes
                ])
        return output_path
    
    def get_revenue_summary(self) -> Dict[str, Any]:
        """Get revenue summary for dashboard"""
        with self._conn() as conn:
            total_revenue = conn.execute(
                "SELECT COALESCE(SUM(total_revenue), 0) FROM lead_records WHERE payment_status = 'succeeded'"
            ).fetchone()[0]
            
            platform_revenue = conn.execute(
                "SELECT COALESCE(SUM(platform_revenue), 0) FROM lead_records WHERE payment_status = 'succeeded'"
            ).fetchone()[0]
            
            website_revenue = conn.execute(
                "SELECT COALESCE(SUM(website_revenue), 0) FROM lead_records WHERE payment_status = 'succeeded'"
            ).fetchone()[0]
            
            total_leads = conn.execute("SELECT COUNT(*) FROM lead_records").fetchone()[0]
            converted = conn.execute(
                "SELECT COUNT(*) FROM lead_records WHERE payment_status = 'succeeded'"
            ).fetchone()[0]
            
            return {
                "total_revenue": total_revenue,
                "platform_revenue": platform_revenue,
                "website_revenue": website_revenue,
                "total_leads": total_leads,
                "converted_leads": converted,
                "conversion_rate": (converted / total_leads * 100) if total_leads > 0 else 0
            }
    
    def _row_to_formation(self, row) -> LLCFormation:
        info = json.loads(row['business_info_json']) if row['business_info_json'] else {}
        business_info = BusinessInfo(**info) if info else BusinessInfo(
            business_name=row['business_name'],
            state=row['state'],
            owner_name=row['owner_name'],
            owner_email=row['owner_email'],
            owner_phone=row['owner_phone'],
            owner_address=row['owner_address'],
        )
        
        return LLCFormation(
            id=row['id'],
            business_info=business_info,
            status=LLCStatus(row['status']),
            current_step=row['current_step'],
            total_steps=row['total_steps'],
            state_filing_fee=row['state_filing_fee'],
            base_formation_fee=row['base_formation_fee'],
            registered_agent_fee=row['registered_agent_fee'],
            ein_service_fee=row['ein_service_fee'],
            website_design_fee=row['website_design_fee'],
            subtotal=row['subtotal'],
            revenue_share_amount=row['revenue_share_amount'],
            total=row['total'],
            payment_intent_id=row['payment_intent_id'],
            payment_status=PaymentStatus(row['payment_status']),
            payment_amount=row['payment_amount'],
            payment_date=datetime.fromisoformat(row['payment_date']) if row['payment_date'] else None,
            articles_of_organization_pdf=row['articles_of_organization_pdf'],
            operating_agreement_pdf=row['operating_agreement_pdf'],
            business_model_pdf=row['business_model_pdf'],
            loan_proposal_pdf=row['loan_proposal_pdf'],
            payment_receipt_pdf=row['payment_receipt_pdf'],
            business_email=row['business_email'],
            email_created=bool(row['email_created']),
            email_credentials=json.loads(row['email_credentials']) if row['email_credentials'] else None,
            filing_confirmation_number=row['filing_confirmation_number'],
            filing_date=datetime.fromisoformat(row['filing_date']) if row['filing_date'] else None,
            ein_number=row['ein_number'],
            website_design_status=WebsiteDesignStatus(row['website_design_status']),
            website_url=row['website_url'],
            created_at=datetime.fromisoformat(row['created_at']),
            updated_at=datetime.fromisoformat(row['updated_at']),
            completed_at=datetime.fromisoformat(row['completed_at']) if row['completed_at'] else None,
            lead_source=row['lead_source'],
            utm_source=row['utm_source'],
            utm_medium=row['utm_medium'],
            utm_campaign=row['utm_campaign'],
        )
    
    def _row_to_lead(self, row) -> LeadRecord:
        return LeadRecord(
            id=row['id'],
            llc_id=row['llc_id'],
            business_name=row['business_name'],
            owner_name=row['owner_name'],
            owner_email=row['owner_email'],
            owner_phone=row['owner_phone'],
            state=row['state'],
            total_revenue=row['total_revenue'],
            platform_revenue=row['platform_revenue'],
            website_revenue=row['website_revenue'],
            status=LLCStatus(row['status']),
            payment_status=PaymentStatus(row['payment_status']),
            lead_source=row['lead_source'],
            utm_source=row['utm_source'],
            utm_medium=row['utm_medium'],
            utm_campaign=row['utm_campaign'],
            created_at=datetime.fromisoformat(row['created_at']),
            updated_at=datetime.fromisoformat(row['updated_at']),
            converted_at=datetime.fromisoformat(row['converted_at']) if row['converted_at'] else None,
            notes=row['notes'],
        )


db = Database()