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

  // Q2: 본문에서 "연체율"이 가장 많이 등장하는 글의 slug
  let maxDelinquency = { slug: "", count: 0 };
  pfctBlogData.forEach((d) => {
    const matches = d.bodyText?.match(/연체율/g);
    const count = matches?.length || 0;
    if (count > maxDelinquency.count) {
      maxDelinquency = { slug: d.slug, count };
    }
  });

  // Q3: 본문에 "2024년" 언급된 글 수
  const year2024Count = pfctBlogData.filter((d) =>
    d.bodyText?.includes("2024년")
  ).length;

  // Q4: 가장 짧은 본문을 가진 글의 slug
  const shortestPost = pfctBlogData.reduce((a, b) =>
    (a.bodyText?.length || Infinity) < (b.bodyText?.length || Infinity) ? a : b
  );

  // Q5: 본문에서 "피플펀드" 총 등장 횟수
  let peoplefundTotal = 0;
  pfctBlogData.forEach((d) => {
    if (d.bodyText) {
      const matches = d.bodyText.match(/피플펀드/g);
      peoplefundTotal += matches?.length || 0;
    }
  });

  return {
    "pfct-news-q1": topWord,
    "pfct-news-q2": maxDelinquency.slug,
    "pfct-news-q3": String(year2024Count),
    "pfct-news-q4": shortestPost.slug,
    "pfct-news-q5": String(peoplefundTotal),
  };
};
