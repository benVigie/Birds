var enumServerState = {
  WaitingForPlayers: 1,
  OnGame: 2,
  Ranking: 3
};

var enumPlayerState = {
  OnLoginScreen: 1,
  WaintingInLobby: 2,
  //Ready: 3,
  Playing: 4,
  Died: 5
};

exports.PlayerState = enumPlayerState;
exports.ServerState = enumServerState;