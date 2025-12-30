"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { createAnswer, subscribeGroupAnswers } from "@/lib/firestore/answer";
import { subscribeLobby } from "@/lib/firestore/lobby";
import type { Answer, Group, Lobby, Question } from "@/types/firestore";
import { GroupFinished } from "./_components/GroupFinished";
import { GroupQuiz } from "./_components/GroupQuiz";
import { GroupResult } from "./_components/GroupResult";
import { GroupWaiting } from "./_components/GroupWaiting";

type PageState = "waiting" | "quiz" | "result" | "finished";

type Props = {
  params: Promise<{ lobbyId: string; groupId: string }>;
};

export default function GroupPage({ params }: Props) {
  const { lobbyId, groupId } = use(params);
  const router = useRouter();

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageState, setPageState] = useState<PageState>("waiting");
  const [remainingTime, setRemainingTime] = useState<string>("10:00");

  // クイズ中の状態
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastResult, setLastResult] = useState<{
    isCorrect: boolean;
    question: string;
    choices: string[];
    correctIndex: number;
    selectedIndex: number;
    pointChange: number;
  } | null>(null);

  // 問題表示開始時刻（回答時間計測用）
  const questionStartTimeRef = useRef<number>(0);

  // スコア計算（マイナスにならないようにする）
  const score = useMemo(() => {
    return Math.max(0, answers.reduce((sum, a) => sum + a.scoreChange, 0));
  }, [answers]);

  // 統計計算（終了時用）
  const stats = useMemo(() => {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalCount = answers.length;
    let maxStreak = 0;
    let currentStreak = 0;
    for (const a of answers) {
      if (a.isCorrect) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    return { correctCount, totalCount, maxStreak };
  }, [answers]);

  // グループ情報の取得
  useEffect(() => {
    const fetchGroup = async () => {
      const groupRef = doc(db, `quiz-time-attack-lobbies/${lobbyId}/groups/${groupId}`);
      const snapshot = await getDoc(groupRef);
      if (snapshot.exists()) {
        setGroup({ id: snapshot.id, ...snapshot.data() } as Group);
      }
    };
    fetchGroup();
  }, [lobbyId, groupId]);

  // クイズデータの取得
  useEffect(() => {
    if (!lobby) return;

    const fetchQuestions = async () => {
      const res = await fetch(`/data/quizzes/${lobby.quizFileName}.json`);
      const data = await res.json();
      setQuestions(data);
    };
    fetchQuestions();
  }, [lobby]);

  // ロビー情報のリアルタイム監視
  useEffect(() => {
    const unsubscribe = subscribeLobby(lobbyId, (lobbyData) => {
      setLobby(lobbyData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [lobbyId]);

  // 回答履歴のリアルタイム監視
  useEffect(() => {
    const unsubscribe = subscribeGroupAnswers(lobbyId, groupId, setAnswers);
    return () => unsubscribe();
  }, [lobbyId, groupId]);

  // ロビーの状態に応じた画面状態の更新
  useEffect(() => {
    if (!lobby) return;

    if (lobby.status === "waiting") {
      setPageState("waiting");
    } else if (lobby.status === "playing") {
      // 結果表示中でなければクイズ画面へ
      setPageState((prev) => {
        if (prev === "waiting") {
          questionStartTimeRef.current = Date.now();
          return "quiz";
        }
        return prev;
      });
    } else if (lobby.status === "finished") {
      setPageState("finished");
    } else if (lobby.status === "result") {
      router.push(`/lobby/${lobbyId}/result`);
    }
  }, [lobby, router, lobbyId]);

  // タイマー
  useEffect(() => {
    if (!lobby || lobby.status !== "playing" || !lobby.startedAt) return;

    const updateTimer = () => {
      if (!lobby.startedAt) return;
      const startedAt = lobby.startedAt.toDate().getTime();
      const endTime = startedAt + lobby.durationSeconds * 1000;
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);

      if (remaining <= 0) {
        setPageState("finished");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lobby]);

  // 回答ハンドラ
  const handleAnswer = useCallback(
    async (selectedIndex: number) => {
      if (!lobby || !questions[currentQuestionIndex]) return;

      const question = questions[currentQuestionIndex];
      const answerTimeMs = Date.now() - questionStartTimeRef.current;

      await createAnswer({
        lobbyId,
        groupId,
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedIndex,
        correctAnswer: question.answer,
        answerTimeMs,
        pointsCorrect: lobby.pointsCorrect,
        pointsIncorrect: lobby.pointsIncorrect,
      });

      const isCorrect = selectedIndex === question.answer;
      setLastResult({
        isCorrect,
        question: question.question,
        choices: question.choices,
        correctIndex: question.answer,
        selectedIndex,
        pointChange: isCorrect ? lobby.pointsCorrect : lobby.pointsIncorrect,
      });
      setPageState("result");
    },
    [lobby, questions, currentQuestionIndex, lobbyId, groupId],
  );

  // 次の問題へ
  const handleNext = useCallback(() => {
    // ランダムに次の問題を選択
    const nextIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestionIndex(nextIndex);
    setLastResult(null);
    setPageState("quiz");
    questionStartTimeRef.current = Date.now();
  }, [questions.length]);

  if (isLoading) {
    return (
      <Box minH="100vh" bg="#FFFDF7" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="2xl" color="#FF8800" fontWeight="bold">
          読み込み中...
        </Text>
      </Box>
    );
  }

  if (!lobby || !group) {
    return (
      <Box minH="100vh" bg="#FFFDF7" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Text fontSize="2xl" color="#FF8800" fontWeight="bold">
            データが見つかりません
          </Text>
        </VStack>
      </Box>
    );
  }

  switch (pageState) {
    case "waiting":
      return <GroupWaiting groupName={group.name} />;
    case "quiz":
      return (
        <GroupQuiz
          groupName={group.name}
          score={score}
          remainingTime={remainingTime}
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      );
    case "result":
      return lastResult ? (
        <GroupResult
          groupName={group.name}
          score={score}
          remainingTime={remainingTime}
          result={lastResult}
          onNext={handleNext}
        />
      ) : null;
    case "finished":
      return (
        <GroupFinished
          groupName={group.name}
          finalScore={score}
          correctCount={stats.correctCount}
          totalCount={stats.totalCount}
          maxStreak={stats.maxStreak}
        />
      );
  }
}
