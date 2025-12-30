"use client";

import { Box, Flex, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { type GroupWithAnswers, subscribeAllGroupAnswers } from "@/lib/firestore/answer";
import { subscribeGroups } from "@/lib/firestore/group";
import { subscribeLobby } from "@/lib/firestore/lobby";
import type { Group, Lobby, Question } from "@/types/firestore";

// ============================================
// Animations
// ============================================

const zoomIn = keyframes`
  0% { opacity: 0; transform: scale(0.3) rotate(-5deg); }
  60% { transform: scale(1.08) rotate(1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(8deg); }
`;

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0.3; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.4; transform: scale(0.7) rotate(180deg); }
`;

const podiumRise = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  60% { transform: translateY(-10%); }
  100% { transform: translateY(0); opacity: 1; }
`;

const revealTeam = keyframes`
  0% { opacity: 0; transform: scale(0.5) translateY(30px); }
  60% { transform: scale(1.1) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const goldShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const crownBounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  25% { transform: translateY(-8px) rotate(3deg); }
  75% { transform: translateY(-4px) rotate(-2deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 50px rgba(255, 215, 0, 0.6), 0 0 100px rgba(255, 215, 0, 0.4); }
`;

const slideInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-60px); }
  100% { opacity: 1; transform: translateX(0); }
`;

// ============================================
// Constants
// ============================================

const TEAM_COLORS = ["#FF8800", "#22C55E", "#3B82F6", "#A855F7", "#EC4899", "#14B8A6", "#F59E0B", "#6366F1"];

// ============================================
// Helper Functions
// ============================================

const getMedalEmoji = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
};

const getPodiumConfig = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        height: "200px",
        color: "linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #B8860B 100%)",
        borderColor: "#FFD700",
        delay: "3.5s",
        teamDelay: "4s",
        glow: "0 0 40px rgba(255, 215, 0, 0.5)",
        zIndex: 3,
      };
    case 2:
      return {
        height: "150px",
        color: "linear-gradient(180deg, #E8E8E8 0%, #C0C0C0 50%, #A0A0A0 100%)",
        borderColor: "#C0C0C0",
        delay: "2.5s",
        teamDelay: "3s",
        glow: "0 0 30px rgba(192, 192, 192, 0.4)",
        zIndex: 2,
      };
    case 3:
      return {
        height: "110px",
        color: "linear-gradient(180deg, #E0A060 0%, #CD7F32 50%, #8B4513 100%)",
        borderColor: "#CD7F32",
        delay: "1.5s",
        teamDelay: "2s",
        glow: "0 0 25px rgba(205, 127, 50, 0.4)",
        zIndex: 1,
      };
    default:
      return {
        height: "80px",
        color: "#E0E0E0",
        borderColor: "#999",
        delay: "1s",
        teamDelay: "1.5s",
        glow: "none",
        zIndex: 0,
      };
  }
};

// ============================================
// Main Component
// ============================================

export default function ResultPage() {
  const params = useParams();
  const lobbyId = params.lobbyId as string;

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsWithAnswers, setGroupsWithAnswers] = useState<GroupWithAnswers[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to lobby
  useEffect(() => {
    const unsubscribe = subscribeLobby(lobbyId, setLobby);
    return unsubscribe;
  }, [lobbyId]);

  // Subscribe to groups
  useEffect(() => {
    const unsubscribe = subscribeGroups(lobbyId, (newGroups) => {
      setGroups(newGroups);
    });
    return unsubscribe;
  }, [lobbyId]);

  // Subscribe to all group answers
  useEffect(() => {
    if (groups.length === 0) {
      setGroupsWithAnswers([]);
      return;
    }

    const unsubscribe = subscribeAllGroupAnswers(lobbyId, groups, (data) => {
      setGroupsWithAnswers(data);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [lobbyId, groups]);

  // Fetch quiz questions
  useEffect(() => {
    if (!lobby?.quizFileName) return;
    fetch(`/data/quizzes/${lobby.quizFileName}.json`)
      .then((res) => res.json())
      .then(setQuestions)
      .catch(console.error);
  }, [lobby?.quizFileName]);

  // Calculate ranking
  const ranking = useMemo(() => {
    return groupsWithAnswers
      .map((group) => ({
        name: group.groupName,
        score: group.answers.reduce((sum, a) => sum + a.scoreChange, 0),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [groupsWithAnswers]);

  // Calculate score history (1 minute intervals)
  const scoreHistory = useMemo(() => {
    if (!lobby?.startedAt || groupsWithAnswers.length === 0) return [];

    const startTime = lobby.startedAt.toMillis();
    const durationMinutes = Math.ceil(lobby.durationSeconds / 60);
    const history: Record<string, number | string>[] = [];

    for (let minute = 0; minute <= durationMinutes; minute++) {
      const timePoint = startTime + minute * 60 * 1000;
      const entry: Record<string, number | string> = {
        time: `${minute}:00`,
      };

      for (const group of groupsWithAnswers) {
        const scoreAtTime = group.answers
          .filter((a) => a.answeredAt.toMillis() <= timePoint)
          .reduce((sum, a) => sum + a.scoreChange, 0);
        entry[group.groupName] = scoreAtTime;
      }

      history.push(entry);
    }

    return history;
  }, [lobby, groupsWithAnswers]);

  // Calculate awards
  const awards = useMemo(() => {
    if (!lobby?.startedAt || groupsWithAnswers.length === 0) return [];

    const result: { icon: string; title: string; winner: string; detail: string }[] = [];
    const startTime = lobby.startedAt.toMillis();
    const durationMs = lobby.durationSeconds * 1000;

    // 1. 最速正解賞 - 単一最速回答
    let fastestAnswer: { groupName: string; timeMs: number } | null = null;
    for (const group of groupsWithAnswers) {
      for (const answer of group.answers) {
        if (answer.isCorrect) {
          if (!fastestAnswer || answer.answerTimeMs < fastestAnswer.timeMs) {
            fastestAnswer = { groupName: group.groupName, timeMs: answer.answerTimeMs };
          }
        }
      }
    }
    if (fastestAnswer) {
      result.push({
        icon: "🏃",
        title: "最速正解賞",
        winner: fastestAnswer.groupName,
        detail: `${(fastestAnswer.timeMs / 1000).toFixed(1)}秒`,
      });
    }

    // 2. ラストスパート賞 - 後半20%での得点増加
    const lastSpurtStart = startTime + durationMs * 0.8;
    let bestLastSpurt: { groupName: string; score: number } | null = null;
    for (const group of groupsWithAnswers) {
      const lastSpurtScore = group.answers
        .filter((a) => a.answeredAt.toMillis() >= lastSpurtStart)
        .reduce((sum, a) => sum + a.scoreChange, 0);
      if (!bestLastSpurt || lastSpurtScore > bestLastSpurt.score) {
        bestLastSpurt = { groupName: group.groupName, score: lastSpurtScore };
      }
    }
    if (bestLastSpurt && bestLastSpurt.score > 0) {
      result.push({
        icon: "🔥",
        title: "ラストスパート賞",
        winner: bestLastSpurt.groupName,
        detail: `+${bestLastSpurt.score}点`,
      });
    }

    // 3. 連続正解記録
    let bestStreak: { groupName: string; streak: number } | null = null;
    for (const group of groupsWithAnswers) {
      let currentStreak = 0;
      let maxStreak = 0;
      for (const answer of group.answers) {
        if (answer.isCorrect) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      if (!bestStreak || maxStreak > bestStreak.streak) {
        bestStreak = { groupName: group.groupName, streak: maxStreak };
      }
    }
    if (bestStreak && bestStreak.streak > 1) {
      result.push({
        icon: "✨",
        title: "連続正解記録",
        winner: bestStreak.groupName,
        detail: `${bestStreak.streak}問連続`,
      });
    }

    return result;
  }, [lobby, groupsWithAnswers]);

  // Calculate question statistics
  const questionStats = useMemo(() => {
    const stats = new Map<number, { correct: number; total: number }>();

    for (const group of groupsWithAnswers) {
      for (const answer of group.answers) {
        const current = stats.get(answer.questionIndex) ?? { correct: 0, total: 0 };
        current.total++;
        if (answer.isCorrect) current.correct++;
        stats.set(answer.questionIndex, current);
      }
    }

    return Array.from(stats.entries())
      .map(([index, { correct, total }]) => ({
        questionIndex: index,
        correctRate: (correct / total) * 100,
        total,
      }))
      .sort((a, b) => b.correctRate - a.correctRate);
  }, [groupsWithAnswers]);

  // Calculate question awards
  const questionAwards = useMemo(() => {
    if (questionStats.length === 0 || questions.length === 0) return [];

    const easiest = questionStats[0];
    const hardest = questionStats[questionStats.length - 1];

    return [
      {
        icon: "😊",
        title: "みんなが得意だった問題",
        question: questions[easiest.questionIndex]?.question ?? "",
        detail: `正答率 ${easiest.correctRate.toFixed(0)}%`,
      },
      {
        icon: "😈",
        title: "難問チャレンジ",
        question: questions[hardest.questionIndex]?.question ?? "",
        detail: `正答率 ${hardest.correctRate.toFixed(0)}%`,
      },
    ];
  }, [questionStats, questions]);

  // Create color map for groups
  const groupColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    groupsWithAnswers.forEach((group, index) => {
      map[group.groupName] = TEAM_COLORS[index % TEAM_COLORS.length];
    });
    return map;
  }, [groupsWithAnswers]);

  // Max score for Y-axis
  const maxScore = useMemo(() => {
    if (ranking.length === 0) return 100;
    const max = Math.max(...ranking.map((r) => r.score));
    return Math.ceil((max + 20) / 10) * 10;
  }, [ranking]);

  // Loading state
  if (isLoading || !lobby) {
    return (
      <Box minH="100vh" bg="#FFFDF7" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="orange.500" />
          <Text fontSize="xl" color="gray.600">
            結果を読み込み中...
          </Text>
        </VStack>
      </Box>
    );
  }

  // No groups
  if (ranking.length === 0) {
    return (
      <Box minH="100vh" bg="#FFFDF7" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="2xl" color="gray.600">
          参加グループがありません
        </Text>
      </Box>
    );
  }

  const first = ranking.find((t) => t.rank === 1);
  const second = ranking.find((t) => t.rank === 2);
  const third = ranking.find((t) => t.rank === 3);

  return (
    <Box minH="100vh" bg="#FFFDF7" position="relative" overflow="hidden">
      {/* ========== Background Effects ========== */}

      {/* Radial gradient atmosphere */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.25) 0%, transparent 60%),
                 radial-gradient(ellipse at 20% 100%, rgba(255, 136, 0, 0.15) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(255, 229, 0, 0.12) 0%, transparent 50%)"
        pointerEvents="none"
      />

      {/* Spotlight effect from top */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="600px"
        h="600px"
        bgImage="radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%)"
        pointerEvents="none"
        animation={`${pulseGlow} 4s ease-in-out infinite`}
        css={{ filter: "blur(40px)" }}
      />

      {/* Confetti particles */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={`confetti-${i}`}
          position="absolute"
          top="-30px"
          left={`${3 + i * 6.5}%`}
          w={`${12 + (i % 4) * 4}px`}
          h={`${12 + (i % 4) * 4}px`}
          bg={
            i % 5 === 0
              ? "#FFD700"
              : i % 5 === 1
                ? "#FF8800"
                : i % 5 === 2
                  ? "#FFE500"
                  : i % 5 === 3
                    ? "#22C55E"
                    : "#FF6B9D"
          }
          borderRadius={i % 3 === 0 ? "full" : i % 3 === 1 ? "4px" : "2px"}
          animation={`${confettiFall} ${5 + (i % 4)}s linear ${i * 0.3}s infinite`}
          opacity={0.9}
        />
      ))}

      {/* Sparkle decorations */}
      {[
        { top: "8%", left: "5%", size: "4xl", delay: "0s" },
        { top: "12%", right: "8%", size: "3xl", delay: "0.4s" },
        { top: "35%", left: "3%", size: "2xl", delay: "0.8s" },
        { top: "40%", right: "4%", size: "3xl", delay: "1.2s" },
        { top: "65%", left: "6%", size: "2xl", delay: "1.6s" },
        { top: "60%", right: "5%", size: "4xl", delay: "2s" },
      ].map((pos, i) => (
        <Text
          key={`sparkle-${i}`}
          position="absolute"
          top={pos.top}
          left={pos.left}
          right={pos.right}
          fontSize={pos.size}
          animation={`${sparkle} 2.5s ease-in-out ${pos.delay} infinite`}
          pointerEvents="none"
        >
          ✨
        </Text>
      ))}

      {/* Floating geometric shapes */}
      <Box
        position="absolute"
        top="15%"
        left="2%"
        w="100px"
        h="100px"
        bg="linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 136, 0, 0.15) 100%)"
        borderRadius="24px"
        animation={`${float} 8s ease-in-out infinite`}
        transform="rotate(15deg)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="45%"
        right="2%"
        w="80px"
        h="80px"
        border="6px solid rgba(255, 215, 0, 0.25)"
        borderRadius="50%"
        animation={`${float} 9s ease-in-out infinite 1s`}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="20%"
        left="4%"
        w="60px"
        h="60px"
        bg="linear-gradient(45deg, rgba(34, 197, 94, 0.2) 0%, rgba(255, 229, 0, 0.15) 100%)"
        transform="rotate(45deg)"
        animation={`${float} 7s ease-in-out infinite 0.5s`}
        pointerEvents="none"
      />

      {/* ========== Main Content ========== */}
      <VStack position="relative" zIndex={1} py={8} px={6} gap={10} minH="100vh">
        {/* Header Banner */}
        <Box
          bg="linear-gradient(135deg, #FF8800 0%, #FFB800 50%, #FF8800 100%)"
          backgroundSize="200% 100%"
          animation={`${zoomIn} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), ${goldShimmer} 3s linear infinite 1s`}
          px={16}
          py={5}
          borderRadius="2xl"
          boxShadow="0 8px 40px rgba(255, 136, 0, 0.4), 0 0 80px rgba(255, 215, 0, 0.3)"
          position="relative"
          overflow="hidden"
        >
          {/* Shine sweep */}
          <Box
            position="absolute"
            top={0}
            left="-100%"
            w="50%"
            h="100%"
            bgGradient="to-r"
            gradientFrom="transparent"
            gradientVia="rgba(255,255,255,0.5)"
            gradientTo="transparent"
            transform="skewX(-25deg)"
            css={{
              animation: "shineSweep 4s ease-in-out infinite",
              "@keyframes shineSweep": {
                "0%": { left: "-100%" },
                "50%, 100%": { left: "200%" },
              },
            }}
          />
          <Text
            fontSize="5xl"
            fontWeight="900"
            color="white"
            textShadow="3px 3px 0 rgba(0,0,0,0.2), 0 0 30px rgba(255,255,255,0.3)"
            letterSpacing="0.1em"
            position="relative"
            zIndex={1}
          >
            🎊 結果発表 🎊
          </Text>
        </Box>

        {/* ========== Podium Section ========== */}
        <Box
          position="relative"
          w="full"
          maxW="900px"
          h="480px"
          mx="auto"
          animation={`${fadeInUp} 0.8s ease-out 0.5s both`}
        >
          {/* Podium base / stage */}
          <Box
            position="absolute"
            bottom={0}
            left="50%"
            marginLeft="-310px"
            w="620px"
            h="50px"
            bg="linear-gradient(180deg, #4A4A4A 0%, #2D2D2D 50%, #1A1A1A 100%)"
            borderRadius="8px 8px 0 0"
            boxShadow="0 -4px 20px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)"
            animation={`${fadeInUp} 0.6s ease-out 0.8s both`}
          />

          {/* 2nd Place - Left */}
          {second && (
            <Box
              position="absolute"
              bottom="50px"
              left="50%"
              transform="translateX(-310px)"
              w="200px"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {/* Team Card */}
              <Box
                bg="white"
                borderRadius="xl"
                border="4px solid"
                borderColor={getPodiumConfig(2).borderColor}
                p={4}
                textAlign="center"
                boxShadow={`0 8px 30px rgba(0,0,0,0.15), ${getPodiumConfig(2).glow}`}
                animation={`${revealTeam} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${getPodiumConfig(2).teamDelay} both`}
                mb={3}
              >
                <Text fontSize="4xl" mb={1}>
                  {getMedalEmoji(2)}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="#333">
                  {second.name}
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="900"
                  bgImage="linear-gradient(135deg, #C0C0C0 0%, #808080 100%)"
                  bgClip="text"
                  css={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {second.score}点
                </Text>
              </Box>
              {/* Platform */}
              <Box
                w="180px"
                h={getPodiumConfig(2).height}
                bg={getPodiumConfig(2).color}
                borderRadius="12px 12px 0 0"
                boxShadow="inset 0 2px 10px rgba(255,255,255,0.3), 0 -4px 20px rgba(0,0,0,0.2)"
                animation={`${podiumRise} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${getPodiumConfig(2).delay} both`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Text
                  fontSize="6xl"
                  fontWeight="900"
                  color="rgba(255,255,255,0.4)"
                  textShadow="2px 2px 4px rgba(0,0,0,0.2)"
                >
                  2
                </Text>
              </Box>
            </Box>
          )}

          {/* 1st Place - Center */}
          {first && (
            <Box
              position="absolute"
              bottom="50px"
              left="50%"
              transform="translateX(-50%)"
              w="220px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              zIndex={3}
            >
              {/* Crown animation */}
              <Text
                fontSize="5xl"
                animation={`${crownBounce} 2s ease-in-out infinite, ${fadeInUp} 0.5s ease-out 4.5s both`}
                mb={-2}
              >
                👑
              </Text>
              {/* Team Card */}
              <Box
                bg="white"
                borderRadius="xl"
                border="5px solid"
                borderColor="#FFD700"
                p={5}
                textAlign="center"
                boxShadow={`0 12px 40px rgba(0,0,0,0.2), ${getPodiumConfig(1).glow}`}
                animation={`${revealTeam} 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${getPodiumConfig(1).teamDelay} both, ${pulseGlow} 3s ease-in-out infinite 5s`}
                mb={3}
                position="relative"
                overflow="hidden"
              >
                {/* Gold shimmer overlay */}
                <Box
                  position="absolute"
                  inset={0}
                  bgImage="linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.1) 50%, transparent 100%)"
                  backgroundSize="200% 100%"
                  animation={`${goldShimmer} 2s linear infinite`}
                  pointerEvents="none"
                />
                <Text fontSize="5xl" mb={1} position="relative" zIndex={1}>
                  {getMedalEmoji(1)}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="#333" position="relative" zIndex={1}>
                  {first.name}
                </Text>
                <Text
                  fontSize="3xl"
                  fontWeight="900"
                  bgImage="linear-gradient(135deg, #FFD700 0%, #FF8800 50%, #FFD700 100%)"
                  backgroundSize="200% 100%"
                  bgClip="text"
                  css={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  animation={`${goldShimmer} 2s linear infinite`}
                  position="relative"
                  zIndex={1}
                >
                  {first.score}点
                </Text>
              </Box>
              {/* Platform */}
              <Box
                w="200px"
                h={getPodiumConfig(1).height}
                bg={getPodiumConfig(1).color}
                borderRadius="16px 16px 0 0"
                boxShadow="inset 0 4px 15px rgba(255,255,255,0.4), 0 -6px 30px rgba(255,215,0,0.4)"
                animation={`${podiumRise} 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${getPodiumConfig(1).delay} both`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Text
                  fontSize="7xl"
                  fontWeight="900"
                  color="rgba(255,255,255,0.5)"
                  textShadow="3px 3px 6px rgba(0,0,0,0.3)"
                >
                  1
                </Text>
              </Box>
            </Box>
          )}

          {/* 3rd Place - Right */}
          {third && (
            <Box
              position="absolute"
              bottom="50px"
              left="50%"
              transform="translateX(110px)"
              w="200px"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {/* Team Card */}
              <Box
                bg="white"
                borderRadius="xl"
                border="4px solid"
                borderColor={getPodiumConfig(3).borderColor}
                p={4}
                textAlign="center"
                boxShadow={`0 8px 30px rgba(0,0,0,0.15), ${getPodiumConfig(3).glow}`}
                animation={`${revealTeam} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${getPodiumConfig(3).teamDelay} both`}
                mb={3}
              >
                <Text fontSize="4xl" mb={1}>
                  {getMedalEmoji(3)}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="#333">
                  {third.name}
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="900"
                  bgImage="linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)"
                  bgClip="text"
                  css={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {third.score}点
                </Text>
              </Box>
              {/* Platform */}
              <Box
                w="180px"
                h={getPodiumConfig(3).height}
                bg={getPodiumConfig(3).color}
                borderRadius="12px 12px 0 0"
                boxShadow="inset 0 2px 10px rgba(255,255,255,0.3), 0 -4px 20px rgba(0,0,0,0.2)"
                animation={`${podiumRise} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${getPodiumConfig(3).delay} both`}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontSize="5xl"
                  fontWeight="900"
                  color="rgba(255,255,255,0.35)"
                  textShadow="2px 2px 4px rgba(0,0,0,0.2)"
                >
                  3
                </Text>
              </Box>
            </Box>
          )}
        </Box>

        {/* ========== Score History Chart ========== */}
        {scoreHistory.length > 0 && (
          <Box
            w="full"
            maxW="900px"
            mx="auto"
            bg="white"
            borderRadius="2xl"
            border="3px solid #FF8800"
            p={8}
            boxShadow="0 8px 40px rgba(255, 136, 0, 0.15)"
            animation={`${fadeInUp} 0.6s ease-out 5s both`}
          >
            <Text fontSize="2xl" fontWeight="bold" color="#E67A00" mb={6} textAlign="center">
              📈 スコア変遷グラフ
            </Text>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="time" tick={{ fill: "#666", fontSize: 12 }} axisLine={{ stroke: "#CCC" }} />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={{ stroke: "#CCC" }} domain={[0, maxScore]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #FF8800",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  {groupsWithAnswers.map((group) => (
                    <Line
                      key={group.groupId}
                      type="monotone"
                      dataKey={group.groupName}
                      stroke={groupColorMap[group.groupName]}
                      strokeWidth={3}
                      dot={{ fill: groupColorMap[group.groupName], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}

        {/* ========== Awards Section ========== */}
        {awards.length > 0 && (
          <Box
            w="full"
            maxW="900px"
            mx="auto"
            bg="white"
            borderRadius="2xl"
            border="3px solid #FF8800"
            p={8}
            boxShadow="0 8px 40px rgba(255, 136, 0, 0.15)"
            animation={`${fadeInUp} 0.6s ease-out 5.5s both`}
          >
            <Text fontSize="2xl" fontWeight="bold" color="#E67A00" mb={6} textAlign="center">
              🏆 大会アワード
            </Text>
            <VStack gap={4} align="stretch">
              {awards.map((award, index) => (
                <Box
                  key={award.title}
                  bg="linear-gradient(135deg, rgba(255, 136, 0, 0.05) 0%, rgba(255, 229, 0, 0.05) 100%)"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="rgba(255, 136, 0, 0.2)"
                  p={5}
                  animation={`${slideInLeft} 0.5s ease-out ${5.8 + index * 0.2}s both`}
                  _hover={{
                    borderColor: "rgba(255, 136, 0, 0.4)",
                    transform: "translateX(8px)",
                    transition: "all 0.3s",
                  }}
                >
                  <Flex align="center" gap={5}>
                    <Text fontSize="4xl">{award.icon}</Text>
                    <Box flex={1}>
                      <Text fontSize="lg" fontWeight="bold" color="#E67A00" mb={1}>
                        {award.title}
                      </Text>
                      <HStack gap={3}>
                        <Text fontSize="xl" fontWeight="bold" color="#333">
                          {award.winner}
                        </Text>
                        <Text fontSize="md" color="#666" bg="rgba(255, 136, 0, 0.1)" px={3} py={1} borderRadius="full">
                          {award.detail}
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* ========== Question Awards Section ========== */}
        {questionAwards.length > 0 && (
          <Box
            w="full"
            maxW="900px"
            mx="auto"
            bg="white"
            borderRadius="2xl"
            border="3px solid #FF8800"
            p={8}
            boxShadow="0 8px 40px rgba(255, 136, 0, 0.15)"
            animation={`${fadeInUp} 0.6s ease-out 6.5s both`}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative background pattern */}
            <Box
              position="absolute"
              top={0}
              right={0}
              w="200px"
              h="200px"
              bgImage="radial-gradient(circle at center, rgba(255, 136, 0, 0.08) 0%, transparent 70%)"
              pointerEvents="none"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              w="150px"
              h="150px"
              bgImage="radial-gradient(circle at center, rgba(255, 229, 0, 0.1) 0%, transparent 70%)"
              pointerEvents="none"
            />

            <Text fontSize="2xl" fontWeight="bold" color="#E67A00" mb={6} textAlign="center" position="relative">
              📝 問題アワード
            </Text>
            <VStack gap={5} align="stretch" position="relative">
              {questionAwards.map((award, index) => (
                <Box
                  key={award.title}
                  bg="linear-gradient(135deg, rgba(255, 136, 0, 0.03) 0%, rgba(255, 229, 0, 0.06) 100%)"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="rgba(255, 136, 0, 0.25)"
                  p={5}
                  animation={`${slideInLeft} 0.5s ease-out ${6.8 + index * 0.3}s both`}
                  _hover={{
                    borderColor: "rgba(255, 136, 0, 0.5)",
                    transform: "translateX(8px)",
                    boxShadow: "0 4px 20px rgba(255, 136, 0, 0.15)",
                    transition: "all 0.3s",
                  }}
                  position="relative"
                >
                  <Flex align="flex-start" gap={4}>
                    {/* Icon with glow effect */}
                    <Box
                      flexShrink={0}
                      w="60px"
                      h="60px"
                      bg={index === 0 ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"}
                      borderRadius="xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow={index === 0 ? "0 4px 15px rgba(34, 197, 94, 0.4)" : "0 4px 15px rgba(239, 68, 68, 0.4)"}
                    >
                      <Text fontSize="2xl">{award.icon}</Text>
                    </Box>

                    <Box flex={1} minW={0}>
                      {/* Title and detail badge */}
                      <Flex align="center" gap={3} mb={2} flexWrap="wrap">
                        <Text fontSize="lg" fontWeight="bold" color="#E67A00">
                          {award.title}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="white"
                          bg={index === 0 ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"}
                          px={3}
                          py={1}
                          borderRadius="full"
                          boxShadow={index === 0 ? "0 2px 8px rgba(34, 197, 94, 0.3)" : "0 2px 8px rgba(239, 68, 68, 0.3)"}
                        >
                          {award.detail}
                        </Text>
                      </Flex>

                      {/* Question text with quote style */}
                      <Box
                        bg="rgba(255, 136, 0, 0.05)"
                        borderLeft="4px solid"
                        borderColor={index === 0 ? "#22C55E" : "#EF4444"}
                        borderRadius="0 8px 8px 0"
                        p={3}
                        position="relative"
                      >
                        <Text
                          fontSize="md"
                          color="#333"
                          fontWeight="medium"
                          lineHeight="1.6"
                          css={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {award.question}
                        </Text>
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Footer space */}
        <Box h={8} />
      </VStack>

      {/* Bottom gradient fade */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="150px"
        bgGradient="to-t"
        gradientFrom="rgba(255, 250, 240, 0.9)"
        gradientTo="transparent"
        pointerEvents="none"
      />
    </Box>
  );
}
