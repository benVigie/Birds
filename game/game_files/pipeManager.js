var util          = require('util'),
    EventEmitter  = require('events').EventEmitter,
    Pipe          = require('./pipe'),
    enums         = require('./enums'),
    Const         = require('../sharedConstants').constant;

var FIRST_PIPE_POSX           = Const.SCREEN_WIDTH + 100;
var SPAWN_PIPE_ALERT          = Const.SCREEN_WIDTH;
var MAX_PIPE_CHECK_COLLISION  = 3;

var _pipeList = new Array(),
    _socket = null;

function PipeManager () {
  EventEmitter.call(this);
};

util.inherits(PipeManager, EventEmitter);

PipeManager.prototype.setSocket = function (socket) {
  _socket = socket;
};

PipeManager.prototype.newPipe = function () {
  var newPipe,
      lastPos = FIRST_PIPE_POSX;

  if (_pipeList.length > 0)
    lastPos = _pipeList[_pipeList.length - 1].getPipeObject().posX;

  newPipe = new Pipe(lastPos);
  _pipeList.push(newPipe);

  return (newPipe);
};

PipeManager.prototype.updatePipes = function (time) {
  var nbPipes = _pipeList.length,
      i;

  // If the first pipe is out of the screen, erase it
  if (_pipeList[0].canBeDroped() == true) {
    _pipeList.shift();
    nbPipes--;
  }

  for (i = 0; i < nbPipes; i++) {
    _pipeList[i].update(time);
  };

  if (_pipeList[nbPipes - 1].getPipeObject().posX < SPAWN_PIPE_ALERT)
    this.emit('need_new_pipe');
};

PipeManager.prototype.getPipeList = function () {
  var pipes = new Array(),
      nbPipes = _pipeList.length,
      i;

  for (i = 0; i < nbPipes; i++) {
      pipes.push(_pipeList[i].getPipeObject());
  };

  return (pipes);
};

PipeManager.prototype.getPotentialPipeHit = function () {
  var pipes = new Array(),
      nbPipes = _pipeList.length,
      i;

  // In multiplayer mode, just check the first 2 pipes
  // because the other ones are too far from the players
  if (nbPipes > MAX_PIPE_CHECK_COLLISION)
    nbPipes = MAX_PIPE_CHECK_COLLISION;

  for (i = 0; i < nbPipes; i++) {
    pipes.push(_pipeList[i].getPipeObject());
  };

  return (pipes);
};

PipeManager.prototype.flushPipeList = function () {
  _pipeList = new Array();
};


module.exports = PipeManager;