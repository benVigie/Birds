var enums   = require('./enums'),
    Const   = require('../sharedConstants').constant;

// Defines
var MAX_BIRDS_IN_A_ROW      = 3;
var START_BIRD_POS_X        = 100;
var SPACE_BETWEEN_BIRDS_X   = 120;
var START_BIRD_POS_Y        = 100;
var SPACE_BETWEEN_BIRDS_Y   = 100;

function Player (socket, uid, color) {
  this._socket  = socket;
  this._gravity = 0.1;
  this._speedJump = -1;
  this._speedY  = 0;
  this._playerTinyObject = {
      id:     uid,
      nick:   '',
      color:  color,
      score:  0,
      state:  enums.PlayerState.OnLoginScreen,
      posX:   0,
      posY:   0
    };
  };

  Player.prototype.update = function (timeLapse) {
    console.info('Update player ' + this._playerTinyObject.nick);
    
    // If player is still alive, update its Y position
    if (this._playerTinyObject.state == enums.PlayerState.Playing) {
      this._speedY += this._gravity;
      this._playerTinyObject.posY += Math.round(timeLapse * this._speedY);
    }
    // If he's died, update it's X position
    else if (this._playerTinyObject.state == enums.PlayerState.Died) {
      this._playerTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
    }
    else {
      console.info(this._playerTinyObject.nick + " doesn't move because he's in state " + this._playerTinyObject.state);
    }

    console.info(this._playerTinyObject.nick + ' new pos: ' + this._playerTinyObject.posX + ' - ' + this._playerTinyObject.posY);
  };
  
  Player.prototype.jump = function () {
    this._speedY = this._speedJump;
  };

  Player.prototype.getNick = function () { return (this._playerTinyObject.nick); };
  Player.prototype.setNick = function (nick) {
    this._playerTinyObject.nick = nick;
    console.info('Please call me [' + nick + '] !');
  };

  Player.prototype.getID = function () { return (this._playerTinyObject.id); };
  
  Player.prototype.getState = function () { return (this._playerTinyObject.state); };
  
  Player.prototype.sorryYouAreDie = function () {
    this._playerTinyObject.state = enums.PlayerState.Died;
  };

  Player.prototype.setReadyState = function (readyState) {
    this._playerTinyObject.state = (readyState == true) ? enums.PlayerState.Playing : enums.PlayerState.WaitingInLobby;
    console.info(this._playerTinyObject.nick + ' is ' + ((this._playerTinyObject.state == enums.PlayerState.Playing) ? 'ready !' : 'not yet ready'));
  };

  Player.prototype.isReadyToPlay = function () {
    if (this._playerTinyObject.state == enums.PlayerState.Playing)
      return (true);
    return (false);
  };

  Player.prototype.getPlayerObject = function () {
    return (this._playerTinyObject);
  };

  Player.prototype.preparePlayer = function (pos) {
    var line,
        col;

    // Place bird on the departure grid :p
    line = Math.floor(pos / MAX_BIRDS_IN_A_ROW);
    col = Math.floor(pos % MAX_BIRDS_IN_A_ROW);    
    this._playerTinyObject.posY = START_BIRD_POS_Y + line * SPACE_BETWEEN_BIRDS_Y;
    this._playerTinyObject.posX = START_BIRD_POS_X + col * SPACE_BETWEEN_BIRDS_X;

    // Reset usefull values
    this._speedY  = 0;
    this._playerTinyObject.score =  0;
    this._playerTinyObject.state = enums.PlayerState.WaitingInLobby;
  };

  Player.prototype.sendScore = function () {
    
    this._socket.emit('ranking', 1, 12);
  };
  

  // Player.prototype.socket = _socket;


module.exports = Player;

/*var enums   = require('./enums'),
    Const   = require('../sharedConstants').constant;

// Defines
var MAX_BIRDS_IN_A_ROW      = 3;
var START_BIRD_POS_X        = 100;
var SPACE_BETWEEN_BIRDS_X   = 120;
var START_BIRD_POS_Y        = 100;
var SPACE_BETWEEN_BIRDS_Y   = 100;

var Player = function (socket, uid, color) {
  var that   = {},
    _socket  = socket,
    _gravity = 0.1;
    _speedJump = -1;
    _speedY  = 0;
    _playerTinyObject = {
      id:     uid,
      nick:   '',
      color:  color,
      score:  0,
      state:  enums.PlayerState.OnLoginScreen,
      posX:   0,
      posY:   0
    };

  that.update = function (timeLapse) {
    console.info('Update player ' + _playerTinyObject.nick);
    
    // If player is still alive, update its Y position
    if (_playerTinyObject.state == enums.PlayerState.Playing) {
      _speedY += _gravity;
      _playerTinyObject.posY += Math.round(timeLapse * _speedY);
    }
    // If he's died, update it's X position
    else if (_playerTinyObject.state == enums.PlayerState.Died) {
      _playerTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
    }

    console.info(_playerTinyObject.nick + ' new pos: ' + _playerTinyObject.posX + ' - ' + _playerTinyObject.posY);
  };
  
  that.jump = function () {
    _speedY = _speedJump;
  };

  that.getNick = function () { return (_playerTinyObject.nick); };
  that.setNick = function (nick) {
    _playerTinyObject.nick = nick;
    console.info('Please call me [' + nick + '] !');
  };

  that.getID = function () { return (_playerTinyObject.id); };
  
  that.getState = function () { return (_playerTinyObject.state); };
  
  that.sorryYouAreDie = function () {
    _playerTinyObject.state = enums.PlayerState.Died;
  };

  that.setReadyState = function (readyState) {
    _playerTinyObject.state = (readyState == true) ? enums.PlayerState.Playing : enums.PlayerState.WaitingInLobby;
    console.info(_playerTinyObject.nick + ' is ' + ((_playerTinyObject.state == enums.PlayerState.Playing) ? 'ready !' : 'not yet ready'));
  };

  that.isReadyToPlay = function () {
    if (_playerTinyObject.state == enums.PlayerState.Playing)
      return (true);
    return (false);
  };

  that.getPlayerObject = function () {
    return (_playerTinyObject);
  };

  that.preparePlayer = function (pos) {
    var line,
        col;

    // Place bird on the departure grid :p
    line = Math.floor(pos / MAX_BIRDS_IN_A_ROW);
    col = Math.floor(pos % MAX_BIRDS_IN_A_ROW);    
    _playerTinyObject.posY = START_BIRD_POS_Y + line * SPACE_BETWEEN_BIRDS_Y;
    _playerTinyObject.posX = START_BIRD_POS_X + col * SPACE_BETWEEN_BIRDS_X;

    // Reset usefull values
    _speedY  = 0;
    _playerTinyObject.score =  0;
    _playerTinyObject.state = enums.PlayerState.WaitingInLobby;
  };

  that.sendScore = function () {
    
    _socket.emit('ranking', 1, 12);
  };
  

  that.socket = _socket;

  return (that);
};

exports.createNewPlayer = Player;*/