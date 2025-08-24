-- Migration: 012_create_scholarship_table
-- Create scholarship tables for educational assistance and scholarship management

-- Main scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scholarship_type VARCHAR(50) NOT NULL CHECK (scholarship_type IN ('academic', 'need_based', 'merit', 'sports', 'arts', 'vocational', 'research', 'community_service', 'minority', 'other')),
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('primary', 'secondary', 'high_school', 'undergraduate', 'graduate', 'postgraduate', 'phd', 'vocational', 'continuing_education')),
    field_of_study VARCHAR(100),
    target_group VARCHAR(100), -- women, minorities, refugees, disabled, etc.
    eligibility_criteria TEXT NOT NULL,
    required_documents TEXT[],
    application_requirements TEXT,
    selection_criteria TEXT,
    award_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    award_type VARCHAR(50) DEFAULT 'full_tuition' CHECK (award_type IN ('full_tuition', 'partial_tuition', 'living_expenses', 'books_supplies', 'comprehensive', 'stipend', 'other')),
    payment_schedule VARCHAR(50) DEFAULT 'semester' CHECK (payment_schedule IN ('lump_sum', 'semester', 'monthly', 'quarterly', 'annual')),
    duration_years DECIMAL(3,1) DEFAULT 1.0,
    renewable BOOLEAN DEFAULT false,
    renewal_criteria TEXT,
    max_renewals INTEGER DEFAULT 0,
    total_budget DECIMAL(15,2) NOT NULL,
    allocated_budget DECIMAL(15,2) DEFAULT 0.00,
    remaining_budget DECIMAL(15,2) GENERATED ALWAYS AS (total_budget - allocated_budget) STORED,
    max_recipients INTEGER DEFAULT 1,
    current_recipients INTEGER DEFAULT 0,
    available_slots INTEGER GENERATED ALWAYS AS (max_recipients - current_recipients) STORED,
    application_start_date DATE NOT NULL,
    application_deadline DATE NOT NULL,
    selection_date DATE,
    award_announcement_date DATE,
    academic_year VARCHAR(20) NOT NULL, -- e.g., "2024-2025"
    semester VARCHAR(20), -- Fall, Spring, Summer, etc.
    minimum_gpa DECIMAL(3,2),
    minimum_age INTEGER,
    maximum_age INTEGER,
    citizenship_requirements TEXT,
    residency_requirements TEXT,
    income_threshold DECIMAL(12,2),
    family_size_consideration BOOLEAN DEFAULT false,
    priority_regions TEXT[],
    partner_institutions TEXT[],
    funding_source VARCHAR(255),
    donor_information JSONB DEFAULT '{}'::jsonb,
    application_fee DECIMAL(8,2) DEFAULT 0.00,
    interview_required BOOLEAN DEFAULT false,
    essay_required BOOLEAN DEFAULT false,
    recommendation_letters_required INTEGER DEFAULT 0,
    portfolio_required BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'under_review', 'awarded', 'completed', 'cancelled', 'suspended')),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'restricted')),
    application_method VARCHAR(50) DEFAULT 'online' CHECK (application_method IN ('online', 'paper', 'email', 'in_person')),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website_url TEXT,
    brochure_url TEXT,
    image_url TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    success_stories JSONB DEFAULT '[]'::jsonb,
    statistics JSONB DEFAULT '{}'::jsonb,
    tags TEXT[],
    notes TEXT,
    created_by UUID REFERENCES users(id),
    managed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_scholarship_dates CHECK (
        application_deadline > application_start_date AND
        (selection_date IS NULL OR selection_date >= application_deadline) AND
        (award_announcement_date IS NULL OR award_announcement_date >= application_deadline)
    ),
    CONSTRAINT valid_age_range CHECK (maximum_age IS NULL OR minimum_age IS NULL OR maximum_age >= minimum_age),
    CONSTRAINT valid_budget CHECK (total_budget > 0 AND allocated_budget >= 0),
    CONSTRAINT valid_recipients CHECK (max_recipients > 0 AND current_recipients >= 0)
);

-- Scholarship applications table
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_code VARCHAR(50) UNIQUE NOT NULL,
    scholarship_id UUID REFERENCES scholarships(id),
    applicant_id UUID REFERENCES beneficiaries(id),
    application_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'interview_scheduled', 'interviewed', 'approved', 'rejected', 'waitlisted', 'withdrawn', 'expired')),
    submission_date TIMESTAMP WITH TIME ZONE,
    review_date DATE,
    interview_date DATE,
    decision_date DATE,
    notification_date DATE,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    citizenship_status VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    address TEXT,
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    
    -- Academic Information
    current_education_level VARCHAR(50) NOT NULL,
    current_institution VARCHAR(255),
    current_program VARCHAR(255),
    current_gpa DECIMAL(3,2),
    graduation_date DATE,
    intended_field_of_study VARCHAR(255),
    intended_institution VARCHAR(255),
    intended_start_date DATE,
    previous_education JSONB DEFAULT '[]'::jsonb,
    academic_achievements JSONB DEFAULT '[]'::jsonb,
    standardized_test_scores JSONB DEFAULT '{}'::jsonb,
    
    -- Financial Information
    family_income DECIMAL(12,2),
    family_size INTEGER,
    employment_status VARCHAR(50),
    current_employer VARCHAR(255),
    other_scholarships JSONB DEFAULT '[]'::jsonb,
    financial_aid_received JSONB DEFAULT '[]'::jsonb,
    estimated_education_cost DECIMAL(12,2),
    
    -- Application Materials
    personal_statement TEXT,
    essay_responses JSONB DEFAULT '{}'::jsonb,
    career_goals TEXT,
    community_involvement TEXT,
    work_experience JSONB DEFAULT '[]'::jsonb,
    volunteer_experience JSONB DEFAULT '[]'::jsonb,
    extracurricular_activities JSONB DEFAULT '[]'::jsonb,
    awards_honors JSONB DEFAULT '[]'::jsonb,
    skills_talents TEXT,
    languages_spoken TEXT[],
    
    -- Documents and References
    documents_submitted JSONB DEFAULT '[]'::jsonb,
    transcripts_submitted BOOLEAN DEFAULT false,
    recommendation_letters JSONB DEFAULT '[]'::jsonb,
    portfolio_submitted BOOLEAN DEFAULT false,
    
    -- Review and Scoring
    reviewer_notes TEXT,
    interview_notes TEXT,
    academic_score DECIMAL(5,2),
    financial_need_score DECIMAL(5,2),
    personal_statement_score DECIMAL(5,2),
    interview_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    ranking INTEGER,
    
    -- Decision Information
    decision VARCHAR(20) CHECK (decision IN ('approved', 'rejected', 'waitlisted')),
    award_amount DECIMAL(12,2),
    award_duration_years DECIMAL(3,1),
    conditions_of_award TEXT,
    rejection_reason TEXT,
    feedback_provided TEXT,
    
    -- Follow-up
    acceptance_deadline DATE,
    accepted_award BOOLEAN,
    acceptance_date DATE,
    decline_reason TEXT,
    
    assigned_reviewer UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_application_dates CHECK (
        (submission_date IS NULL OR submission_date >= created_at) AND
        (review_date IS NULL OR review_date >= application_date) AND
        (decision_date IS NULL OR decision_date >= application_date) AND
        (acceptance_deadline IS NULL OR acceptance_deadline >= decision_date)
    )
);

-- Scholarship recipients table (awarded scholarships)
CREATE TABLE IF NOT EXISTS scholarship_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id UUID REFERENCES scholarships(id),
    application_id UUID REFERENCES scholarship_applications(id),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    recipient_code VARCHAR(50) UNIQUE NOT NULL,
    award_date DATE NOT NULL,
    award_amount DECIMAL(12,2) NOT NULL,
    award_duration_years DECIMAL(3,1) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    
    -- Status and Progress
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed', 'terminated', 'transferred')),
    enrollment_status VARCHAR(20) DEFAULT 'enrolled' CHECK (enrollment_status IN ('enrolled', 'deferred', 'graduated', 'dropped_out', 'transferred')),
    current_gpa DECIMAL(3,2),
    credits_completed INTEGER DEFAULT 0,
    credits_required INTEGER,
    progress_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN credits_required = 0 THEN 0
            ELSE (credits_completed::DECIMAL / credits_required) * 100
        END
    ) STORED,
    
    -- Financial Tracking
    total_amount_disbursed DECIMAL(12,2) DEFAULT 0.00,
    remaining_amount DECIMAL(12,2) GENERATED ALWAYS AS (award_amount - total_amount_disbursed) STORED,
    payment_schedule VARCHAR(50) DEFAULT 'semester',
    next_payment_date DATE,
    next_payment_amount DECIMAL(10,2),
    
    -- Renewal Information
    renewable BOOLEAN DEFAULT false,
    renewal_count INTEGER DEFAULT 0,
    max_renewals INTEGER DEFAULT 0,
    next_renewal_date DATE,
    renewal_gpa_requirement DECIMAL(3,2),
    
    -- Compliance and Reporting
    conditions_met BOOLEAN DEFAULT true,
    compliance_notes TEXT,
    last_progress_report_date DATE,
    next_progress_report_due DATE,
    graduation_expected_date DATE,
    
    -- Contact and Updates
    current_address TEXT,
    current_phone VARCHAR(20),
    current_email VARCHAR(255),
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    
    -- Outcomes
    graduation_date DATE,
    final_gpa DECIMAL(3,2),
    degree_obtained VARCHAR(255),
    employment_after_graduation TEXT,
    further_education TEXT,
    
    notes TEXT,
    case_manager UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_recipient_dates CHECK (end_date > start_date),
    CONSTRAINT valid_renewal_count CHECK (renewal_count <= max_renewals)
);

-- Scholarship payments table
CREATE TABLE IF NOT EXISTS scholarship_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES scholarship_recipients(id) ON DELETE CASCADE,
    payment_code VARCHAR(50) UNIQUE NOT NULL,
    payment_type VARCHAR(50) DEFAULT 'regular' CHECK (payment_type IN ('regular', 'bonus', 'emergency', 'final', 'refund')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_date DATE NOT NULL,
    academic_period VARCHAR(50), -- Fall 2024, Spring 2025, etc.
    payment_method VARCHAR(50) DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'check', 'cash', 'digital_wallet', 'other')),
    reference_number VARCHAR(100),
    bank_details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    processed_date DATE,
    processed_by UUID REFERENCES users(id),
    failure_reason TEXT,
    receipt_url TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarship progress reports table
CREATE TABLE IF NOT EXISTS scholarship_progress_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES scholarship_recipients(id) ON DELETE CASCADE,
    report_code VARCHAR(50) UNIQUE NOT NULL,
    report_period VARCHAR(50) NOT NULL, -- Fall 2024, Spring 2025, etc.
    submission_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'under_review', 'approved', 'requires_revision', 'overdue')),
    
    -- Academic Progress
    current_gpa DECIMAL(3,2),
    credits_completed_this_period INTEGER DEFAULT 0,
    total_credits_completed INTEGER DEFAULT 0,
    courses_taken JSONB DEFAULT '[]'::jsonb,
    grades_received JSONB DEFAULT '{}'::jsonb,
    academic_standing VARCHAR(50),
    
    -- Personal Development
    extracurricular_activities TEXT,
    volunteer_work TEXT,
    internships_jobs TEXT,
    research_projects TEXT,
    achievements_awards TEXT,
    
    -- Challenges and Support
    challenges_faced TEXT,
    support_received TEXT,
    additional_support_needed TEXT,
    
    -- Future Plans
    next_semester_plans TEXT,
    career_development_activities TEXT,
    graduation_timeline TEXT,
    
    -- Financial Information
    tuition_fees_paid DECIMAL(10,2),
    other_expenses DECIMAL(10,2),
    additional_funding_sources JSONB DEFAULT '[]'::jsonb,
    
    -- Attachments and Evidence
    transcript_attached BOOLEAN DEFAULT false,
    supporting_documents JSONB DEFAULT '[]'::jsonb,
    
    -- Review and Feedback
    reviewer_comments TEXT,
    recommendations TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    next_review_date DATE,
    
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scholarships_scholarship_code ON scholarships(scholarship_code);
CREATE INDEX IF NOT EXISTS idx_scholarships_scholarship_type ON scholarships(scholarship_type);
CREATE INDEX IF NOT EXISTS idx_scholarships_education_level ON scholarships(education_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_application_dates ON scholarships(application_start_date, application_deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_academic_year ON scholarships(academic_year);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_by ON scholarships(created_by);
CREATE INDEX IF NOT EXISTS idx_scholarships_managed_by ON scholarships(managed_by);
CREATE INDEX IF NOT EXISTS idx_scholarships_tags ON scholarships USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_scholarship_applications_application_code ON scholarship_applications(application_code);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_scholarship_id ON scholarship_applications(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_applicant_id ON scholarship_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_status ON scholarship_applications(status);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_application_date ON scholarship_applications(application_date);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_submission_date ON scholarship_applications(submission_date);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_assigned_reviewer ON scholarship_applications(assigned_reviewer);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_email ON scholarship_applications(email);

CREATE INDEX IF NOT EXISTS idx_scholarship_recipients_recipient_code ON scholarship_recipients(recipient_code);
CREATE INDEX IF NOT EXISTS idx_scholarship_recipients_scholarship_id ON scholarship_recipients(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_recipients_beneficiary_id ON scholarship_recipients(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_recipients_status ON scholarship_recipients(status);
CREATE INDEX IF NOT EXISTS idx_scholarship_recipients_academic_year ON scholarship_recipients(academic_year);
CREATE INDEX IF NOT EXISTS idx_scholarship_recipients_case_manager ON scholarship_recipients(case_manager);
CREATE INDEX IF NOT EXISTS idx_scholarship_recipients_dates ON scholarship_recipients(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_scholarship_payments_recipient_id ON scholarship_payments(recipient_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_payments_payment_code ON scholarship_payments(payment_code);
CREATE INDEX IF NOT EXISTS idx_scholarship_payments_status ON scholarship_payments(status);
CREATE INDEX IF NOT EXISTS idx_scholarship_payments_payment_date ON scholarship_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_scholarship_payments_processed_by ON scholarship_payments(processed_by);

CREATE INDEX IF NOT EXISTS idx_scholarship_progress_reports_recipient_id ON scholarship_progress_reports(recipient_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_progress_reports_report_code ON scholarship_progress_reports(report_code);
CREATE INDEX IF NOT EXISTS idx_scholarship_progress_reports_status ON scholarship_progress_reports(status);
CREATE INDEX IF NOT EXISTS idx_scholarship_progress_reports_due_date ON scholarship_progress_reports(due_date);
CREATE INDEX IF NOT EXISTS idx_scholarship_progress_reports_reviewed_by ON scholarship_progress_reports(reviewed_by);

-- Create triggers for updated_at
CREATE TRIGGER update_scholarships_updated_at
    BEFORE UPDATE ON scholarships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarship_applications_updated_at
    BEFORE UPDATE ON scholarship_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarship_recipients_updated_at
    BEFORE UPDATE ON scholarship_recipients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarship_payments_updated_at
    BEFORE UPDATE ON scholarship_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarship_progress_reports_updated_at
    BEFORE UPDATE ON scholarship_progress_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate scholarship codes
CREATE OR REPLACE FUNCTION generate_scholarship_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code VARCHAR(50);
    counter INTEGER := 1;
    prefix VARCHAR(10);
BEGIN
    IF NEW.scholarship_code IS NULL THEN
        -- Set prefix based on scholarship type
        CASE NEW.scholarship_type
            WHEN 'academic' THEN prefix := 'ACAD';
            WHEN 'need_based' THEN prefix := 'NEED';
            WHEN 'merit' THEN prefix := 'MERT';
            WHEN 'sports' THEN prefix := 'SPRT';
            WHEN 'arts' THEN prefix := 'ARTS';
            WHEN 'vocational' THEN prefix := 'VOC';
            WHEN 'research' THEN prefix := 'RSCH';
            ELSE prefix := 'SCHOL';
        END CASE;
        
        LOOP
            new_code := prefix || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || LPAD(counter::TEXT, 4, '0');
            
            IF NOT EXISTS (SELECT 1 FROM scholarships WHERE scholarship_code = new_code) THEN
                NEW.scholarship_code := new_code;
                EXIT;
            END IF;
            
            counter := counter + 1;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_scholarship_code_trigger
    BEFORE INSERT ON scholarships
    FOR EACH ROW
    EXECUTE FUNCTION generate_scholarship_code();

-- Create function to update scholarship statistics
CREATE OR REPLACE FUNCTION update_scholarship_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update scholarship current recipients and allocated budget
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE scholarships 
        SET 
            current_recipients = (
                SELECT COUNT(*)
                FROM scholarship_recipients
                WHERE scholarship_id = NEW.scholarship_id AND status = 'active'
            ),
            allocated_budget = (
                SELECT COALESCE(SUM(award_amount), 0)
                FROM scholarship_recipients
                WHERE scholarship_id = NEW.scholarship_id AND status IN ('active', 'completed')
            )
        WHERE id = NEW.scholarship_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE scholarships 
        SET 
            current_recipients = (
                SELECT COUNT(*)
                FROM scholarship_recipients
                WHERE scholarship_id = OLD.scholarship_id AND status = 'active'
            ),
            allocated_budget = (
                SELECT COALESCE(SUM(award_amount), 0)
                FROM scholarship_recipients
                WHERE scholarship_id = OLD.scholarship_id AND status IN ('active', 'completed')
            )
        WHERE id = OLD.scholarship_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scholarship_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON scholarship_recipients
    FOR EACH ROW
    EXECUTE FUNCTION update_scholarship_stats();

-- Create function to update recipient payment totals
CREATE OR REPLACE FUNCTION update_recipient_payment_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update recipient total amount disbursed
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE scholarship_recipients 
        SET total_amount_disbursed = (
            SELECT COALESCE(SUM(amount), 0)
            FROM scholarship_payments
            WHERE recipient_id = NEW.recipient_id AND status = 'completed'
        )
        WHERE id = NEW.recipient_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE scholarship_recipients 
        SET total_amount_disbursed = (
            SELECT COALESCE(SUM(amount), 0)
            FROM scholarship_payments
            WHERE recipient_id = OLD.recipient_id AND status = 'completed'
        )
        WHERE id = OLD.recipient_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipient_payment_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON scholarship_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_recipient_payment_totals();

-- Enable RLS
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_progress_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public scholarships are viewable by all" ON scholarships
    FOR SELECT USING (visibility = 'public' AND status = 'open');

CREATE POLICY "Users can view scholarships they manage" ON scholarships
    FOR SELECT USING (
        created_by = auth.uid() OR 
        managed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Authorized users can manage scholarships" ON scholarships
    FOR ALL USING (
        created_by = auth.uid() OR 
        managed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view their own applications" ON scholarship_applications
    FOR SELECT USING (
        created_by = auth.uid() OR 
        assigned_reviewer = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create scholarship applications" ON scholarship_applications
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON scholarships TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON scholarship_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON scholarship_recipients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON scholarship_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON scholarship_progress_reports TO authenticated;
GRANT SELECT ON scholarships TO anon;
GRANT SELECT ON scholarship_applications TO anon;
GRANT SELECT ON scholarship_recipients TO anon;
GRANT SELECT ON scholarship_payments TO anon;
GRANT SELECT ON scholarship_progress_reports TO anon;