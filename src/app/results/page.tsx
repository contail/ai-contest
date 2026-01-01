import Header from "@/components/site/Header";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { supabase } from "@/lib/supabaseServer";
import SessionResetButton from "@/components/admin/SessionResetButton";

async function getAnswerKeysByChallengeIds(
  challengeIds: string[]
): Promise<Map<string, Record<string, string>>> {
  if (challengeIds.length === 0) return new Map();

  const { data: questions } = await supabase
    .from("questions")
    .select("id, challenge_id")
    .in("challenge_id", challengeIds);

  if (!questions?.length) return new Map();

  const questionIds = questions.map((q) => q.id);
  const { data: answerKeys } = await supabase
    .from("answer_keys")
    .select("question_id, answer")
    .in("question_id", questionIds);

  const result = new Map<string, Record<string, string>>();
  challengeIds.forEach((id) => result.set(id, {}));

  questions.forEach((q) => {
    const answer = answerKeys?.find((a) => a.question_id === q.id);
    if (answer) {
      const existing = result.get(q.challenge_id) ?? {};
      existing[q.id] = answer.answer;
      result.set(q.challenge_id, existing);
    }
  });

  return result;
}

const parseAnswerPayload = (payload: string): string | string[] => {
  const trimmed = payload.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return payload;
    }
  }
  return payload;
};

const isEqualAnswer = (
  actual: string | string[] | undefined,
  expected: string | string[]
) => {
  if (!actual) return false;
  if (Array.isArray(expected)) {
    const actualArray = Array.isArray(actual) ? actual : [actual];
    const normalizedActual = [...new Set(actualArray.map((item) => item.trim()))]
      .filter(Boolean)
      .sort();
    const normalizedExpected = [...new Set(expected.map((item) => item.trim()))]
      .filter(Boolean)
      .sort();
    if (normalizedActual.length !== normalizedExpected.length) return false;
    return normalizedExpected.every(
      (item, index) => normalizedActual[index] === item
    );
  }
  return (Array.isArray(actual) ? actual.join(",") : actual).trim() ===
    expected.trim();
};

async function ResultsContent() {
  const { data: sessions } = await supabase
    .from("submission_sessions")
    .select("id,challenge_id,nickname,status,score,total_questions,created_at,submitted_at")
    .order("created_at", { ascending: false });

  const sessionList = (sessions ?? []).map((s) => ({
    id: s.id,
    challengeId: s.challenge_id,
    nickname: s.nickname,
    status: s.status,
    score: s.score as number | null,
    totalQuestions: s.total_questions as number | null,
    createdAt: s.created_at,
    submittedAt: s.submitted_at,
  }));

  const challengeIds = Array.from(
    new Set(sessionList.map((session) => session.challengeId))
  );
  const sessionIds = sessionList.map((session) => session.id);

  const { data: challenges } = challengeIds.length
    ? await supabase
        .from("challenges")
        .select("id,title")
        .in("id", challengeIds)
    : { data: [] };

  const { data: answersData } = sessionIds.length
    ? await supabase
        .from("answers")
        .select("session_id,question_id,payload")
        .in("session_id", sessionIds)
    : { data: [] };

  const answers = (answersData ?? []).map((a) => ({
    sessionId: a.session_id,
    questionId: a.question_id,
    payload: a.payload,
  }));

  const challengeMap = new Map(
    (challenges ?? []).map((challenge) => [challenge.id, challenge])
  );
  const answersBySession = new Map<string, typeof answers>();
  answers.forEach((answer) => {
    if (!answersBySession.has(answer.sessionId)) {
      answersBySession.set(answer.sessionId, []);
    }
    answersBySession.get(answer.sessionId)?.push(answer);
  });

  // 답변이 1개 이상이거나 제출 완료된 세션만 필터링
  const activeSessionList = sessionList.filter((session) => {
    const answerCount = answersBySession.get(session.id)?.length ?? 0;
    return session.status === "SUBMITTED" || answerCount > 0;
  });

  const grouped = activeSessionList.reduce<Record<string, typeof sessionList>>(
    (acc, session) => {
      const key = session.challengeId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(session);
      return acc;
    },
    {}
  );

  const answerKeysMap = await getAnswerKeysByChallengeIds(challengeIds);

  return (
    <>
      <section className="border border-black/5 bg-[var(--card)] px-6 py-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          결과 요약
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          응시 현황
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          제출 상태와 점수를 확인합니다.
        </p>
      </section>

      {activeSessionList.length === 0 ? (
        <section className="border border-black/5 bg-[var(--card)] px-6 py-8 text-sm text-slate-600 shadow-sm">
          아직 응시한 세션이 없습니다.
        </section>
      ) : (
        Object.entries(grouped).map(([challengeId, items]) => (
          <section
            key={challengeId}
            className="border border-black/5 bg-[var(--card)] px-6 py-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {challengeMap.get(items[0]?.challengeId)?.title ??
                    "콘테스트"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  총 {items.length}건
                </p>
              </div>
            </div>
            <div className="mt-4 divide-y divide-slate-200">
              {items.map((session) => {
                const isSubmitted = session.status === "SUBMITTED";
                const answerCount = answersBySession.get(session.id)?.length ?? 0;

                // 제출된 세션은 저장된 점수 사용, 아니면 실시간 계산
                let correctCount = 0;
                let totalQuestions = 0;
                let hasScore = false;

                if (isSubmitted && session.score !== null && session.totalQuestions !== null) {
                  correctCount = session.score;
                  totalQuestions = session.totalQuestions;
                  hasScore = true;
                } else {
                  const answerKey = answerKeysMap.get(session.challengeId);
                  if (answerKey && Object.keys(answerKey).length > 0) {
                    hasScore = true;
                    totalQuestions = Object.keys(answerKey).length;
                    const answerMap = new Map(
                      (answersBySession.get(session.id) ?? []).map((answer) => [
                        answer.questionId,
                        parseAnswerPayload(answer.payload),
                      ])
                    );
                    correctCount = Object.entries(answerKey).reduce(
                      (count, [id, expected]) =>
                        isEqualAnswer(answerMap.get(id), expected) ? count + 1 : count,
                      0
                    );
                  }
                }

                return (
                  <div
                    key={session.id}
                    className="flex flex-col gap-2 py-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-slate-900">{session.nickname}</p>
                      <p className="text-xs text-slate-500">
                        세션 {session.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="rounded-[var(--radius-sm)] border border-slate-200 px-2 py-1">
                        {isSubmitted ? "최종 제출" : "응시 중"}
                      </span>
                      {hasScore ? (
                        <span className="rounded-[var(--radius-sm)] border border-[var(--lime-200)] bg-[var(--lime-50)] px-2 py-1 text-[var(--lime-700)]">
                          {correctCount}/{totalQuestions}점
                        </span>
                      ) : (
                        <span className="rounded-[var(--radius-sm)] border border-slate-200 px-2 py-1 text-slate-500">
                          채점 대기
                        </span>
                      )}
                      <span className="text-slate-500">
                        응답 {answerCount}개
                      </span>
                      <SessionResetButton
                        sessionId={session.id}
                        nickname={session.nickname}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </>
  );
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AdminGuard>
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16 pt-8">
          <ResultsContent />
        </main>
      </AdminGuard>
    </div>
  );
}
