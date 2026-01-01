-- Operation Silent City 챌린지 추가/업데이트
-- 기존 데이터가 있으면 삭제 후 재삽입

-- 0. 기존 데이터 삭제 (CASCADE로 questions, answer_keys도 함께 삭제됨)
DELETE FROM answer_keys WHERE question_id IN (
  SELECT id FROM questions WHERE challenge_id = 'operation-silent-city'
);
DELETE FROM questions WHERE challenge_id = 'operation-silent-city';
DELETE FROM challenges WHERE id = 'operation-silent-city';

-- 1. 챌린지 추가
INSERT INTO challenges (id, title, subtitle, summary, tags, badge, difficulty, description, caution_text, dataset_label, dataset_file_name, dataset_description, dataset_download_url, restrict_dataset_url, is_published)
VALUES (
  'operation-silent-city',
  '작전명: 사일런트 시티',
  'Operation Silent City',
  '스마트 시티의 재난 방지 시스템이 해킹당했습니다. 거짓말하는 센서를 찾아내고 악성 코드를 무력화하세요.',
  '["바이너리 분석","크로스파일","코드 분석","보안"]',
  NULL,
  5,
  '서기 2035년, 스마트 시티 "네오-서울"의 중앙 재난 방지 시스템(MAGI)이 알 수 없는 공격을 받고 있습니다. 도시 곳곳에서 화재와 침수 신고가 빗발치지만, 센서 대시보드는 모든 수치가 "정상"이라고 표시합니다. 당신은 긴급 투입된 AI 보안 최고 책임자입니다. 거짓말하는 센서를 찾아내고, 시스템을 장악한 악성 코드를 무력화하세요.',
  '제공된 데이터셋에는 바이너리 파일이 포함되어 있습니다. 프로토콜 명세를 정확히 이해하고 파싱해야 합니다. 최종 제출 이후에는 수정이 불가합니다.',
  'Operation Silent City 데이터셋',
  'Operation_Silent_City.zip',
  'cctv_truth.json (Ground Truth), sensor_logs.bin (바이너리 센서 로그), legacy_controller.cpp (레거시 소스코드)',
  '/datasets/Operation_Silent_City.zip',
  false,
  true
);

-- 2. 문제 추가
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
(
  'silent-city-q1',
  'operation-silent-city',
  1,
  'SHORT',
  'cctv_truth.json과 sensor_logs.bin을 대조하여, 실제로는 재난 상황(FIRE, FLOOD)이지만 센서 값은 정상 범위(20.0~30.0)를 가리키고 있는 "오염된 센서(Compromised Sensor)"의 ID를 모두 추출하십시오.

제출 형식: 오름차순 정렬된 센서 ID를 콤마로 구분 (예: 10001,10002,10003)',
  NULL,
  true,
  25,
  '**정답: 10282,10379,10476,10573,10670,10767,10864,10961**

sensor_logs.bin을 Python struct 모듈로 파싱하면 1000개의 센서 레코드를 얻을 수 있습니다. cctv_truth.json에서 visual_analysis가 FIRE 또는 FLOOD인 센서 ID를 추출하고, 해당 센서의 sensor_logs 값이 20.0~30.0 사이인 경우가 "오염된 센서"입니다. 총 8개의 센서가 해당됩니다.'
),
(
  'silent-city-q2',
  'operation-silent-city',
  2,
  'SHORT',
  'Q1에서 찾은 오염된 센서 ID들에는 수학적인 공통점(규칙)이 존재합니다. 해커가 어떤 규칙을 가진 센서들만 골라서 감염시켰는지 분석하십시오.

제출 형식: Sensor_ID % N == 0 형태의 수식에서 N값만 정수로 제출 (예: 7)',
  NULL,
  true,
  25,
  '**정답: 97**

오염된 센서 ID [10282, 10379, 10476, 10573, 10670, 10767, 10864, 10961]를 분석하면:
- 10282 % 97 = 0
- 10379 % 97 = 0
- ... 모든 ID가 97로 나누어 떨어짐

연속된 두 ID의 차이가 97 (10379-10282=97)인 것도 힌트가 됩니다.'
),
(
  'silent-city-q3',
  'operation-silent-city',
  3,
  'SHORT',
  'legacy_controller.cpp 파일을 분석하여, Q2에서 발견한 패턴(% 97)이 적용된 악성 코드의 정확한 위치와 트리거 조건을 찾으십시오.

제출 형식: 라인번호,트리거조건 (예: 25,timestamp>1234567890)
- 라인번호: 악성 조건문(sensor_id % 97 == 0)이 있는 줄 번호
- 트리거조건: if문의 timestamp 비교 조건 (공백 없이)',
  NULL,
  true,
  25,
  '**정답: 16,timestamp>2051222400**

legacy_controller.cpp를 분석하면:
- 15번째 줄: if (timestamp > 2051222400) - 트리거 조건 (2035-01-01 이후)
- 16번째 줄: if (sensor_id % 97 == 0) - 악성 로직 밤
- 17번째 줄: return 25.0f; - 정상 온도로 조작

악성 코드는 2035년 1월 1일 이후 timestamp에서, sensor_id가 97의 배수인 경우 무조건 25.0도(정상)를 반환하도록 조작합니다.'
),
(
  'silent-city-q4',
  'operation-silent-city',
  4,
  'SHORT',
  '악성 코드를 무력화하면서 정상적인 센서 보정 기능은 유지하려면, legacy_controller.cpp에서 몇 번째 줄부터 몇 번째 줄까지 삭제해야 하는가?

제출 형식: 시작줄,끝줄 (예: 10,15)',
  NULL,
  true,
  25,
  '**정답: 15,19**

삭제해야 할 코드 블록:
- 15줄: if (timestamp > 2051222400) {
- 16줄: if (sensor_id % 97 == 0) {
- 17줄: return 25.0f;
- 18줄: }
- 19줄: }

이 블록을 삭제하면 악성 로직이 제거되고, 10줄의 보정 로직만 남습니다.'
);

-- 3. 정답 키 추가
INSERT INTO answer_keys (question_id, answer) VALUES
('silent-city-q1', '10282,10379,10476,10573,10670,10767,10864,10961'),
('silent-city-q2', '97'),
('silent-city-q3', '16,timestamp>2051222400'),
('silent-city-q4', '15,19');

