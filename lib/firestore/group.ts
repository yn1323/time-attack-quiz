import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Group } from "@/types/firestore"

export async function createGroup(
  lobbyId: string,
  groupName: string,
): Promise<string> {
  const groupRef = doc(collection(db, `lobbies/${lobbyId}/groups`))

  const groupData: Omit<Group, "id" | "createdAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>
  } = {
    lobbyId,
    name: groupName,
    createdAt: serverTimestamp(),
  }

  await setDoc(groupRef, groupData)

  return groupRef.id
}

export function subscribeGroups(
  lobbyId: string,
  callback: (groups: Group[]) => void,
): Unsubscribe {
  const groupsQuery = query(
    collection(db, `lobbies/${lobbyId}/groups`),
    orderBy("createdAt", "asc"),
  )

  return onSnapshot(groupsQuery, (snapshot) => {
    const groups: Group[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Group[]

    callback(groups)
  })
}
