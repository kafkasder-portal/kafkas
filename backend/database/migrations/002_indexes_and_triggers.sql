-- Migration: 002_indexes_and_triggers
-- Description: Add indexes and triggers for performance and automation
-- Created: 2025-01-22

-- Indexes for better query performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Donations table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_donations_donor_name_new ON donations(donor_name);
CREATE INDEX IF NOT EXISTS idx_donations_type_new ON donations(type);
CREATE INDEX IF NOT EXISTS idx_donations_status_new ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_date_new ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_donations_amount_new ON donations(amount);
CREATE INDEX IF NOT EXISTS idx_donations_created_at_new ON donations(created_at);

-- Beneficiaries table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_beneficiaries_first_name_new ON beneficiaries(first_name);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_last_name_new ON beneficiaries(last_name);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_category_new ON beneficiaries(category);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_region_new ON beneficiaries(region);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status_new ON beneficiaries(status);
-- is_active column does not exist in beneficiaries table, using status instead
CREATE INDEX IF NOT EXISTS idx_beneficiaries_created_at_new ON beneficiaries(created_at);

-- Aid records table does not exist in current schema
-- Skipping aid_records indexes

-- Hospital referrals table does not exist in current schema  
-- Skipping hospital_referrals indexes

-- Volunteers table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id_new ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_email_new ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status_new ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at_new ON volunteers(created_at);

-- Projects table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_projects_name_new ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_status_new ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_start_date_new ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date_new ON projects(end_date);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id_new ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by_new ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_created_at_new ON projects(created_at);

-- Project volunteers table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_project_volunteers_project_id_new ON project_volunteers(project_id);
CREATE INDEX IF NOT EXISTS idx_project_volunteers_volunteer_id_new ON project_volunteers(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_project_volunteers_role_new ON project_volunteers(role);
CREATE INDEX IF NOT EXISTS idx_project_volunteers_assigned_date_new ON project_volunteers(assigned_date);
CREATE INDEX IF NOT EXISTS idx_project_volunteers_created_at_new ON project_volunteers(created_at);

-- Expenses table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_expenses_project_id_new ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_new ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_amount_new ON expenses(amount);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date_new ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_status_new ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_created_by_new ON expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at_new ON expenses(created_at);

-- Reports table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_reports_title_new ON reports(title);
CREATE INDEX IF NOT EXISTS idx_reports_type_new ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_status_new ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at_new ON reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_reports_created_by_new ON reports(created_by);

-- Audit logs table indexes (based on existing schema)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_new ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_new ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name_new ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id_new ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_new ON audit_logs(created_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at timestamps
-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_beneficiaries_updated_at ON beneficiaries;
CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Skip hospital_referrals trigger as table doesn't exist
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

-- User sessions table does not exist in current schema
-- Skipping user_sessions indexes

-- Insert migration record
INSERT INTO schema_migrations (version) VALUES ('002_indexes_and_triggers') ON CONFLICT DO NOTHING;