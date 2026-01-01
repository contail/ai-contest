-- 평가 시스템 테이블 생성

-- 1. 평가 세션 (기업이 생성하는 평가)
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  company_name VARCHAR(255),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  challenge_id VARCHAR(255) NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  access_code VARCHAR(20) UNIQUE NOT NULL,
  time_limit_minutes INT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 지원자 응시 기록
CREATE TABLE IF NOT EXISTS assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  score INT,
  total_questions INT,
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, applicant_email)
);

-- 3. 지원자 답변
CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES assessment_submissions(id) ON DELETE CASCADE,
  question_id VARCHAR(255) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, question_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_assessments_access_code ON assessments(access_code);
CREATE INDEX IF NOT EXISTS idx_assessments_created_by ON assessments(created_by);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_assessment_id ON assessment_submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_submission_id ON assessment_answers(submission_id);

-- RLS 정책 (Row Level Security)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신이 만든 평가를 볼 수 있도록
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = created_by);

-- 평가 제출은 누구나 가능 (지원자)
CREATE POLICY "Anyone can view submissions for their assessment" ON assessment_submissions
  FOR SELECT USING (
    assessment_id IN (SELECT id FROM assessments WHERE created_by = auth.uid())
  );

CREATE POLICY "Anyone can insert submissions" ON assessment_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their submissions" ON assessment_submissions
  FOR UPDATE USING (true);

-- 답변도 마찬가지
CREATE POLICY "Anyone can view answers for their assessment" ON assessment_answers
  FOR SELECT USING (
    submission_id IN (
      SELECT id FROM assessment_submissions
      WHERE assessment_id IN (SELECT id FROM assessments WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Anyone can insert answers" ON assessment_answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update answers" ON assessment_answers
  FOR UPDATE USING (true);

