import type { Timestamp } from "firebase/firestore"

export type LobbyStatus = "waiting" | "playing" | "finished" | "result"

export interface Question {
  question: string
  choices: string[]
  answer: number
  relatedLinks?: string[]
}

export interface Lobby {
  id: string
  status: LobbyStatus
  createdAt: Timestamp
  startedAt: Timestamp | null
  finishedAt: Timestamp | null
  durationSeconds: number
  pointsCorrect: number
  pointsIncorrect: number
}

export interface Group {
  id: string
  lobbyId: string
  name: string
  createdAt: Timestamp
}

export interface Answer {
  id: string
  groupId: string
  questionIndex: number
  selectedAnswer: number
  correctAnswer: number
  isCorrect: boolean
  answeredAt: Timestamp
  answerTimeMs: number
  scoreChange: number
}
