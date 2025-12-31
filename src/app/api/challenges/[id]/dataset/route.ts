import { prisma } from "@/lib/prisma";
import { challenges } from "@/lib/mockData";
import { pfctBlogUrls } from "@/lib/pfctBlogUrls";

type RouteContext = {
  params: Promise<{
    id?: string;
  }>;
};

const buildDownloadResponse = (fileName: string, urls: string[]) => {
  const safeFileName = fileName?.trim() || "dataset.txt";
  const body = urls.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeFileName}"`,
    },
  });
};

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const id = params?.id;
  if (!id) {
    return new Response("Missing challenge id.", { status: 400 });
  }

  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      datasetUrls: {
        select: { url: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (challenge && challenge.datasetUrls.length > 0) {
    const urls = challenge.datasetUrls.map((item) => item.url);
    return buildDownloadResponse(challenge.datasetFileName, urls);
  }

  const mock = challenges.find((item) => item.id === id);
  if (mock && id === "pfct-news" && pfctBlogUrls.length > 0) {
    return buildDownloadResponse(mock.datasetFileName, pfctBlogUrls);
  }

  return new Response("Dataset not available.", { status: 404 });
}
