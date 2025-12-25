import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Lobby } from "@/types/firestore"

export async function createLobby(): Promise<string> {
  const lobbyRef = doc(collection(db, "lobbies"))

  const lobbyData: Omit<Lobby, "id" | "createdAt" | "startedAt" | "finishedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>
    startedAt: null
    finishedAt: null
  } = {
    status: "waiting",
    createdAt: serverTimestamp(),
    startedAt: null,
    finishedAt: null,
    durationSeconds: 600,
    pointsCorrect: 5,
    pointsIncorrect: -2,
  }

  await setDoc(lobbyRef, lobbyData)

  return lobbyRef.id
}

export function subscribeLobby(
  lobbyId: string,
  callback: (lobby: Lobby | null) => void,
): Unsubscribe {
  const lobbyRef = doc(db, "lobbies", lobbyId)

  return onSnapshot(lobbyRef, (snapshot) => {
    if (snapshot.exists()) {
      const lobby: Lobby = {
        id: snapshot.id,
        ...snapshot.data(),
      } as Lobby
      callback(lobby)
    } else {
      callback(null)
    }
  })
}
