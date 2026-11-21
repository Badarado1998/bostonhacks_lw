import type { PlayableTeamId } from "./routes";

export type BountyKind = "bounty" | "trade" | "offer";
export type BountyStatus = "open" | "reserved" | "completed" | "cancelled";
export type BountyAction = "claim" | "release" | "complete" | "cancel";
export interface BountyPost {
  id: string;
  authorId: string;
  authorName: string;
  teamRouteId: PlayableTeamId;
  kind: BountyKind;
  title: string;
  body: string;
  rewardTokens: number;
  have?: string;
  want?: string;
  station?: string;
  status: BountyStatus;
  claimantId: string | null;
  claimantName: string | null;
  createdAt: string;
}
export interface BountiesResponse { posts: BountyPost[] }
export interface CreateBountyRequest {
  riderId: string;
  /** Stable UUID generated once per composer attempt; retries return the existing post. */
  requestId: string;
  kind: BountyKind;
  title: string;
  body: string;
  rewardTokens: number;
  have?: string;
  want?: string;
  station?: string;
}
export interface BountyActionRequest { riderId: string; action: BountyAction }
export interface BountyMutationResponse { post: BountyPost; tokensLeft: number }

export interface TriviaQuestion { id: string; prompt: string; options: string[] }
export interface TriviaRound {
  roundId: string;
  stopId: string;
  expiresAt: string;
  questions: TriviaQuestion[];
  maxPoints: number;
  rewardAvailable: boolean;
}
export interface StartTriviaRequest { riderId: string; stopId: string }
export interface SubmitTriviaRequest { riderId: string; roundId: string; answers: (string | null)[] }
export interface SubmitTriviaResponse {
  correct: number;
  total: number;
  pointsAwarded: number;
  tokensAwarded: number;
  alreadyDone: boolean;
  /** Correct answers are returned only after the round has been graded. */
  correctAnswers: string[];
}
export interface StationGameInfo {
  id: string;
  kind: "clue" | "trivia" | "photo" | "landmark" | "challenge";
  title: string;
  rewardPoints: number;
  rewardTokens: number;
}
export interface StationGamesInfo { stopId: string; name: string; teamRouteId: string; delayed: boolean; games: StationGameInfo[] }
export type HuntMapResponse = StationGamesInfo[];

/** Read-only simulator state, used to label simulated location controls. */
export interface DemoStatusResponse { running: boolean }
