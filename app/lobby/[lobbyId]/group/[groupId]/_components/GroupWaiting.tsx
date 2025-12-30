"use client";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const floatReverse = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-3deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

type Props = {
  groupName: string;
};

export function GroupWaiting({ groupName }: Props) {
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
      {/* Animated background */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(ellipse at 30% 70%, rgba(255, 136, 0, 0.12) 0%, transparent 50%),
                 radial-gradient(ellipse at 70% 30%, rgba(255, 229, 0, 0.15) 0%, transparent 50%),
                 radial-gradient(ellipse at 50% 50%, rgba(255, 136, 0, 0.05) 0%, transparent 80%)"
        pointerEvents="none"
      />

      {/* Floating geometric decorations */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="80px"
        h="80px"
        bg="linear-gradient(135deg, #FFE500 0%, #FF8800 100%)"
        borderRadius="20px"
        opacity={0.5}
        animation={`${float} 6s ease-in-out infinite`}
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        top="20%"
        right="15%"
        w="60px"
        h="60px"
        bg="linear-gradient(135deg, #FF8800 0%, #FFE500 100%)"
        borderRadius="50%"
        opacity={0.4}
        animation={`${floatReverse} 7s ease-in-out infinite 0.5s`}
      />
      <Box
        position="absolute"
        bottom="25%"
        left="8%"
        w="50px"
        h="50px"
        border="6px solid rgba(255, 136, 0, 0.4)"
        borderRadius="14px"
        animation={`${float} 8s ease-in-out infinite 1s`}
        transform="rotate(-10deg)"
      />
      <Box
        position="absolute"
        bottom="15%"
        right="10%"
        w="70px"
        h="70px"
        bg="#FFE500"
        opacity={0.35}
        clipPath="polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
        animation={`${floatReverse} 5s ease-in-out infinite 0.3s`}
      />
      <Box
        position="absolute"
        top="50%"
        left="5%"
        w="40px"
        h="40px"
        bg="linear-gradient(45deg, #FF8800, #FFE500)"
        borderRadius="8px"
        opacity={0.3}
        animation={`${float} 9s ease-in-out infinite 2s`}
      />
      <Box
        position="absolute"
        top="35%"
        right="5%"
        w="35px"
        h="35px"
        border="5px solid rgba(255, 229, 0, 0.5)"
        borderRadius="50%"
        animation={`${floatReverse} 6s ease-in-out infinite 1.5s`}
      />

      {/* Main content */}
      <VStack gap={8} position="relative" zIndex={1} textAlign="center" px={4}>
        {/* Team badge */}
        <Box
          bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
          color="white"
          px={10}
          py={3}
          borderRadius="full"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="900"
          letterSpacing="0.05em"
          boxShadow="0 4px 20px rgba(255, 136, 0, 0.4)"
          animation={`${fadeInUp} 0.6s ease-out`}
        >
          {groupName}
        </Box>

        {/* Animated waiting icon */}
        <Box position="relative" w="120px" h="120px" animation={`${fadeInUp} 0.6s ease-out 0.1s both`}>
          {/* Rotating ring */}
          <Box
            position="absolute"
            inset={0}
            borderRadius="full"
            border="4px solid transparent"
            borderTopColor="#FF8800"
            borderRightColor="#FFE500"
            animation={`${rotate} 2s linear infinite`}
          />
          {/* Inner pulsing circle */}
          <Flex
            position="absolute"
            inset="15px"
            bg="linear-gradient(135deg, rgba(255, 136, 0, 0.1), rgba(255, 229, 0, 0.1))"
            borderRadius="full"
            align="center"
            justify="center"
            animation={`${pulse} 2s ease-in-out infinite`}
          >
            <Text fontSize="4xl">⏳</Text>
          </Flex>
        </Box>

        {/* Main message */}
        <VStack gap={2} animation={`${fadeInUp} 0.6s ease-out 0.2s both`}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="900"
            bgImage="linear-gradient(90deg, #FF8800, #FFE500, #FF8800)"
            bgSize="200% auto"
            bgClip="text"
            color="transparent"
            animation={`${shimmer} 3s linear infinite`}
            css={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            まもなく開始します
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} color="#E67A00" fontWeight="medium">
            準備はよろしいですか?
          </Text>
        </VStack>

        {/* Rules card */}
        <Box
          bg="white"
          px={{ base: 6, md: 10 }}
          py={5}
          borderRadius="2xl"
          border="3px solid"
          borderColor="rgba(255, 136, 0, 0.3)"
          boxShadow="0 4px 20px rgba(255, 136, 0, 0.15)"
          animation={`${fadeInUp} 0.6s ease-out 0.25s both`}
        >
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="#FF8800" textAlign="center" mb={2}>
            みんなで楽しくクイズ大会！！時間内に回答しまくろう！
          </Text>
          <Flex gap={{ base: 4, md: 6 }} wrap="wrap" justify="center" mb={3}>
            <Flex align="center" gap={2}>
              <Text fontSize="xl">⏱️</Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#555" fontWeight="medium">
                制限時間 7分
              </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontSize="xl">⭕</Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#22C55E" fontWeight="bold">
                正解 +5点
              </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontSize="xl">❌</Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#EF4444" fontWeight="bold">
                不正解 -3点
              </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontSize="xl">🔢</Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#555" fontWeight="medium">
                3択形式
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Tips card */}
        <Box
          bg="linear-gradient(135deg, rgba(255, 229, 0, 0.15) 0%, rgba(255, 136, 0, 0.1) 100%)"
          px={{ base: 6, md: 10 }}
          py={5}
          borderRadius="2xl"
          border="3px solid"
          borderColor="rgba(255, 200, 0, 0.5)"
          boxShadow="0 4px 20px rgba(255, 180, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
          animation={`${fadeInUp} 0.6s ease-out 0.28s both`}
          position="relative"
          overflow="hidden"
          maxW="600px"
        >
          {/* Decorative sparkle */}
          <Box
            position="absolute"
            top="-10px"
            right="-10px"
            w="60px"
            h="60px"
            bg="radial-gradient(circle, rgba(255, 229, 0, 0.4) 0%, transparent 70%)"
            pointerEvents="none"
          />
          <Flex align="center" justify="center" gap={2} mb={3}>
            <Text fontSize="2xl">💡</Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="900"
              bgImage="linear-gradient(90deg, #E67A00, #CC6600)"
              bgClip="text"
              color="transparent"
              css={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TIPS
            </Text>
          </Flex>
          <VStack gap={2} align="stretch">
            <Flex align="flex-start" gap={2}>
              <Text fontSize="lg" flexShrink={0}>
                🏆
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#555" fontWeight="medium">
                7分間の得点が高いチームが優勝！
              </Text>
            </Flex>
            <Flex align="flex-start" gap={2}>
              <Text fontSize="lg" flexShrink={0}>
                🔗
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#555" fontWeight="medium">
                「関連リンク」にヒントが隠されているかも...？
              </Text>
            </Flex>
            <Flex align="flex-start" gap={2}>
              <Text fontSize="lg" flexShrink={0}>
                📊
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="#555" fontWeight="medium">
                最初の3分間はスコアが丸見え！（残り2分で非表示に）
              </Text>
            </Flex>
          </VStack>
        </Box>

        {/* Info card */}
        <Box
          bg="white"
          px={{ base: 8, md: 12 }}
          py={6}
          borderRadius="2xl"
          border="3px dashed"
          borderColor="rgba(255, 136, 0, 0.4)"
          boxShadow="0 4px 20px rgba(255, 136, 0, 0.1)"
          animation={`${fadeInUp} 0.6s ease-out 0.3s both`}
        >
          <Text fontSize={{ base: "md", md: "lg" }} color="#666" fontWeight="medium" textAlign="center">
            管理者の合図を待っています
          </Text>
        </Box>

        {/* Loading dots */}
        <Flex gap={3} animation={`${fadeInUp} 0.6s ease-out 0.4s both`}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              w="14px"
              h="14px"
              bg="linear-gradient(135deg, #FF8800, #FFE500)"
              borderRadius="full"
              animation={`${bounce} 1.4s ease-in-out ${i * 0.16}s infinite`}
              boxShadow="0 2px 8px rgba(255, 136, 0, 0.3)"
            />
          ))}
        </Flex>
      </VStack>

      {/* Bottom decorative gradient */}
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
  );
}
