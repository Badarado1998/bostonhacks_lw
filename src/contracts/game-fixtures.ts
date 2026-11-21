import type { BountiesResponse, TriviaRound, SubmitTriviaResponse } from "./games";
export const bountiesFixture: BountiesResponse = { posts: [{ id: "demo-bounty", authorId: "demo-author", authorName: "Sam", teamRouteId: "Green", kind: "bounty", title: "Share your favorite Boston detour", body: "A demo task: tell me one place you would explore after your ride.", rewardTokens: 2, status: "open", claimantId: null, claimantName: null, createdAt: "2026-11-21T18:00:00.000Z" }] };
export const triviaRoundFixture: TriviaRound = { roundId: "demo-trivia", stopId: "place-kencl", expiresAt: "2099-01-01T00:00:00.000Z", maxPoints: 15, rewardAvailable: true, questions: [
  { id: "blue", prompt: "Which line serves Aquarium?", options: ["Blue", "Orange", "Red", "Green"] },
  { id: "transfer", prompt: "Where do Red and Orange meet?", options: ["Downtown Crossing", "Park Street", "State", "Haymarket"] },
  { id: "silver", prompt: "What grows when you earn points?", options: ["Your team's city district", "Your train fare", "The platform", "Your trip time"] },
] };
export const triviaSubmitFixture: SubmitTriviaResponse = { correct: 3, total: 3, pointsAwarded: 15, tokensAwarded: 1, alreadyDone: false, correctAnswers: ["Blue", "Downtown Crossing", "Your team's city district"] };
