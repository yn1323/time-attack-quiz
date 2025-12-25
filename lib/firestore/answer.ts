import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Answer, Group } from "@/types/firestore"

export type GroupWithAnswers = {
  groupId: string
  groupName: string
  answers: Answer[]
}

export function subscribeAllGroupAnswers(
  lobbyId: string,
  groups: Group[],
  callback: (groupsWithAnswers: GroupWithAnswers[]) => void,
): Unsubscribe {
  const answersMap = new Map<string, Answer[]>()
  const unsubscribes: Unsubscribe[] = []

  groups.forEach((group) => {
    answersMap.set(group.id, [])
  })

  const emitUpdate = () => {
    const result: GroupWithAnswers[] = groups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      answers: answersMap.get(group.id) ?? [],
    }))
    callback(result)
  }

  groups.forEach((group) => {
    const answersQuery = query(
      collection(
        db,
        `quiz-time-attack-lobbies/${lobbyId}/groups/${group.id}/answers`,
      ),
      orderBy("answeredAt", "asc"),
    )

    const unsubscribe = onSnapshot(answersQuery, (snapshot) => {
      const answers: Answer[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Answer[]

      answersMap.set(group.id, answers)
      emitUpdate()
    })

    unsubscribes.push(unsubscribe)
  })

  if (groups.length === 0) {
    emitUpdate()
  }

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe())
  }
}
