-- ============================================================
-- Supabase SQL: Create ai_news table
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. AI News table (stores RSS feed items)
CREATE TABLE IF NOT EXISTS ai_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    link TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. AI Blog Posts table (stores generated articles)
CREATE TABLE IF NOT EXISTS ai_blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    news_id UUID REFERENCES ai_news(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,       -- 'feed_checked', 'article_saved', 'blog_generated', 'duplicate_skipped'
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_news_title ON ai_news(title);
CREATE INDEX IF NOT EXISTS idx_ai_news_created ON ai_news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_blog_posts_slug ON ai_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_ai_blog_posts_created ON ai_blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created ON automation_logs(created_at DESC);

-- 5. Enable Row Level Security (RLS) — allow public read, restrict writes
ALTER TABLE ai_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Public read for ai_news and ai_blog_posts
CREATE POLICY "Public can read ai_news" ON ai_news FOR SELECT USING (true);
CREATE POLICY "Public can read ai_blog_posts" ON ai_blog_posts FOR SELECT USING (true);

-- Service role can do everything (used by the automation script)
CREATE POLICY "Service can insert ai_news" ON ai_news FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can insert ai_blog_posts" ON ai_blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can insert logs" ON automation_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can read logs" ON automation_logs FOR SELECT USING (true);
