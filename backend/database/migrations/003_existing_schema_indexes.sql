-- Migration: 003_existing_schema_indexes
-- Description: Add indexes for existing schema tables
-- Created: 2025-01-22

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Donations table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_donations_donor_name ON donations(donor_name);
CREATE INDEX IF NOT EXISTS idx_donations_type ON donations(type);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_donation_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_donations_amount ON donations(amount);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- Beneficiaries table indexes
CREATE INDEX IF NOT EXISTS idx_beneficiaries_category ON beneficiaries(category);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_region ON beneficiaries(region);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_urgency ON beneficiaries(urgency);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_created_by ON beneficiaries(created_by);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_first_name ON beneficiaries(first_name);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_last_name ON beneficiaries(last_name);

-- Aid records table indexes (table does not exist in current schema)
-- CREATE INDEX IF NOT EXISTS idx_aid_records_beneficiary_id ON aid_records(beneficiary_id);
-- CREATE INDEX IF NOT EXISTS idx_aid_records_aid_type ON aid_records(aid_type);
-- CREATE INDEX IF NOT EXISTS idx_aid_records_aid_date ON aid_records(aid_date);
-- CREATE INDEX IF NOT EXISTS idx_aid_records_created_by ON aid_records(created_by);

-- Hospital referrals table indexes (table does not exist in current schema)
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_referral_number ON hospital_referrals(referral_number);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_patient_name ON hospital_referrals(patient_name);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_status ON hospital_referrals(status);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_urgency ON hospital_referrals(urgency);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_hospital_name ON hospital_referrals(hospital_name);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_appointment_date ON hospital_referrals(appointment_date);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_referral_date ON hospital_referrals(referral_date);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_payment_status ON hospital_referrals(payment_status);
-- CREATE INDEX IF NOT EXISTS idx_hospital_referrals_created_by ON hospital_referrals(created_by);

-- Volunteers table indexes
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);

-- Volunteer hours table does not exist in current schema
-- Skipping volunteer_hours indexes

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);

-- Project volunteers table indexes
CREATE INDEX IF NOT EXISTS idx_project_volunteers_project_id ON project_volunteers(project_id);
CREATE INDEX IF NOT EXISTS idx_project_volunteers_volunteer_id ON project_volunteers(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_project_volunteers_assigned_date ON project_volunteers(assigned_date);

-- Expenses table indexes
CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount);
CREATE INDEX IF NOT EXISTS idx_expenses_created_by ON expenses(created_by);

-- Reports table indexes
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);

-- Audit logs table indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- User sessions table does not exist in current schema
-- Skipping user_sessions indexes

-- Function to automatically update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_beneficiaries_updated_at ON beneficiaries;
CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DROP TRIGGER IF EXISTS update_hospital_referrals_updated_at ON hospital_referrals;
-- CREATE TRIGGER update_hospital_referrals_updated_at BEFORE UPDATE ON hospital_referrals
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_volunteers_updated_at ON volunteers;
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert migration record
INSERT INTO schema_migrations (version) VALUES ('003_existing_schema_indexes') ON CONFLICT DO NOTHING;