-- Migration: 009_create_finance_table
-- Create finance tables for financial management

-- Financial accounts table (must be created first)
CREATE TABLE IF NOT EXISTS financial_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit_card', 'cash', 'investment', 'loan', 'other')),
    bank_name VARCHAR(255),
    branch VARCHAR(255),
    currency VARCHAR(3) DEFAULT 'USD',
    opening_balance DECIMAL(15,2) DEFAULT 0.00,
    current_balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    credit_limit DECIMAL(15,2),
    interest_rate DECIMAL(5,4),
    account_holder VARCHAR(255),
    contact_info JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main financial transactions table
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer', 'adjustment')),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
    amount_local DECIMAL(15,2) GENERATED ALWAYS AS (amount * exchange_rate) STORED,
    description TEXT NOT NULL,
    reference_number VARCHAR(100),
    payment_method VARCHAR(50), -- cash, bank_transfer, credit_card, check, etc.
    account_id UUID REFERENCES financial_accounts(id),
    counterparty VARCHAR(255), -- Who we received from or paid to
    project_id UUID, -- Link to specific projects if applicable
    beneficiary_id UUID REFERENCES beneficiaries(id),
    transaction_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed', 'reconciled')),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB,
    tags TEXT[],
    attachments JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget categories table
CREATE TABLE IF NOT EXISTS budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_type VARCHAR(20) NOT NULL CHECK (category_type IN ('income', 'expense')),
    parent_category_id UUID REFERENCES budget_categories(id),
    budget_amount DECIMAL(15,2) DEFAULT 0.00,
    period_type VARCHAR(20) DEFAULT 'monthly' CHECK (period_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget periods table
CREATE TABLE IF NOT EXISTS budget_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
    total_budgeted_income DECIMAL(15,2) DEFAULT 0.00,
    total_budgeted_expenses DECIMAL(15,2) DEFAULT 0.00,
    total_actual_income DECIMAL(15,2) DEFAULT 0.00,
    total_actual_expenses DECIMAL(15,2) DEFAULT 0.00,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_budget_period CHECK (end_date > start_date)
);

-- Budget allocations table
CREATE TABLE IF NOT EXISTS budget_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_period_id UUID REFERENCES budget_periods(id) ON DELETE CASCADE,
    category_id UUID REFERENCES budget_categories(id),
    allocated_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    spent_amount DECIMAL(15,2) DEFAULT 0.00,
    remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (allocated_amount - spent_amount) STORED,
    variance_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN allocated_amount = 0 THEN 0
            ELSE ((spent_amount - allocated_amount) / allocated_amount) * 100
        END
    ) STORED,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(budget_period_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_transaction_number ON financial_transactions(transaction_number);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_account_id ON financial_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_beneficiary_id ON financial_transactions(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_status ON financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_amount ON financial_transactions(amount);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_by ON financial_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_tags ON financial_transactions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_at ON financial_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_financial_accounts_account_number ON financial_accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_account_type ON financial_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_is_active ON financial_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_is_primary ON financial_accounts(is_primary);

CREATE INDEX IF NOT EXISTS idx_budget_categories_name ON budget_categories(name);
CREATE INDEX IF NOT EXISTS idx_budget_categories_type ON budget_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_budget_categories_parent ON budget_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_active ON budget_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_budget_periods_dates ON budget_periods(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_budget_periods_status ON budget_periods(status);
CREATE INDEX IF NOT EXISTS idx_budget_periods_type ON budget_periods(period_type);

CREATE INDEX IF NOT EXISTS idx_budget_allocations_period ON budget_allocations(budget_period_id);
CREATE INDEX IF NOT EXISTS idx_budget_allocations_category ON budget_allocations(category_id);

-- Create trigger for updated_at
CREATE TRIGGER update_financial_transactions_updated_at
    BEFORE UPDATE ON financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_accounts_updated_at
    BEFORE UPDATE ON financial_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_categories_updated_at
    BEFORE UPDATE ON budget_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_periods_updated_at
    BEFORE UPDATE ON budget_periods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_allocations_updated_at
    BEFORE UPDATE ON budget_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate transaction numbers
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TRIGGER AS $$
DECLARE
    new_number VARCHAR(50);
    counter INTEGER := 1;
    prefix VARCHAR(10);
BEGIN
    IF NEW.transaction_number IS NULL THEN
        -- Set prefix based on transaction type
        CASE NEW.transaction_type
            WHEN 'income' THEN prefix := 'INC';
            WHEN 'expense' THEN prefix := 'EXP';
            WHEN 'transfer' THEN prefix := 'TRF';
            WHEN 'adjustment' THEN prefix := 'ADJ';
            ELSE prefix := 'TXN';
        END CASE;
        
        LOOP
            new_number := prefix || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || 
                         TO_CHAR(EXTRACT(MONTH FROM NOW()), 'FM00') || 
                         LPAD(counter::TEXT, 4, '0');
            
            -- Check if this number already exists
            IF NOT EXISTS (SELECT 1 FROM financial_transactions WHERE transaction_number = new_number) THEN
                NEW.transaction_number := new_number;
                EXIT;
            END IF;
            
            counter := counter + 1;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_transaction_number_trigger
    BEFORE INSERT ON financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION generate_transaction_number();

-- Create function to update account balances
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update account balance when transaction is completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        IF NEW.transaction_type = 'income' THEN
            UPDATE financial_accounts 
            SET current_balance = current_balance + NEW.amount
            WHERE id = NEW.account_id;
        ELSIF NEW.transaction_type = 'expense' THEN
            UPDATE financial_accounts 
            SET current_balance = current_balance - NEW.amount
            WHERE id = NEW.account_id;
        END IF;
    END IF;
    
    -- Reverse balance update if transaction is cancelled
    IF NEW.status = 'cancelled' AND OLD.status = 'completed' THEN
        IF NEW.transaction_type = 'income' THEN
            UPDATE financial_accounts 
            SET current_balance = current_balance - NEW.amount
            WHERE id = NEW.account_id;
        ELSIF NEW.transaction_type = 'expense' THEN
            UPDATE financial_accounts 
            SET current_balance = current_balance + NEW.amount
            WHERE id = NEW.account_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_account_balance_trigger
    AFTER UPDATE ON financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance();

-- Enable RLS
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_allocations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins and managers can view all financial data" ON financial_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins and managers can manage financial transactions" ON financial_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view financial accounts" ON financial_accounts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Admins and managers can manage accounts" ON financial_accounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view budget categories" ON budget_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Admins and managers can manage budget categories" ON budget_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view budget periods" ON budget_periods
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Admins and managers can manage budget periods" ON budget_periods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view budget allocations" ON budget_allocations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Admins and managers can manage budget allocations" ON budget_allocations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON financial_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON financial_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON budget_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON budget_periods TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON budget_allocations TO authenticated;
GRANT SELECT ON financial_transactions TO anon;
GRANT SELECT ON financial_accounts TO anon;
GRANT SELECT ON budget_categories TO anon;
GRANT SELECT ON budget_periods TO anon;
GRANT SELECT ON budget_allocations TO anon;