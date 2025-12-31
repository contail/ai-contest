"use client";

import { useEffect, useMemo, useState } from "react";

type ChallengeOption = {
  id: string;
  title: string;
};

type QuestionInput = {
  order: number;
  type: string;
  prompt: string;
  options?: string[];
  required?: boolean;
};

export default function AdminPanel() {
  const [challenges, setChallenges] = useState<ChallengeOption[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const [datasetLabel, setDatasetLabel] = useState("");
  const [datasetFileName, setDatasetFileName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [datasetDownloadUrl, setDatasetDownloadUrl] = useState("");
  const [datasetUrlsText, setDatasetUrlsText] = useState("");

  const [restrictDatasetUrl, setRestrictDatasetUrl] = useState(false);
  const [questionsText, setQuestionsText] = useState("");
  const [sessionResetId, setSessionResetId] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      const response = await fetch("/api/challenges");
      const data = (await response.json()) as { challenges: ChallengeOption[] };
      setChallenges(data.challenges);
      if (data.challenges.length > 0) {
        setSelectedId(data.challenges[0].id);
      }
    };
    fetchChallenges();
  }, []);

  const urlsArray = useMemo(
    () =>
      datasetUrlsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [datasetUrlsText]
  );

  const handleSettingsSave = async () => {
    if (!selectedId) return;
    setStatus("설정 저장 중...");
    const response = await fetch(`/api/admin/challenges/${selectedId}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restrictDatasetUrl }),
    });
    setStatus(response.ok ? "설정 저장 완료" : "설정 저장 실패");
  };

  const handleDatasetSave = async () => {
    if (!selectedId) return;
    setStatus("데이터셋 저장 중...");
    const response = await fetch(`/api/admin/challenges/${selectedId}/dataset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        datasetLabel,
        datasetFileName,
        datasetDescription,
        datasetDownloadUrl: datasetDownloadUrl || null,
        urls: urlsArray,
      }),
    });
    setStatus(response.ok ? "데이터셋 저장 완료" : "데이터셋 저장 실패");
  };

  const handleQuestionsSave = async () => {
    if (!selectedId) return;
    setStatus("질문 항목 저장 중...");
    try {
      const questions = JSON.parse(questionsText) as QuestionInput[];
      const response = await fetch(
        `/api/admin/challenges/${selectedId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions }),
        }
      );
      setStatus(response.ok ? "질문 항목 저장 완료" : "질문 항목 저장 실패");
    } catch {
      setStatus("질문 항목 JSON 형식 오류");
    }
  };

  const handleResetSession = async () => {
    if (!sessionResetId) return;
    setStatus("세션 초기화 중...");
    const response = await fetch(`/api/sessions/${sessionResetId}/reset`, {
      method: "POST",
    });
    setStatus(response.ok ? "세션 초기화 완료" : "세션 초기화 실패");
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="border border-black/5 bg-[var(--card)] px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          대상 콘테스트
        </p>
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
          <label className="text-sm text-slate-600 md:w-28">콘테스트 선택</label>
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
          >
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="border border-black/5 bg-[var(--card)] px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          검증 정책
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={restrictDatasetUrl}
            onChange={(event) => setRestrictDatasetUrl(event.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          데이터셋 URL만 허용
        </label>
        <button
          type="button"
          className="mt-4 border border-[var(--brand)] px-3 py-2 text-xs font-semibold text-[var(--brand)] hover:bg-emerald-50"
          onClick={handleSettingsSave}
        >
          설정 저장
        </button>
      </section>

      <section className="border border-black/5 bg-[var(--card)] px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          데이터셋 관리
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            value={datasetLabel}
            onChange={(event) => setDatasetLabel(event.target.value)}
            placeholder="데이터셋 라벨"
            className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
          />
          <input
            value={datasetFileName}
            onChange={(event) => setDatasetFileName(event.target.value)}
            placeholder="파일명"
            className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
          />
          <input
            value={datasetDescription}
            onChange={(event) => setDatasetDescription(event.target.value)}
            placeholder="설명"
            className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
          />
          <input
            value={datasetDownloadUrl}
            onChange={(event) => setDatasetDownloadUrl(event.target.value)}
            placeholder="다운로드 URL (선택)"
            className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
          />
        </div>
        <textarea
          rows={5}
          value={datasetUrlsText}
          onChange={(event) => setDatasetUrlsText(event.target.value)}
          placeholder="데이터셋 URL 목록 (줄바꿈 구분)"
          className="mt-3 w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
        />
        <button
          type="button"
          className="mt-4 border border-[var(--brand)] px-3 py-2 text-xs font-semibold text-[var(--brand)] hover:bg-emerald-50"
          onClick={handleDatasetSave}
        >
          데이터셋 저장
        </button>
      </section>

      <section className="border border-black/5 bg-[var(--card)] px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          질문 항목 관리
        </p>
        <textarea
          rows={6}
          value={questionsText}
          onChange={(event) => setQuestionsText(event.target.value)}
          placeholder='예: [{"order":1,"type":"URL","prompt":"...", "required":true}]'
          className="mt-3 w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
        />
        <button
          type="button"
          className="mt-4 border border-[var(--brand)] px-3 py-2 text-xs font-semibold text-[var(--brand)] hover:bg-emerald-50"
          onClick={handleQuestionsSave}
        >
          질문 항목 저장
        </button>
      </section>

      <section className="border border-black/5 bg-[var(--card)] px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          응시 세션 초기화
        </p>
        <input
          value={sessionResetId}
          onChange={(event) => setSessionResetId(event.target.value)}
          placeholder="세션 ID 입력"
          className="mt-3 w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand)] focus:outline-none"
        />
        <button
          type="button"
          className="mt-4 border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:border-slate-300"
          onClick={handleResetSession}
        >
          세션 초기화
        </button>
      </section>

      {status ? (
        <p className="text-sm text-slate-600">{status}</p>
      ) : null}
    </div>
  );
}
