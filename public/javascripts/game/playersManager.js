/*
*   Represent a player. Can  
*/
define(['playerEntity'], function (Player) {

  var _playerList,
      _keyMatching,
      _currentPlayer;

  function PlayerManager () {
    _playerList = new Array();
    _keyMatching = new Array();
  };

  PlayerManager.prototype.addPlayer = function (infos, playerID) {
    var player = new Player(infos, playerID);

    _playerList.push(player);
    _keyMatching[infos.id] = _playerList.length - 1;

    if (player.isCurrentPlayer() == true)
      _currentPlayer = _playerList.length - 1;
  };

  PlayerManager.prototype.removePlayer = function (player) {
    var pos = _playerList.indexOf(player);

    if (pos < 0) {
      console.log("Can't find the disconected player in list");
    }
    else {
      _playerList.splice(pos, 1);

      if (pos < _currentPlayer)
        --_currentPlayer;
    }
  };

  PlayerManager.prototype.updatePlayerListFromServer = function (playerlistUpdated) {
    var nbUpdates = playerlistUpdated.length,
        i;

    for (i = 0; i < nbUpdates; i++) {
      _playerList[(_keyMatching[playerlistUpdated[i].id])].updateFromServer(playerlistUpdated[i]);
    };
  };

  PlayerManager.prototype.getPlayers = function () {
    return (_playerList);
  };

  PlayerManager.prototype.getCurrentPlayer = function () {
    return (_playerList[_currentPlayer]);
  };

  PlayerManager.prototype.getPlayerFromId = function (playerID) {
    var nbPlayers = _playerList.length,
        i;

    for (i = 0; i < nbPlayers; i++) {
      if (_playersList[i].getId() === playerID)
        return (_playersList[i]);
    };

    console.log("Can't find player in list");
    return (null);
  };


  return (PlayerManager);
});