-- Migration: 004_create_inventory_table
-- Create inventory table for item management

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    unit VARCHAR(50) NOT NULL DEFAULT 'piece',
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    total_value DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    location VARCHAR(255),
    supplier VARCHAR(255),
    barcode VARCHAR(100),
    expiry_date DATE,
    minimum_stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'expired', 'damaged')),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry_date ON inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON inventory(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity);

-- Create trigger for updated_at
CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity <= NEW.minimum_stock AND NEW.quantity > 0 THEN
        -- Log low stock warning (could be extended to send notifications)
        INSERT INTO system_logs (level, message, data, created_at)
        VALUES ('warning', 'Low stock alert', 
                json_build_object('item_id', NEW.id, 'item_name', NEW.name, 'quantity', NEW.quantity, 'minimum_stock', NEW.minimum_stock),
                NOW());
    END IF;
    
    IF NEW.quantity = 0 THEN
        NEW.status = 'out_of_stock';
    ELSIF OLD.status = 'out_of_stock' AND NEW.quantity > 0 THEN
        NEW.status = 'available';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER inventory_stock_check
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION check_low_stock();

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view inventory" ON inventory
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can manage inventory" ON inventory
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can insert inventory items" ON inventory
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON inventory TO authenticated;
GRANT SELECT ON inventory TO anon;