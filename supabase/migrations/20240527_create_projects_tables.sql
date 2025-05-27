-- Проверка существования расширения для векторного поиска
CREATE EXTENSION IF NOT EXISTS vector;

-- Таблица проектов
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  business_idea TEXT NOT NULL,
  industry TEXT,
  target_audience TEXT,
  stage TEXT DEFAULT 'idea', -- idea, mvp, growth, scaling
  status TEXT DEFAULT 'draft', -- draft, active, funded, completed, cancelled

  -- AI Analysis Results
  ai_analysis JSONB,
  market_research JSONB,
  financial_projections JSONB,
  competitive_analysis JSONB,
  tokenomics JSONB,
  pitch_deck_data JSONB,
  mvp_plan JSONB,

  -- Investment Data
  investment_enabled BOOLEAN DEFAULT FALSE,
  funding_goal_ton DECIMAL(20,9), 
  funding_raised_ton DECIMAL(20,9) DEFAULT 0,
  token_symbol TEXT,
  token_price_ton DECIMAL(20,9),
  nft_collection_id TEXT,

  -- Metadata
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  investment_count INTEGER DEFAULT 0,
  ai_score DECIMAL(3,1), -- AI оценка от 1 до 10
  tags TEXT[],

  -- File URLs
  pitch_deck_url TEXT,
  demo_url TEXT,
  website_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица для векторного хранилища
CREATE TABLE IF NOT EXISTS project_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- description, business_idea, ai_analysis, etc.
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- Размерность вектора для OpenAI embeddings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем индекс для векторного поиска
CREATE INDEX IF NOT EXISTS project_embeddings_idx ON project_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Функция для обновления timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для обновления timestamp
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_embeddings_updated_at
BEFORE UPDATE ON project_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Функция для векторного поиска
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pe.project_id as id,
    pe.content,
    1 - (pe.embedding <=> query_embedding) as similarity
  FROM project_embeddings pe
  WHERE 1 - (pe.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Включаем Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_embeddings ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Users can view their own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON projects FOR DELETE
USING (auth.uid() = user_id);

-- Политики для project_embeddings
CREATE POLICY "Users can view embeddings of their own projects"
ON project_embeddings FOR SELECT
USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert embeddings for their own projects"
ON project_embeddings FOR INSERT
WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can update embeddings of their own projects"
ON project_embeddings FOR UPDATE
USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete embeddings of their own projects"
ON project_embeddings FOR DELETE
USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
