import Header from "@/components/site/Header";
import { supabase } from "@/lib/supabaseServer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ nickname: string }>;
};

type Submission = {
  challengeId: string;
  challengeTitle: string;
  difficulty: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
};

const getDifficultyLabel = (level: number) => {
  const labels: Record<number, { text: string; color: string }> = {
    1: { text: "입문", color: "bg-green-500" },
    2: { text: "중급", color: "bg-yellow-500" },
    3: { text: "고급", color: "bg-orange-500" },
    4: { text: "전문가", color: "bg-red-500" },
    5: { text: "하드코어", color: "bg-purple-600" },
    6: { text: "심연", color: "bg-black" },
  };
  return labels[level] || { text: "입문", color: "bg-gray-500" };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

async function getProfileData(nickname: string) {
  const { data: sessions, error } = await supabase
    .from("submission_sessions")
    .select("id,score,total_questions,submitted_at,challenge_id")
    .eq("nickname", nickname)
    .eq("status", "SUBMITTED")
    .not("score", "is", null)
    .order("submitted_at", { ascending: false });

  if (error || !sessions || sessions.length === 0) {
    return null;
  }

  const challengeIds = [...new Set(sessions.map((s) => s.challenge_id))];
  const { data: challenges } = await supabase
    .from("challenges")
    .select("id,title,difficulty")
    .in("id", challengeIds);

  const challengeMap = new Map(
    (challenges || []).map((c) => [c.id, { title: c.title, difficulty: c.difficulty }])
  );

  const submissions: Submission[] = sessions.map((session) => {
    const challenge = challengeMap.get(session.challenge_id);
    return {
      challengeId: session.challenge_id,
      challengeTitle: challenge?.title || "Unknown",
      difficulty: challenge?.difficulty || 1,
      score: session.score || 0,
      totalQuestions: session.total_questions || 0,
      percentage: session.total_questions > 0
        ? Math.round((session.score / session.total_questions) * 100)
        : 0,
      submittedAt: session.submitted_at,
    };
  });

  const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);
  const totalQuestions = submissions.reduce((sum, s) => sum + s.totalQuestions, 0);

  return {
    nickname,
    totalScore,
    totalQuestions,
    challengesCompleted: submissions.length,
    averagePercentage: totalQuestions > 0
      ? Math.round((totalScore / totalQuestions) * 100)
      : 0,
    submissions,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { nickname } = await params;
  const decodedNickname = decodeURIComponent(nickname);
  const profile = await getProfileData(decodedNickname);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-16 pt-10">
        {/* 뒤로가기 */}
        <div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1 text-sm text-[var(--gray-500)] hover:text-[var(--gray-700)]"
          >
            <span>←</span>
            <span>리더보드로 돌아가기</span>
          </Link>
        </div>

        {/* 프로필 헤더 */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--lime-100)] text-2xl font-bold text-[var(--lime-600)]">
              {profile.nickname.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--gray-900)]">
                {profile.nickname}
              </h1>
              <p className="mt-1 text-sm text-[var(--gray-500)]">
                AI Challenge Hub 참가자
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-[var(--radius-md)] bg-[var(--gray-50)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--lime-600)]">
                {profile.totalScore}
              </p>
              <p className="mt-1 text-xs text-[var(--gray-500)]">총점</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-[var(--gray-50)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--gray-900)]">
                {profile.challengesCompleted}
              </p>
              <p className="mt-1 text-xs text-[var(--gray-500)]">참여 챌린지</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-[var(--gray-50)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--gray-900)]">
                {profile.averagePercentage}%
              </p>
              <p className="mt-1 text-xs text-[var(--gray-500)]">평균 정답률</p>
            </div>
          </div>
        </section>

        {/* 참여 기록 */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-[var(--gray-900)]">
            참여 기록
          </h2>
          <div className="space-y-3">
            {profile.submissions.map((sub) => {
              const diff = getDifficultyLabel(sub.difficulty);
              return (
                <div
                  key={`${sub.challengeId}-${sub.submittedAt}`}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-bold text-white ${diff.color}`}>
                          Lv.{sub.difficulty} {diff.text}
                        </span>
                      </div>
                      <h3 className="mt-2 font-medium text-[var(--gray-900)]">
                        {sub.challengeTitle}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--gray-500)]">
                        {formatDate(sub.submittedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        <span className="text-[var(--lime-600)]">{sub.score}</span>
                        <span className="text-[var(--gray-400)]">/{sub.totalQuestions}</span>
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--gray-200)]">
                          <div
                            className="h-full rounded-full bg-[var(--lime-500)]"
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[var(--gray-600)]">
                          {sub.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

