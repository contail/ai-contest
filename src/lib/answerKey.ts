import { pfctBlogUrls } from "@/lib/pfctBlogUrls";

type AnswerKey = Record<string, string | string[]>;

const decodeUrls = (urls: string[]) => urls.map((url) => decodeURIComponent(url));

const countOccurrences = (value: string, term: string) => {
  if (!term) return 0;
  let count = 0;
  let index = 0;
  while (true) {
    const nextIndex = value.indexOf(term, index);
    if (nextIndex === -1) break;
    count += 1;
    index = nextIndex + term.length;
  }
  return count;
};

const countIncludes = (urls: string[], term: string) =>
  urls.reduce((total, url) => total + countOccurrences(url, term), 0);

const findUrlContains = (urls: string[], term: string) =>
  urls.find((url) => url.includes(term)) ?? "";

export const buildPfctBlogAnswerKey = (): AnswerKey => {
  const decodedUrls = decodeUrls(pfctBlogUrls);
  const slugs = decodedUrls.map((url) =>
    url.replace("https://blog.pfct.co.kr/", "")
  );

  const reservationCount = countIncludes(decodedUrls, "예약투자");
  const loanCount = countIncludes(decodedUrls, "대출");
  const hyphenFourPlusCount = slugs.filter((slug) => {
    const count = (slug.match(/-/g) ?? []).length;
    return count >= 4;
  }).length;
  const maxSlugLength = Math.max(...slugs.map((slug) => slug.length));

  return {
    q1: findUrlContains(decodedUrls, "happyhour"),
    q2: String(reservationCount),
    q3: `${loanCount}회`,
    q4: String(hyphenFourPlusCount),
    q5: String(maxSlugLength),
  };
};
