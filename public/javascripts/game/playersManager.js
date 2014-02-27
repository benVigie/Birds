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
    // Create a player and push it into the player list
    var player = new Player(infos, playerID);

    _playerList.push(player);
    // Add his ID in _keyMatching. WIth that, synchro with the server will be quick
    // because we will don't need to iterate the player list to update it
    _keyMatching[infos.id] = _playerList.length - 1;

    if (player.isCurrentPlayer() == true)
      _currentPlayer = _playerList.length - 1;
  }; 

  PlayerManager.prototype.removePlayer = function (player) {
    var pos = _keyMatching[player.id];
  
    if (typeof pos == 'undefined') {
      console.log("Can't find the disconected player in list");
    }
    else {
      console.log('Removing ' + _playerList[pos].getNick());
      // Remove player from lists
      _playerList.splice(pos, 1);
      // delete _keyMatching[player.id];
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
      if (_playerList[i].getId() === playerID)
        return (_playerList[i]);
    };

    console.log("Can't find player in list");
    return (null);
  };


  return (PlayerManager);
});