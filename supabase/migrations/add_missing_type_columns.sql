-- Add missing 'type' columns to tables that don't have them

-- Add type column to donations table
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'monetary' 
CHECK (type IN ('monetary', 'in_kind', 'service', 'other'));

-- Add type column to financial_accounts table
ALTER TABLE financial_accounts 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'checking' 
CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment', 'loan', 'other'));

-- Add type column to financial_transactions table
ALTER TABLE financial_transactions 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'income' 
CHECK (type IN ('income', 'expense', 'transfer', 'adjustment'));

-- Add type column to budget_categories table
ALTER TABLE budget_categories 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'expense' 
CHECK (type IN ('income', 'expense'));

-- Add type column to budget_periods table
ALTER TABLE budget_periods 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'annual' 
CHECK (type IN ('weekly', 'monthly', 'quarterly', 'annual'));

-- Add type column to budget_allocations table
ALTER TABLE budget_allocations 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'planned' 
CHECK (type IN ('planned', 'actual', 'revised'));

-- Add type column to fund_campaigns table
ALTER TABLE fund_campaigns 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'standard' 
CHECK (type IN ('standard', 'matching', 'challenge', 'peer_to_peer', 'event'));

-- Add type column to fund_donations table
ALTER TABLE fund_donations 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'regular' 
CHECK (type IN ('regular', 'matching', 'challenge', 'bonus'));

-- Add type column to fund_expenses table
ALTER TABLE fund_expenses 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'operational' 
CHECK (type IN ('operational', 'program', 'administrative', 'fundraising'));

-- Add type column to fund_beneficiaries table
ALTER TABLE fund_beneficiaries 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'direct' 
CHECK (type IN ('direct', 'indirect', 'group', 'community'));

-- Add type column to fund_milestones table
ALTER TABLE fund_milestones 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'funding' 
CHECK (type IN ('funding', 'impact', 'timeline', 'engagement'));

-- Add type column to aid_distribution_items table
ALTER TABLE aid_distribution_items 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'regular' 
CHECK (type IN ('regular', 'emergency', 'special', 'supplementary'));

-- Add type column to aid_program_beneficiaries table
ALTER TABLE aid_program_beneficiaries 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'individual' 
CHECK (type IN ('individual', 'family', 'group', 'community'));

-- Add type column to scholarship_payments table
ALTER TABLE scholarship_payments 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'regular' 
CHECK (type IN ('regular', 'bonus', 'emergency', 'final', 'refund'));

-- Add type column to scholarship_progress_reports table
ALTER TABLE scholarship_progress_reports 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'semester' 
CHECK (type IN ('semester', 'quarterly', 'annual', 'final', 'special'));

-- Update existing records to have appropriate type values
UPDATE donations SET type = 'monetary' WHERE type IS NULL;
UPDATE financial_accounts SET type = account_type WHERE type IS NULL;
UPDATE financial_transactions SET type = transaction_type WHERE type IS NULL;
UPDATE budget_categories SET type = category_type WHERE type IS NULL;
UPDATE budget_periods SET type = period_type WHERE type IS NULL;
UPDATE budget_allocations SET type = 'planned' WHERE type IS NULL;
UPDATE fund_campaigns SET type = campaign_type WHERE type IS NULL;
UPDATE fund_donations SET type = 'regular' WHERE type IS NULL;
UPDATE fund_expenses SET type = 'operational' WHERE type IS NULL;
UPDATE fund_beneficiaries SET type = 'direct' WHERE type IS NULL;
UPDATE fund_milestones SET type = 'funding' WHERE type IS NULL;
UPDATE aid_distribution_items SET type = 'regular' WHERE type IS NULL;
UPDATE aid_program_beneficiaries SET type = 'individual' WHERE type IS NULL;
UPDATE scholarship_payments SET type = payment_type WHERE type IS NULL;
UPDATE scholarship_progress_reports SET type = 'semester' WHERE type IS NULL;

-- Add comments to explain the type columns
COMMENT ON COLUMN donations.type IS 'Type of donation: monetary, in_kind, service, other';
COMMENT ON COLUMN financial_accounts.type IS 'Type of financial account';
COMMENT ON COLUMN financial_transactions.type IS 'Type of financial transaction';
COMMENT ON COLUMN budget_categories.type IS 'Type of budget category: income or expense';
COMMENT ON COLUMN budget_periods.type IS 'Type of budget period: weekly, monthly, quarterly, annual';
COMMENT ON COLUMN budget_allocations.type IS 'Type of budget allocation: planned, actual, revised';
COMMENT ON COLUMN fund_campaigns.type IS 'Type of fundraising campaign';
COMMENT ON COLUMN fund_donations.type IS 'Type of fund donation';
COMMENT ON COLUMN fund_expenses.type IS 'Type of fund expense';
COMMENT ON COLUMN fund_beneficiaries.type IS 'Type of fund beneficiary relationship';
COMMENT ON COLUMN fund_milestones.type IS 'Type of fund milestone';
COMMENT ON COLUMN aid_distribution_items.type IS 'Type of aid distribution item';
COMMENT ON COLUMN aid_program_beneficiaries.type IS 'Type of aid program beneficiary';
COMMENT ON COLUMN scholarship_payments.type IS 'Type of scholarship payment';
COMMENT ON COLUMN scholarship_progress_reports.type IS 'Type of progress report';