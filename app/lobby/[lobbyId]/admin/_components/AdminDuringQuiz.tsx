"use client"

import { useEffect, useMemo, useState } from "react"
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import {
  subscribeAllGroupAnswers,
  type GroupWithAnswers,
} from "@/lib/firestore/answer"
import { finishLobby } from "@/lib/firestore/lobby"
import type { Group, Lobby } from "@/types/firestore"

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`

const timerPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 136, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 136, 0, 0.5); }
`

const rankBounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const urgentPulse = keyframes`
  0%, 100% { transform: scale(1); color: #FF8800; }
  50% { transform: scale(1.05); color: #FF0000; }
`

const getMedalEmoji = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇"
    case 2:
      return "🥈"
    case 3:
      return "🥉"
    default:
      return ""
  }
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        border: "#FFD700",
        bg: "rgba(255, 215, 0, 0.08)",
        shadow: "rgba(255, 215, 0, 0.3)",
      }
    case 2:
      return {
        border: "#C0C0C0",
        bg: "rgba(192, 192, 192, 0.08)",
        shadow: "rgba(192, 192, 192, 0.3)",
      }
    case 3:
      return {
        border: "#CD7F32",
        bg: "rgba(205, 127, 50, 0.08)",
        shadow: "rgba(205, 127, 50, 0.3)",
      }
    default:
      return {
        border: "#E0E0E0",
        bg: "rgba(0, 0, 0, 0.02)",
        shadow: "rgba(0, 0, 0, 0.1)",
      }
  }
}

type Props = {
  lobbyId: string
  lobby: Lobby
  groups: Group[]
}

type RankingEntry = {
  rank: number
  groupId: string
  name: string
  score: number
}

export function AdminDuringQuiz({ lobbyId, lobby, groups }: Props) {
  const [groupsWithAnswers, setGroupsWithAnswers] = useState<GroupWithAnswers[]>([])
  const [remainingSeconds, setRemainingSeconds] = useState<number>(lobby.durationSeconds)
  const [hasFinished, setHasFinished] = useState(false)

  // Subscribe to all group answers
  useEffect(() => {
    if (groups.length === 0) return

    const unsubscribe = subscribeAllGroupAnswers(lobbyId, groups, setGroupsWithAnswers)
    return () => unsubscribe()
  }, [lobbyId, groups])

  // Timer countdown
  useEffect(() => {
    const startedAt = lobby.startedAt
    if (!startedAt) return

    const updateTimer = () => {
      const startTime = startedAt.toMillis()
      const now = Date.now()
      const elapsedSeconds = Math.floor((now - startTime) / 1000)
      const remaining = Math.max(0, lobby.durationSeconds - elapsedSeconds)
      setRemainingSeconds(remaining)

      if (remaining === 0 && !hasFinished) {
        setHasFinished(true)
        finishLobby(lobbyId).catch(console.error)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [lobby.startedAt, lobby.durationSeconds, lobbyId, hasFinished])

  // Calculate ranking
  const ranking: RankingEntry[] = useMemo(() => {
    return groupsWithAnswers
      .map((group) => ({
        groupId: group.groupId,
        name: group.groupName,
        score: group.answers.reduce((sum, answer) => sum + answer.scoreChange, 0),
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
  }, [groupsWithAnswers])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`
  const isUrgent = remainingSeconds <= 60
  const isCountdownMode = remainingSeconds <= 120

  return (
    <Box minH="100vh" bg="#FFFDF7" position="relative" overflow="hidden">
      {/* Dynamic gradient background */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(ellipse at 80% 20%, rgba(255, 136, 0, 0.12) 0%, transparent 50%),
                 radial-gradient(ellipse at 20% 80%, rgba(255, 229, 0, 0.1) 0%, transparent 50%),
                 radial-gradient(ellipse at 50% 50%, rgba(255, 136, 0, 0.05) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Floating decorations */}
      <Box
        position="absolute"
        top="10%"
        left="3%"
        w="80px"
        h="80px"
        bg="linear-gradient(135deg, rgba(255, 229, 0, 0.25) 0%, rgba(255, 136, 0, 0.15) 100%)"
        borderRadius="20px"
        animation={`${float} 7s ease-in-out infinite`}
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        bottom="15%"
        right="4%"
        w="90px"
        h="90px"
        border="5px solid rgba(255, 136, 0, 0.2)"
        borderRadius="50%"
        animation={`${float} 8s ease-in-out infinite 1s`}
      />
      <Box
        position="absolute"
        top="60%"
        left="2%"
        w="50px"
        h="50px"
        bg="linear-gradient(135deg, rgba(255, 136, 0, 0.2) 0%, rgba(255, 229, 0, 0.1) 100%)"
        borderRadius="12px"
        animation={`${float} 6s ease-in-out infinite 0.5s`}
        transform="rotate(-15deg)"
      />

      {/* Header with timer */}
      <Flex justify="flex-end" align="center" p={8} position="relative" zIndex={1}>
        <HStack
          bg="white"
          px={8}
          py={4}
          borderRadius="2xl"
          border="4px solid"
          borderColor={isUrgent ? "#FF0000" : "#FF8800"}
          boxShadow={
            isUrgent
              ? "0 8px 30px rgba(255, 0, 0, 0.35)"
              : "0 8px 30px rgba(255, 136, 0, 0.25)"
          }
          animation={`${timerPulse} 1s ease-in-out infinite`}
        >
          <Text fontSize="5xl">⏱️</Text>
          <Text
            fontSize="7xl"
            fontWeight="900"
            bgImage={
              isUrgent
                ? "linear-gradient(135deg, #FF0000 0%, #FF8800 100%)"
                : "linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
            }
            bgClip="text"
            color="transparent"
            fontFamily="mono"
            letterSpacing="0.05em"
            animation={isUrgent ? `${urgentPulse} 0.5s ease-in-out infinite` : "none"}
            css={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {timeString}
          </Text>
        </HStack>
      </Flex>

      {/* Main content */}
      {isCountdownMode ? (
        /* Countdown mode - Large timer display */
        <Flex
          direction="column"
          align="center"
          justify="center"
          flex={1}
          minH="70vh"
          position="relative"
          zIndex={1}
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="#FF8800"
            mb={4}
            animation={`${fadeInUp} 0.5s ease-out`}
          >
            まもなく終了！
          </Text>
          <Box
            bg="white"
            px={16}
            py={12}
            borderRadius="3xl"
            border="6px solid #FF8800"
            boxShadow="0 12px 50px rgba(255, 136, 0, 0.4)"
            animation={`${timerPulse} 1s ease-in-out infinite`}
          >
            <Text
              fontSize="12rem"
              fontWeight="900"
              bgImage="linear-gradient(135deg, #FF8800 0%, #FFE500 100%)"
              bgClip="text"
              color="transparent"
              fontFamily="mono"
              lineHeight={1}
              css={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {timeString}
            </Text>
          </Box>
          <Text
            fontSize="2xl"
            color="#666"
            mt={6}
            animation={`${fadeInUp} 0.5s ease-out 0.2s both`}
          >
            結果発表をお楽しみに！
          </Text>
        </Flex>
      ) : (
        /* Normal mode - Ranking display */
        <VStack gap={8} px={12} pb={12} position="relative" zIndex={1}>
          {/* Title */}
          <Box textAlign="center" animation={`${fadeInUp} 0.6s ease-out`}>
            <Text
              fontSize="5xl"
              fontWeight="900"
              bgImage="linear-gradient(135deg, #FF8800 0%, #FFE500 50%, #FF8800 100%)"
              bgSize="200% auto"
              bgClip="text"
              color="transparent"
              letterSpacing="0.05em"
              animation={`${shimmer} 3s linear infinite`}
              css={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              リアルタイムランキング
            </Text>
          </Box>

          {/* Ranking cards */}
          <VStack w="full" maxW="900px" gap={5}>
          {ranking.length === 0 ? (
            <Text color="gray.500" fontSize="xl">
              回答を待っています...
            </Text>
          ) : (
            ranking.map((team, index) => {
              const colors = getRankColor(team.rank)

              return (
                <Box
                  key={team.groupId}
                  w="full"
                  bg="white"
                  borderRadius="2xl"
                  border="4px solid"
                  borderColor={colors.border}
                  p={6}
                  boxShadow={`0 8px 30px ${colors.shadow}`}
                  animation={`${fadeInUp} 0.5s ease-out ${index * 0.1}s both, ${team.rank <= 3 ? glowPulse : "none"} 3s ease-in-out infinite`}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Background tint */}
                  <Box
                    position="absolute"
                    inset={0}
                    bg={colors.bg}
                    pointerEvents="none"
                  />

                  {/* Card content */}
                  <Flex position="relative" zIndex={1} justify="space-between" align="center">
                    <HStack gap={4}>
                      {/* Rank number with medal */}
                      <HStack gap={2}>
                        <Text
                          fontSize="4xl"
                          fontWeight="900"
                          color={team.rank <= 3 ? colors.border : "#666"}
                          animation={
                            team.rank === 1
                              ? `${rankBounce} 2s ease-in-out infinite`
                              : "none"
                          }
                        >
                          {team.rank}位
                        </Text>
                        {team.rank <= 3 && (
                          <Text
                            fontSize="4xl"
                            animation={`${rankBounce} 2s ease-in-out infinite ${team.rank * 0.2}s`}
                          >
                            {getMedalEmoji(team.rank)}
                          </Text>
                        )}
                      </HStack>

                      {/* Team name */}
                      <Text fontSize="3xl" fontWeight="bold" color="#333" ml={4}>
                        {team.name}
                      </Text>
                    </HStack>

                    {/* Score */}
                    <Text
                      fontSize="5xl"
                      fontWeight="900"
                      bgImage="linear-gradient(135deg, #FF8800 0%, #FFE500 100%)"
                      bgClip="text"
                      color="transparent"
                      css={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {team.score}
                      <Text as="span" fontSize="2xl">
                        点
                      </Text>
                    </Text>
                  </Flex>
                </Box>
              )
            })
          )}
          </VStack>
        </VStack>
      )}

      {/* Bottom gradient fade */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="100px"
        bgGradient="to-t"
        gradientFrom="rgba(255, 245, 230, 0.6)"
        gradientTo="transparent"
        pointerEvents="none"
      />
    </Box>
  )
}
