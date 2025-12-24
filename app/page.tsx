"use client"

import { Box, Heading, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import Link from "next/link"

// Keyframe animations
const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 136, 0, 0.4), 0 8px 30px rgba(255, 136, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 136, 0, 0.6), 0 8px 40px rgba(255, 136, 0, 0.5); }
`

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
`

const rotateFloat = keyframes`
  0% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(90deg) translateY(-10px); }
  50% { transform: rotate(180deg) translateY(0); }
  75% { transform: rotate(270deg) translateY(-10px); }
  100% { transform: rotate(360deg) translateY(0); }
`

export default function HomePage() {
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
      {/* Animated background layers */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(circle at 20% 80%, rgba(255, 136, 0, 0.15) 0%, transparent 40%),
                 radial-gradient(circle at 80% 20%, rgba(255, 229, 0, 0.2) 0%, transparent 40%),
                 radial-gradient(circle at 60% 60%, rgba(255, 136, 0, 0.08) 0%, transparent 50%)"
        pointerEvents="none"
      />

      {/* Geometric decorations */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        w="80px"
        h="80px"
        bg="linear-gradient(135deg, #FFE500 0%, #FF8800 100%)"
        borderRadius="20px"
        opacity={0.6}
        animation={`${float} 6s ease-in-out infinite`}
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        top="15%"
        right="10%"
        w="60px"
        h="60px"
        bg="linear-gradient(135deg, #FF8800 0%, #FFE500 100%)"
        borderRadius="50%"
        opacity={0.5}
        animation={`${float} 8s ease-in-out infinite 1s`}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="8%"
        w="40px"
        h="40px"
        bg="#FFE500"
        opacity={0.4}
        animation={`${rotateFloat} 10s linear infinite`}
        clipPath="polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
      />
      <Box
        position="absolute"
        bottom="15%"
        right="5%"
        w="70px"
        h="70px"
        border="6px solid"
        borderColor="rgba(255, 136, 0, 0.3)"
        borderRadius="16px"
        animation={`${float} 7s ease-in-out infinite 0.5s`}
        transform="rotate(-10deg)"
      />

      {/* Sparkle decorations */}
      {[
        { top: "25%", left: "15%", delay: "0s", size: "24px" },
        { top: "30%", right: "20%", delay: "0.3s", size: "20px" },
        { bottom: "35%", left: "20%", delay: "0.6s", size: "16px" },
        { bottom: "25%", right: "15%", delay: "0.9s", size: "22px" },
      ].map((pos, i) => (
        <Text
          key={i}
          position="absolute"
          top={pos.top}
          bottom={pos.bottom}
          left={pos.left}
          right={pos.right}
          fontSize={pos.size}
          animation={`${sparkle} 2s ease-in-out infinite ${pos.delay}`}
        >
          ✦
        </Text>
      ))}

      {/* Main content */}
      <VStack gap={8} position="relative" zIndex={1} textAlign="center" px={4}>
        {/* Badge */}
        <Box
          bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
          color="white"
          px={6}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="bold"
          letterSpacing="0.1em"
          textTransform="uppercase"
          boxShadow="0 4px 15px rgba(255, 136, 0, 0.3)"
        >
          Quiz Competition
        </Box>

        {/* Main title with animated gradient */}
        <Heading
          as="h1"
          fontSize={{ base: "5xl", md: "7xl", lg: "8xl" }}
          fontWeight="900"
          lineHeight="1.1"
          bgImage="linear-gradient(90deg, #FF8800, #FFE500, #FF8800, #FFE500)"
          bgSize="200% auto"
          bgClip="text"
          color="transparent"
          animation={`${gradientShift} 4s linear infinite`}
          textShadow="4px 4px 0 rgba(255, 136, 0, 0.1)"
          letterSpacing="-0.02em"
          css={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TIME ATTACK
          <br />
          QUIZ
        </Heading>

        {/* Subtitle with decorative frame */}
        <Box position="relative" py={4}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="120%"
            h="100%"
            border="3px solid"
            borderColor="rgba(255, 136, 0, 0.2)"
            borderRadius="full"
          />
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            color="#E67A00"
            fontWeight="bold"
            letterSpacing="0.15em"
          >
            〜タイムアタック〜
          </Text>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            color="#FF8800"
            fontWeight="900"
            mt={1}
          >
            クイズ大会
          </Text>
        </Box>

        {/* CTA Button */}
        <Link href="/lobby/sample-lobby-id">
          <Box
            as="button"
            position="relative"
            px={{ base: 12, md: 16 }}
            py={{ base: 5, md: 6 }}
            mt={4}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="900"
            color="white"
            bg="linear-gradient(135deg, #FF8800 0%, #FF6B00 50%, #E67A00 100%)"
            borderRadius="full"
            cursor="pointer"
            transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
            animation={`${pulse} 2s ease-in-out infinite`}
            border="none"
            outline="none"
            _hover={{
              transform: "translateY(-4px) scale(1.02)",
              boxShadow: "0 0 50px rgba(255, 136, 0, 0.6), 0 12px 40px rgba(255, 136, 0, 0.4)",
            }}
            _active={{
              transform: "translateY(-2px) scale(0.98)",
            }}
          >
            <Box
              position="absolute"
              inset="-3px"
              borderRadius="full"
              bg="linear-gradient(135deg, #FFE500, #FF8800, #FFE500)"
              opacity={0.5}
              filter="blur(10px)"
              zIndex={-1}
            />
            大会をはじめる
          </Box>
        </Link>

        {/* Footer hint */}
        <Text
          fontSize="sm"
          color="rgba(230, 122, 0, 0.6)"
          mt={4}
          fontWeight="medium"
        >
          グループ対抗で競い合おう
        </Text>
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
  )
}
