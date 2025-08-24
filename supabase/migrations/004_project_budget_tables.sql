-- Proje Yönetimi ve Bütçe Planlama Tabloları

-- Projeler tablosu
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(15,2) DEFAULT 0,
  budget_used DECIMAL(15,2) DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'planning',
  location VARCHAR(255),
  manager VARCHAR(255),
  progress INTEGER DEFAULT 0,
  objectives JSONB,
  risks JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proje ekip üyeleri tablosu
CREATE TABLE IF NOT EXISTS project_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(100) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proje faydalanıcıları tablosu
CREATE TABLE IF NOT EXISTS project_beneficiaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
  assistance_type VARCHAR(100),
  amount DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proje kilometre taşları tablosu
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proje görevleri tablosu
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bütçeler tablosu
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  total_budget DECIMAL(15,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bütçe tahsisleri tablosu
CREATE TABLE IF NOT EXISTS budget_allocations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bütçe gelir kaynakları tablosu
CREATE TABLE IF NOT EXISTS budget_income_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  source_name VARCHAR(255) NOT NULL,
  expected_amount DECIMAL(15,2) NOT NULL,
  actual_amount DECIMAL(15,2) DEFAULT 0,
  frequency VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bütçe gider kategorileri tablosu
CREATE TABLE IF NOT EXISTS budget_expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category_name VARCHAR(255) NOT NULL,
  allocated_amount DECIMAL(15,2) NOT NULL,
  spent_amount DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_project_team_project ON project_team(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_user ON project_team(user_id);

CREATE INDEX IF NOT EXISTS idx_project_beneficiaries_project ON project_beneficiaries(project_id);
CREATE INDEX IF NOT EXISTS idx_project_beneficiaries_beneficiary ON project_beneficiaries(beneficiary_id);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_completed ON project_milestones(completed);

CREATE INDEX IF NOT EXISTS idx_project_tasks_project ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee ON project_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON project_tasks(status);

CREATE INDEX IF NOT EXISTS idx_budgets_year ON budgets(year);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_budgets_status ON budgets(status);

CREATE INDEX IF NOT EXISTS idx_budget_allocations_budget ON budget_allocations(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_allocations_category ON budget_allocations(category);

CREATE INDEX IF NOT EXISTS idx_budget_income_sources_budget ON budget_income_sources(budget_id);

CREATE INDEX IF NOT EXISTS idx_budget_expense_categories_budget ON budget_expense_categories(budget_id);

-- RLS (Row Level Security) Politikaları

-- Projeler için RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projeleri görüntüle" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Proje oluştur" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Proje güncelle" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Proje sil" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Proje ekip üyeleri için RLS
ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ekip üyelerini görüntüle" ON project_team
  FOR SELECT USING (true);

CREATE POLICY "Ekip üyesi ekle" ON project_team
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Ekip üyesi güncelle" ON project_team
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Ekip üyesi sil" ON project_team
  FOR DELETE USING (auth.role() = 'authenticated');

-- Proje faydalanıcıları için RLS
ALTER TABLE project_beneficiaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faydalanıcıları görüntüle" ON project_beneficiaries
  FOR SELECT USING (true);

CREATE POLICY "Faydalanıcı ekle" ON project_beneficiaries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Faydalanıcı güncelle" ON project_beneficiaries
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Faydalanıcı sil" ON project_beneficiaries
  FOR DELETE USING (auth.role() = 'authenticated');

-- Proje kilometre taşları için RLS
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kilometre taşlarını görüntüle" ON project_milestones
  FOR SELECT USING (true);

CREATE POLICY "Kilometre taşı ekle" ON project_milestones
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Kilometre taşı güncelle" ON project_milestones
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Kilometre taşı sil" ON project_milestones
  FOR DELETE USING (auth.role() = 'authenticated');

-- Proje görevleri için RLS
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Görevleri görüntüle" ON project_tasks
  FOR SELECT USING (true);

CREATE POLICY "Görev ekle" ON project_tasks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Görev güncelle" ON project_tasks
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Görev sil" ON project_tasks
  FOR DELETE USING (auth.role() = 'authenticated');

-- Bütçeler için RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bütçeleri görüntüle" ON budgets
  FOR SELECT USING (true);

CREATE POLICY "Bütçe oluştur" ON budgets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Bütçe güncelle" ON budgets
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Bütçe sil" ON budgets
  FOR DELETE USING (auth.role() = 'authenticated');

-- Bütçe tahsisleri için RLS
ALTER TABLE budget_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bütçe tahsislerini görüntüle" ON budget_allocations
  FOR SELECT USING (true);

CREATE POLICY "Bütçe tahsisi ekle" ON budget_allocations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Bütçe tahsisi güncelle" ON budget_allocations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Bütçe tahsisi sil" ON budget_allocations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Bütçe gelir kaynakları için RLS
ALTER TABLE budget_income_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gelir kaynaklarını görüntüle" ON budget_income_sources
  FOR SELECT USING (true);

CREATE POLICY "Gelir kaynağı ekle" ON budget_income_sources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Gelir kaynağı güncelle" ON budget_income_sources
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Gelir kaynağı sil" ON budget_income_sources
  FOR DELETE USING (auth.role() = 'authenticated');

-- Bütçe gider kategorileri için RLS
ALTER TABLE budget_expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gider kategorilerini görüntüle" ON budget_expense_categories
  FOR SELECT USING (true);

CREATE POLICY "Gider kategorisi ekle" ON budget_expense_categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Gider kategorisi güncelle" ON budget_expense_categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Gider kategorisi sil" ON budget_expense_categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_allocations_updated_at BEFORE UPDATE ON budget_allocations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_income_sources_updated_at BEFORE UPDATE ON budget_income_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_expense_categories_updated_at BEFORE UPDATE ON budget_expense_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Örnek veriler (opsiyonel)
INSERT INTO projects (name, description, start_date, end_date, budget, category, priority, status, location) VALUES
('Eğitim Desteği Projesi', 'İhtiyaç sahiplerinin çocuklarına eğitim desteği sağlama projesi', '2024-01-01', '2024-12-31', 500000, 'education', 'high', 'active', 'İstanbul'),
('Sağlık Tarama Kampanyası', 'Toplum sağlığı için ücretsiz sağlık tarama kampanyası', '2024-03-01', '2024-06-30', 300000, 'health', 'medium', 'planning', 'Ankara'),
('Acil Yardım Projesi', 'Doğal afet sonrası acil yardım ve destek projesi', '2024-02-01', '2024-05-31', 750000, 'emergency', 'high', 'active', 'Hatay');

INSERT INTO budgets (name, year, total_budget, category, description, status) VALUES
('2024 Eğitim Bütçesi', 2024, 1000000, 'education', '2024 yılı eğitim projeleri için ayrılan bütçe', 'active'),
('2024 Sağlık Bütçesi', 2024, 750000, 'health', '2024 yılı sağlık projeleri için ayrılan bütçe', 'active'),
('2024 Acil Yardım Bütçesi', 2024, 500000, 'emergency', '2024 yılı acil yardım projeleri için ayrılan bütçe', 'draft');

