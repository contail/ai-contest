-- =============================================================================
-- Create users table
-- Supabase SQL Editor에서 실행
-- =============================================================================

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,  -- Supabase Auth uid
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  nickname TEXT,
  role TEXT NOT NULL DEFAULT 'user',  -- 'user' | 'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- submission_sessions에 user_id 컬럼 추가 (없으면)
ALTER TABLE submission_sessions
ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE SET NULL;

-- RLS 비활성화 (개발용)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 초기 관리자 추가 (본인 이메일로 변경하세요)
-- INSERT INTO users (id, email, name, nickname, role)
-- VALUES ('admin-temp-id', 'your-email@company.com', 'Admin', 'admin', 'admin')
-- ON CONFLICT (email) DO UPDATE SET role = 'admin';

