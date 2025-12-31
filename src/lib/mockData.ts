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
        type: "single",
        prompt:
          "URL slug에서 하이픈(-)으로 구분된 영단어 중, 가장 많이 등장하는 단어는?",
        options: ["loan", "credit", "to", "peoplefund"],
        required: true,
      },
      {
        id: "pfct-news-q2",
        order: 2,
        type: "short",
        prompt:
          "100개 블로그 본문에서 '피플펀드'라는 단어가 총 몇 회 등장하나요? (숫자만 입력, 크롤링 필요)",
        required: true,
      },
      {
        id: "pfct-news-q3",
        order: 3,
        type: "short",
        prompt:
          "100개 블로그 중 본문에 '머신러닝' 또는 '딥러닝'이 언급된 글은 몇 개인가요? (숫자만 입력, 크롤링 필요)",
        required: true,
      },
      {
        id: "pfct-news-q4",
        order: 4,
        type: "short",
        prompt:
          "100개 블로그 중 본문 길이가 1000자 미만인 글은 몇 개인가요? (숫자만 입력, 크롤링 필요)",
        required: true,
      },
      {
        id: "pfct-news-q5",
        order: 5,
        type: "short",
        prompt:
          "100개 블로그 중 본문에 '2024년'이라는 문구가 포함된 글은 몇 개인가요? (숫자만 입력, 크롤링 필요)",
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
      q1: "4건",
      q2: "정스피드 > 김철수 > 이영희 > 박민수 > 최신속",
      q3: "서초구",
      q4: "라이더의 최대 적재 용량 초과",
      q5: "정스피드 > 김철수 > 최신속 > 이영희 = 박민수",
    },
    questions: [
      {
        id: "q1",
        order: 1,
        type: "single",
        prompt:
          "dispatch_log.csv 데이터 중, 선호 지역 가중치 적용으로 인해 실제 거리상 더 가까운 라이더가 있었음에도 배차권을 얻은 ‘역전 배차’ 건수는 몇 건인가요?",
        options: ["2건", "3건", "4건", "5건"],
        required: true,
      },
      {
        id: "q2",
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
        id: "q3",
        order: 3,
        type: "single",
        prompt:
          "배차 완료 데이터에서, 선호 지역 라이더가 배정된 비율이 가장 높은 지역은 어디인가요?",
        options: ["강남구", "서초구", "역삼동", "송파구"],
        required: true,
      },
      {
        id: "q4",
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
        id: "q5",
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
];

export const getChallengeById = (id: string): Challenge => {
  return challenges.find((challenge) => challenge.id === id) ?? challenges[0];
};

export const getAnswerKeyByChallengeId = (
  id: string
): Record<string, string | string[]> | null => {
  return challenges.find((challenge) => challenge.id === id)?.answerKey ?? null;
};
