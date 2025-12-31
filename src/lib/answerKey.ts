import { pfctBlogData } from "@/lib/pfctBlogData";

type AnswerKey = Record<string, string | string[]>;

export const buildPfctBlogAnswerKey = (): AnswerKey => {
  // Q1: "AI" 포함된 블로그 수
  const aiCount = pfctBlogData.filter((d) => d.bodyText?.includes("AI")).length;

  // Q2: "금리" 총 등장 횟수
  let interestTotal = 0;
  pfctBlogData.forEach((d) => {
    if (d.bodyText) {
      const matches = d.bodyText.match(/금리/g);
      interestTotal += matches?.length || 0;
    }
  });

  // Q3: "투자" 최다 언급 글의 slug
  let maxInvest = { slug: "", count: 0 };
  pfctBlogData.forEach((d) => {
    const matches = d.bodyText?.match(/투자/g);
    const count = matches?.length || 0;
    if (count > maxInvest.count) {
      maxInvest = { slug: d.slug, count };
    }
  });

  // Q4: "담보"와 "아파트" 모두 포함된 블로그 수
  const mortgageAptCount = pfctBlogData.filter(
    (d) => d.bodyText?.includes("담보") && d.bodyText?.includes("아파트")
  ).length;

  // Q5: "AI" 최다 언급 글의 slug
  let maxAI = { slug: "", count: 0 };
  pfctBlogData.forEach((d) => {
    const matches = d.bodyText?.match(/AI/g);
    const count = matches?.length || 0;
    if (count > maxAI.count) {
      maxAI = { slug: d.slug, count };
    }
  });

  return {
    "pfct-news-q1": String(aiCount),
    "pfct-news-q2": String(interestTotal),
    "pfct-news-q3": maxInvest.slug,
    "pfct-news-q4": String(mortgageAptCount),
    "pfct-news-q5": maxAI.slug,
  };
};
