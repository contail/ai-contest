import { PrismaClient } from "@prisma/client";
import { challenges } from "../src/lib/mockData";
import { pfctBlogUrls } from "../src/lib/pfctBlogUrls";

const prisma = new PrismaClient();

async function main() {
  for (const challenge of challenges) {
    const createdChallenge = await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: {
        title: challenge.title,
        subtitle: challenge.subtitle,
        summary: challenge.summary,
        tags: JSON.stringify(challenge.tags),
        badge: challenge.badge ?? null,
        heroCopy: challenge.heroCopy ?? null,
        description: challenge.description,
        cautionText: challenge.cautionText,
        datasetLabel: challenge.datasetLabel,
        datasetFileName: challenge.datasetFileName,
        datasetDescription: challenge.datasetDescription,
        restrictDatasetUrl: false,
        isPublished: true,
      },
      create: {
        id: challenge.id,
        title: challenge.title,
        subtitle: challenge.subtitle,
        summary: challenge.summary,
        tags: JSON.stringify(challenge.tags),
        badge: challenge.badge ?? null,
        heroCopy: challenge.heroCopy ?? null,
        description: challenge.description,
        cautionText: challenge.cautionText,
        datasetLabel: challenge.datasetLabel,
        datasetFileName: challenge.datasetFileName,
        datasetDescription: challenge.datasetDescription,
        restrictDatasetUrl: false,
        isPublished: true,
      },
    });

    await prisma.question.deleteMany({
      where: { challengeId: createdChallenge.id },
    });

    for (const question of challenge.questions) {
      await prisma.question.create({
        data: {
          challengeId: createdChallenge.id,
          order: question.order,
          type: question.type,
          prompt: question.prompt,
          options: question.options
            ? JSON.stringify(question.options)
            : undefined,
          required: question.required ?? false,
        },
      });
    }

    const datasetUrls =
      challenge.id === "pfct-news"
        ? pfctBlogUrls.map((url) => ({
            challengeId: createdChallenge.id,
            url,
          }))
        : Array.from({ length: 5 }, (_, index) => ({
            challengeId: createdChallenge.id,
            url: `https://example.com/articles/${challenge.id}/${index + 1}`,
          }));

    await prisma.datasetUrl.deleteMany({
      where: { challengeId: createdChallenge.id },
    });
    for (const datasetUrl of datasetUrls) {
      await prisma.datasetUrl.create({ data: datasetUrl });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
