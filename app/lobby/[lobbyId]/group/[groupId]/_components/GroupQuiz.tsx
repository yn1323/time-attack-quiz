"use client";

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import type { Question } from "@/types/firestore";
import { RelatedLinks } from "./RelatedLinks";

// Floating animation for background decorations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const floatReverse = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(-5deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 136, 0, 0.3), 0 4px 20px rgba(255, 136, 0, 0.15); }
  50% { box-shadow: 0 0 35px rgba(255, 136, 0, 0.5), 0 4px 30px rgba(255, 136, 0, 0.25); }
`;

const slideIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

type Props = {
  groupName: string;
  score: number;
  remainingTime: string;
  question: Question | undefined;
  onAnswer: (selectedIndex: number) => void;
};

export function GroupQuiz({ groupName, score, remainingTime, question, onAnswer }: Props) {
  const choiceLabels = ["A", "B", "C"];

  return (
    <Box minH="100vh" bg="#FFFDF7" position="relative" overflow="hidden">
      {/* Animated background layers */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(ellipse at 15% 85%, rgba(255, 136, 0, 0.12) 0%, transparent 50%),
                 radial-gradient(ellipse at 85% 15%, rgba(255, 229, 0, 0.15) 0%, transparent 45%),
                 radial-gradient(ellipse at 50% 50%, rgba(255, 136, 0, 0.05) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Floating geometric decorations */}
      <Box
        position="absolute"
        top="15%"
        right="8%"
        w="70px"
        h="70px"
        bg="linear-gradient(135deg, #FFE500 0%, #FF8800 100%)"
        borderRadius="18px"
        opacity={0.5}
        animation={`${float} 6s ease-in-out infinite`}
        transform="rotate(12deg)"
      />
      <Box
        position="absolute"
        top="60%"
        left="5%"
        w="50px"
        h="50px"
        bg="linear-gradient(135deg, #FF8800 0%, #FFE500 100%)"
        borderRadius="50%"
        opacity={0.4}
        animation={`${floatReverse} 7s ease-in-out infinite 0.5s`}
      />
      <Box
        position="absolute"
        bottom="20%"
        right="4%"
        w="40px"
        h="40px"
        border="5px solid rgba(255, 136, 0, 0.3)"
        borderRadius="12px"
        animation={`${float} 8s ease-in-out infinite 1s`}
        transform="rotate(-8deg)"
      />
      <Box
        position="absolute"
        top="35%"
        left="3%"
        w="30px"
        h="30px"
        bg="#FFE500"
        opacity={0.35}
        clipPath="polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
        animation={`${floatReverse} 5s ease-in-out infinite 0.3s`}
      />

      {/* Status Bar */}
      <Flex
        justify="space-between"
        align="center"
        px={{ base: 6, md: 10 }}
        py={4}
        bg="white"
        borderBottom="5px solid"
        borderColor="#FF8800"
        position="relative"
        zIndex={10}
        boxShadow="0 4px 20px rgba(255, 136, 0, 0.12)"
      >
        {/* Team name with accent */}
        <HStack gap={3}>
          <Box
            w="14px"
            h="14px"
            bg="linear-gradient(135deg, #FF8800, #FFE500)"
            borderRadius="full"
            boxShadow="0 0 10px rgba(255, 136, 0, 0.5)"
          />
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color="#333" letterSpacing="0.02em">
            {groupName}
          </Text>
        </HStack>

        {/* Timer and Score */}
        <HStack gap={{ base: 4, md: 8 }}>
          {/* Timer */}
          <HStack gap={2}>
            <Text fontSize={{ base: "xl", md: "2xl" }}>⏱️</Text>
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="900"
              color="#E67A00"
              letterSpacing="-0.02em"
              fontVariantNumeric="tabular-nums"
            >
              {remainingTime}
            </Text>
          </HStack>

          {/* Score */}
          <HStack gap={2}>
            <Text fontSize={{ base: "xl", md: "2xl" }}>💰</Text>
            <Box position="relative">
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="900"
                bgImage="linear-gradient(90deg, #D4A600, #FFE500, #D4A600)"
                bgSize="200% auto"
                bgClip="text"
                color="transparent"
                letterSpacing="-0.02em"
                css={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {score}点
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Flex>

      {/* Main Content Area */}
      <VStack
        py={{ base: 8, md: 12 }}
        px={{ base: 4, md: 12 }}
        gap={{ base: 6, md: 10 }}
        position="relative"
        zIndex={1}
        maxW="900px"
        mx="auto"
      >
        {/* Question Card */}
        <Box
          w="full"
          bg="white"
          p={{ base: 8, md: 12 }}
          pt={{ base: 10, md: 14 }}
          borderRadius="2xl"
          border="5px solid"
          borderColor="#FF8800"
          position="relative"
          animation={`${pulseGlow} 3s ease-in-out infinite, ${slideIn} 0.5s ease-out`}
        >
          {/* Decorative corner accents */}
          <Box
            position="absolute"
            top="-2px"
            left="-2px"
            w="40px"
            h="40px"
            borderTop="6px solid #FFE500"
            borderLeft="6px solid #FFE500"
            borderTopLeftRadius="2xl"
          />
          <Box
            position="absolute"
            bottom="-2px"
            right="-2px"
            w="40px"
            h="40px"
            borderBottom="6px solid #FFE500"
            borderRight="6px solid #FFE500"
            borderBottomRightRadius="2xl"
          />

          {/* Question label */}
          <Box
            position="absolute"
            top={-4}
            left="50%"
            transform="translateX(-50%)"
            bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
            color="white"
            px={6}
            py={1}
            borderRadius="full"
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="0.1em"
            boxShadow="0 4px 15px rgba(255, 136, 0, 0.3)"
          >
            QUESTION
          </Box>

          {/* Question text */}
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            textAlign="center"
            color="#222"
            lineHeight="1.4"
            mt={2}
          >
            Q. {question?.question}
          </Text>
        </Box>

        {/* Choices */}
        <VStack w="full" gap={4}>
          {question?.choices.map((choice, index) => (
            <Box
              key={index}
              as="button"
              w="full"
              h={{ base: "70px", md: "85px" }}
              bg="white"
              border="4px solid"
              borderColor="rgba(255, 136, 0, 0.35)"
              borderRadius="xl"
              cursor="pointer"
              display="flex"
              alignItems="center"
              px={{ base: 5, md: 8 }}
              position="relative"
              overflow="hidden"
              transition="all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
              animation={`${slideIn} 0.5s ease-out ${0.1 * (index + 1)}s both`}
              onClick={() => onAnswer(index)}
              _hover={{
                bg: "#FFF8F0",
                borderColor: "#FF8800",
                transform: "scale(1.02) translateX(5px)",
                boxShadow: "0 8px 25px rgba(255, 136, 0, 0.2), -4px 0 0 #FF8800",
              }}
              _active={{
                transform: "scale(0.98)",
              }}
            >
              {/* Choice label circle */}
              <Flex
                w={{ base: "40px", md: "50px" }}
                h={{ base: "40px", md: "50px" }}
                bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
                borderRadius="full"
                align="center"
                justify="center"
                mr={{ base: 4, md: 6 }}
                flexShrink={0}
                boxShadow="0 3px 10px rgba(255, 136, 0, 0.3)"
              >
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="white">
                  {choiceLabels[index]}
                </Text>
              </Flex>

              {/* Choice text */}
              <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color="#333">
                {choice}
              </Text>
            </Box>
          ))}
        </VStack>

        {/* Related Links */}
        <RelatedLinks links={question?.relatedLinks || []} />
      </VStack>

      {/* Bottom decorative gradient */}
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
  );
}
