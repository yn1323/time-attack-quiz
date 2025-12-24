"use client"

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"

// Animations
const bounceIn = keyframes`
  0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.08); }
  70% { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`

const slideInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`

const pulseCorrect = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.7); }
`

const pulseIncorrect = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.7); }
`

const pulse = keyframes`
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 136, 0, 0.3); }
  50% { box-shadow: 0 4px 25px rgba(255, 136, 0, 0.5); }
`

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
`

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`

// Mock data - 正解パターン
const MOCK_TEAM = { name: "チームA", score: 50, remainingTime: "7:28" }
const MOCK_RESULT = {
  isCorrect: true, // false に変更すると不正解表示
  question: "日本で一番高い山は?",
  choices: ["富士山", "北岳", "奥穂高岳"],
  correctIndex: 0,
  selectedIndex: 0, // 不正解時は 1 など
  pointChange: 5, // 不正解時は -2
}

export function GroupResult() {
  const { isCorrect, question, choices, correctIndex, selectedIndex, pointChange } = MOCK_RESULT
  const choiceLabels = ["A", "B", "C"]

  return (
    <Box minH="100vh" bg="#FFFDF7" position="relative" overflow="hidden">
      {/* Background gradient */}
      <Box
        position="absolute"
        inset={0}
        bgImage={isCorrect
          ? "radial-gradient(ellipse at 50% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255, 229, 0, 0.1) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255, 136, 0, 0.08) 0%, transparent 50%)"
        }
        pointerEvents="none"
      />

      {/* Confetti particles (正解時のみ) */}
      {isCorrect && (
        <>
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              position="absolute"
              top="20%"
              left={`${10 + i * 12}%`}
              w="12px"
              h="12px"
              bg={i % 2 === 0 ? "#FFE500" : "#22C55E"}
              borderRadius={i % 3 === 0 ? "full" : "2px"}
              animation={`${confetti} 2s ease-out ${i * 0.1}s infinite`}
              opacity={0.8}
            />
          ))}
        </>
      )}

      {/* Status Bar */}
      <Flex
        justify="space-between"
        align="center"
        px={{ base: 6, md: 10 }}
        py={4}
        bg="white"
        borderBottom="5px solid"
        borderColor={isCorrect ? "#22C55E" : "#EF4444"}
        position="relative"
        zIndex={10}
        boxShadow={`0 4px 20px ${isCorrect ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)"}`}
      >
        <HStack gap={3}>
          <Box
            w="14px"
            h="14px"
            bg={isCorrect
              ? "linear-gradient(135deg, #22C55E, #4ADE80)"
              : "linear-gradient(135deg, #EF4444, #F87171)"
            }
            borderRadius="full"
            boxShadow={`0 0 10px ${isCorrect ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)"}`}
          />
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color="#333">
            {MOCK_TEAM.name}
          </Text>
        </HStack>

        <HStack gap={{ base: 4, md: 8 }}>
          <HStack gap={2}>
            <Text fontSize={{ base: "xl", md: "2xl" }}>⏱️</Text>
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="900"
              color="#E67A00"
              fontVariantNumeric="tabular-nums"
            >
              {MOCK_TEAM.remainingTime}
            </Text>
          </HStack>

          <HStack gap={2}>
            <Text fontSize={{ base: "xl", md: "2xl" }}>💰</Text>
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="900"
              color={isCorrect ? "#22C55E" : "#EF4444"}
            >
              {MOCK_TEAM.score}点
            </Text>
          </HStack>
        </HStack>
      </Flex>

      {/* Main Content */}
      <VStack
        py={{ base: 6, md: 10 }}
        px={{ base: 4, md: 12 }}
        gap={{ base: 5, md: 8 }}
        position="relative"
        zIndex={1}
        maxW="800px"
        mx="auto"
      >
        {/* Result Banner */}
        <Box
          bg={isCorrect ? "#DCFCE7" : "#FEE2E2"}
          border="5px solid"
          borderColor={isCorrect ? "#22C55E" : "#EF4444"}
          borderRadius="2xl"
          px={{ base: 10, md: 20 }}
          py={{ base: 5, md: 7 }}
          animation={`${bounceIn} 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), ${isCorrect ? pulseCorrect : pulseIncorrect} 2s ease-in-out infinite 0.6s`}
          position="relative"
          overflow="hidden"
        >
          {/* Shine effect */}
          <Box
            position="absolute"
            top={0}
            left="-100%"
            w="50%"
            h="100%"
            bgGradient="to-r"
            gradientFrom="transparent"
            gradientVia={isCorrect ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.3)"}
            gradientTo="transparent"
            transform="skewX(-25deg)"
            animation="shimmer 2s ease-in-out infinite"
            css={{
              "@keyframes shimmer": {
                "0%": { left: "-100%" },
                "100%": { left: "200%" },
              },
            }}
          />

          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="900"
            color={isCorrect ? "#15803D" : "#DC2626"}
            textAlign="center"
            textShadow={isCorrect
              ? "2px 2px 0 rgba(34, 197, 94, 0.2)"
              : "2px 2px 0 rgba(239, 68, 68, 0.2)"
            }
          >
            {isCorrect ? "⭕ 正解！" : "❌ 不正解"}
            <Text as="span" fontSize={{ base: "2xl", md: "3xl" }} ml={3}>
              {pointChange > 0 ? `+${pointChange}` : pointChange}点
            </Text>
          </Text>
        </Box>

        {/* Question recap */}
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          color="#555"
          textAlign="center"
          animation={`${slideInUp} 0.5s ease-out 0.2s both`}
        >
          Q. {question}
        </Text>

        {/* Choices with results */}
        <VStack w="full" gap={3} animation={`${slideInUp} 0.5s ease-out 0.3s both`}>
          {choices.map((choice, index) => {
            const isCorrectChoice = index === correctIndex
            const isSelectedChoice = index === selectedIndex
            const isWrongSelection = isSelectedChoice && !isCorrect

            let bgColor = "#F9FAFB"
            let borderColor = "transparent"
            let opacity = 0.6

            if (isCorrectChoice) {
              bgColor = "#DCFCE7"
              borderColor = "#22C55E"
              opacity = 1
            } else if (isWrongSelection) {
              bgColor = "#FEE2E2"
              borderColor = "#EF4444"
              opacity = 1
            }

            return (
              <Box
                key={index}
                w="full"
                p={4}
                bg={bgColor}
                border="3px solid"
                borderColor={borderColor}
                borderRadius="xl"
                opacity={opacity}
                position="relative"
                animation={isWrongSelection ? `${shake} 0.5s ease-in-out 0.5s` : undefined}
              >
                <Flex align="center" justify="space-between">
                  <HStack gap={4}>
                    {/* Label circle */}
                    <Flex
                      w="40px"
                      h="40px"
                      bg={isCorrectChoice
                        ? "linear-gradient(135deg, #22C55E, #4ADE80)"
                        : isWrongSelection
                          ? "linear-gradient(135deg, #EF4444, #F87171)"
                          : "#E5E7EB"
                      }
                      borderRadius="full"
                      align="center"
                      justify="center"
                    >
                      <Text fontSize="lg" fontWeight="900" color={isCorrectChoice || isWrongSelection ? "white" : "#9CA3AF"}>
                        {choiceLabels[index]}
                      </Text>
                    </Flex>

                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight={isCorrectChoice || isWrongSelection ? "bold" : "medium"}
                      color={isCorrectChoice ? "#15803D" : isWrongSelection ? "#DC2626" : "#6B7280"}
                    >
                      {choice}
                    </Text>
                  </HStack>

                  {/* Status indicator */}
                  {isCorrectChoice && (
                    <Text fontSize="lg" fontWeight="bold" color="#15803D">
                      ← 正解
                    </Text>
                  )}
                  {isWrongSelection && (
                    <Text fontSize="lg" fontWeight="bold" color="#DC2626">
                      ← あなたの回答
                    </Text>
                  )}
                </Flex>
              </Box>
            )
          })}
        </VStack>

        {/* Next button */}
        <Box
          as="button"
          mt={4}
          px={{ base: 10, md: 14 }}
          py={{ base: 4, md: 5 }}
          bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
          color="white"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="900"
          borderRadius="xl"
          cursor="pointer"
          border="none"
          animation={`${slideInUp} 0.5s ease-out 0.5s both, ${pulse} 2s ease-in-out infinite 1s`}
          transition="all 0.2s"
          _hover={{
            transform: "translateY(-3px)",
            boxShadow: "0 8px 30px rgba(255, 136, 0, 0.4)",
          }}
          _active={{
            transform: "translateY(0)",
          }}
        >
          次の問題へ →
        </Box>
      </VStack>

      {/* Bottom gradient */}
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
