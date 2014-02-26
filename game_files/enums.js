var enumServerState = {
  WaitingForPlayers: 1,
  OnGame: 2,
  Ranking: 3
};

var enumPlayerState = {
  OnLoginScreen: 1,
  WaitingInLobby: 2,
  Playing: 4,
  Died: 5
};

exports.PlayerState = enumPlayerState;
exports.ServerState = enumServerState;