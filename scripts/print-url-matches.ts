import { pfctBlogUrls } from "../src/lib/pfctBlogUrls";

const decodedUrls = pfctBlogUrls.map((url) => decodeURIComponent(url));

const formatRatio = (count: number) => {
  if (decodedUrls.length === 0) return "0.0%";
  return `${((count / decodedUrls.length) * 100).toFixed(1)}%`;
};

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

const slugs = decodedUrls.map((url) =>
  url.replace("https://blog.pfct.co.kr/", "")
);

const reservationCount = decodedUrls.reduce(
  (total, url) => total + countOccurrences(url, "예약투자"),
  0
);
const loanCount = decodedUrls.reduce(
  (total, url) => total + countOccurrences(url, "대출"),
  0
);
const hyphenFourPlusCount = slugs.filter((slug) => {
  const count = (slug.match(/-/g) ?? []).length;
  return count >= 4;
}).length;
const maxSlugLength = Math.max(...slugs.map((slug) => slug.length));

console.log(`예약투자 등장 횟수: ${reservationCount}회`);
console.log(`대출 등장 횟수: ${loanCount}회`);
console.log(
  `하이픈 4개 이상 URL: ${hyphenFourPlusCount}건 (${formatRatio(hyphenFourPlusCount)})`
);
console.log(`최장 slug 길이: ${maxSlugLength}자`);
