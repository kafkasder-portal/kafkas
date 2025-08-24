-- Migration: 011_create_aid_table
-- Create aid tables for humanitarian aid and assistance management

-- Main aid programs table
CREATE TABLE IF NOT EXISTS aid_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    program_type VARCHAR(50) NOT NULL CHECK (program_type IN ('food', 'medical', 'shelter', 'education', 'clothing', 'financial', 'emergency', 'rehabilitation', 'other')),
    category VARCHAR(100),
    target_group VARCHAR(100), -- children, elderly, families, disabled, refugees, etc.
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical')),
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled', 'suspended')),
    budget_allocated DECIMAL(15,2) DEFAULT 0.00,
    budget_spent DECIMAL(15,2) DEFAULT 0.00,
    budget_remaining DECIMAL(15,2) GENERATED ALWAYS AS (budget_allocated - budget_spent) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(255),
    coordinates POINT,
    coverage_area TEXT, -- geographic coverage description
    target_beneficiaries INTEGER DEFAULT 0,
    served_beneficiaries INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN target_beneficiaries = 0 THEN 0
            ELSE (served_beneficiaries::DECIMAL / target_beneficiaries) * 100
        END
    ) STORED,
    eligibility_criteria TEXT,
    application_process TEXT,
    required_documents TEXT[],
    contact_info JSONB DEFAULT '{}'::jsonb,
    partners JSONB DEFAULT '[]'::jsonb, -- partner organizations
    funding_sources JSONB DEFAULT '[]'::jsonb,
    distribution_schedule JSONB DEFAULT '{}'::jsonb,
    reporting_requirements TEXT,
    success_metrics JSONB DEFAULT '{}'::jsonb,
    challenges JSONB DEFAULT '[]'::jsonb,
    lessons_learned TEXT,
    image_url TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    tags TEXT[],
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50), -- weekly, monthly, quarterly, etc.
    next_occurrence DATE,
    created_by UUID REFERENCES users(id),
    managed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_aid_dates CHECK (end_date IS NULL OR end_date > start_date),
    CONSTRAINT valid_budget CHECK (budget_allocated >= 0 AND budget_spent >= 0)
);

-- Aid requests table
CREATE TABLE IF NOT EXISTS aid_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(50) UNIQUE NOT NULL,
    program_id UUID REFERENCES aid_programs(id),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    requester_name VARCHAR(255) NOT NULL,
    requester_phone VARCHAR(20),
    requester_email VARCHAR(255),
    relationship_to_beneficiary VARCHAR(100), -- self, family, guardian, organization, etc.
    request_type VARCHAR(50) NOT NULL,
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'fulfilled', 'cancelled', 'expired')),
    requested_items JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{"item": "food_package", "quantity": 2, "unit": "packages"}]
    approved_items JSONB DEFAULT '[]'::jsonb,
    delivered_items JSONB DEFAULT '[]'::jsonb,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    needed_by_date DATE,
    review_date DATE,
    approval_date DATE,
    delivery_date DATE,
    completion_date DATE,
    delivery_address TEXT,
    delivery_coordinates POINT,
    delivery_instructions TEXT,
    special_requirements TEXT,
    medical_conditions TEXT,
    household_size INTEGER,
    monthly_income DECIMAL(10,2),
    employment_status VARCHAR(50),
    housing_situation VARCHAR(100),
    previous_aid_received JSONB DEFAULT '[]'::jsonb,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'requires_documents')),
    verification_notes TEXT,
    supporting_documents JSONB DEFAULT '[]'::jsonb,
    photos JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    internal_notes TEXT, -- staff only
    rejection_reason TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    assigned_to UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    delivered_by UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_request_dates CHECK (
        (needed_by_date IS NULL OR needed_by_date >= request_date) AND
        (review_date IS NULL OR review_date >= request_date) AND
        (approval_date IS NULL OR approval_date >= request_date) AND
        (delivery_date IS NULL OR delivery_date >= request_date)
    )
);

-- Aid inventory table
CREATE TABLE IF NOT EXISTS aid_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    unit_of_measure VARCHAR(50) NOT NULL, -- kg, pieces, liters, boxes, etc.
    unit_cost DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    current_stock INTEGER DEFAULT 0,
    reserved_stock INTEGER DEFAULT 0, -- allocated but not yet distributed
    available_stock INTEGER GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER,
    reorder_point INTEGER DEFAULT 0,
    storage_location VARCHAR(255),
    storage_requirements TEXT, -- temperature, humidity, special handling
    expiry_date DATE,
    batch_number VARCHAR(100),
    supplier VARCHAR(255),
    supplier_contact JSONB DEFAULT '{}'::jsonb,
    procurement_date DATE,
    last_restocked_date DATE,
    last_distributed_date DATE,
    quality_status VARCHAR(20) DEFAULT 'good' CHECK (quality_status IN ('excellent', 'good', 'fair', 'poor', 'expired', 'damaged')),
    is_perishable BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,
    weight_per_unit DECIMAL(8,3), -- in kg
    dimensions JSONB DEFAULT '{}'::jsonb, -- {"length": 10, "width": 5, "height": 3, "unit": "cm"}
    special_handling BOOLEAN DEFAULT false,
    handling_instructions TEXT,
    distribution_priority INTEGER DEFAULT 0, -- higher number = higher priority
    tags TEXT[],
    images JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued', 'out_of_stock')),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_stock_levels CHECK (
        current_stock >= 0 AND 
        reserved_stock >= 0 AND 
        reserved_stock <= current_stock AND
        minimum_stock >= 0 AND
        (maximum_stock IS NULL OR maximum_stock >= minimum_stock)
    )
);

-- Aid distributions table
CREATE TABLE IF NOT EXISTS aid_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distribution_code VARCHAR(50) UNIQUE NOT NULL,
    program_id UUID REFERENCES aid_programs(id),
    request_id UUID REFERENCES aid_requests(id),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    distribution_type VARCHAR(50) DEFAULT 'regular' CHECK (distribution_type IN ('regular', 'emergency', 'special', 'follow_up')),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'failed')),
    scheduled_date DATE NOT NULL,
    actual_date DATE,
    location VARCHAR(255),
    coordinates POINT,
    distribution_method VARCHAR(50) DEFAULT 'pickup' CHECK (distribution_method IN ('pickup', 'delivery', 'mobile_unit', 'partner_org')),
    items_distributed JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_value DECIMAL(10,2) DEFAULT 0.00,
    recipient_signature TEXT, -- base64 encoded signature
    recipient_id_verified BOOLEAN DEFAULT false,
    photos JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    weather_conditions VARCHAR(100),
    challenges_encountered TEXT,
    feedback_received TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    distributed_by UUID REFERENCES users(id),
    verified_by UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aid distribution items table (detailed breakdown)
CREATE TABLE IF NOT EXISTS aid_distribution_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distribution_id UUID REFERENCES aid_distributions(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES aid_inventory(id),
    item_name VARCHAR(255) NOT NULL,
    quantity_planned INTEGER NOT NULL,
    quantity_distributed INTEGER DEFAULT 0,
    unit_of_measure VARCHAR(50) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity_distributed * COALESCE(unit_cost, 0)) STORED,
    batch_number VARCHAR(100),
    expiry_date DATE,
    condition_at_distribution VARCHAR(20) DEFAULT 'good' CHECK (condition_at_distribution IN ('excellent', 'good', 'fair', 'poor')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_quantities CHECK (quantity_planned > 0 AND quantity_distributed >= 0 AND quantity_distributed <= quantity_planned)
);

-- Aid program beneficiaries (many-to-many relationship)
CREATE TABLE IF NOT EXISTS aid_program_beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES aid_programs(id) ON DELETE CASCADE,
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended', 'transferred')),
    priority_level INTEGER DEFAULT 1 CHECK (priority_level >= 1 AND priority_level <= 5),
    special_needs TEXT,
    last_service_date DATE,
    total_aid_received DECIMAL(10,2) DEFAULT 0.00,
    services_count INTEGER DEFAULT 0,
    notes TEXT,
    assigned_case_worker UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(program_id, beneficiary_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aid_programs_program_code ON aid_programs(program_code);
CREATE INDEX IF NOT EXISTS idx_aid_programs_program_type ON aid_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_aid_programs_status ON aid_programs(status);
CREATE INDEX IF NOT EXISTS idx_aid_programs_priority ON aid_programs(priority);
CREATE INDEX IF NOT EXISTS idx_aid_programs_dates ON aid_programs(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_aid_programs_location ON aid_programs(location);
CREATE INDEX IF NOT EXISTS idx_aid_programs_created_by ON aid_programs(created_by);
CREATE INDEX IF NOT EXISTS idx_aid_programs_managed_by ON aid_programs(managed_by);
CREATE INDEX IF NOT EXISTS idx_aid_programs_tags ON aid_programs USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_aid_requests_request_code ON aid_requests(request_code);
CREATE INDEX IF NOT EXISTS idx_aid_requests_program_id ON aid_requests(program_id);
CREATE INDEX IF NOT EXISTS idx_aid_requests_beneficiary_id ON aid_requests(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_aid_requests_status ON aid_requests(status);
CREATE INDEX IF NOT EXISTS idx_aid_requests_urgency ON aid_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_aid_requests_request_date ON aid_requests(request_date);
CREATE INDEX IF NOT EXISTS idx_aid_requests_needed_by_date ON aid_requests(needed_by_date);
CREATE INDEX IF NOT EXISTS idx_aid_requests_assigned_to ON aid_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_aid_requests_verification_status ON aid_requests(verification_status);

CREATE INDEX IF NOT EXISTS idx_aid_inventory_item_code ON aid_inventory(item_code);
CREATE INDEX IF NOT EXISTS idx_aid_inventory_category ON aid_inventory(category);
CREATE INDEX IF NOT EXISTS idx_aid_inventory_status ON aid_inventory(status);
CREATE INDEX IF NOT EXISTS idx_aid_inventory_current_stock ON aid_inventory(current_stock);
CREATE INDEX IF NOT EXISTS idx_aid_inventory_expiry_date ON aid_inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_aid_inventory_storage_location ON aid_inventory(storage_location);
CREATE INDEX IF NOT EXISTS idx_aid_inventory_tags ON aid_inventory USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_aid_distributions_distribution_code ON aid_distributions(distribution_code);
CREATE INDEX IF NOT EXISTS idx_aid_distributions_program_id ON aid_distributions(program_id);
CREATE INDEX IF NOT EXISTS idx_aid_distributions_request_id ON aid_distributions(request_id);
CREATE INDEX IF NOT EXISTS idx_aid_distributions_beneficiary_id ON aid_distributions(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_aid_distributions_status ON aid_distributions(status);
CREATE INDEX IF NOT EXISTS idx_aid_distributions_scheduled_date ON aid_distributions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_aid_distributions_actual_date ON aid_distributions(actual_date);
CREATE INDEX IF NOT EXISTS idx_aid_distributions_distributed_by ON aid_distributions(distributed_by);

CREATE INDEX IF NOT EXISTS idx_aid_distribution_items_distribution_id ON aid_distribution_items(distribution_id);
CREATE INDEX IF NOT EXISTS idx_aid_distribution_items_inventory_item_id ON aid_distribution_items(inventory_item_id);

CREATE INDEX IF NOT EXISTS idx_aid_program_beneficiaries_program_id ON aid_program_beneficiaries(program_id);
CREATE INDEX IF NOT EXISTS idx_aid_program_beneficiaries_beneficiary_id ON aid_program_beneficiaries(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_aid_program_beneficiaries_status ON aid_program_beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_aid_program_beneficiaries_case_worker ON aid_program_beneficiaries(assigned_case_worker);

-- Create triggers for updated_at
CREATE TRIGGER update_aid_programs_updated_at
    BEFORE UPDATE ON aid_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aid_requests_updated_at
    BEFORE UPDATE ON aid_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aid_inventory_updated_at
    BEFORE UPDATE ON aid_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aid_distributions_updated_at
    BEFORE UPDATE ON aid_distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aid_program_beneficiaries_updated_at
    BEFORE UPDATE ON aid_program_beneficiaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate aid codes
CREATE OR REPLACE FUNCTION generate_aid_program_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code VARCHAR(50);
    counter INTEGER := 1;
    prefix VARCHAR(10);
BEGIN
    IF NEW.program_code IS NULL THEN
        -- Set prefix based on program type
        CASE NEW.program_type
            WHEN 'food' THEN prefix := 'FOOD';
            WHEN 'medical' THEN prefix := 'MED';
            WHEN 'shelter' THEN prefix := 'SHLT';
            WHEN 'education' THEN prefix := 'EDU';
            WHEN 'clothing' THEN prefix := 'CLTH';
            WHEN 'financial' THEN prefix := 'FIN';
            WHEN 'emergency' THEN prefix := 'EMG';
            ELSE prefix := 'AID';
        END CASE;
        
        LOOP
            new_code := prefix || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || LPAD(counter::TEXT, 4, '0');
            
            IF NOT EXISTS (SELECT 1 FROM aid_programs WHERE program_code = new_code) THEN
                NEW.program_code := new_code;
                EXIT;
            END IF;
            
            counter := counter + 1;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_aid_program_code_trigger
    BEFORE INSERT ON aid_programs
    FOR EACH ROW
    EXECUTE FUNCTION generate_aid_program_code();

-- Create function to generate request codes
CREATE OR REPLACE FUNCTION generate_aid_request_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code VARCHAR(50);
    counter INTEGER := 1;
BEGIN
    IF NEW.request_code IS NULL THEN
        LOOP
            new_code := 'REQ' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::TEXT, 4, '0');
            
            IF NOT EXISTS (SELECT 1 FROM aid_requests WHERE request_code = new_code) THEN
                NEW.request_code := new_code;
                EXIT;
            END IF;
            
            counter := counter + 1;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_aid_request_code_trigger
    BEFORE INSERT ON aid_requests
    FOR EACH ROW
    EXECUTE FUNCTION generate_aid_request_code();

-- Create function to update inventory stock
CREATE OR REPLACE FUNCTION update_aid_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Update inventory when items are distributed
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE aid_inventory 
        SET 
            current_stock = current_stock - (NEW.quantity_distributed - COALESCE(OLD.quantity_distributed, 0)),
            last_distributed_date = CASE 
                WHEN NEW.quantity_distributed > COALESCE(OLD.quantity_distributed, 0) THEN CURRENT_DATE
                ELSE last_distributed_date
            END
        WHERE id = NEW.inventory_item_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE aid_inventory 
        SET current_stock = current_stock + OLD.quantity_distributed
        WHERE id = OLD.inventory_item_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_aid_inventory_stock_trigger
    AFTER INSERT OR UPDATE OR DELETE ON aid_distribution_items
    FOR EACH ROW
    EXECUTE FUNCTION update_aid_inventory_stock();

-- Create function to update program statistics
CREATE OR REPLACE FUNCTION update_aid_program_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update program served beneficiaries count
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE aid_programs 
        SET served_beneficiaries = (
            SELECT COUNT(DISTINCT beneficiary_id)
            FROM aid_distributions
            WHERE program_id = NEW.program_id AND status = 'completed'
        )
        WHERE id = NEW.program_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE aid_programs 
        SET served_beneficiaries = (
            SELECT COUNT(DISTINCT beneficiary_id)
            FROM aid_distributions
            WHERE program_id = OLD.program_id AND status = 'completed'
        )
        WHERE id = OLD.program_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_aid_program_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON aid_distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_aid_program_stats();

-- Enable RLS
ALTER TABLE aid_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_distribution_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_program_beneficiaries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view aid programs" ON aid_programs
    FOR SELECT USING (
        created_by = auth.uid() OR 
        managed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'volunteer')
        )
    );

CREATE POLICY "Authorized users can manage aid programs" ON aid_programs
    FOR ALL USING (
        created_by = auth.uid() OR 
        managed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view aid requests" ON aid_requests
    FOR SELECT USING (
        created_by = auth.uid() OR 
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'volunteer')
        )
    );

CREATE POLICY "Users can create aid requests" ON aid_requests
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'volunteer', 'user')
        )
    );

CREATE POLICY "Authorized users can manage aid requests" ON aid_requests
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON aid_programs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON aid_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON aid_inventory TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON aid_distributions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON aid_distribution_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON aid_program_beneficiaries TO authenticated;
GRANT SELECT ON aid_programs TO anon;
GRANT SELECT ON aid_requests TO anon;
GRANT SELECT ON aid_inventory TO anon;
GRANT SELECT ON aid_distributions TO anon;
GRANT SELECT ON aid_distribution_items TO anon;
GRANT SELECT ON aid_program_beneficiaries TO anon;