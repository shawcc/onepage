-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'premium', 'enterprise')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(50) NOT NULL,
    page_data JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    conversion_rate FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_industry ON projects(industry);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Principles Table
CREATE TABLE IF NOT EXISTS principles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('cta', 'trust', 'urgency', 'visual', 'copywriting')),
    description TEXT NOT NULL,
    conditions JSONB DEFAULT '{}',
    examples JSONB DEFAULT '[]',
    impact_score FLOAT DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_principles_category ON principles(category);
CREATE INDEX IF NOT EXISTS idx_principles_impact_score ON principles(impact_score DESC);

-- Knowledge Cases Table
CREATE TABLE IF NOT EXISTS knowledge_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principle_id UUID NOT NULL REFERENCES principles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    before_after JSONB DEFAULT '{}',
    conversion_improvement FLOAT DEFAULT 0,
    industry VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_cases_principle_id ON knowledge_cases(principle_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_cases_industry ON knowledge_cases(industry);

-- Templates Table (Added as per TAD diagram, though not explicitly in SQL block, good to have)
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    industry VARCHAR(50),
    preview_data JSONB DEFAULT '{}',
    avg_conversion_boost FLOAT DEFAULT 0,
    usage_count INT DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS & Permissions
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own projects" ON projects
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Grant Permissions
-- Note: 'anon' and 'authenticated' roles exist in Supabase by default.
-- If running in a local postgres without these roles, these might fail, but for Supabase it's correct.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    GRANT SELECT ON principles TO anon;
    GRANT SELECT ON knowledge_cases TO anon;
    GRANT SELECT ON templates TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    GRANT ALL PRIVILEGES ON users TO authenticated;
    GRANT ALL PRIVILEGES ON projects TO authenticated;
    GRANT ALL PRIVILEGES ON principles TO authenticated; -- Allow reading principles
    GRANT ALL PRIVILEGES ON knowledge_cases TO authenticated;
    GRANT ALL PRIVILEGES ON templates TO authenticated;
  END IF;
END
$$;

-- Initial Data
INSERT INTO principles (name, category, description, conditions, examples, impact_score) VALUES
('头图三要素', 'visual', '主图必须包含产品、卖点、场景三个要素', '{"required_elements": ["product", "benefit", "scenario"]}', '["展示产品在真实使用场景中，突出核心卖点"]', 85),
('FAB法则', 'copywriting', '特征-优势-利益的递进式文案结构', '{"structure": ["feature", "advantage", "benefit"]}', '["先说明产品特征，再强调优势，最后突出用户利益"]', 78),
('社会认同', 'trust', '利用用户评价、销量数据建立信任', '{"elements": ["reviews", "ratings", "sales_numbers"]}', '["展示真实用户评价，突出销量和好评率"]', 92),
('稀缺性原理', 'urgency', '通过限时限量营造紧迫感', '{"tactics": ["time_limit", "quantity_limit", "exclusive"]}', '["限时优惠、限量发售、独家专享等策略"]', 88),
('明确CTA', 'cta', '行动召唤按钮必须清晰明确', '{"requirements": ["clear_text", "prominent_color", "single_focus"]}', '["使用''立即购买''、''马上抢购''等明确动词"]', 95);

INSERT INTO knowledge_cases (principle_id, title, description, before_after, conversion_improvement, industry) VALUES
((SELECT id FROM principles WHERE name = '头图三要素'), '服装类目转化率提升35%', '通过优化主图展示穿搭效果和场景，转化率从2.1%提升至2.8%', '{"before": "单纯产品展示", "after": "模特穿搭+场景展示"}', 35, 'fashion'),
((SELECT id FROM principles WHERE name = '社会认同'), '电子产品信任建立案例', '添加用户评价和销量展示后，转化率提升42%', '{"before": "无用户评价", "after": "展示4.8分评价和10万+销量"}', 42, 'electronics');
