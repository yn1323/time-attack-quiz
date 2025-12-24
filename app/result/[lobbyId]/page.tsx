"use client"

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// ============================================
// Animations
// ============================================

const zoomIn = keyframes`
  0% { opacity: 0; transform: scale(0.3) rotate(-5deg); }
  60% { transform: scale(1.08) rotate(1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(8deg); }
`

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0.3; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.4; transform: scale(0.7) rotate(180deg); }
`

const podiumRise = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  60% { transform: translateY(-10%); }
  100% { transform: translateY(0); opacity: 1; }
`

const revealTeam = keyframes`
  0% { opacity: 0; transform: scale(0.5) translateY(30px); }
  60% { transform: scale(1.1) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`

const goldShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const crownBounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  25% { transform: translateY(-8px) rotate(3deg); }
  75% { transform: translateY(-4px) rotate(-2deg); }
`

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 50px rgba(255, 215, 0, 0.6), 0 0 100px rgba(255, 215, 0, 0.4); }
`

const slideInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-60px); }
  100% { opacity: 1; transform: translateX(0); }
`

// ============================================
// Mock Data
// ============================================

const MOCK_RANKING = [
  { rank: 1, name: "チームA", score: 125 },
  { rank: 2, name: "チームC", score: 108 },
  { rank: 3, name: "チームB", score: 95 },
  { rank: 4, name: "チームD", score: 72 },
]

const MOCK_AWARDS = [
  { icon: "🏃", title: "最速正解賞", winner: "チームA", detail: "平均3.2秒" },
  { icon: "🔥", title: "ラストスパート賞", winner: "チームC", detail: "+28点" },
  { icon: "✨", title: "連続正解記録", winner: "チームB", detail: "8問連続" },
]

const MOCK_SCORE_HISTORY = [
  { time: "0:00", チームA: 0, チームB: 0, チームC: 0, チームD: 0 },
  { time: "1:00", チームA: 15, チームB: 10, チームC: 8, チームD: 5 },
  { time: "2:00", チームA: 28, チームB: 23, チームC: 18, チームD: 15 },
  { time: "3:00", チームA: 45, チームB: 38, チームC: 30, チームD: 25 },
  { time: "4:00", チームA: 58, チームB: 52, チームC: 45, チームD: 35 },
  { time: "5:00", チームA: 72, チームB: 65, チームC: 58, チームD: 42 },
  { time: "6:00", チームA: 85, チームB: 75, チームC: 70, チームD: 50 },
  { time: "7:00", チームA: 98, チームB: 82, チームC: 82, チームD: 58 },
  { time: "8:00", チームA: 110, チームB: 88, チームC: 95, チームD: 65 },
  { time: "9:00", チームA: 118, チームB: 92, チームC: 102, チームD: 70 },
  { time: "10:00", チームA: 125, チームB: 95, チームC: 108, チームD: 72 },
]

const TEAM_COLORS = {
  チームA: "#FF8800",
  チームB: "#22C55E",
  チームC: "#3B82F6",
  チームD: "#A855F7",
}

// ============================================
// Helper Functions
// ============================================

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
      }
    case 2:
      return {
        height: "150px",
        color: "linear-gradient(180deg, #E8E8E8 0%, #C0C0C0 50%, #A0A0A0 100%)",
        borderColor: "#C0C0C0",
        delay: "2.5s",
        teamDelay: "3s",
        glow: "0 0 30px rgba(192, 192, 192, 0.4)",
        zIndex: 2,
      }
    case 3:
      return {
        height: "110px",
        color: "linear-gradient(180deg, #E0A060 0%, #CD7F32 50%, #8B4513 100%)",
        borderColor: "#CD7F32",
        delay: "1.5s",
        teamDelay: "2s",
        glow: "0 0 25px rgba(205, 127, 50, 0.4)",
        zIndex: 1,
      }
    default:
      return {
        height: "80px",
        color: "#E0E0E0",
        borderColor: "#999",
        delay: "1s",
        teamDelay: "1.5s",
        glow: "none",
        zIndex: 0,
      }
  }
}

// ============================================
// Main Component
// ============================================

export default function ResultPage() {
  const top3 = MOCK_RANKING.filter((t) => t.rank <= 3)
  const first = top3.find((t) => t.rank === 1)!
  const second = top3.find((t) => t.rank === 2)!
  const third = top3.find((t) => t.rank === 3)!

  return (
    <Box
      minH="100vh"
      bg="#FFFDF7"
      position="relative"
      overflow="hidden"
    >
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
      <VStack
        position="relative"
        zIndex={1}
        py={8}
        px={6}
        gap={10}
        minH="100vh"
      >
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
          h="380px"
          mx="auto"
          animation={`${fadeInUp} 0.8s ease-out 0.5s both`}
        >
          {/* Podium base / stage */}
          <Box
            position="absolute"
            bottom={0}
            left="50%"
            transform="translateX(-50%)"
            w="620px"
            h="50px"
            bg="linear-gradient(180deg, #4A4A4A 0%, #2D2D2D 50%, #1A1A1A 100%)"
            borderRadius="8px 8px 0 0"
            boxShadow="0 -4px 20px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)"
            animation={`${fadeInUp} 0.6s ease-out 0.8s both`}
          />

          {/* 2nd Place - Left */}
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
              <Text fontSize="4xl" mb={1}>{getMedalEmoji(2)}</Text>
              <Text fontSize="xl" fontWeight="bold" color="#333">{second.name}</Text>
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

          {/* 1st Place - Center */}
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
              <Text fontSize="5xl" mb={1} position="relative" zIndex={1}>{getMedalEmoji(1)}</Text>
              <Text fontSize="2xl" fontWeight="bold" color="#333" position="relative" zIndex={1}>{first.name}</Text>
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

          {/* 3rd Place - Right */}
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
              <Text fontSize="4xl" mb={1}>{getMedalEmoji(3)}</Text>
              <Text fontSize="xl" fontWeight="bold" color="#333">{third.name}</Text>
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
        </Box>

        {/* ========== Score History Chart ========== */}
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
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="#E67A00"
            mb={6}
            textAlign="center"
          >
            📈 スコア変遷グラフ
          </Text>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_SCORE_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#CCC" }}
                />
                <YAxis
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#CCC" }}
                  domain={[0, 140]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #FF8800",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="チームA"
                  stroke={TEAM_COLORS.チームA}
                  strokeWidth={3}
                  dot={{ fill: TEAM_COLORS.チームA, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="チームB"
                  stroke={TEAM_COLORS.チームB}
                  strokeWidth={3}
                  dot={{ fill: TEAM_COLORS.チームB, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="チームC"
                  stroke={TEAM_COLORS.チームC}
                  strokeWidth={3}
                  dot={{ fill: TEAM_COLORS.チームC, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="チームD"
                  stroke={TEAM_COLORS.チームD}
                  strokeWidth={3}
                  dot={{ fill: TEAM_COLORS.チームD, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* ========== Awards Section ========== */}
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
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="#E67A00"
            mb={6}
            textAlign="center"
          >
            🏆 大会アワード
          </Text>
          <VStack gap={4} align="stretch">
            {MOCK_AWARDS.map((award, index) => (
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
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="#E67A00"
                      mb={1}
                    >
                      {award.title}
                    </Text>
                    <HStack gap={3}>
                      <Text fontSize="xl" fontWeight="bold" color="#333">
                        {award.winner}
                      </Text>
                      <Text
                        fontSize="md"
                        color="#666"
                        bg="rgba(255, 136, 0, 0.1)"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {award.detail}
                      </Text>
                    </HStack>
                  </Box>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

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
  )
}
