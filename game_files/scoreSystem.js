
function ScoreSystem () {
  this._bestScore = new Array();
};

ScoreSystem.prototype.retreiveHighScore = function (player) {
  if (typeof this._bestScore[player.getNick()] != undefined)
    return (this._bestScore[player.getNick()]);

  return (0);
};

ScoreSystem.prototype.setPlayerScore = function (player) {
  if (typeof this._bestScore[player] != undefined)
    return (this._bestScore[player]);
};

module.exports = ScoreSystem;