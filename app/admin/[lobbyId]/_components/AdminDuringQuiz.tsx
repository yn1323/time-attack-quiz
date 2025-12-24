"use client"

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"

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

const progressShimmer = keyframes`
  0% { left: -50%; }
  100% { left: 150%; }
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

// Mock data
const MOCK_RANKING = [
  { rank: 1, name: "チームA", score: 125 },
  { rank: 2, name: "チームC", score: 108 },
  { rank: 3, name: "チームB", score: 95 },
  { rank: 4, name: "チームD", score: 72 },
]

const MOCK_TIME = { minutes: 7, seconds: 32 }
const MAX_SCORE = 150 // For progress bar calculation

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
      return { border: "#FFD700", bg: "rgba(255, 215, 0, 0.08)", shadow: "rgba(255, 215, 0, 0.3)" }
    case 2:
      return { border: "#C0C0C0", bg: "rgba(192, 192, 192, 0.08)", shadow: "rgba(192, 192, 192, 0.3)" }
    case 3:
      return { border: "#CD7F32", bg: "rgba(205, 127, 50, 0.08)", shadow: "rgba(205, 127, 50, 0.3)" }
    default:
      return { border: "#E0E0E0", bg: "rgba(0, 0, 0, 0.02)", shadow: "rgba(0, 0, 0, 0.1)" }
  }
}

export function AdminDuringQuiz() {
  const timeString = `${MOCK_TIME.minutes}:${MOCK_TIME.seconds.toString().padStart(2, "0")}`

  return (
    <Box
      minH="100vh"
      bg="#FFFDF7"
      position="relative"
      overflow="hidden"
    >
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
      <Flex
        justify="flex-end"
        align="center"
        p={8}
        position="relative"
        zIndex={1}
      >
        <HStack
          bg="white"
          px={8}
          py={4}
          borderRadius="2xl"
          border="4px solid"
          borderColor="#FF8800"
          boxShadow="0 8px 30px rgba(255, 136, 0, 0.25)"
          animation={`${timerPulse} 1s ease-in-out infinite`}
        >
          <Text fontSize="5xl">⏱️</Text>
          <Text
            fontSize="7xl"
            fontWeight="900"
            bgImage="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
            bgClip="text"
            color="transparent"
            fontFamily="mono"
            letterSpacing="0.05em"
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
            🏆 リアルタイムランキング 🏆
          </Text>
        </Box>

        {/* Ranking cards */}
        <VStack w="full" maxW="900px" gap={5}>
          {MOCK_RANKING.map((team, index) => {
            const colors = getRankColor(team.rank)
            const progressPercent = (team.score / MAX_SCORE) * 100

            return (
              <Box
                key={team.rank}
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
                <Box position="relative" zIndex={1}>
                  <Flex justify="space-between" align="center" mb={4}>
                    <HStack gap={4}>
                      {/* Rank number with medal */}
                      <HStack gap={2}>
                        <Text
                          fontSize="4xl"
                          fontWeight="900"
                          color={team.rank <= 3 ? colors.border : "#666"}
                          animation={team.rank === 1 ? `${rankBounce} 2s ease-in-out infinite` : "none"}
                        >
                          {team.rank}位
                        </Text>
                        {team.rank <= 3 && (
                          <Text fontSize="4xl" animation={`${rankBounce} 2s ease-in-out infinite ${team.rank * 0.2}s`}>
                            {getMedalEmoji(team.rank)}
                          </Text>
                        )}
                      </HStack>

                      {/* Team name */}
                      <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        color="#333"
                        ml={4}
                      >
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
                      <Text as="span" fontSize="2xl">点</Text>
                    </Text>
                  </Flex>

                  {/* Progress bar */}
                  <Box
                    w="full"
                    h="24px"
                    bg="gray.100"
                    borderRadius="full"
                    overflow="hidden"
                    position="relative"
                  >
                    <Box
                      h="full"
                      w={`${progressPercent}%`}
                      bgImage="linear-gradient(90deg, #FF8800 0%, #FFE500 50%, #FF8800 100%)"
                      bgSize="200% auto"
                      borderRadius="full"
                      position="relative"
                      overflow="hidden"
                      transition="width 0.5s ease-out"
                    >
                      {/* Shimmer effect on progress bar */}
                      <Box
                        position="absolute"
                        top={0}
                        left="-50%"
                        w="30%"
                        h="100%"
                        bgGradient="to-r"
                        gradientFrom="transparent"
                        gradientVia="rgba(255,255,255,0.5)"
                        gradientTo="transparent"
                        animation={`${progressShimmer} 2s ease-in-out infinite`}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </VStack>
      </VStack>

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
