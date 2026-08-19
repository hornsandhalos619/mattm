"""
LLC Builder Web Application
Main Flask application with routes for the LLC formation process
"""
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime

from .models import *
from .database import db_manager
from .pdf_generator import pdf_generator
from .payment_processor import payment_processor
from .llc_filing import llc_filing_service
from .email_service import email_service
from .config import Settings

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = Settings().flask_secret_key
    app.config['UPLOAD_FOLDER'] = '/c/Users/mattm/llc_builder/app/uploads'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
    
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    @app.route('/')
    def index():
        """Landing page"""
        return render_template('index.html')
    
    @app.route('/start', methods=['GET', 'POST'])
    def start_formation():
        """Start the LLC formation process"""
        if request.method == 'GET':
            return render_template('start.html')
        
        # Handle form submission
        try:
            # Create lead
            lead_id = str(uuid.uuid4())
            lead = LeadRecord(
                id=lead_id,
                first_name=request.form['first_name'],
                last_name=request.form['last_name'],
                email=request.form['email'],
                phone=request.form.get('phone', ''),
                company=request.form.get('company', ''),
                industry=request.form.get('industry', ''),
                source=request.form.get('source', 'website'),
                status=LeadStatus.NEW
            )
            
            db_manager.create_lead(lead)
            
            # Store lead ID in session
            session['lead_id'] = lead_id
            
            # Send welcome email
            email_service.send_welcome_email(lead_id)
            
            flash('Welcome! Let\'s start building your LLC.', 'success')
            return redirect(url_for('business_info'))
            
        except Exception as e:
            flash(f'Error starting process: {str(e)}', 'error')
            return render_template('start.html')
    
    @app.route('/business-info', methods=['GET', 'POST'])
    def business_info():
        """Collect business information"""
        if 'lead_id' not in session:
            return redirect(url_for('index'))
        
        if request.method == 'GET':
            return render_template('business_info.html')
        
        try:
            # Create business info
            business_info_id = str(uuid.uuid4())
            business_info = BusinessInfo(
                id=business_info_id,
                lead_id=session['lead_id'],
                owner_first_name=request.form['owner_first_name'],
                owner_last_name=request.form['owner_last_name'],
                owner_email=request.form['owner_email'],
                owner_phone=request.form.get('owner_phone', ''),
                business_name=request.form['business_name'],
                business_address=request.form.get('business_address', ''),
                business_city=request.form.get('business_city', ''),
                business_state=request.form.get('business_state', ''),
                business_zip=request.form.get('business_zip', ''),
                industry=request.form.get('industry', ''),
                business_description=request.form.get('business_description', ''),
                website_url=request.form.get('website_url', '')
            )
            
            db_manager.create_business_info(business_info)
            
            # Store business info ID in session
            session['business_info_id'] = business_info_id
            
            flash('Great! Now let\'s choose your LLC details.', 'success')
            return redirect(url_for('llc_details'))
            
        except Exception as e:
            flash(f'Error saving business info: {str(e)}', 'error')
            return render_template('business_info.html')
    
    @app.route('/llc-details', methods=['GET', 'POST'])
    def llc_details():
        """Collect LLC specific details"""
        if 'business_info_id' not in session:
            return redirect(url_for('start_formation'))
        
        if request.method == 'GET':
            # Get business info to display
            business_info = db_manager.get_business_info(session['business_info_id'])
            return render_template('llc_details.html', business_info=business_info)
        
        try:
            # Create LLC formation
            formation_id = str(uuid.uuid4())
            formation = LLCFormation(
                id=formation_id,
                business_info_id=session['business_info_id'],
                business_name=request.form['business_name'],
                state_code=request.form['state_code'],
                expedited_processing=request.form.get('expedited_processing') == 'on',
                registered_agent_service=request.form.get('registered_agent_service') == 'on',
                filing_fee=0.0,  # Will be calculated later
                status=LLCStatus.DRAFT
            )
            
            db_manager.create_formation(formation)
            
            # Store formation ID in session
            session['formation_id'] = formation_id
            
            flash('Perfect! Now let\'s review and process payment.', 'success')
            return redirect(url_for('payment'))
            
        except Exception as e:
            flash(f'Error saving LLC details: {str(e)}', 'error')
            return render_template('llc_details.html')
    
    @app.route('/payment', methods=['GET', 'POST'])
    def payment():
        """Handle payment processing"""
        if 'formation_id' not in session:
            return redirect(url_for('start_formation'))
        
        if request.method == 'GET':
            # Get formation and business info for display
            formation = db_manager.get_formation(session['formation_id'])
            business_info = db_manager.get_business_info(formation.business_info_id) if formation else None
            
            # Calculate pricing
            settings = Settings()
            base_price = settings.base_llc_price
            website_price = settings.website_upsell_price
            
            return render_template('payment.html', 
                                 formation=formation,
                                 business_info=business_info,
                                 base_price=base_price,
                                 website_price=website_price)
        
        try:
            formation = db_manager.get_formation(session['formation_id'])
            if not formation:
                flash('Formation not found', 'error')
                return redirect(url_for('start_formation'))
            
            # Determine if website upsell is selected
            include_website = request.form.get('include_website') == 'on'
            
            # Calculate amount
            settings = Settings()
            base_amount = Decimal(str(settings.base_llc_price))
            website_amount = Decimal(str(settings.website_upsell_price)) if include_website else Decimal('0')
            total_amount = base_amount + website_amount
            
            # Create payment session
            payment_result = payment_processor.create_payment_session(
                formation_id=session['formation_id'],
                amount_usd=total_amount,
                include_website=include_website
            )
            
            # Update formation with payment pending status
            formation.status = LLCStatus.PAYMENT_PENDING
            db_manager.update_formation(formation)
            
            # Redirect to Stripe checkout
            return redirect(payment_result['url'], code=303)
            
        except Exception as e:
            flash(f'Error processing payment: {str(e)}', 'error')
            return render_template('payment.html')
    
    @app.route('/payment-success')
    def payment_success():
        """Handle successful payment redirect from Stripe"""
        session_id = request.args.get('session_id')
        formation_id = request.args.get('formation_id')
        
        if session_id:
            # Verify payment with Stripe webhook would normally handle this
            # For simplicity, we'll check the payment status
            payment_record = payment_processor.get_payment_status(session_id)
            if payment_record and payment_record['status'] == 'success':
                formation = db_manager.get_formation(formation_id)
                if formation:
                    formation.status = LLCStatus.PAYMENT_SUCCESS
                    db_manager.update_formation(formation)
                    
                    # Send payment confirmation email
                    email_service.send_payment_confirmation_email(payment_record['id'])
                    
                    flash('Payment successful! Processing your LLC formation...', 'success')
                    return redirect(url_for('processing'))
        
        flash('Payment verification failed. Please contact support.', 'error')
        return redirect(url_for('index'))
    
    @app.route('/payment-cancel')
    def payment_cancel():
        """Handle cancelled payment"""
        flash('Payment was cancelled. You can try again anytime.', 'info')
        return redirect(url_for('payment'))
    
    @app.route('/processing')
    def processing():
        """Show processing page while LLC is being formed"""
        if 'formation_id' not in session:
            return redirect(url_for('index'))
        
        formation = db_manager.get_formation(session['formation_id'])
        if not formation:
            return redirect(url_for('index'))
        
        # If payment is successful, start the filing process
        if formation.status == LLCStatus.PAYMENT_SUCCESS:
            # Simulate filing process (in production, this might be async)
            filing_result = llc_filing_service.simulate_filing(session['formation_id'])
            
            if filing_result['success']:
                # Generate documents
                pdf_files = pdf_generator.generate_formation_package(session['formation_id'])
                
                # Update formation to completed
                formation = db_manager.get_formation(session['formation_id'])
                if formation:
                    formation.status = LLCStatus.COMPLETED
                    formation.completed_date = datetime.utcnow()
                    db_manager.update_formation(formation)
                    
                    # Send completion email with documents
                    email_service.send_formation_complete_email(session['formation_id'])
                    
                    flash('Your LLC formation is complete! Check your email for documents.', 'success')
                    return redirect(url_for('complete'))
            else:
                flash(f'Error processing filing: {filing_result.get("error", "Unknown error")}', 'error')
                return redirect(url_for('index'))
        
        return render_template('processing.html', formation=formation)
    
    @app.route('/complete')
    def complete():
        """Show completion page"""
        if 'formation_id' not in session:
            return redirect(url_for('index'))
        
        formation = db_manager.get_formation(session['formation_id'])
        if not formation or formation.status != LLCStatus.COMPLETED:
            return redirect(url_for('index'))
        
        business_info = db_manager.get_business_info(formation.business_info_id) if formation else None
        
        return render_template('complete.html', 
                             formation=formation,
                             business_info=business_info)
    
    @app.route('/download/<doc_type>')
    def download_document(doc_type):
        """Download generated documents"""
        if 'formation_id' not in session:
            return redirect(url_for('index'))
        
        formation = db_manager.get_formation(session['formation_id'])
        if not formation:
            return "Formation not found", 404
        
        # Map document types to filenames
        doc_map = {
            'articles': 'articles_of_organization',
            'operating': 'operating_agreement',
            'business-model': 'business_model',
            'loan-proposal': 'loan_proposal',
            'payment-receipt': 'payment_receipt'
        }
        
        if doc_type not in doc_map:
            return "Invalid document type", 400
        
        # In a real app, we'd serve the actual PDF file
        # For now, we'll regenerate or provide a placeholder
        return f"Document {doc_type} for {formation.business_name} would be downloaded here.", 200
    
    @app.route('/api/pricing/<state_code>')
    def get_pricing(state_code):
        """API endpoint to get state-specific pricing"""
        try:
            requirements = llc_filing_service.get_state_requirements(state_code.upper())
            if not requirements:
                return jsonify({'error': 'State not supported'}), 400
            
            cost_breakdown = llc_filing_service.calculate_total_cost(
                state_code.upper(),
                expedited=False,  # Default to standard processing
                include_registered_agent=True
            )
            
            return jsonify(cost_breakdown)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/states')
    def get_states():
        """API endpoint to get all available states"""
        try:
            states = llc_filing_service.get_all_states()
            state_list = []
            for code, req in states.items():
                state_list.append({
                    'code': code,
                    'name': req.state_name,
                    'filing_fee': req.filing_fee,
                    'processing_time': req.processing_time_standard,
                    'notes': req.notes
                })
            return jsonify(state_list)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.errorhandler(404)
    def not_found(error):
        return render_template('404.html'), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return render_template('500.html'), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)