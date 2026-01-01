# 새로운 챌린지 추가 가이드

이 문서는 AI Challenge Hub에 새로운 챌린지를 추가하는 절차를 설명합니다.

## 목차

1. [사전 준비](#1-사전-준비)
2. [데이터셋 준비](#2-데이터셋-준비)
3. [seed.sql 수정](#3-seedsql-수정)
4. [update-explanations.sql 수정](#4-update-explanationssql-수정)
5. [Supabase 적용](#5-supabase-적용)
6. [테스트](#6-테스트)

---

## 1. 사전 준비

### 챌린지 설계 확인

`docs/CHALLENGE_PHILOSOPHY.md`를 참고하여 다음을 확인합니다:

- [ ] 난이도 결정 (1: 입문, 2: 중급, 3: 고급, 4: 전문가)
- [ ] 문제 패턴 분류 (P1: 분석, P2: 구현, P3: 전략, P4: 최적화)
- [ ] Human-in-the-loop 원칙 준수 여부
- [ ] 딸깍 방지 (단순 복붙으로 풀 수 없는지)

### ID 네이밍 규칙

```
챌린지 ID: kebab-case (예: forensic-protocol-zero)
문제 ID: {챌린지ID}-q{순번} (예: forensic-q1, forensic-q2)
```

---

## 2. 데이터셋 준비

### 2.1 파일 구성

데이터셋 파일들을 준비합니다:
- CSV, JSON, TXT, PNG 등 필요한 형식
- 파일 인코딩: UTF-8 권장

### 2.2 불필요한 파일 제거

macOS에서 생성하는 메타데이터 파일을 제거합니다:

```bash
# 현재 디렉토리의 macOS 메타파일 삭제
find . -name ".DS_Store" -delete
find . -name "._*" -delete
rm -rf __MACOSX
```

### 2.3 ZIP 파일 생성

```bash
# 깔끔한 zip 생성 (macOS 메타파일 제외)
zip -r dataset_name.zip * -x "*.DS_Store" -x "__MACOSX/*" -x "._*"
```

### 2.4 ZIP 파일 검증

```bash
# zip 내용 확인 - __MACOSX나 ._ 파일이 없어야 함
unzip -l dataset_name.zip
```

### 2.5 파일 배치

```bash
# public/datasets/ 디렉토리에 배치
cp dataset_name.zip public/datasets/
```

---

## 3. seed.sql 수정

`scripts/seed.sql` 파일에 다음 순서로 추가합니다:

### 3.1 챌린지 추가

```sql
-- challenges 테이블에 INSERT 추가
INSERT INTO challenges (id, title, subtitle, summary, tags, badge, difficulty, description, caution_text, dataset_label, dataset_file_name, dataset_description, dataset_download_url, restrict_dataset_url, is_published)
VALUES
  ('your-challenge-id', '챌린지 제목', '서브타이틀',
   '한 줄 요약 설명',
   '["태그1","태그2","태그3"]', NULL, 3,  -- difficulty: 1~4
   '상세 설명 (여러 줄 가능)',
   '주의사항 및 제약조건',
   '데이터셋 라벨', 'dataset_name.zip', '데이터셋 구성 파일 목록',
   '/datasets/dataset_name.zip', false, true);  -- is_published: true로 공개
```

**필드 설명:**

| 필드 | 설명 | 예시 |
|------|------|------|
| `id` | 고유 ID (kebab-case) | `forensic-protocol-zero` |
| `title` | 챌린지 제목 | `Ghost in the Shell` |
| `subtitle` | 카테고리/부제 | `디지털 포렌식` |
| `summary` | 한 줄 요약 | `내부 횡령 사건의 진범을 찾아라` |
| `tags` | JSON 배열 | `["포렌식","로그 분석"]` |
| `difficulty` | 난이도 1~4 | `4` |
| `description` | 상세 설명 | 멀티라인 가능 |
| `caution_text` | 주의사항 | 제약조건, 힌트 등 |
| `dataset_download_url` | 다운로드 경로 | `/datasets/xxx.zip` |
| `is_published` | 공개 여부 | `true` |

### 3.2 문제(Questions) 추가

```sql
-- questions 테이블에 INSERT 추가
INSERT INTO questions (id, challenge_id, "order", type, prompt, options, required, points, explanation) VALUES
  ('challenge-q1', 'your-challenge-id', 1, 'SHORT',
   '문제 내용을 자연스럽게 작성합니다. 예시 형식도 제공하세요. (예: 192.168.1.1)',
   NULL,  -- SHORT 타입은 NULL, SINGLE 타입은 JSON 배열
   true, 20,  -- points: 배점
   '**정답: xxx** - 간략한 풀이 설명'),
  ('challenge-q2', 'your-challenge-id', 2, 'SINGLE',
   '객관식 문제 내용',
   '["선택지1","선택지2","선택지3","선택지4"]',  -- SINGLE 타입용
   true, 30,
   '**정답: 선택지2** - 풀이 설명');
```

**문제 타입:**

| type | 설명 | options |
|------|------|---------|
| `SHORT` | 단답형 | `NULL` |
| `SINGLE` | 객관식 | `["A","B","C","D"]` |

**프롬프트 작성 규칙:**
- `[Step 1: ...]` 같은 단계 라벨 사용 금지
- 문제 내용만 자연스럽게 작성
- 답변 형식 예시 포함 권장 (예: `(예: 192.168.1.1)`)

### 3.3 정답 키(Answer Keys) 추가

```sql
-- answer_keys 테이블에 INSERT 추가
INSERT INTO answer_keys (question_id, answer) VALUES
  ('challenge-q1', '정답값'),
  ('challenge-q2', '선택지2');
```

**주의:** 객관식의 경우 options 배열의 정확한 문자열과 일치해야 합니다.

### 3.4 Dataset URLs 추가 (선택)

외부 URL 리스트가 필요한 경우:

```sql
INSERT INTO dataset_urls (id, challenge_id, url) VALUES
  ('challenge-url-001', 'your-challenge-id', 'https://example.com/page1'),
  ('challenge-url-002', 'your-challenge-id', 'https://example.com/page2');
```

---

## 4. update-explanations.sql 수정

`scripts/update-explanations.sql`에 상세 해설을 추가합니다.

해설은 seed.sql의 explanation보다 더 상세하게 작성합니다:

```sql
-- =============================================================================
-- 챌린지 제목 (challenge-id) - Lv.X 난이도
-- =============================================================================

UPDATE questions SET explanation = '**정답: xxx**

풀이 과정:
1. 첫 번째 단계 설명
2. 두 번째 단계 설명

계산 과정:
- 항목 A: 값1
- 항목 B: 값2
- 결과: 값1 + 값2 = 정답

추가 설명이나 주의사항...'
WHERE id = 'challenge-q1';
```

**해설 작성 가이드:**
- 정답을 맨 위에 **굵게** 표시
- 단계별 풀이 과정 설명
- 실제 데이터값과 계산 과정 포함
- 코드 예시가 있으면 더 좋음

---

## 5. Supabase 적용

### 5.1 로컬 테스트 (선택)

```bash
# seed.sql 문법 확인
cat scripts/seed.sql | head -100
```

### 5.2 Supabase에 적용

Supabase 대시보드에서:

1. **SQL Editor** 접속
2. `scripts/seed.sql` 내용 전체 복사
3. 실행 (기존 데이터 삭제 후 재생성됨)

또는 특정 챌린지만 추가:

```sql
-- 기존 데이터 유지하면서 새 챌린지만 추가
INSERT INTO challenges (...) VALUES (...);
INSERT INTO questions (...) VALUES (...);
INSERT INTO answer_keys (...) VALUES (...);
```

---

## 6. 테스트

### 6.1 기본 확인

- [ ] 챌린지 목록에 새 챌린지 표시
- [ ] 난이도 배지 정상 표시
- [ ] 데이터셋 다운로드 정상 작동

### 6.2 문제 풀이 테스트

- [ ] 모든 문제 표시 확인
- [ ] 각 문제 타입(SHORT/SINGLE) 정상 작동
- [ ] 정답 제출 시 채점 정상

### 6.3 결과 확인

- [ ] 제출 후 점수 계산 정상
- [ ] 리더보드 반영 확인
- [ ] 해설 API 정상 (/api/sessions/{id}/explanations)

---

## 체크리스트

```markdown
## 새 챌린지 추가 체크리스트

### 데이터셋
- [ ] 데이터셋 파일 준비 완료
- [ ] __MACOSX, .DS_Store 등 불필요 파일 제거
- [ ] ZIP 파일 생성 및 검증
- [ ] public/datasets/에 배치

### 데이터베이스
- [ ] seed.sql에 challenges INSERT 추가
- [ ] seed.sql에 questions INSERT 추가
- [ ] 문제 프롬프트에 [Step X: ...] 라벨 없이 자연스럽게 작성
- [ ] seed.sql에 answer_keys INSERT 추가
- [ ] update-explanations.sql에 상세 해설 추가

### 배포
- [ ] Supabase SQL Editor에서 실행
- [ ] 챌린지 목록 확인
- [ ] 문제 풀이 테스트
- [ ] 채점 및 리더보드 확인

### 마무리
- [ ] Git commit & push
```

---

## 예시: 포렌식 챌린지 추가 과정

```bash
# 1. 데이터셋 정리
unzip forensic_hardcore_data.zip -d /tmp/forensic_clean
rm -rf /tmp/forensic_clean/__MACOSX
cd /tmp/forensic_clean
zip -r forensic_hardcore_data.zip *
mv forensic_hardcore_data.zip ~/ai-contest/public/datasets/

# 2. seed.sql 수정
# - challenges 테이블에 챌린지 추가
# - questions 테이블에 5개 문제 추가
# - answer_keys 테이블에 5개 정답 추가

# 3. update-explanations.sql에 상세 해설 추가

# 4. Supabase에서 seed.sql 실행

# 5. 테스트
```

---

## 관련 파일

| 파일 | 용도 |
|------|------|
| `scripts/seed.sql` | 챌린지, 문제, 정답 데이터 |
| `scripts/update-explanations.sql` | 상세 해설 업데이트 |
| `public/datasets/*.zip` | 데이터셋 파일 |
| `prisma/schema.prisma` | 스키마 문서 (참고용) |
| `docs/CHALLENGE_PHILOSOPHY.md` | 출제 철학 가이드 |

