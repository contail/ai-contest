"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import type { ChallengeCardData } from "@/lib/challengeQueries";

type CompletedInfo = {
  score: number;
  totalQuestions: number;
};

type ChallengeListProps = {
  challenges: ChallengeCardData[];
};

export default function ChallengeList({ challenges }: ChallengeListProps) {
  const { user } = useAuth();
  const [completedChallenges, setCompletedChallenges] = useState<
    Record<string, CompletedInfo>
  >({});

  useEffect(() => {
    if (!user?.id) {
      setCompletedChallenges({});
      return;
    }

    const fetchCompleted = async () => {
      try {
        const response = await fetch(
          `/api/user/completed-challenges?userId=${user.id}`
        );
        if (response.ok) {
          const data = (await response.json()) as {
            completedChallenges: Record<string, CompletedInfo>;
          };
          setCompletedChallenges(data.completedChallenges);
        }
      } catch {
        // ignore
      }
    };

    fetchCompleted();
  }, [user?.id]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          completed={completedChallenges[challenge.id]}
        />
      ))}
    </div>
  );
}

