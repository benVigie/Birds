var Const = require('../sharedConstants').constant;

function Pipe (lastPipePosX) {
  this._pipeTinyObject = {
    id:   new Date().getTime(),
    posX: (lastPipePosX + Const.DISTANCE_BETWEEN_PIPES),
    posY: Math.floor(Math.random() * ((Const.MAX_PIPE_HEIGHT - Const.HEIGHT_BETWEEN_PIPES)- Const.MIN_PIPE_HEIGHT + 1) + Const.MIN_PIPE_HEIGHT)
  };
};
 
Pipe.prototype.update = function (timeLapse) {
  this._pipeTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
};

Pipe.prototype.canBeDroped = function () {
  if (this._pipeTinyObject.posX + Const.PIPE_WIDTH < 0)
    return (true);
  return (false);
};

Pipe.prototype.getPipeObject = function () {
  return (this._pipeTinyObject);
};

module.exports = Pipe;