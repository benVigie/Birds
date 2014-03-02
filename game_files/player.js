var enums   = require('./enums'),
    Const   = require('../sharedConstants').constant;

// Defines
var MAX_BIRDS_IN_A_ROW      = 3;
var START_BIRD_POS_X        = 100;
var SPACE_BETWEEN_BIRDS_X   = 120;
var START_BIRD_POS_Y        = 100;
var SPACE_BETWEEN_BIRDS_Y   = 100;
var GRAVITY_SPEED           = 0.05;
var JUMP_SPEED              = -0.6;
var MAX_ROTATION            = -10;
var MIN_ROTATION            = 60;
var ROTATION_SPEED          = 8;


function Player (socket, uid, color) {
  this._socket    = socket;
  this._speedY    = 0;
  this._isInAPipe = false;
  this._rank      = 1;
  this._playerTinyObject = {
      id:         uid,
      nick:       '',
      color:      color,
      rotation:   0,
      score:      0,
      best_score: 0,
      state:      enums.PlayerState.OnLoginScreen,
      posX:       0,
      posY:       0
    };
  };

  Player.prototype.update = function (timeLapse) {
    // console.info('Update player ' + this._playerTinyObject.nick);
    
    // If player is still alive, update its Y position
    if (this._playerTinyObject.state == enums.PlayerState.Playing) {
      // calc now Y pos
      this._speedY += GRAVITY_SPEED;
      this._playerTinyObject.posY += Math.round(timeLapse * this._speedY);
      
      // Calc rotation
      this._playerTinyObject.rotation += Math.round(this._speedY * ROTATION_SPEED);
      if (this._playerTinyObject.rotation > MIN_ROTATION)
        this._playerTinyObject.rotation = MIN_ROTATION;
    }
    // If he's died, update it's X position
    else if (this._playerTinyObject.state == enums.PlayerState.Died) {
      this._playerTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
    }
    else {
      // console.info(this._playerTinyObject.nick + " doesn't move because he's in state " + this._playerTinyObject.state);
    }
  };
  
  Player.prototype.jump = function () {
    this._speedY = JUMP_SPEED;
    this._playerTinyObject.rotation = MAX_ROTATION;
  };

  Player.prototype.getNick = function () { return (this._playerTinyObject.nick); };
  Player.prototype.setNick = function (nick) {
    this._playerTinyObject.nick = nick;
    console.info('Please call me [' + nick + '] !');
  };

  Player.prototype.getID = function () { return (this._playerTinyObject.id); };
  
  Player.prototype.getState = function () { return (this._playerTinyObject.state); };
  Player.prototype.getScore = function () { return (this._playerTinyObject.score); };
  Player.prototype.getHighScore = function () { return (this._playerTinyObject.best_score); };
  
  Player.prototype.sorryYouAreDie = function (nbPlayersLeft) {
    this._rank = nbPlayersLeft;
    this._playerTinyObject.state = enums.PlayerState.Died;
  };

  Player.prototype.setReadyState = function (readyState) {
    this._playerTinyObject.state = (readyState == true) ? enums.PlayerState.Playing : enums.PlayerState.WaitingInLobby;
    console.info(this._playerTinyObject.nick + ' is ' + ((this._playerTinyObject.state == enums.PlayerState.Playing) ? 'ready !' : 'not yet ready'));
  };

  Player.prototype.setBestScore = function (score) {
    this._playerTinyObject.best_score = score;
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
    this._rank    = 0;
    this._playerTinyObject.score    =  0;
    this._playerTinyObject.rotation =  0;
    // Update all register players
    if (this._playerTinyObject.nick != '')
      this._playerTinyObject.state = enums.PlayerState.WaitingInLobby;
  };  

  Player.prototype.updateScore = function (isEnterAPipe) {
    // PLayer enters a pipe
    if (isEnterAPipe == true && this._isInAPipe == false)
    {
      this._playerTinyObject.score++;
      this._isInAPipe = true;
    }
    else if (isEnterAPipe == false && this._isInAPipe == true)
      this._isInAPipe = false;
  };

  Player.prototype.sendScore = function (NBPlayers) {
    var isNewBestScore = false;

    if (this._playerTinyObject.score > this._playerTinyObject.best_score) {
      this._playerTinyObject.best_score = this._playerTinyObject.score;
      isNewBestScore = true;
    }

    this._socket.emit('ranking',  { score: this._playerTinyObject.score, bestScore: this._playerTinyObject.best_score, rank: this._rank, nbPlayers: NBPlayers, newBestScore: isNewBestScore });
  };
  

module.exports = Player;