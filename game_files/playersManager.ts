import { EventEmitter } from "events";
import * as enums from "./enums";
import Player from "./player";
import Scores from "./scoreSystem";

const NB_AVAILABLE_BIRDS_COLOR = 4;

let _playersList = [];
let _posOnGrid = 0;
let _scores = new Scores();

export default class PlayersManager extends EventEmitter {
  addNewPlayer(playerSocket, id) {
    // Set an available color according the number of client's sprites
    const birdColor = Math.floor(
      Math.random() * (NB_AVAILABLE_BIRDS_COLOR - 1 + 1)
    );

    // Create new player and add it in the list
    const newPlayer = new Player(playerSocket, id, birdColor);

    _playersList.push(newPlayer);

    console.info(
      "New player connected. There is currently " +
        _playersList.length +
        " player(s)"
    );

    return newPlayer;
  }

  removePlayer(player) {
    const pos = _playersList.indexOf(player);

    if (pos < 0) {
      console.error("[ERROR] Can't find player in playerList");
    } else {
      console.info("Removing player " + player.getNick());

      _playersList.splice(pos, 1);

      console.info("It remains " + _playersList.length + " player(s)");
    }
  }

  changeLobbyState(player, isReady) {
    let pos = _playersList.indexOf(player);

    if (pos < 0) {
      console.error("[ERROR] Can't find player in playerList");
    } else {
      // Change ready state
      _playersList[pos].setReadyState(isReady);
    }

    // PlayersManager check if players are ready
    for (let i = 0; i < _playersList.length; i++) {
      // if at least one player doesn't ready, return
      if (_playersList[i].getState() === enums.PlayerState.WaitingInLobby) {
        const nick = _playersList[i].getNick();

        console.info(nick + " is not yet ready, don't start game");

        return;
      }
    }

    // else raise the start game event !
    this.emit("players-ready");
  }

  getPlayerList(specificState) {
    let players = [];

    for (let i = 0; i < _playersList.length; i++) {
      if (specificState) {
        if (_playersList[i].getState() === specificState) {
          players.push(_playersList[i]);
        }
      } else {
        players.push(_playersList[i].getPlayerObject());
      }
    }

    return players;
  }

  getOnGamePlayerList() {
    let players = [];

    for (let i = 0; i < _playersList.length; i++) {
      if (
        _playersList[i].getState() === enums.PlayerState.Playing ||
        _playersList[i].getState() === enums.PlayerState.Died
      )
        players.push(_playersList[i].getPlayerObject());
    }

    return players;
  }

  getNumberOfPlayers() {
    return _playersList.length;
  }

  updatePlayers(time) {
    for (let i = 0; i < _playersList.length; i++) {
      _playersList[i].update(time);
    }
  }

  arePlayersStillAlive() {
    for (let i = 0; i < _playersList.length; i++) {
      if (_playersList[i].getState() === enums.PlayerState.Playing) {
        return true;
      }
    }

    return false;
  }

  resetPlayersForNewGame() {
    let updatedList = [];

    // reset position counter
    _posOnGrid = 0;

    for (let i = 0; i < _playersList.length; i++) {
      _playersList[i].preparePlayer(_posOnGrid++);

      updatedList.push(_playersList[i].getPlayerObject());
    }

    return updatedList;
  }

  sendPlayerScore() {
    // Save player score
    for (let i = 0; i < _playersList.length; i++) {
      _scores.savePlayerScore(_playersList[i], _playersList[i].getScore());
    }

    // Retrieve highscores and then send scores to players
    _scores.getHighScores(function (highScores) {
      // Send score to the players
      for (let i = 0; i < _playersList.length; i++) {
        _playersList[i].sendScore(_playersList.length, highScores);
      }
    });
  }

  prepareNewPlayer(player, nickname, floor) {
    // Set his nickname
    player.setNick(nickname);

    player.setFloor(floor);

    // Retrieve his highscore
    _scores.setPlayerHighScore(player);

    // Put him on the game grid
    player.preparePlayer(_posOnGrid++);
  }
}
