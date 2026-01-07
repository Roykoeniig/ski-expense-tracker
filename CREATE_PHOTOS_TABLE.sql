-- 创建照片表
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_photos_date ON photos(date DESC);

-- 启用 Row Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人访问（公开应用）
CREATE POLICY "Allow all operations on photos" ON photos
  FOR ALL USING (true) WITH CHECK (true);

