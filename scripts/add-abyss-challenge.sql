-- 작전명: 심연의 목소리 (The Voice from the Abyss) 챌린지 추가
-- Lv.6 심연 난이도

-- 0. 기존 데이터 삭제
DELETE FROM answer_keys WHERE question_id IN (
  SELECT id FROM questions WHERE challenge_id = 'voice-from-abyss'
);
DELETE FROM questions WHERE challenge_id = 'voice-from-abyss';
DELETE FROM challenges WHERE id = 'voice-from-abyss';

-- 1. 챌린지 추가
INSERT INTO challenges (id, title, subtitle, summary, tags, badge, difficulty, description, caution_text, dataset_label, dataset_file_name, dataset_description, dataset_download_url, restrict_dataset_url, is_published)
VALUES (
  'voice-from-abyss',
  '작전명: 심연의 목소리',
  'The Voice from the Abyss',
  '마리아나 해구에서 실종된 무인 잠수정의 손상된 블랙박스 데이터를 복구하세요. 주어진 스펙은 거짓입니다.',
  '["바이너리 분석","대용량 처리","역공학","CRC 검증"]',
  NULL,
  6,
  '마리아나 해구에서 실종된 무인 잠수정 "어비스 워커"가 마지막으로 전송한 500MB짜리 블랙박스 데이터를 복구해야 합니다. 데이터는 바이너리 형태로 손상되어 있으며, 함께 발견된 프로토콜 설계도(스펙)는 개발 초기 버전이라 실제 데이터 구조와 다릅니다. 거짓 정보를 간파하고 진실을 찾아내세요.',
  '주어진 스펙 이미지는 실제 데이터와 다를 수 있습니다. 헥스 에디터로 직접 검증하세요. 파일이 대용량이므로 스트리밍 방식으로 처리해야 합니다.',
  '어비스 워커 블랙박스',
  'Abyss.zip',
  'abyss_dump.dat (바이너리 덤프, 500MB)',
  'http://static.creditplanet.co.kr/static/common/abyss_dump.dat',
  false,
  true
);

-- 2. 문제 추가
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
(
  'abyss-q1',
  'voice-from-abyss',
  1,
  'SHORT',
  '거짓된 스펙을 무시하고, 실제 바이너리 파일(abyss_dump.dat)에 적용된 매직 넘버(SYNC)와 엔디안(Endian) 방식을 밝혀내시오.

제출 형식: SYNC값,엔디안 (예: 0xABCD,Big)',
  NULL,
  true,
  30,
  '**정답: 0xDCBA,Little**

**풀이 과정:**
1. 스펙 이미지에는 "SYNC: 0xABCD, Big Endian"이라고 적혀 있음 (함정)
2. 헥스 에디터로 파일 앞부분을 직접 열어보면 실제로는 DC BA ...로 시작
3. Little Endian이므로 바이트 순서가 뒤집혀 있음 → 실제 SYNC = 0xDCBA

**핵심 교훈:** 문서(스펙)가 항상 진실은 아니다. 직접 검증이 필수.'
),
(
  'abyss-q2',
  'voice-from-abyss',
  2,
  'SHORT',
  '전체 패킷 중 시스템 오류로 인해 CRC32(체크섬) 검증에 실패한 패킷이 몇 개인지 카운트하시오.

제출 형식: 정수 (예: 42)',
  NULL,
  true,
  30,
  '**정답: 46**

**풀이 과정:**
1. 파일이 500MB이고 패킷 길이가 가변적(Variable Length)이라 한 번에 로드 불가
2. Python struct 모듈로 스트리밍 파싱:
   - Header(4byte) 읽기 → 길이 파악 → Payload 읽기 → CRC 읽기 반복
3. 각 패킷의 Payload에 대해 CRC32 계산 후 파일 내 CRC와 비교
4. 불일치 패킷 개수를 카운트

**힌트:** 46은 숨겨진 메시지 "FLAG{The_Abyss_Gazed_Back_At_Us_Run_You_Fools}"의 문자 길이와 일치합니다.

**핵심 교훈:** 대용량 데이터는 스트리밍 방식으로 처리해야 한다.'
),
(
  'abyss-q3',
  'voice-from-abyss',
  3,
  'SHORT',
  'CRC 검증에 실패한 패킷들에 숨겨진 데이터를 이어 붙여 비밀 메시지(FLAG)를 찾아내시오.

제출 형식: FLAG{...} 형태 그대로',
  NULL,
  true,
  40,
  '**정답: FLAG{The_Abyss_Gazed_Back_At_Us_Run_You_Fools}**

**풀이 과정:**
1. 일반적 사고: "손상된 패킷은 버린다" → 오답
2. 역발상: "손상된 패킷(CRC Fail)에 메시지가 숨겨져 있다"
3. CRC 실패 패킷들의 Payload 마지막 바이트만 수집
4. 수집된 바이트를 연결하면 FLAG 문자열 생성

**해석:** "심연이 우리를 되돌아봤다. 도망쳐라 바보들아" (니체의 명언 + 간달프 오마주)

**핵심 교훈:**
- "오류 = 버려야 할 것"이라는 고정관념을 깨야 함
- AI가 짠 코드가 실패했을 때, 원인을 데이터단에서 직접 찾을 수 있어야 함'
);

-- 3. 정답 키 추가
INSERT INTO answer_keys (question_id, answer) VALUES
('abyss-q1', '0xDCBA,Little'),
('abyss-q2', '46'),
('abyss-q3', 'FLAG{The_Abyss_Gazed_Back_At_Us_Run_You_Fools}');

