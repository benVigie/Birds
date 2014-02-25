var PIPE_SPEED              = 0.3;
var PIPE_WIDTH              = 148
var DISTANCE_BETWEEN_PIPES  = 250 + PIPE_WIDTH;
var MIN_PIPE_HEIGHT         = 20;
var MAX_PIPE_HEIGHT         = 680;
var HEIGHT_BETWEEN_PIPE     = 150;

var Pipe = function (lastPipePosX) {
  var that   = {},
    _pipeTinyObject = {
      posX:   0,
      posY:   0
    };

  that.update = function (timeLapse) {
    _pipeTinyObject.posX -= Math.floor(timeLapse * PIPE_SPEED);
  };

  that.canBeDroped = function () {
    if (_pipeTinyObject.posX + PIPE_WIDTH < 0)
      return (true);
    return (false);
  };

  that.getPipeObject = function () {
    return (_pipeTinyObject);
  };


  function setInitialPosition (lastPipePosX) {
    _pipeTinyObject.posX = lastPipePosX + DISTANCE_BETWEEN_PIPES;
    _pipeTinyObject.posY = Math.floor(Math.random() * ((MAX_PIPE_HEIGHT - HEIGHT_BETWEEN_PIPE)- MIN_PIPE_HEIGHT + 1) + MIN_PIPE_HEIGHT);
  };

  setInitialPosition(lastPipePosX);
  
  return (that);
};

exports.createNewPipe = Pipe;