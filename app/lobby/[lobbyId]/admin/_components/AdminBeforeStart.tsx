"use client"

import { useEffect, useState } from "react"
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import { subscribeGroups } from "@/lib/firestore/group"
import { startLobby } from "@/lib/firestore/lobby"
import type { Group } from "@/types/firestore"

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 40px rgba(255, 136, 0, 0.5), 0 0 80px rgba(255, 136, 0, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 60px rgba(255, 136, 0, 0.7), 0 0 120px rgba(255, 136, 0, 0.4);
    transform: scale(1.02);
  }
`

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const readyPulse = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(34, 197, 94, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
`

const glowLine = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`

type Props = {
  lobbyId: string
}

export function AdminBeforeStart({ lobbyId }: Props) {
  const [groups, setGroups] = useState<Group[]>([])
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeGroups(lobbyId, setGroups)
    return () => unsubscribe()
  }, [lobbyId])

  const handleStart = async () => {
    setIsStarting(true)
    try {
      await startLobby(lobbyId)
    } catch (error) {
      console.error("Failed to start lobby:", error)
      setIsStarting(false)
    }
  }

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/lobby/${lobbyId}`
    await navigator.clipboard.writeText(url)
  }

  return (
    <Box
      minH="100vh"
      bg="#FFFDF7"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Dramatic gradient background */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(ellipse at 50% 0%, rgba(255, 136, 0, 0.15) 0%, transparent 60%),
                 radial-gradient(ellipse at 0% 100%, rgba(255, 229, 0, 0.12) 0%, transparent 50%),
                 radial-gradient(ellipse at 100% 100%, rgba(255, 136, 0, 0.1) 0%, transparent 50%)"
        pointerEvents="none"
      />

      {/* Floating decorations */}
      <Box
        position="absolute"
        top="8%"
        left="5%"
        w="100px"
        h="100px"
        bg="linear-gradient(135deg, rgba(255, 229, 0, 0.3) 0%, rgba(255, 136, 0, 0.2) 100%)"
        borderRadius="24px"
        animation={`${float} 8s ease-in-out infinite`}
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        top="15%"
        right="8%"
        w="80px"
        h="80px"
        border="6px solid rgba(255, 136, 0, 0.25)"
        borderRadius="50%"
        animation={`${float} 6s ease-in-out infinite 1s`}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="10%"
        w="60px"
        h="60px"
        bg="linear-gradient(135deg, rgba(255, 136, 0, 0.2) 0%, rgba(255, 229, 0, 0.15) 100%)"
        borderRadius="16px"
        animation={`${float} 7s ease-in-out infinite 0.5s`}
        transform="rotate(-10deg)"
      />
      <Box
        position="absolute"
        bottom="30%"
        right="5%"
        w="70px"
        h="70px"
        border="5px solid rgba(255, 229, 0, 0.3)"
        borderRadius="20px"
        animation={`${float} 9s ease-in-out infinite 2s`}
        transform="rotate(20deg)"
      />

      {/* Main content */}
      <VStack
        flex={1}
        justify="center"
        gap={10}
        position="relative"
        zIndex={1}
        px={8}
        py={12}
      >
        {/* Title section */}
        <Box textAlign="center" animation={`${fadeInUp} 0.8s ease-out`}>
          <Text
            fontSize="6xl"
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
            大会コントロールセンター
          </Text>
          <Box
            mt={4}
            mx="auto"
            w="400px"
            h="6px"
            bg="linear-gradient(90deg, transparent, #FF8800, #FFE500, #FF8800, transparent)"
            borderRadius="full"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              inset={0}
              bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)"
              animation={`${glowLine} 2s ease-in-out infinite`}
            />
          </Box>
        </Box>

        {/* Groups section */}
        <Box
          w="full"
          maxW="1000px"
          animation={`${fadeInUp} 0.8s ease-out 0.2s both`}
        >
          <Flex justify="center" align="center" gap={3} mb={6}>
            <Text fontSize="2xl" fontWeight="bold" color="#E67A00">
              参加グループ
            </Text>
            <Box
              bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
              color="white"
              px={4}
              py={1}
              borderRadius="full"
              fontWeight="bold"
              fontSize="lg"
            >
              {groups.length} 組
            </Box>
          </Flex>

          {/* Group cards grid */}
          <Flex justify="center" gap={6} flexWrap="wrap">
            {groups.length === 0 ? (
              <Text color="gray.500" fontSize="lg">
                参加者を待っています...
              </Text>
            ) : (
              groups.map((group, index) => (
                <Box
                  key={group.id}
                  w="200px"
                  bg="white"
                  borderRadius="2xl"
                  border="4px solid"
                  borderColor="#FF8800"
                  p={6}
                  textAlign="center"
                  boxShadow="0 8px 30px rgba(255, 136, 0, 0.2)"
                  animation={`${fadeInUp} 0.5s ease-out ${0.3 + index * 0.1}s both`}
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
                    gradientVia="rgba(255,255,255,0.4)"
                    gradientTo="transparent"
                    transform="skewX(-25deg)"
                    animation="shine 4s ease-in-out infinite"
                    css={{
                      "@keyframes shine": {
                        "0%": { left: "-100%" },
                        "50%, 100%": { left: "200%" },
                      },
                    }}
                  />

                  <Text fontSize="2xl" fontWeight="bold" color="#333" mb={3}>
                    {group.name}
                  </Text>

                  <Box
                    display="inline-block"
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg="#DCFCE7"
                    color="#22C55E"
                    fontWeight="bold"
                    fontSize="md"
                    animation={`${readyPulse} 2s ease-in-out infinite`}
                  >
                    READY
                  </Box>
                </Box>
              ))
            )}
          </Flex>
        </Box>

        {/* Start button */}
        <Box animation={`${fadeInUp} 0.8s ease-out 0.6s both`}>
          <Box
            as="button"
            w="350px"
            h="100px"
            bg={
              groups.length === 0 || isStarting
                ? "gray.300"
                : "linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
            }
            color="white"
            fontSize="3xl"
            fontWeight="900"
            borderRadius="full"
            border="none"
            cursor={groups.length === 0 || isStarting ? "not-allowed" : "pointer"}
            animation={
              groups.length === 0 || isStarting
                ? "none"
                : `${pulse} 2s ease-in-out infinite`
            }
            position="relative"
            overflow="hidden"
            aria-disabled={groups.length === 0 || isStarting}
            onClick={groups.length === 0 || isStarting ? undefined : handleStart}
            _hover={{
              transform: groups.length === 0 || isStarting ? "none" : "scale(1.05)",
            }}
            _active={{
              transform: groups.length === 0 || isStarting ? "none" : "scale(0.98)",
            }}
            transition="transform 0.2s"
          >
            {/* Button shine effect */}
            {groups.length > 0 && !isStarting && (
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
                animation="buttonShine 3s ease-in-out infinite"
                css={{
                  "@keyframes buttonShine": {
                    "0%": { left: "-100%" },
                    "50%, 100%": { left: "200%" },
                  },
                }}
              />
            )}
            <Text position="relative" zIndex={1}>
              {isStarting ? "開始中..." : "大会をスタート"}
            </Text>
          </Box>
        </Box>
      </VStack>

      {/* Footer with lobby URL */}
      <Box
        position="relative"
        zIndex={1}
        py={6}
        px={8}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        borderTop="3px solid"
        borderColor="rgba(255, 136, 0, 0.2)"
      >
        <Flex justify="center" align="center" gap={4}>
          <Text fontSize="lg" color="#666" fontWeight="medium">
            ロビーURL:
          </Text>
          <HStack
            bg="white"
            border="2px solid"
            borderColor="#FF8800"
            borderRadius="xl"
            px={5}
            py={3}
            gap={3}
          >
            <Text fontSize="lg" fontWeight="bold" color="#333" fontFamily="mono">
              /lobby/{lobbyId}
            </Text>
            <Box
              as="button"
              bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
              color="white"
              px={4}
              py={2}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="bold"
              border="none"
              cursor="pointer"
              onClick={handleCopyUrl}
              _hover={{ opacity: 0.9 }}
            >
              コピー
            </Box>
          </HStack>
        </Flex>
      </Box>

      {/* Bottom gradient fade */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="100px"
        bgGradient="to-t"
        gradientFrom="rgba(255, 245, 230, 0.5)"
        gradientTo="transparent"
        pointerEvents="none"
      />
    </Box>
  )
}
