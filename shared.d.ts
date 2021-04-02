export enum PlayerState {
  OnLoginScreen = 1,
  WaitingInLobby = 2,
  Playing = 3,
  Died = 4,
}

export enum ServerState {
  WaitingForPlayers = 1,
  OnGame = 2,
  Ranking = 3,
}

type PlayerTinyObject = {
  best_score: number;
  color: number;
  floor: number;
  id: string;
  nick: string;
  posX: number;
  posY: number;
  rotation: number;
  score: number;
  state: PlayerState.OnLoginScreen;
};

export type Bird = {
  getPlayerObject: () => PlayerTinyObject;
  sorryYouAreDie: (numberOfPlayersLeft: number) => void;
  updateScore: (pipeId: string) => void;
};

export type Pipe = {
  id: string;
  posX: number;
  posY: number;
};
