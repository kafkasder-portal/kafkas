-- Migration: 010_create_fund_table
-- Create fund tables for fundraising and fund management

-- Main funds table
CREATE TABLE IF NOT EXISTS funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fund_type VARCHAR(50) NOT NULL CHECK (fund_type IN ('general', 'emergency', 'project', 'scholarship', 'medical', 'education', 'infrastructure', 'other')),
    category VARCHAR(100),
    target_amount DECIMAL(15,2) NOT NULL,
    raised_amount DECIMAL(15,2) DEFAULT 0.00,
    remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (target_amount - raised_amount) STORED,
    progress_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN target_amount = 0 THEN 0
            ELSE (raised_amount / target_amount) * 100
        END
    ) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled', 'expired')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'restricted')),
    image_url TEXT,
    banner_url TEXT,
    location VARCHAR(255),
    beneficiary_count INTEGER DEFAULT 0,
    donor_count INTEGER DEFAULT 0,
    minimum_donation DECIMAL(10,2) DEFAULT 1.00,
    maximum_donation DECIMAL(10,2),
    allow_anonymous BOOLEAN DEFAULT true,
    allow_recurring BOOLEAN DEFAULT true,
    tags TEXT[],
    social_links JSONB DEFAULT '{}'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    updates JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES users(id),
    managed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_fund_dates CHECK (end_date IS NULL OR end_date > start_date),
    CONSTRAINT valid_donation_limits CHECK (maximum_donation IS NULL OR maximum_donation >= minimum_donation)
);

-- Fund campaigns table for specific fundraising campaigns
CREATE TABLE IF NOT EXISTS fund_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID REFERENCES funds(id) ON DELETE CASCADE,
    campaign_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) DEFAULT 'standard' CHECK (campaign_type IN ('standard', 'matching', 'challenge', 'peer_to_peer', 'event')),
    target_amount DECIMAL(15,2) NOT NULL,
    raised_amount DECIMAL(15,2) DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    matching_fund_amount DECIMAL(15,2) DEFAULT 0.00,
    matching_ratio DECIMAL(5,2) DEFAULT 1.00, -- 1:1 matching by default
    challenge_amount DECIMAL(15,2),
    challenge_deadline TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_campaign_dates CHECK (end_date > start_date)
);

-- Fund donations table (extends the main donations table)
CREATE TABLE IF NOT EXISTS fund_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
    fund_id UUID REFERENCES funds(id),
    campaign_id UUID REFERENCES fund_campaigns(id),
    allocation_percentage DECIMAL(5,2) DEFAULT 100.00 CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
    allocated_amount DECIMAL(15,2) NOT NULL,
    is_matching_donation BOOLEAN DEFAULT false,
    matched_amount DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fund expenses table
CREATE TABLE IF NOT EXISTS fund_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID REFERENCES funds(id) ON DELETE CASCADE,
    expense_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    expense_date DATE NOT NULL,
    vendor VARCHAR(255),
    receipt_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    paid_by UUID REFERENCES users(id),
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fund beneficiaries table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS fund_beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID REFERENCES funds(id) ON DELETE CASCADE,
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    allocation_amount DECIMAL(15,2),
    allocation_percentage DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(fund_id, beneficiary_id)
);

-- Fund milestones table
CREATE TABLE IF NOT EXISTS fund_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID REFERENCES funds(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2) NOT NULL,
    target_date DATE,
    achieved_amount DECIMAL(15,2) DEFAULT 0.00,
    achieved_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'achieved', 'missed')),
    reward_description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_funds_fund_code ON funds(fund_code);
CREATE INDEX IF NOT EXISTS idx_funds_fund_type ON funds(fund_type);
CREATE INDEX IF NOT EXISTS idx_funds_status ON funds(status);
CREATE INDEX IF NOT EXISTS idx_funds_start_date ON funds(start_date);
CREATE INDEX IF NOT EXISTS idx_funds_end_date ON funds(end_date);
CREATE INDEX IF NOT EXISTS idx_funds_created_by ON funds(created_by);
CREATE INDEX IF NOT EXISTS idx_funds_managed_by ON funds(managed_by);
CREATE INDEX IF NOT EXISTS idx_funds_tags ON funds USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_funds_target_amount ON funds(target_amount);
CREATE INDEX IF NOT EXISTS idx_funds_raised_amount ON funds(raised_amount);

CREATE INDEX IF NOT EXISTS idx_fund_campaigns_fund_id ON fund_campaigns(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_campaigns_campaign_code ON fund_campaigns(campaign_code);
CREATE INDEX IF NOT EXISTS idx_fund_campaigns_status ON fund_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_fund_campaigns_dates ON fund_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_fund_donations_donation_id ON fund_donations(donation_id);
CREATE INDEX IF NOT EXISTS idx_fund_donations_fund_id ON fund_donations(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_donations_campaign_id ON fund_donations(campaign_id);

CREATE INDEX IF NOT EXISTS idx_fund_expenses_fund_id ON fund_expenses(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_expenses_expense_code ON fund_expenses(expense_code);
CREATE INDEX IF NOT EXISTS idx_fund_expenses_status ON fund_expenses(status);
CREATE INDEX IF NOT EXISTS idx_fund_expenses_expense_date ON fund_expenses(expense_date);

CREATE INDEX IF NOT EXISTS idx_fund_beneficiaries_fund_id ON fund_beneficiaries(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_beneficiaries_beneficiary_id ON fund_beneficiaries(beneficiary_id);

CREATE INDEX IF NOT EXISTS idx_fund_milestones_fund_id ON fund_milestones(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_milestones_status ON fund_milestones(status);
CREATE INDEX IF NOT EXISTS idx_fund_milestones_target_date ON fund_milestones(target_date);

-- Create trigger for updated_at
CREATE TRIGGER update_funds_updated_at
    BEFORE UPDATE ON funds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fund_campaigns_updated_at
    BEFORE UPDATE ON fund_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fund_expenses_updated_at
    BEFORE UPDATE ON fund_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fund_milestones_updated_at
    BEFORE UPDATE ON fund_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate fund codes
CREATE OR REPLACE FUNCTION generate_fund_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code VARCHAR(50);
    counter INTEGER := 1;
    prefix VARCHAR(10);
BEGIN
    IF NEW.fund_code IS NULL THEN
        -- Set prefix based on fund type
        CASE NEW.fund_type
            WHEN 'emergency' THEN prefix := 'EMG';
            WHEN 'project' THEN prefix := 'PRJ';
            WHEN 'scholarship' THEN prefix := 'SCH';
            WHEN 'medical' THEN prefix := 'MED';
            WHEN 'education' THEN prefix := 'EDU';
            WHEN 'infrastructure' THEN prefix := 'INF';
            ELSE prefix := 'FND';
        END CASE;
        
        LOOP
            new_code := prefix || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || LPAD(counter::TEXT, 4, '0');
            
            -- Check if this code already exists
            IF NOT EXISTS (SELECT 1 FROM funds WHERE fund_code = new_code) THEN
                NEW.fund_code := new_code;
                EXIT;
            END IF;
            
            counter := counter + 1;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_fund_code_trigger
    BEFORE INSERT ON funds
    FOR EACH ROW
    EXECUTE FUNCTION generate_fund_code();

-- Create function to update fund raised amounts
CREATE OR REPLACE FUNCTION update_fund_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Update fund raised amount when donation is added/updated/deleted
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE funds 
        SET raised_amount = (
            SELECT COALESCE(SUM(fd.allocated_amount), 0)
            FROM fund_donations fd
            JOIN donations d ON fd.donation_id = d.id
            WHERE fd.fund_id = NEW.fund_id AND d.status = 'completed'
        ),
        donor_count = (
            SELECT COUNT(DISTINCT d.donor_id)
            FROM fund_donations fd
            JOIN donations d ON fd.donation_id = d.id
            WHERE fd.fund_id = NEW.fund_id AND d.status = 'completed'
        )
        WHERE id = NEW.fund_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE funds 
        SET raised_amount = (
            SELECT COALESCE(SUM(fd.allocated_amount), 0)
            FROM fund_donations fd
            JOIN donations d ON fd.donation_id = d.id
            WHERE fd.fund_id = OLD.fund_id AND d.status = 'completed'
        ),
        donor_count = (
            SELECT COUNT(DISTINCT d.donor_id)
            FROM fund_donations fd
            JOIN donations d ON fd.donation_id = d.id
            WHERE fd.fund_id = OLD.fund_id AND d.status = 'completed'
        )
        WHERE id = OLD.fund_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fund_raised_amount_trigger
    AFTER INSERT OR UPDATE OR DELETE ON fund_donations
    FOR EACH ROW
    EXECUTE FUNCTION update_fund_raised_amount();

-- Create function to update milestone status
CREATE OR REPLACE FUNCTION update_milestone_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update milestone status based on fund progress
    UPDATE fund_milestones 
    SET 
        achieved_amount = NEW.raised_amount,
        status = CASE 
            WHEN NEW.raised_amount >= target_amount AND status != 'achieved' THEN 'achieved'
            WHEN NEW.raised_amount >= target_amount * 0.5 AND status = 'pending' THEN 'in_progress'
            ELSE status
        END,
        achieved_date = CASE 
            WHEN NEW.raised_amount >= target_amount AND achieved_date IS NULL THEN CURRENT_DATE
            ELSE achieved_date
        END
    WHERE fund_id = NEW.id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milestone_status_trigger
    AFTER UPDATE ON funds
    FOR EACH ROW
    WHEN (OLD.raised_amount != NEW.raised_amount)
    EXECUTE FUNCTION update_milestone_status();

-- Enable RLS
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public funds are viewable by all" ON funds
    FOR SELECT USING (visibility = 'public' AND status = 'active');

CREATE POLICY "Users can view funds they created or manage" ON funds
    FOR SELECT USING (
        created_by = auth.uid() OR 
        managed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create funds" ON funds
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Fund creators and managers can update funds" ON funds
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        managed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins and fund creators can delete funds" ON funds
    FOR DELETE USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Similar policies for other tables
CREATE POLICY "Users can view fund campaigns" ON fund_campaigns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM funds f
            WHERE f.id = fund_id AND (
                f.visibility = 'public' OR
                f.created_by = auth.uid() OR
                f.managed_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users
                    WHERE id = auth.uid() AND role IN ('admin', 'manager')
                )
            )
        )
    );

CREATE POLICY "Fund managers can manage campaigns" ON fund_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM funds f
            WHERE f.id = fund_id AND (
                f.created_by = auth.uid() OR
                f.managed_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users
                    WHERE id = auth.uid() AND role IN ('admin', 'manager')
                )
            )
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON funds TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON fund_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON fund_donations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON fund_expenses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON fund_beneficiaries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON fund_milestones TO authenticated;
GRANT SELECT ON funds TO anon;
GRANT SELECT ON fund_campaigns TO anon;
GRANT SELECT ON fund_donations TO anon;
GRANT SELECT ON fund_expenses TO anon;
GRANT SELECT ON fund_beneficiaries TO anon;
GRANT SELECT ON fund_milestones TO anon;