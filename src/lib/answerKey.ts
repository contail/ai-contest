import { pfctBlogUrls } from "@/lib/pfctBlogUrls";

type AnswerKey = Record<string, string | string[]>;

const decodeUrls = (urls: string[]) => urls.map((url) => decodeURIComponent(url));

export const buildPfctBlogAnswerKey = (): AnswerKey => {
  const decodedUrls = decodeUrls(pfctBlogUrls);
  const slugs = decodedUrls.map((url) =>
    url.replace("https://blog.pfct.co.kr/", "")
  );

  // Q1: 가장 많이 등장하는 영단어
  const wordCount: Record<string, number> = {};
  slugs.forEach((slug) => {
    const words = slug.split("-").filter((w) => /^[a-z]+$/i.test(w));
    words.forEach((w) => {
      const lower = w.toLowerCase();
      wordCount[lower] = (wordCount[lower] || 0) + 1;
    });
  });
  const topWord = Object.entries(wordCount).sort((a, b) => b[1] - a[1])[0][0];

  // Q2: 한글 포함 slug 개수
  const koreanCount = slugs.filter((s) => /[가-힣]/.test(s)).length;

  // Q3: 20XX-로 시작하는 URL 개수
  const dateStartCount = slugs.filter((s) => /^20\d{2}-/.test(s)).length;

  // Q4: 가장 짧은 slug 길이
  const shortestLength = Math.min(...slugs.map((s) => s.length));

  // Q5: 숫자로 끝나는 slug 개수
  const endsWithNumberCount = slugs.filter((s) => /\d$/.test(s)).length;

  return {
    "pfct-news-q1": topWord,
    "pfct-news-q2": String(koreanCount),
    "pfct-news-q3": `${dateStartCount}개`,
    "pfct-news-q4": String(shortestLength),
    "pfct-news-q5": `${endsWithNumberCount}개`,
  };
};
