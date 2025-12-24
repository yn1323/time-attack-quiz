"use client"

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"

// Animations
const zoomIn = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  70% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(255, 229, 0, 0.4), 0 8px 40px rgba(255, 136, 0, 0.2); }
  50% { box-shadow: 0 0 50px rgba(255, 229, 0, 0.6), 0 8px 60px rgba(255, 136, 0, 0.3); }
`

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0.3; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
`

// Mock data
const MOCK_TEAM = { name: "チームA" }
const MOCK_FINAL = {
  score: 125,
  correctCount: 28,
  totalCount: 35,
  maxStreak: 8,
}

export function GroupFinished() {
  const accuracyRate = Math.round((MOCK_FINAL.correctCount / MOCK_FINAL.totalCount) * 100)

  return (
    <Box
      minH="100vh"
      bg="#FFFDF7"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Celebratory background gradient */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(ellipse at 50% 30%, rgba(255, 229, 0, 0.2) 0%, transparent 50%),
                 radial-gradient(ellipse at 20% 80%, rgba(255, 136, 0, 0.15) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 70%, rgba(255, 229, 0, 0.12) 0%, transparent 50%)"
        pointerEvents="none"
      />

      {/* Confetti particles */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          top="-20px"
          left={`${5 + i * 8}%`}
          w={`${10 + (i % 3) * 4}px`}
          h={`${10 + (i % 3) * 4}px`}
          bg={i % 3 === 0 ? "#FFE500" : i % 3 === 1 ? "#FF8800" : "#22C55E"}
          borderRadius={i % 2 === 0 ? "full" : "3px"}
          animation={`${confettiFall} ${4 + (i % 3)}s linear ${i * 0.3}s infinite`}
          opacity={0.7}
        />
      ))}

      {/* Sparkle decorations */}
      {[
        { top: "15%", left: "10%", delay: "0s" },
        { top: "20%", right: "15%", delay: "0.5s" },
        { top: "70%", left: "8%", delay: "1s" },
        { top: "65%", right: "10%", delay: "1.5s" },
      ].map((pos, i) => (
        <Text
          key={i}
          position="absolute"
          top={pos.top}
          left={pos.left}
          right={pos.right}
          fontSize="2xl"
          animation={`${sparkle} 2s ease-in-out ${pos.delay} infinite`}
        >
          ✨
        </Text>
      ))}

      {/* Floating geometric shapes */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        w="70px"
        h="70px"
        bg="linear-gradient(135deg, #FFE500 0%, #FF8800 100%)"
        borderRadius="18px"
        opacity={0.4}
        animation={`${float} 6s ease-in-out infinite`}
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="8%"
        w="60px"
        h="60px"
        border="5px solid rgba(255, 136, 0, 0.4)"
        borderRadius="50%"
        animation={`${float} 7s ease-in-out infinite 1s`}
      />

      {/* Main content */}
      <VStack gap={6} position="relative" zIndex={1} textAlign="center" px={4}>
        {/* TIME UP banner */}
        <Box
          bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
          color="white"
          px={{ base: 10, md: 16 }}
          py={{ base: 4, md: 5 }}
          borderRadius="2xl"
          animation={`${zoomIn} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`}
          boxShadow="0 8px 40px rgba(255, 136, 0, 0.4)"
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
            gradientVia="rgba(255,255,255,0.3)"
            gradientTo="transparent"
            transform="skewX(-25deg)"
            animation="shine 3s ease-in-out infinite"
            css={{
              "@keyframes shine": {
                "0%": { left: "-100%" },
                "50%, 100%": { left: "200%" },
              },
            }}
          />
          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="900"
            letterSpacing="0.1em"
            textShadow="2px 2px 0 rgba(0,0,0,0.1)"
          >
            TIME UP!
          </Text>
        </Box>

        {/* Team name */}
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="#E67A00"
          animation={`${fadeInUp} 0.6s ease-out 0.2s both`}
        >
          {MOCK_TEAM.name}
        </Text>

        {/* Score card */}
        <Box
          bg="white"
          px={{ base: 10, md: 16 }}
          py={{ base: 8, md: 10 }}
          borderRadius="3xl"
          border="6px solid"
          borderColor="#FFE500"
          animation={`${fadeInUp} 0.6s ease-out 0.3s both, ${pulseGlow} 3s ease-in-out infinite 1s`}
          position="relative"
          minW={{ base: "280px", md: "350px" }}
        >
          {/* Corner decorations */}
          <Box
            position="absolute"
            top="-3px"
            left="-3px"
            w="30px"
            h="30px"
            borderTop="6px solid #FF8800"
            borderLeft="6px solid #FF8800"
            borderTopLeftRadius="3xl"
          />
          <Box
            position="absolute"
            bottom="-3px"
            right="-3px"
            w="30px"
            h="30px"
            borderBottom="6px solid #FF8800"
            borderRight="6px solid #FF8800"
            borderBottomRightRadius="3xl"
          />

          <VStack gap={2}>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="#888"
              fontWeight="medium"
              letterSpacing="0.1em"
            >
              最終スコア
            </Text>
            <Text
              fontSize={{ base: "5xl", md: "7xl" }}
              fontWeight="900"
              bgImage="linear-gradient(90deg, #FF8800, #FFE500, #FF8800, #FFE500)"
              bgSize="200% auto"
              bgClip="text"
              color="transparent"
              animation={`${shimmer} 3s linear infinite`}
              lineHeight="1"
              css={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {MOCK_FINAL.score}
              <Text as="span" fontSize={{ base: "2xl", md: "3xl" }}>点</Text>
            </Text>
          </VStack>
        </Box>

        {/* Statistics */}
        <Box
          bg="white"
          px={{ base: 6, md: 10 }}
          py={5}
          borderRadius="2xl"
          border="3px solid"
          borderColor="rgba(255, 136, 0, 0.2)"
          boxShadow="0 4px 20px rgba(255, 136, 0, 0.1)"
          animation={`${fadeInUp} 0.6s ease-out 0.5s both`}
        >
          <HStack gap={{ base: 6, md: 10 }} flexWrap="wrap" justify="center">
            <VStack gap={1}>
              <Text fontSize="sm" color="#888" fontWeight="medium">正解数</Text>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color="#333">
                {MOCK_FINAL.correctCount}
                <Text as="span" fontSize="md" color="#666" fontWeight="medium"> / {MOCK_FINAL.totalCount}問</Text>
              </Text>
            </VStack>

            <Box w="1px" h="40px" bg="rgba(255, 136, 0, 0.2)" />

            <VStack gap={1}>
              <Text fontSize="sm" color="#888" fontWeight="medium">正解率</Text>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color="#22C55E">
                {accuracyRate}%
              </Text>
            </VStack>

            <Box w="1px" h="40px" bg="rgba(255, 136, 0, 0.2)" />

            <VStack gap={1}>
              <Text fontSize="sm" color="#888" fontWeight="medium">連続正解</Text>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color="#E67A00">
                {MOCK_FINAL.maxStreak}問
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Waiting message */}
        <Box
          mt={4}
          px={8}
          py={4}
          bg="rgba(255, 136, 0, 0.08)"
          borderRadius="2xl"
          border="2px dashed"
          borderColor="rgba(255, 136, 0, 0.3)"
          animation={`${fadeInUp} 0.6s ease-out 0.7s both`}
        >
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="#E67A00"
            fontWeight="medium"
          >
            結果発表をお待ちください
          </Text>
        </Box>
      </VStack>

      {/* Bottom gradient */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="150px"
        bgGradient="to-t"
        gradientFrom="rgba(255, 245, 230, 0.8)"
        gradientTo="transparent"
        pointerEvents="none"
      />
    </Box>
  )
}
