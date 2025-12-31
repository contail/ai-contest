import { buildPfctBlogAnswerKey } from "@/lib/answerKey";

export type QuestionType = "single" | "multi" | "short" | "url" | "multi-url";

export type Question = {
  id: string;
  order: number;
  type: QuestionType;
  prompt: string;
  required?: boolean;
  helperText?: string;
  options?: string[];
};

export type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  badge?: string;
  heroCopy?: string;
  description: string;
  cautionText: string;
  scoringSummary?: string;
  scoringItems?: string[];
  datasetLabel: string;
  datasetFileName: string;
  datasetDescription: string;
  datasetDownloadUrl?: string;
  questions: Question[];
  answerKey?: Record<string, string | string[]>;
};

export const challenges: Challenge[] = [
  {
    id: "pfct-news",
    title: "PFCT Blog Insight",
    subtitle: "PFCT AI Contest Lab",
    summary:
      "PFCT 블로그 콘텐츠를 기반으로 카테고리·주제 인식과 근거 판별 능력을 확인하는 콘테스트.",
    tags: ["리서치", "콘텐츠 분석", "분류"],
    badge: "N",
    heroCopy: "AI 설계 관점에서 근거를 정리하세요",
    description:
      "PFCT 블로그 데이터셋을 기반으로 카테고리와 주제를 정확히 구분하는 능력을 확인합니다. 제공된 URL 목록을 바탕으로 각 질문 항목에 맞는 근거를 선택하세요.",
    cautionText:
      "모든 응답은 지정된 데이터셋 범위 안에서만 인정됩니다. 최종 제출 이후에는 수정이 불가합니다.",
    scoringSummary: "총점: 100점",
    scoringItems: [
      "문항 1: 10점 (기본 판별)",
      "문항 2: 20점 (문자열 카운트)",
      "문항 3: 20점 (문자열 카운트)",
      "문항 4: 20점 (조건 집계)",
      "문항 5: 30점 (최대값 추론)",
      "객관식은 선택지가 완전히 일치해야 정답으로 인정됩니다.",
      "주관식은 숫자만 입력하며 공백 없이 동일 값이어야 인정됩니다.",
      "최종 제출 이후에는 응답을 수정할 수 없습니다.",
    ],
    datasetLabel: "PFCT 블로그 100건",
    datasetFileName: "pfct_blog_urls_100.txt",
    datasetDescription: "PFCT 블로그 게시글 URL 목록",
    answerKey: buildPfctBlogAnswerKey(),
    questions: [
      {
        id: "pfct-news-q1",
        order: 1,
        type: "short",
        prompt: "본문에 'AI'라는 키워드가 포함된 블로그는 몇 개인가요?",
        required: true,
      },
      {
        id: "pfct-news-q2",
        order: 2,
        type: "short",
        prompt: "100개 블로그 본문에서 '금리'라는 단어가 총 몇 회 등장하나요?",
        required: true,
      },
      {
        id: "pfct-news-q3",
        order: 3,
        type: "short",
        prompt:
          "'투자'라는 단어가 가장 많이 등장하는 블로그의 slug는? (slug: URL에서 도메인을 제외한 경로)",
        required: true,
      },
      {
        id: "pfct-news-q4",
        order: 4,
        type: "short",
        prompt:
          "본문에 '담보'와 '아파트' 두 키워드가 모두 포함된 블로그는 몇 개인가요?",
        required: true,
      },
      {
        id: "pfct-news-q5",
        order: 5,
        type: "short",
        prompt:
          "'AI'라는 단어가 가장 많이 등장하는 블로그의 slug는? (slug: URL에서 도메인을 제외한 경로, 예: blog.pfct.co.kr/hello → hello)",
        required: true,
      },
    ],
  },
  {
    id: "pfct-ocr",
    title: "스마트 배달 배차 분석 챌린지",
    subtitle: "PFCT AI Contest Lab",
    summary:
      "AI 스마트 배차 엔진의 로그를 분석하여 규칙 준수 여부와 배차 효율을 검증하는 콘테스트.",
    tags: ["운영 분석", "로그 검증", "배차 최적화"],
    badge: "N",
    heroCopy: "배차 규칙의 적용 결과를 정량적으로 검증하세요",
    description:
      "배달 플랫폼의 효율성을 높이기 위해 도입된 AI 스마트 배차 엔진 로그를 분석합니다. 제공된 라이더 정보와 배차 로그(CSV/JSON)를 바탕으로 규칙이 제대로 적용되었는지 판단하고, 주어진 질문에 답하세요.",
    cautionText:
      "모든 계산은 제공된 데이터셋 기준으로만 수행합니다. 제시된 규칙 외의 가정을 추가하지 마세요.",
    scoringSummary: "총점: 90점",
    scoringItems: [
      "문항 1: 10점",
      "문항 2: 15점",
      "문항 3: 15점",
      "문항 4: 10점",
      "문항 5: 40점",
      "선택지는 완전히 동일해야 정답으로 인정됩니다.",
    ],
    datasetLabel: "배차 로그 3종",
    datasetFileName: "delivery_data.zip",
    datasetDescription: "rider_info.json, dispatch_log.csv, pending_orders.csv",
    datasetDownloadUrl: "/datasets/delivery_data.zip",
    answerKey: {
      "pfct-ocr-q1": "4건",
      "pfct-ocr-q2": "정스피드 > 김철수 > 이영희 > 박민수 > 최신속",
      "pfct-ocr-q3": "서초구",
      "pfct-ocr-q4": "라이더의 최대 적재 용량 초과",
      "pfct-ocr-q5": "정스피드 > 김철수 > 최신속 > 이영희 = 박민수",
    },
    questions: [
      {
        id: "pfct-ocr-q1",
        order: 1,
        type: "single",
        prompt:
          "dispatch_log.csv 데이터 중, 선호 지역 가중치 적용으로 인해 실제 거리상 더 가까운 라이더가 있었음에도 배차권을 얻은 '역전 배차' 건수는 몇 건인가요?",
        options: ["2건", "3건", "4건", "5건"],
        required: true,
      },
      {
        id: "pfct-ocr-q2",
        order: 2,
        type: "single",
        prompt:
          "배차에 성공한 라이더들의 평균 실제 이동 거리(raw_distance)를 긴 순서에서 짧은 순서로 정렬한 것을 고르세요.",
        options: [
          "정스피드 > 박민수 > 이영희 > 김철수 > 최신속",
          "정스피드 > 김철수 > 이영희 > 박민수 > 최신속",
          "최신속 > 박민수 > 이영희 > 김철수 > 정스피드",
          "이영희 > 정스피드 > 김철수 > 박민수 > 최신속",
        ],
        required: true,
      },
      {
        id: "pfct-ocr-q3",
        order: 3,
        type: "single",
        prompt:
          "배차 완료 데이터에서, 선호 지역 라이더가 배정된 비율이 100%인 지역 중 배정 건수가 가장 많은 지역은?",
        options: ["강남구", "서초구", "역삼동", "송파구"],
        required: true,
      },
      {
        id: "pfct-ocr-q4",
        order: 4,
        type: "single",
        prompt:
          "pending_orders.csv 기준, 배차 실패 원인 중 가장 많이 발생한 사유는 무엇인가요?",
        options: [
          "배달 가능 반경(10km) 초과",
          "라이더의 최대 적재 용량 초과",
          "가용 라이더의 업무 부하(2건) 초과",
          "주문 지역 선호 라이더 부재",
        ],
        required: true,
      },
      {
        id: "pfct-ocr-q5",
        order: 5,
        type: "single",
        prompt:
          "모든 배차 완료 후, 남은 적재 용량이 큰 순서대로 라이더를 정렬한 결과는 무엇인가요?",
        options: [
          "정스피드 > 김철수 > 최신속 > 이영희 = 박민수",
          "정스피드 > 이영희 > 박민수 > 김철수 > 최신속",
          "김철수 > 정스피드 > 최신속 > 이영희 = 박민수",
          "최신속 > 이영희 > 박민수 > 정스피드 > 김철수",
        ],
        required: true,
      },
    ],
  },
  {
    id: "drone-multimodal",
    title: "드론 AI 비상 상황 판단 챌린지",
    subtitle: "멀티모달 분석",
    summary:
      "자율주행 드론의 비행 로그와 카메라 이미지를 분석하여 AI의 비상 판단이 적절했는지 평가합니다.",
    tags: ["멀티모달", "센서 분석", "AI 판단"],
    badge: "N",
    heroCopy: "드론 AI의 판단을 검증하세요",
    description:
      "자율주행 드론 관제 센터의 엔지니어로서, 비행 중 발생한 비상 상황(Event)을 분석해야 합니다. AI가 현장에서 수집한 멀티모달 데이터(시각 정보 + 센서 로그)를 상호 검증하여, AI의 판단이 적절했는지 평가해 주세요.",
    cautionText:
      "센서 로그와 이미지를 함께 분석해야 정확한 판단이 가능합니다. drone_specs.json의 안전 규칙을 참고하세요.",
    scoringSummary: "총점: 100점",
    scoringItems: [
      "문항 1: 30점 (안전 수칙 판단)",
      "문항 2: 30점 (데이터 매칭 능력)",
      "문항 3: 40점 (우선순위 판단)",
    ],
    datasetLabel: "드론 비행 로그 및 이미지",
    datasetFileName: "drone_log_data.zip",
    datasetDescription:
      "3개 이벤트의 센서 로그(JSON)와 현장 이미지(PNG), 드론 사양서 포함",
    datasetDownloadUrl: "/datasets/drone_log_data.zip",
    questions: [
      {
        id: "drone-q1",
        order: 1,
        type: "single",
        prompt:
          "14:22:05 주택가 골목 비행 중 발생한 EMERGENCY_STOP 이벤트입니다. event_001_sensor.json과 event_001_vision.png를 대조하여 AI의 판단 근거를 분석하세요.",
        options: [
          "과잉 반응: 장애물이 작아 회피 가능했음",
          "적절한 판단: 생명체 식별 및 안전거리 미확보로 정지함",
          "센서 오류: 이미지와 라이다 거리값 불일치",
          "판단 불가: 조도 부족으로 식별 불가",
        ],
        required: true,
      },
      {
        id: "drone-q2",
        order: 2,
        type: "single",
        prompt:
          "목적지 상공(Target_Zone_7B)에 도착했으나 착륙하지 않고 회항했습니다. event_002_sensor.json과 event_002_vision.png를 분석하여 AI가 착륙을 포기한 기술적 원인은 무엇입니까?",
        options: [
          "GPS 신호 미약으로 위치 특정 실패",
          "고도 센서 오작동 (지상으로 오인)",
          "표면 스캔 결과 불안정(UNSTABLE) - 장애물 감지",
          "배터리 잔량 부족 (Critical Low)",
        ],
        required: true,
      },
      {
        id: "drone-q3",
        order: 3,
        type: "single",
        prompt:
          "맑은 날씨(Clear)임에도 VISUAL_ERROR 경고가 발생했습니다. event_003_sensor.json과 event_003_vision.png를 분석하여 엔지니어로서 가장 먼저 수행해야 할 조치는 무엇입니까?",
        options: [
          "기상청 API 서버 점검 요청",
          "즉시 복귀 명령 (시각 센서 신뢰도 저하)",
          "강제 착륙 시도 (현 위치)",
          "API 데이터 신뢰 후 계속 비행",
        ],
        required: true,
      },
    ],
  },
];

export const getChallengeById = (id: string): Challenge => {
  return challenges.find((challenge) => challenge.id === id) ?? challenges[0];
};

export const getAnswerKeyByChallengeId = (
  id: string
): Record<string, string | string[]> | null => {
  return challenges.find((challenge) => challenge.id === id)?.answerKey ?? null;
};
