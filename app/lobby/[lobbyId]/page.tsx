"use client"

import { Box, Flex, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { subscribeLobby } from "@/lib/firestore/lobby"
import { createGroup, subscribeGroups } from "@/lib/firestore/group"
import type { Lobby, Group } from "@/types/firestore"

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`

const pulse = keyframes`
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 136, 0, 0.3); }
  50% { box-shadow: 0 4px 25px rgba(255, 136, 0, 0.5); }
`

export default function LobbyPage() {
  const params = useParams()
  const router = useRouter()
  const lobbyId = params.lobbyId as string

  const [lobby, setLobby] = useState<Lobby | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [groupName, setGroupName] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  // ロビー情報とグループ一覧のリアルタイムリスナー
  useEffect(() => {
    const unsubscribeLobby = subscribeLobby(lobbyId, (lobbyData) => {
      setLobby(lobbyData)
      setIsLoading(false)
    })

    const unsubscribeGroups = subscribeGroups(lobbyId, (groupsData) => {
      setGroups(groupsData)
    })

    return () => {
      unsubscribeLobby()
      unsubscribeGroups()
    }
  }, [lobbyId])

  const handleJoinGroup = async () => {
    if (!groupName.trim()) {
      alert("グループ名を入力してください")
      return
    }

    setIsJoining(true)
    try {
      const groupId = await createGroup(lobbyId, groupName.trim())
      router.push(`/lobby/${lobbyId}/group/${groupId}`)
    } catch (error) {
      console.error("Failed to create group:", error)
      alert("グループの作成に失敗しました。もう一度お試しください。")
      setIsJoining(false)
    }
  }

  const handleCopyURL = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert("URLをコピーしました！")
  }

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bg="#FFFDF7"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="2xl" color="#FF8800" fontWeight="bold">
          読み込み中...
        </Text>
      </Box>
    )
  }

  if (!lobby) {
    return (
      <Box
        minH="100vh"
        bg="#FFFDF7"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Text fontSize="2xl" color="#FF8800" fontWeight="bold">
            ロビーが見つかりません
          </Text>
          <Link href="/">
            <Text color="#FF8800" textDecoration="underline">
              TOPページに戻る
            </Text>
          </Link>
        </VStack>
      </Box>
    )
  }

  return (
    <Box
      minH="100vh"
      bg="#FFFDF7"
      position="relative"
      overflow="hidden"
    >
      {/* Background decorations */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(circle at 10% 90%, rgba(255, 136, 0, 0.1) 0%, transparent 40%),
                 radial-gradient(circle at 90% 10%, rgba(255, 229, 0, 0.15) 0%, transparent 40%)"
        pointerEvents="none"
      />

      {/* Floating geometric shapes */}
      <Box
        position="absolute"
        top="20%"
        right="5%"
        w="50px"
        h="50px"
        bg="linear-gradient(135deg, #FFE500 0%, #FF8800 100%)"
        borderRadius="12px"
        opacity={0.4}
        animation={`${float} 5s ease-in-out infinite`}
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        bottom="30%"
        left="3%"
        w="40px"
        h="40px"
        bg="#FFE500"
        borderRadius="50%"
        opacity={0.3}
        animation={`${float} 6s ease-in-out infinite 1s`}
      />

      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        px={8}
        py={4}
        bg="white"
        borderBottom="4px solid"
        borderColor="#FF8800"
        position="relative"
        zIndex={10}
        boxShadow="0 2px 10px rgba(255, 136, 0, 0.1)"
      >
        <HStack gap={4}>
          <Box
            w="12px"
            h="12px"
            bg="#22C55E"
            borderRadius="full"
            boxShadow="0 0 8px rgba(34, 197, 94, 0.5)"
          />
          <Text fontSize="lg" fontWeight="bold" color="#E67A00">
            ロビー: {lobbyId}
          </Text>
        </HStack>
        <HStack gap={3}>
          {/* 管理画面リンク */}
          <Link href={`/lobby/${lobbyId}/admin`}>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={2}
              px={5}
              py={2}
              bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
              borderRadius="full"
              color="white"
              fontWeight="bold"
              fontSize="sm"
              cursor="pointer"
              boxShadow="0 2px 10px rgba(255, 136, 0, 0.3)"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(255, 136, 0, 0.4)",
              }}
            >
              <Text fontSize="sm">⚙️</Text>
              管理画面
            </Box>
          </Link>

          {/* URLコピーボタン */}
          <Box
            as="button"
            px={5}
            py={2}
            border="2px solid"
            borderColor="#FF8800"
            borderRadius="full"
            color="#FF8800"
            fontWeight="bold"
            fontSize="sm"
            cursor="pointer"
            bg="white"
            transition="all 0.2s"
            onClick={handleCopyURL}
            _hover={{
              bg: "#FFF5E6",
              transform: "translateY(-1px)",
            }}
          >
            URLをコピー
          </Box>
        </HStack>
      </Flex>

      {/* Main content */}
      <VStack py={16} gap={10} position="relative" zIndex={1}>
        {/* Title with decorative elements */}
        <Box textAlign="center" position="relative">
          <Text
            position="absolute"
            top="-20px"
            left="50%"
            transform="translateX(-50%)"
            fontSize="2xl"
          >
            ✨
          </Text>
          <Heading
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="900"
            color="#FF8800"
            letterSpacing="0.05em"
          >
            参加者募集中!
          </Heading>
          <Box
            mt={2}
            mx="auto"
            w="80px"
            h="4px"
            bg="linear-gradient(90deg, #FF8800, #FFE500)"
            borderRadius="full"
          />
        </Box>

        {/* Group name input card */}
        <Box
          bg="white"
          p={{ base: 8, md: 10 }}
          borderRadius="3xl"
          boxShadow="0 8px 40px rgba(255, 136, 0, 0.15)"
          border="4px solid"
          borderColor="#FF8800"
          w={{ base: "90%", md: "450px" }}
          position="relative"
          overflow="hidden"
        >
          {/* Card decoration */}
          <Box
            position="absolute"
            top="-30px"
            right="-30px"
            w="100px"
            h="100px"
            bg="linear-gradient(135deg, rgba(255, 229, 0, 0.3), rgba(255, 136, 0, 0.2))"
            borderRadius="full"
            pointerEvents="none"
          />

          <VStack gap={6} position="relative">
            <Box textAlign="center">
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="#333"
                mb={1}
              >
                グループ名を入力してください
              </Text>
              <Text fontSize="sm" color="gray.500">
                チームを代表する名前をつけよう
              </Text>
            </Box>

            <Input
              placeholder="例: クイズ王決定戦チーム"
              size="lg"
              py={6}
              px={5}
              fontSize="lg"
              borderWidth="3px"
              borderColor="#FFE500"
              borderRadius="xl"
              bg="#FFFDF7"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={isJoining}
              _focus={{
                borderColor: "#FF8800",
                boxShadow: "0 0 0 3px rgba(255, 136, 0, 0.2)",
              }}
              _placeholder={{
                color: "gray.400",
              }}
            />

            <Box
              as="button"
              w="full"
              py={4}
              fontSize="xl"
              fontWeight="900"
              color="white"
              bg="linear-gradient(135deg, #FF8800 0%, #E67A00 100%)"
              borderRadius="xl"
              cursor={isJoining ? "not-allowed" : "pointer"}
              border="none"
              transition="all 0.2s"
              animation={isJoining ? "none" : `${pulse} 2s ease-in-out infinite`}
              opacity={isJoining ? 0.7 : 1}
              onClick={handleJoinGroup}
              disabled={isJoining}
              _hover={
                isJoining
                  ? {}
                  : {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 30px rgba(255, 136, 0, 0.4)",
                    }
              }
              _active={
                isJoining
                  ? {}
                  : {
                      transform: "translateY(0)",
                    }
              }
            >
              {isJoining ? "参加中..." : "参加する!"}
            </Box>
          </VStack>
        </Box>

        {/* Participating groups */}
        <Box textAlign="center" mt={4}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="#E67A00"
            mb={4}
          >
            現在の参加グループ ({groups.length}組)
          </Text>
          {groups.length > 0 ? (
            <HStack gap={3} justify="center" flexWrap="wrap">
              {groups.map((group) => (
                <Box
                  key={group.id}
                  px={5}
                  py={2}
                  bg="linear-gradient(135deg, #FFE500 0%, #FFC800 100%)"
                  borderRadius="full"
                  fontWeight="bold"
                  fontSize="md"
                  color="#333"
                  boxShadow="0 2px 10px rgba(255, 229, 0, 0.3)"
                  border="2px solid"
                  borderColor="rgba(255, 136, 0, 0.2)"
                >
                  {group.name}
                </Box>
              ))}
            </HStack>
          ) : (
            <Text color="gray.500" fontSize="sm">
              まだ参加者がいません
            </Text>
          )}
        </Box>

        {/* Waiting message */}
        <Box
          mt={8}
          px={8}
          py={4}
          bg="rgba(255, 136, 0, 0.08)"
          borderRadius="2xl"
          border="2px dashed"
          borderColor="rgba(255, 136, 0, 0.3)"
        >
          <Text
            fontSize="md"
            color="#E67A00"
            fontWeight="medium"
            textAlign="center"
          >
            管理者が開始するまでお待ちください
          </Text>
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
