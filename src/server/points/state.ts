import type { PointEventType, TeamRouteId, TokenLedgerEntry } from "@/contracts";

export interface GameRider {
  riderId: string;
  displayName: string;
  homeTeamRouteId: TeamRouteId;
  isSimulated?: boolean;
}
export interface PointEvent {
  riderId: string;
  teamRouteId: TeamRouteId;
  type: PointEventType;
  amount: number;
  ref: string;
  createdAt: string;
}
export interface GameTokenEntry extends TokenLedgerEntry { riderId: string; ref: string }
export interface MemoryGame {
  riders: Map<string, GameRider>;
  events: PointEvent[];
  tokens: GameTokenEntry[];
}
const shared = globalThis as unknown as { __tcityGame?: MemoryGame };
export function memoryGame(): MemoryGame {
  return shared.__tcityGame ??= { riders: new Map(), events: [], tokens: [] };
}
export function registerMemoryRider(rider: GameRider): void {
  memoryGame().riders.set(rider.riderId, { ...rider });
}
