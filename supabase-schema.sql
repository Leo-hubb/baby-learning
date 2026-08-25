-- ============================================
-- 宝贝学习乐园 - Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 全局进度表
-- 记录各模块每个条目的完成状态
-- ============================================
CREATE TABLE IF NOT EXISTS progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  module TEXT NOT NULL,  -- 'english' | 'literacy' | 'math' | 'logic'
  item_id TEXT NOT NULL, -- 单元ID、汉字ID等
  status TEXT NOT NULL DEFAULT 'not_started',  -- 'not_started' | 'in_progress' | 'completed' | 'mastered'
  score INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module, item_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_module ON progress(user_id, module);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS progress_updated_at ON progress;
CREATE TRIGGER progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. 闯关进度表
-- ============================================
CREATE TABLE IF NOT EXISTS adventure_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  level INTEGER NOT NULL,
  stars_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, level)
);

CREATE INDEX IF NOT EXISTS idx_adventure_user ON adventure_progress(user_id);

-- ============================================
-- 3. 徽章表
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_id);

-- ============================================
-- 4. 用户全局统计表
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  total_stars INTEGER DEFAULT 0,
  consecutive_days INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  math_addition_count INTEGER DEFAULT 0,
  logic_question_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS user_stats_updated_at ON user_stats;
CREATE TRIGGER user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. 启用 Row Level Security (RLS)
-- ============================================
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own adventure" ON adventure_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adventure" ON adventure_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own adventure" ON adventure_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 6. 启用 Realtime（可选，用于实时同步）
-- ============================================
-- 在 Supabase Dashboard → Database → Replication 中
-- 将以上4张表添加到 Realtime 出版物

-- ============================================
-- 7. 启用匿名认证
-- ============================================
-- 在 Supabase Dashboard → Authentication → Providers → Anonymous
-- 启用 "Enable Anonymous sign-ins"

-- ============================================
-- 完成！
-- 执行后在项目 .env 文件中配置：
-- VITE_SUPABASE_URL=你的项目URL
-- VITE_SUPABASE_ANON_KEY=你的匿名密钥
-- ============================================
