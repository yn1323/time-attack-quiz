"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { use, useEffect, useState } from "react";
import { subscribeGroups } from "@/lib/firestore/group";
import { subscribeLobby } from "@/lib/firestore/lobby";
import type { Group, Lobby } from "@/types/firestore";
import { AdminAfterQuiz } from "./_components/AdminAfterQuiz";
import { AdminBeforeStart } from "./_components/AdminBeforeStart";
import { AdminDuringQuiz } from "./_components/AdminDuringQuiz";

type Props = {
  params: Promise<{ lobbyId: string }>;
};

export default function AdminPage({ params }: Props) {
  const { lobbyId } = use(params);
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeLobby = subscribeLobby(lobbyId, (lobbyData) => {
      setLobby(lobbyData);
      setIsLoading(false);
    });

    const unsubscribeGroups = subscribeGroups(lobbyId, setGroups);

    return () => {
      unsubscribeLobby();
      unsubscribeGroups();
    };
  }, [lobbyId]);

  if (isLoading) {
    return (
      <Box minH="100vh" bg="#FFFDF7" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="2xl" color="#E67A00" fontWeight="bold">
          読み込み中...
        </Text>
      </Box>
    );
  }

  if (!lobby) {
    return (
      <Box minH="100vh" bg="#FFFDF7" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Text fontSize="2xl" color="#E67A00" fontWeight="bold">
            ロビーが見つかりません
          </Text>
          <Text color="gray.500">URLを確認してください</Text>
        </VStack>
      </Box>
    );
  }

  switch (lobby.status) {
    case "waiting":
      return <AdminBeforeStart lobbyId={lobbyId} lobby={lobby} />;
    case "playing":
      return <AdminDuringQuiz lobbyId={lobbyId} lobby={lobby} groups={groups} />;
    case "finished":
      return <AdminAfterQuiz lobbyId={lobbyId} groups={groups} />;
    default:
      return null;
  }
}
