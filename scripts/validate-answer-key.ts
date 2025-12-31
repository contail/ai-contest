import { buildPfctBlogAnswerKey } from "../src/lib/answerKey";
import { challenges } from "../src/lib/mockData";

const normalizeValue = (value: string | string[]) => {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => item.trim()))]
      .filter(Boolean)
      .sort()
      .join("|");
  }
  return value.trim();
};

const validatePfctNews = () => {
  const challenge = challenges.find((item) => item.id === "pfct-news");
  if (!challenge?.answerKey) {
    throw new Error("pfct-news answerKey is missing.");
  }

  const generated = buildPfctBlogAnswerKey();
  const mismatches: string[] = [];

  for (const [key, expected] of Object.entries(generated)) {
    const actual = challenge.answerKey[key];
    if (!actual) {
      mismatches.push(`${key}: missing`);
      continue;
    }
    if (normalizeValue(actual) !== normalizeValue(expected)) {
      mismatches.push(
        `${key}: expected "${normalizeValue(expected)}" got "${normalizeValue(actual)}"`
      );
    }
  }

  if (mismatches.length > 0) {
    throw new Error(`Answer key mismatch:\n${mismatches.join("\n")}`);
  }
};

try {
  validatePfctNews();
  console.log("Answer key validated.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
