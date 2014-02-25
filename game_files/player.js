var enums   = require('./enums'),
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
    // If player is still alive, update its Y position
    if (_playerTinyObject.state == enums.PlayerState.Playing) {
      _speedY += _gravity;
      _playerTinyObject.posY += Math.round(timeLapse * _speedY);
    }
    // If he's died, update it's X position
    else if (_playerTinyObject.state == enums.PlayerState.Died) {
      _playerTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
    }
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
    _playerTinyObject.state = (readyState == true) ? enums.PlayerState.Playing : enums.PlayerState.WaintingInLobby;
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
    _playerTinyObject.state = enums.PlayerState.WaintingInLobby;
  };

  that.sendScore = function () {
    
    _socket.emit('ranking', 1, 12);
  };
  

  that.socket = _socket;

  return (that);
};

exports.createNewPlayer = Player;