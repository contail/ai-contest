-- =============================================================================
-- Seed Data (snake_case schema)
-- Database: PostgreSQL (Supabase, MySQL compatible)
-- =============================================================================

BEGIN;

-- Clear existing data
DELETE FROM answers;
DELETE FROM submission_sessions;
DELETE FROM answer_keys;
DELETE FROM dataset_urls;
DELETE FROM questions;
DELETE FROM challenges;

-- =============================================================================
-- Challenges
-- =============================================================================

INSERT INTO challenges (id, title, subtitle, summary, tags, badge, description, caution_text, dataset_label, dataset_file_name, dataset_description, dataset_download_url, restrict_dataset_url, is_published)
VALUES
  ('pfct-news', 'PFCT Blog Insight', 'PFCT AI Contest Lab',
   'PFCT 블로그 콘텐츠를 기반으로 카테고리·주제 인식과 근거 판별 능력을 확인하는 콘테스트.',
   '["리서치","콘텐츠 분석","분류"]', 'N',
   'PFCT 블로그 데이터셋을 기반으로 카테고리와 주제를 정확히 구분하는 능력을 확인합니다. 제공된 URL 목록을 바탕으로 각 질문 항목에 맞는 근거를 선택하세요.',
   '모든 응답은 지정된 데이터셋 범위 안에서만 인정됩니다. 최종 제출 이후에는 수정이 불가합니다.',
   'PFCT 블로그 100건', 'pfct_blog_urls_100.txt', 'PFCT 블로그 게시글 URL 목록',
   NULL, false, true),

  ('pfct-ocr', '스마트 배달 배차 분석 챌린지', 'PFCT AI Contest Lab',
   'AI 스마트 배차 엔진의 로그를 분석하여 규칙 준수 여부와 배차 효율을 검증하는 콘테스트.',
   '["운영 분석","로그 검증","배차 최적화"]', 'N',
   '배달 플랫폼의 효율성을 높이기 위해 도입된 AI 스마트 배차 엔진 로그를 분석합니다. 제공된 라이더 정보와 배차 로그(CSV/JSON)를 바탕으로 규칙이 제대로 적용되었는지 판단하고, 주어진 질문에 답하세요.',
   '모든 계산은 제공된 데이터셋 기준으로만 수행합니다. 제시된 규칙 외의 가정을 추가하지 마세요.',
   '배차 로그 3종', 'delivery_data.zip', 'rider_info.json, dispatch_log.csv, pending_orders.csv',
   '/datasets/delivery_data.zip', false, true);

-- =============================================================================
-- Questions
-- =============================================================================

-- pfct-news questions (크롤링 기반 문제)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required) VALUES
  ('pfct-news-q1', 'pfct-news', 1, 'SHORT',
   '본문에 ''AI''라는 키워드가 포함된 블로그는 몇 개인가요?',
   NULL, true),
  ('pfct-news-q2', 'pfct-news', 2, 'SHORT',
   '100개 블로그 본문에서 ''금리''라는 단어가 총 몇 회 등장하나요?',
   NULL, true),
  ('pfct-news-q3', 'pfct-news', 3, 'SHORT',
   '''투자''라는 단어가 가장 많이 등장하는 블로그의 slug는? (slug: URL에서 도메인을 제외한 경로)',
   NULL, true),
  ('pfct-news-q4', 'pfct-news', 4, 'SHORT',
   '본문에 ''담보''와 ''아파트'' 두 키워드가 모두 포함된 블로그는 몇 개인가요?',
   NULL, true),
  ('pfct-news-q5', 'pfct-news', 5, 'SHORT',
   '''AI''라는 단어가 가장 많이 등장하는 블로그의 slug는? (slug: URL에서 도메인을 제외한 경로, 예: blog.pfct.co.kr/hello → hello)',
   NULL, true);

-- pfct-ocr questions
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required) VALUES
  ('pfct-ocr-q1', 'pfct-ocr', 1, 'single',
   'dispatch_log.csv 데이터 중, 선호 지역 가중치 적용으로 인해 실제 거리상 더 가까운 라이더가 있었음에도 배차권을 얻은 ''역전 배차'' 건수는 몇 건인가요?',
   '["2건","3건","4건","5건"]', true),
  ('pfct-ocr-q2', 'pfct-ocr', 2, 'single',
   '배차에 성공한 라이더들의 평균 실제 이동 거리(raw_distance)를 긴 순서에서 짧은 순서로 정렬한 것을 고르세요.',
   '["정스피드 > 박민수 > 이영희 > 김철수 > 최신속","정스피드 > 김철수 > 이영희 > 박민수 > 최신속","최신속 > 박민수 > 이영희 > 김철수 > 정스피드","이영희 > 정스피드 > 김철수 > 박민수 > 최신속"]',
   true),
  ('pfct-ocr-q3', 'pfct-ocr', 3, 'single',
   '배차 완료 데이터에서, 선호 지역 라이더가 배정된 비율이 100%인 지역 중 배정 건수가 가장 많은 지역은?',
   '["강남구","서초구","역삼동","송파구"]', true),
  ('pfct-ocr-q4', 'pfct-ocr', 4, 'single',
   'pending_orders.csv 기준, 배차 실패 원인 중 가장 많이 발생한 사유는 무엇인가요?',
   '["배달 가능 반경(10km) 초과","라이더의 최대 적재 용량 초과","가용 라이더의 업무 부하(2건) 초과","주문 지역 선호 라이더 부재"]',
   true),
  ('pfct-ocr-q5', 'pfct-ocr', 5, 'single',
   '모든 배차 완료 후, 남은 적재 용량이 큰 순서대로 라이더를 정렬한 결과는 무엇인가요?',
   '["정스피드 > 김철수 > 최신속 > 이영희 = 박민수","정스피드 > 이영희 > 박민수 > 김철수 > 최신속","김철수 > 정스피드 > 최신속 > 이영희 = 박민수","최신속 > 이영희 > 박민수 > 정스피드 > 김철수"]',
   true);

-- =============================================================================
-- Dataset URLs (pfct-news)
-- =============================================================================

INSERT INTO dataset_urls (id, challenge_id, url) VALUES
  ('pfct-news-url-001', 'pfct-news', 'https://blog.pfct.co.kr/%ea%b3%a0%ea%b0%9d-%ea%b0%90%ec%82%ac-%ec%9d%b4%eb%b2%a4%ed%8a%b8'),
  ('pfct-news-url-002', 'pfct-news', 'https://blog.pfct.co.kr/%eb%8c%80%ec%b6%9c%eb%b9%99%ec%9e%90%ed%98%95-%eb%b3%b4%ec%9d%b4%ec%8a%a4%ed%94%bc%ec%8b%b1-%ec%a3%bc%ec%9d%98%eb%b3%b4-%ec%82%ac%eb%a1%80%ec%99%80-%ec%98%88%eb%b0%a9%eb%b2%95%ec%9d%80'),
  ('pfct-news-url-003', 'pfct-news', 'https://blog.pfct.co.kr/%eb%a7%a4%ec%9e%85%ed%99%95%ec%95%bd'),
  ('pfct-news-url-004', 'pfct-news', 'https://blog.pfct.co.kr/%eb%b6%84%ec%82%b0-%ed%88%ac%ec%9e%90'),
  ('pfct-news-url-005', 'pfct-news', 'https://blog.pfct.co.kr/%ec%86%8c%ec%95%a1-%ed%88%ac%ec%9e%90'),
  ('pfct-news-url-006', 'pfct-news', 'https://blog.pfct.co.kr/%ec%8b%a0%ec%9a%a9%ec%a0%90%ec%88%98-%ec%98%ac%eb%a6%ac%eb%8a%94-%ed%98%84%eb%aa%85%ed%95%9c-%eb%8c%80%ec%b6%9c-%ec%83%81%ed%99%98-%ec%88%9c%ec%84%9c'),
  ('pfct-news-url-007', 'pfct-news', 'https://blog.pfct.co.kr/%ec%97%b0%ec%b2%b4%ec%9c%a8-vs-%ec%86%90%ec%8b%a4%eb%a5%a0'),
  ('pfct-news-url-008', 'pfct-news', 'https://blog.pfct.co.kr/%ec%9c%a0%ed%9a%a8%eb%8b%b4%eb%b3%b4%eb%b9%84%ec%9c%a8'),
  ('pfct-news-url-009', 'pfct-news', 'https://blog.pfct.co.kr/%ec%9d%b4%ec%bb%a4%eb%a8%b8%ec%8a%a4-%ec%a0%95%ec%82%b0-%ec%a7%80%ec%97%b0-%ec%82%ac%ed%83%9c'),
  ('pfct-news-url-010', 'pfct-news', 'https://blog.pfct.co.kr/%ec%b1%84%ea%b6%8c-%ed%88%ac%ec%9e%90%ec%9d%98-%eb%a7%a4%eb%a0%a5'),
  ('pfct-news-url-011', 'pfct-news', 'https://blog.pfct.co.kr/%ed%81%ac%ed%94%8c-%eb%8c%80%ec%b6%9c-%ec%8b%a0%ec%9a%a9%ec%a0%90%ec%88%98'),
  ('pfct-news-url-012', 'pfct-news', 'https://blog.pfct.co.kr/%ed%99%a9%ea%b8%88-%ed%8f%ac%ed%8a%b8%ed%8f%b4%eb%a6%ac%ec%98%a4'),
  ('pfct-news-url-013', 'pfct-news', 'https://blog.pfct.co.kr/13%ec%9b%94%ec%9d%98-%ec%9b%94%ea%b8%89'),
  ('pfct-news-url-014', 'pfct-news', 'https://blog.pfct.co.kr/2019-yearend-workshop'),
  ('pfct-news-url-015', 'pfct-news', 'https://blog.pfct.co.kr/2020-yearend-workshop'),
  ('pfct-news-url-016', 'pfct-news', 'https://blog.pfct.co.kr/2020_reddot_award'),
  ('pfct-news-url-017', 'pfct-news', 'https://blog.pfct.co.kr/2021-njt'),
  ('pfct-news-url-018', 'pfct-news', 'https://blog.pfct.co.kr/2024-year-end-party'),
  ('pfct-news-url-019', 'pfct-news', 'https://blog.pfct.co.kr/2024_infographic'),
  ('pfct-news-url-020', 'pfct-news', 'https://blog.pfct.co.kr/2025-pipcnic'),
  ('pfct-news-url-021', 'pfct-news', 'https://blog.pfct.co.kr/20percent'),
  ('pfct-news-url-022', 'pfct-news', 'https://blog.pfct.co.kr/4-ways-to-use-loan-to-loan'),
  ('pfct-news-url-023', 'pfct-news', 'https://blog.pfct.co.kr/6things-to-consider-before-you-receive-a-credit-loan'),
  ('pfct-news-url-024', 'pfct-news', 'https://blog.pfct.co.kr/about_us_peoplefund'),
  ('pfct-news-url-025', 'pfct-news', 'https://blog.pfct.co.kr/agos-informs'),
  ('pfct-news-url-026', 'pfct-news', 'https://blog.pfct.co.kr/ai-lab'),
  ('pfct-news-url-027', 'pfct-news', 'https://blog.pfct.co.kr/ai-technology'),
  ('pfct-news-url-028', 'pfct-news', 'https://blog.pfct.co.kr/airpack-branding'),
  ('pfct-news-url-029', 'pfct-news', 'https://blog.pfct.co.kr/airpack_gameday'),
  ('pfct-news-url-030', 'pfct-news', 'https://blog.pfct.co.kr/aju_ceo_opinion'),
  ('pfct-news-url-031', 'pfct-news', 'https://blog.pfct.co.kr/all-about-peoplefund-investment-in-apartment-mortgage'),
  ('pfct-news-url-032', 'pfct-news', 'https://blog.pfct.co.kr/alternative-card-loan'),
  ('pfct-news-url-033', 'pfct-news', 'https://blog.pfct.co.kr/alternative-loan'),
  ('pfct-news-url-034', 'pfct-news', 'https://blog.pfct.co.kr/apart_rate-of-return'),
  ('pfct-news-url-035', 'pfct-news', 'https://blog.pfct.co.kr/apt'),
  ('pfct-news-url-036', 'pfct-news', 'https://blog.pfct.co.kr/apt-npl'),
  ('pfct-news-url-037', 'pfct-news', 'https://blog.pfct.co.kr/asia_ceo'),
  ('pfct-news-url-038', 'pfct-news', 'https://blog.pfct.co.kr/awesome-keyboard'),
  ('pfct-news-url-039', 'pfct-news', 'https://blog.pfct.co.kr/aws-reinvent-2023'),
  ('pfct-news-url-040', 'pfct-news', 'https://blog.pfct.co.kr/aws_summit'),
  ('pfct-news-url-041', 'pfct-news', 'https://blog.pfct.co.kr/b2b-solution-airpack'),
  ('pfct-news-url-042', 'pfct-news', 'https://blog.pfct.co.kr/backend-engineer-sj'),
  ('pfct-news-url-043', 'pfct-news', 'https://blog.pfct.co.kr/badminton'),
  ('pfct-news-url-044', 'pfct-news', 'https://blog.pfct.co.kr/byungkyu'),
  ('pfct-news-url-045', 'pfct-news', 'https://blog.pfct.co.kr/ceo-column'),
  ('pfct-news-url-046', 'pfct-news', 'https://blog.pfct.co.kr/cio_sungyeol'),
  ('pfct-news-url-047', 'pfct-news', 'https://blog.pfct.co.kr/clo-compliance'),
  ('pfct-news-url-048', 'pfct-news', 'https://blog.pfct.co.kr/column_clo'),
  ('pfct-news-url-049', 'pfct-news', 'https://blog.pfct.co.kr/contribution-210419'),
  ('pfct-news-url-050', 'pfct-news', 'https://blog.pfct.co.kr/contribution-210802'),
  ('pfct-news-url-051', 'pfct-news', 'https://blog.pfct.co.kr/contribution-220404'),
  ('pfct-news-url-052', 'pfct-news', 'https://blog.pfct.co.kr/core_service'),
  ('pfct-news-url-053', 'pfct-news', 'https://blog.pfct.co.kr/corebanking'),
  ('pfct-news-url-054', 'pfct-news', 'https://blog.pfct.co.kr/cple'),
  ('pfct-news-url-055', 'pfct-news', 'https://blog.pfct.co.kr/cple_benefit'),
  ('pfct-news-url-056', 'pfct-news', 'https://blog.pfct.co.kr/cple_investment'),
  ('pfct-news-url-057', 'pfct-news', 'https://blog.pfct.co.kr/cple_loan'),
  ('pfct-news-url-058', 'pfct-news', 'https://blog.pfct.co.kr/cple_mortgageloan'),
  ('pfct-news-url-059', 'pfct-news', 'https://blog.pfct.co.kr/cple_personal-loan'),
  ('pfct-news-url-060', 'pfct-news', 'https://blog.pfct.co.kr/cplenews'),
  ('pfct-news-url-061', 'pfct-news', 'https://blog.pfct.co.kr/credit'),
  ('pfct-news-url-062', 'pfct-news', 'https://blog.pfct.co.kr/credit-card-installment-and-revolving'),
  ('pfct-news-url-063', 'pfct-news', 'https://blog.pfct.co.kr/credit-line'),
  ('pfct-news-url-064', 'pfct-news', 'https://blog.pfct.co.kr/credit-mid-class'),
  ('pfct-news-url-065', 'pfct-news', 'https://blog.pfct.co.kr/css-academy-1'),
  ('pfct-news-url-066', 'pfct-news', 'https://blog.pfct.co.kr/css-academy-2'),
  ('pfct-news-url-067', 'pfct-news', 'https://blog.pfct.co.kr/cultureland'),
  ('pfct-news-url-068', 'pfct-news', 'https://blog.pfct.co.kr/cultureland-2'),
  ('pfct-news-url-069', 'pfct-news', 'https://blog.pfct.co.kr/current_investment'),
  ('pfct-news-url-070', 'pfct-news', 'https://blog.pfct.co.kr/dag_ai-bot'),
  ('pfct-news-url-071', 'pfct-news', 'https://blog.pfct.co.kr/data-analyst'),
  ('pfct-news-url-072', 'pfct-news', 'https://blog.pfct.co.kr/data_strategy_team'),
  ('pfct-news-url-073', 'pfct-news', 'https://blog.pfct.co.kr/depression-p2p'),
  ('pfct-news-url-074', 'pfct-news', 'https://blog.pfct.co.kr/design-system'),
  ('pfct-news-url-075', 'pfct-news', 'https://blog.pfct.co.kr/difference-of-marketplace-lending'),
  ('pfct-news-url-076', 'pfct-news', 'https://blog.pfct.co.kr/diversified-investment-magic'),
  ('pfct-news-url-077', 'pfct-news', 'https://blog.pfct.co.kr/dj_kdd_2024'),
  ('pfct-news-url-078', 'pfct-news', 'https://blog.pfct.co.kr/dmh_interview'),
  ('pfct-news-url-079', 'pfct-news', 'https://blog.pfct.co.kr/droidknights2025'),
  ('pfct-news-url-080', 'pfct-news', 'https://blog.pfct.co.kr/et-ceo-opinion'),
  ('pfct-news-url-081', 'pfct-news', 'https://blog.pfct.co.kr/etoday_ceo'),
  ('pfct-news-url-082', 'pfct-news', 'https://blog.pfct.co.kr/flexing-year-end'),
  ('pfct-news-url-083', 'pfct-news', 'https://blog.pfct.co.kr/fn_ceo_opinion'),
  ('pfct-news-url-084', 'pfct-news', 'https://blog.pfct.co.kr/former-cto'),
  ('pfct-news-url-085', 'pfct-news', 'https://blog.pfct.co.kr/ggang'),
  ('pfct-news-url-086', 'pfct-news', 'https://blog.pfct.co.kr/good-time-with-good-people-1'),
  ('pfct-news-url-087', 'pfct-news', 'https://blog.pfct.co.kr/good-time-with-good-people-2'),
  ('pfct-news-url-088', 'pfct-news', 'https://blog.pfct.co.kr/google-at-peoplefund'),
  ('pfct-news-url-089', 'pfct-news', 'https://blog.pfct.co.kr/happyhour'),
  ('pfct-news-url-090', 'pfct-news', 'https://blog.pfct.co.kr/hello-peopler'),
  ('pfct-news-url-091', 'pfct-news', 'https://blog.pfct.co.kr/how-to-find-success-in-p2p-loan-investment-1'),
  ('pfct-news-url-092', 'pfct-news', 'https://blog.pfct.co.kr/how-to-find-success-in-p2p-loan-investment-2'),
  ('pfct-news-url-093', 'pfct-news', 'https://blog.pfct.co.kr/how-to-manage-credit-score'),
  ('pfct-news-url-094', 'pfct-news', 'https://blog.pfct.co.kr/how-to-manage-debt'),
  ('pfct-news-url-095', 'pfct-news', 'https://blog.pfct.co.kr/how-will-the-interest-rate-on-credit-loans-be-determined'),
  ('pfct-news-url-096', 'pfct-news', 'https://blog.pfct.co.kr/iclr2025'),
  ('pfct-news-url-097', 'pfct-news', 'https://blog.pfct.co.kr/iclr2025-interview'),
  ('pfct-news-url-098', 'pfct-news', 'https://blog.pfct.co.kr/iflr-asia-pacific-awards-2020'),
  ('pfct-news-url-099', 'pfct-news', 'https://blog.pfct.co.kr/impact-of-credit-score'),
  ('pfct-news-url-100', 'pfct-news', 'https://blog.pfct.co.kr/importance-of-partner-bank');

-- =============================================================================
-- Answer Keys
-- =============================================================================

INSERT INTO answer_keys (question_id, answer) VALUES
  -- PFCT Blog 정답
  ('pfct-news-q1', '37'),
  ('pfct-news-q2', '384'),
  ('pfct-news-q3', '채권-투자의-매력'),
  ('pfct-news-q4', '11'),
  ('pfct-news-q5', 'ai-lab'),
  -- 배차 챌린지 정답
  ('pfct-ocr-q1', '4건'),
  ('pfct-ocr-q2', '정스피드 > 김철수 > 이영희 > 박민수 > 최신속'),
  ('pfct-ocr-q3', '서초구'),
  ('pfct-ocr-q4', '라이더의 최대 적재 용량 초과'),
  ('pfct-ocr-q5', '정스피드 > 김철수 > 최신속 > 이영희 = 박민수');

COMMIT;

