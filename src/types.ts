export interface Player {
  color: string;
  name: string;
}

export interface GameState {
  board: (string | null)[][];
  currentTurn: string | null;
  winner: string | null;
  isLoading: boolean;
  error: string | null;
  playerCount: number;
  lastPlayer: string | null;
}

export type PlayerCount = 2 | 3 | 4;