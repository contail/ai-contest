import { pfctBlogUrls } from "@/lib/pfctBlogUrls";
import { pfctBlogData } from "@/lib/pfctBlogData";

type AnswerKey = Record<string, string | string[]>;

const decodeUrls = (urls: string[]) => urls.map((url) => decodeURIComponent(url));

export const buildPfctBlogAnswerKey = (): AnswerKey => {
  const decodedUrls = decodeUrls(pfctBlogUrls);
  const slugs = decodedUrls.map((url) =>
    url.replace("https://blog.pfct.co.kr/", "")
  );

  // Q1: slug에서 가장 많이 등장하는 영단어
  const wordCount: Record<string, number> = {};
  slugs.forEach((slug) => {
    const words = slug.split("-").filter((w) => /^[a-z]+$/i.test(w));
    words.forEach((w) => {
      const lower = w.toLowerCase();
      wordCount[lower] = (wordCount[lower] || 0) + 1;
    });
  });
  const topWord = Object.entries(wordCount).sort((a, b) => b[1] - a[1])[0][0];

  // Q2: 본문에서 "피플펀드" 총 등장 횟수 (크롤링 필요)
  let peoplefundTotal = 0;
  pfctBlogData.forEach((d) => {
    if (d.bodyText) {
      const matches = d.bodyText.match(/피플펀드/g);
      peoplefundTotal += matches?.length || 0;
    }
  });

  // Q3: 본문에 "머신러닝" 또는 "딥러닝" 포함된 글 수 (크롤링 필요)
  const mlCount = pfctBlogData.filter(
    (d) => d.bodyText?.includes("머신러닝") || d.bodyText?.includes("딥러닝")
  ).length;

  // Q4: 본문 1000자 미만인 글 수 (크롤링 필요)
  const shortBodyCount = pfctBlogData.filter(
    (d) => (d.bodyText?.length || 0) < 1000
  ).length;

  // Q5: 본문에 "2024년" 언급된 글 수 (크롤링 필요)
  const year2024Count = pfctBlogData.filter((d) =>
    d.bodyText?.includes("2024년")
  ).length;

  return {
    "pfct-news-q1": topWord,
    "pfct-news-q2": String(peoplefundTotal),
    "pfct-news-q3": String(mlCount),
    "pfct-news-q4": String(shortBodyCount),
    "pfct-news-q5": String(year2024Count),
  };
};
