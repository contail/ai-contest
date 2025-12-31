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
    scoringSummary: "총점: 5점",
    scoringItems: [
      "문항당 1점(총 5문항).",
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
        id: "q1",
        order: 1,
        type: "single",
        prompt: "“띵동! 매주 수요일에 찾아오는 행복, 해피아워로”에 해당하는 URL은 무엇인가요?",
        options: [
          "https://blog.pfct.co.kr/happyhour",
          "https://blog.pfct.co.kr/good-time-with-good-people-1",
          "https://blog.pfct.co.kr/2024-year-end-party",
          "https://blog.pfct.co.kr/flexing-year-end",
        ],
        required: true,
      },
      {
        id: "q2",
        order: 2,
        type: "short",
        prompt:
          "전체 URL 문자열에서 “예약투자”는 몇 회 등장하나요? (없으면 0 입력)",
        required: true,
      },
      {
        id: "q3",
        order: 3,
        type: "single",
        prompt: "전체 URL 문자열에서 “대출”은 몇 회 등장하나요?",
        options: [
          "2회",
          "3회",
          "4회",
          "5회",
        ],
        required: true,
      },
      {
        id: "q4",
        order: 4,
        type: "short",
        prompt:
          "하이픈('-')이 4개 이상 포함된 URL은 몇 개인가요? (숫자만 입력)",
        required: true,
      },
      {
        id: "q5",
        order: 5,
        type: "short",
        prompt:
          "도메인을 제외한 slug 기준, 가장 긴 slug의 길이는 몇 자인가요? (숫자만 입력)",
        required: true,
      },
    ],
  },
  {
    id: "pfct-ocr",
    title: "스파이의 요리코드",
    subtitle: "PFCT Contest",
    summary:
      "암호화된 레시피 데이터를 해독하고 숨겨진 수치를 복원하는 분석 과제.",
    tags: ["추론", "복호화", "텍스트"],
    badge: "N",
    heroCopy: "요리코드 해석 과정을 문서화하세요",
    description:
      "암호화된 요리코드를 해석하여 각 재료의 수치를 복원하는 과제입니다. 제공된 가이드를 참고해 일관된 값을 추론하세요.",
    cautionText:
      "응답은 제공된 파일과 가이드 범위에서만 추론되어야 합니다.",
    datasetLabel: "요리코드 12건",
    datasetFileName: "cook_code_set.txt",
    datasetDescription: "암호화된 요리코드 목록",
    questions: [
      {
        id: "q1",
        order: 1,
        type: "single",
        prompt: "1번 요리코드의 출력값 조합을 고르세요.",
        options: ["3, 89, 6 Kcal", "6, 78, 14 Kcal", "9, 83, 12 Kcal"],
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
