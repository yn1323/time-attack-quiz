"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import {
  subscribeAllGroupAnswers,
  type GroupWithAnswers,
} from "@/lib/firestore/answer"
import type { Group } from "@/types/firestore"

// Animations
const zoomIn = keyframes`
  0% { opacity: 0; transform: scale(0.3); }
  60% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0.3; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
`

const buttonGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2);
  }
  50% {
    box-shadow: 0 0 50px rgba(34, 197, 94, 0.6), 0 0 100px rgba(34, 197, 94, 0.3);
  }
`

const bannerPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 40px rgba(255, 136, 0, 0.4); }
  50% { box-shadow: 0 12px 60px rgba(255, 136, 0, 0.6); }
`

const rankReveal = keyframes`
  0% { opacity: 0; transform: translateX(-30px); }
  100% { opacity: 1; transform: translateX(0); }
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

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        border: "#FFD700",
        text: "#B8860B",
        bg: "rgba(255, 215, 0, 0.1)",
      }
    case 2:
      return {
        border: "#C0C0C0",
        text: "#808080",
        bg: "rgba(192, 192, 192, 0.08)",
      }
    case 3:
      return {
        border: "#CD7F32",
        text: "#8B4513",
        bg: "rgba(205, 127, 50, 0.08)",
      }
    default:
      return { border: "#E0E0E0", text: "#666", bg: "transparent" }
  }
}

type Props = {
  lobbyId: string
  groups: Group[]
}

type RankingEntry = {
  rank: number
  groupId: string
  name: string
  score: number
}

export function AdminAfterQuiz({ lobbyId, groups }: Props) {
  const [groupsWithAnswers, setGroupsWithAnswers] = useState<GroupWithAnswers[]>([])

  // Subscribe to all group answers
  useEffect(() => {
    if (groups.length === 0) return

    const unsubscribe = subscribeAllGroupAnswers(lobbyId, groups, setGroupsWithAnswers)
    return () => unsubscribe()
  }, [lobbyId, groups])

  // Calculate final ranking
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

  return (
    <Box
      minH="100vh"
      bg="#FFFDF7"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Celebratory gradient background */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(ellipse at 50% 20%, rgba(255, 229, 0, 0.2) 0%, transparent 50%),
                 radial-gradient(ellipse at 20% 80%, rgba(255, 136, 0, 0.15) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 70%, rgba(255, 229, 0, 0.12) 0%, transparent 50%)"
        pointerEvents="none"
      />

      {/* Confetti particles */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          top="-20px"
          left={`${3 + i * 6.5}%`}
          w={`${10 + (i % 4) * 3}px`}
          h={`${10 + (i % 4) * 3}px`}
          bg={
            i % 4 === 0
              ? "#FFE500"
              : i % 4 === 1
                ? "#FF8800"
                : i % 4 === 2
                  ? "#22C55E"
                  : "#FF6B6B"
          }
          borderRadius={i % 2 === 0 ? "full" : "4px"}
          animation={`${confettiFall} ${4 + (i % 3)}s linear ${i * 0.2}s infinite`}
          opacity={0.8}
        />
      ))}

      {/* Sparkle decorations */}
      {[
        { top: "10%", left: "8%", delay: "0s" },
        { top: "15%", right: "10%", delay: "0.5s" },
        { top: "50%", left: "5%", delay: "1s" },
        { top: "45%", right: "7%", delay: "1.5s" },
        { top: "75%", left: "12%", delay: "2s" },
        { top: "70%", right: "12%", delay: "2.5s" },
      ].map((pos, i) => (
        <Text
          key={i}
          position="absolute"
          top={pos.top}
          left={pos.left}
          right={pos.right}
          fontSize="3xl"
          animation={`${sparkle} 2s ease-in-out ${pos.delay} infinite`}
        >
          ✨
        </Text>
      ))}

      {/* Floating shapes */}
      <Box
        position="absolute"
        top="20%"
        left="3%"
        w="80px"
        h="80px"
        bg="linear-gradient(135deg, rgba(255, 229, 0, 0.3) 0%, rgba(255, 136, 0, 0.2) 100%)"
        borderRadius="20px"
        animation={`${float} 7s ease-in-out infinite`}
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        bottom="25%"
        right="4%"
        w="70px"
        h="70px"
        border="5px solid rgba(34, 197, 94, 0.3)"
        borderRadius="50%"
        animation={`${float} 8s ease-in-out infinite 1s`}
      />

      {/* Main content */}
      <VStack
        flex={1}
        justify="center"
        gap={8}
        position="relative"
        zIndex={1}
        px={8}
        py={12}
      >
        {/* TIME UP banner */}
        <Box
          bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
          color="white"
          px={20}
          py={6}
          borderRadius="2xl"
          animation={`${zoomIn} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), ${bannerPulse} 3s ease-in-out infinite 1s`}
          position="relative"
          overflow="hidden"
        >
          {/* Shine effect */}
          <Box
            position="absolute"
            top={0}
            left="-100%"
            w="60%"
            h="100%"
            bgGradient="to-r"
            gradientFrom="transparent"
            gradientVia="rgba(255,255,255,0.4)"
            gradientTo="transparent"
            transform="skewX(-25deg)"
            animation="timeUpShine 4s ease-in-out infinite"
            css={{
              "@keyframes timeUpShine": {
                "0%": { left: "-100%" },
                "50%, 100%": { left: "200%" },
              },
            }}
          />
          <Text
            fontSize="6xl"
            fontWeight="900"
            letterSpacing="0.15em"
            textShadow="3px 3px 0 rgba(0,0,0,0.15)"
            position="relative"
            zIndex={1}
          >
            TIME UP!
          </Text>
        </Box>

        {/* Section title */}
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="#E67A00"
          animation={`${fadeInUp} 0.6s ease-out 0.3s both`}
        >
          最終ランキング
        </Text>

        {/* Final ranking list */}
        <VStack w="full" maxW="700px" gap={4}>
          {ranking.length === 0 ? (
            <Text color="gray.500" fontSize="xl">
              結果を読み込んでいます...
            </Text>
          ) : (
            ranking.map((team, index) => {
              const style = getRankStyle(team.rank)

              return (
                <Box
                  key={team.groupId}
                  w="full"
                  bg="white"
                  borderRadius="xl"
                  border="3px solid"
                  borderColor={style.border}
                  p={5}
                  boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                  animation={`${rankReveal} 0.5s ease-out ${0.4 + index * 0.15}s both`}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Background tint */}
                  <Box
                    position="absolute"
                    inset={0}
                    bg={style.bg}
                    pointerEvents="none"
                  />

                  <Flex
                    justify="space-between"
                    align="center"
                    position="relative"
                    zIndex={1}
                  >
                    <HStack gap={4}>
                      {/* Rank with medal */}
                      <HStack gap={2}>
                        <Text
                          fontSize="2xl"
                          fontWeight="900"
                          color={style.text}
                          minW="60px"
                        >
                          {team.rank}位
                        </Text>
                        {team.rank <= 3 && (
                          <Text fontSize="2xl">{getMedalEmoji(team.rank)}</Text>
                        )}
                      </HStack>

                      {/* Team name */}
                      <Text fontSize="2xl" fontWeight="bold" color="#333">
                        {team.name}
                      </Text>
                    </HStack>

                    {/* Score */}
                    <Text
                      fontSize="3xl"
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
                      <Text as="span" fontSize="xl">
                        点
                      </Text>
                    </Text>
                  </Flex>
                </Box>
              )
            })
          )}
        </VStack>

        {/* Results button */}
        <Box mt={4} animation={`${fadeInUp} 0.6s ease-out 1s both`}>
          <Link href={`/lobby/${lobbyId}/result`}>
            <Box
              as="button"
              w="320px"
              h="90px"
              bg="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
              color="white"
              fontSize="2xl"
              fontWeight="900"
              borderRadius="full"
              border="none"
              cursor="pointer"
              animation={`${buttonGlow} 2s ease-in-out infinite`}
              position="relative"
              overflow="hidden"
              _hover={{
                transform: "scale(1.05)",
              }}
              _active={{
                transform: "scale(0.98)",
              }}
              transition="transform 0.2s"
            >
              {/* Button shine effect */}
              <Box
                position="absolute"
                top={0}
                left="-100%"
                w="60%"
                h="100%"
                bgGradient="to-r"
                gradientFrom="transparent"
                gradientVia="rgba(255,255,255,0.3)"
                gradientTo="transparent"
                transform="skewX(-25deg)"
                animation="resultButtonShine 3s ease-in-out infinite"
                css={{
                  "@keyframes resultButtonShine": {
                    "0%": { left: "-100%" },
                    "50%, 100%": { left: "200%" },
                  },
                }}
              />
              <Text position="relative" zIndex={1}>
                結果発表へ進む
              </Text>
            </Box>
          </Link>
        </Box>
      </VStack>

      {/* Bottom gradient */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="120px"
        bgGradient="to-t"
        gradientFrom="rgba(255, 245, 230, 0.7)"
        gradientTo="transparent"
        pointerEvents="none"
      />
    </Box>
  )
}
