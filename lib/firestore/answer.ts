import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Answer, Group } from "@/types/firestore";

type CreateAnswerParams = {
  lobbyId: string;
  groupId: string;
  questionIndex: number;
  selectedAnswer: number;
  correctAnswer: number;
  answerTimeMs: number;
  pointsCorrect: number;
  pointsIncorrect: number;
};

export async function createAnswer({
  lobbyId,
  groupId,
  questionIndex,
  selectedAnswer,
  correctAnswer,
  answerTimeMs,
  pointsCorrect,
  pointsIncorrect,
}: CreateAnswerParams): Promise<void> {
  const isCorrect = selectedAnswer === correctAnswer;
  const scoreChange = isCorrect ? pointsCorrect : pointsIncorrect;

  const answerRef = doc(collection(db, `quiz-time-attack-lobbies/${lobbyId}/groups/${groupId}/answers`));

  await setDoc(answerRef, {
    groupId,
    questionIndex,
    selectedAnswer,
    correctAnswer,
    isCorrect,
    answeredAt: serverTimestamp(),
    answerTimeMs,
    scoreChange,
  });
}

export function subscribeGroupAnswers(
  lobbyId: string,
  groupId: string,
  callback: (answers: Answer[]) => void,
): Unsubscribe {
  const answersQuery = query(
    collection(db, `quiz-time-attack-lobbies/${lobbyId}/groups/${groupId}/answers`),
    orderBy("answeredAt", "asc"),
  );

  return onSnapshot(answersQuery, (snapshot) => {
    const answers: Answer[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Answer[];

    callback(answers);
  });
}

export type GroupWithAnswers = {
  groupId: string;
  groupName: string;
  answers: Answer[];
};

export function subscribeAllGroupAnswers(
  lobbyId: string,
  groups: Group[],
  callback: (groupsWithAnswers: GroupWithAnswers[]) => void,
): Unsubscribe {
  const answersMap = new Map<string, Answer[]>();
  const unsubscribes: Unsubscribe[] = [];

  groups.forEach((group) => {
    answersMap.set(group.id, []);
  });

  const emitUpdate = () => {
    const result: GroupWithAnswers[] = groups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      answers: answersMap.get(group.id) ?? [],
    }));
    callback(result);
  };

  groups.forEach((group) => {
    const answersQuery = query(
      collection(db, `quiz-time-attack-lobbies/${lobbyId}/groups/${group.id}/answers`),
      orderBy("answeredAt", "asc"),
    );

    const unsubscribe = onSnapshot(answersQuery, (snapshot) => {
      const answers: Answer[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Answer[];

      answersMap.set(group.id, answers);
      emitUpdate();
    });

    unsubscribes.push(unsubscribe);
  });

  if (groups.length === 0) {
    emitUpdate();
  }

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}
