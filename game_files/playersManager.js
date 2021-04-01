const util          = require('util'),
    EventEmitter  = require('events').EventEmitter,
    Scores        = require('./scoreSystem'),
    Player        = require('./player'),
    enums         = require('./enums');

const NB_AVAILABLE_BIRDS_COLOR = 4;

let _playersList  = [],
    _posOnGrid    = 0,
    _scores       = new Scores();

function PlayersManager () {
  EventEmitter.call(this);
}

util.inherits(PlayersManager, EventEmitter);

PlayersManager.prototype.addNewPlayer = function (playerSocket, id) {
  let newPlayer,
      birdColor;

  // Set an available color according the number of client's sprites
  birdColor = Math.floor(Math.random() * ((NB_AVAILABLE_BIRDS_COLOR - 1) + 1));

  // Create new player and add it in the list
  newPlayer = new Player(playerSocket, id, birdColor);
  _playersList.push(newPlayer);

  console.info('New player connected. There is currently ' + _playersList.length + ' player(s)');

  return (newPlayer);
};

PlayersManager.prototype.removePlayer = function (player) {
  let pos = _playersList.indexOf(player);

  if (pos < 0) {
    console.error("[ERROR] Can't find player in playerList");
  }
  else {
    console.info('Removing player ' + player.getNick());
    _playersList.splice(pos, 1);
    console.info('It remains ' + _playersList.length + ' player(s)');
  }
}

PlayersManager.prototype.changeLobbyState = function (player, isReady) {
  let pos = _playersList.indexOf(player),
      nbPlayers = _playersList.length,
      i;

  if (pos < 0) {
    console.error("[ERROR] Can't find player in playerList");
  }
  else {
    // Change ready state
    _playersList[pos].setReadyState(isReady);
  }

  // PlayersManager check if players are ready
  for (i = 0; i < nbPlayers; i++) {
    // if at least one player doesn't ready, return
    if (_playersList[i].getState() === enums.PlayerState.WaitingInLobby) {
      console.info(_playersList[i].getNick() + " is not yet ready, don't start game");
      return;
    }
  }

  // else raise the start game event !
  this.emit('players-ready');
}

PlayersManager.prototype.getPlayerList = function (specificState) {
  let players = [],
      nbPlayers = _playersList.length,
      i;

  for (i = 0; i < nbPlayers; i++) {
    if (specificState) {
      if (_playersList[i].getState() === specificState)
        players.push(_playersList[i]);
    }
    else
      players.push(_playersList[i].getPlayerObject());
  }

  return (players);
}

PlayersManager.prototype.getOnGamePlayerList = function () {
  let players = [],
      nbPlayers = _playersList.length,
      i;

  for (i = 0; i < nbPlayers; i++) {
    if ((_playersList[i].getState() === enums.PlayerState.Playing) || (_playersList[i].getState() === enums.PlayerState.Died))
      players.push(_playersList[i].getPlayerObject());
  }

  return (players);
}

PlayersManager.prototype.getNumberOfPlayers = function () {
  return (_playersList.length);
}

PlayersManager.prototype.updatePlayers = function (time) {
  let nbPlayers = _playersList.length,
      i;

  for (i = 0; i < nbPlayers; i++) {
    _playersList[i].update(time);
  }
};

PlayersManager.prototype.arePlayersStillAlive = function () {
  let nbPlayers = _playersList.length,
      i;

  for (i = 0; i < nbPlayers; i++) {
    if (_playersList[i].getState() === enums.PlayerState.Playing)
      return true;
  }

  return false;
};

PlayersManager.prototype.resetPlayersForNewGame = function () {
  let nbPlayers = _playersList.length,
      i,
      updatedList = [];

  // reset position counter
  _posOnGrid = 0;

  for (i = 0; i < nbPlayers; i++) {
    _playersList[i].preparePlayer(_posOnGrid++);
    updatedList.push(_playersList[i].getPlayerObject());
  }

  return (updatedList);
};

PlayersManager.prototype.sendPlayerScore = function () {
  let nbPlayers = _playersList.length,
      i;

  // Save player score
  for (i = 0; i < nbPlayers; i++) {
    _scores.savePlayerScore(_playersList[i], _playersList[i].getScore());
  }

  // Retreive highscores and then send scores to players
  _scores.getHighScores(function (highScores) {
    let nbPlayers = _playersList.length,
        i;

    // Send score to the players
    for (i = 0; i < nbPlayers; i++) {
      _playersList[i].sendScore(nbPlayers, highScores);
    }
  });

};

PlayersManager.prototype.prepareNewPlayer = function (player, nickname, floor) {
  // Set his nickname
  player.setNick(nickname);
  player.setFloor(floor)

  // retreive his highscore
  _scores.setPlayerHighScore(player);

  // Put him on the game grid 
  player.preparePlayer(_posOnGrid++);
};


module.exports = PlayersManager;
