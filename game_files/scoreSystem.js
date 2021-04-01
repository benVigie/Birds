/*
* This class will store the best score of all players.
* It will try to reach a DB by default (best way to store datas). But if you don't have a MySQL server or if the class
* can't establish a connection, player's score will be store in an array (but values will be lost on server shutdown !)
* 
*/
function ScoreSystem () {

  // Default array
  this._bestScore = [];
}


ScoreSystem.prototype.setPlayerHighScore = function (player) {
  const nick = player.getNick();

  if (typeof this._bestScore[nick] != 'undefined')
    player.setBestScore(this._bestScore[nick]);
  else
    player.setBestScore(0);
};

ScoreSystem.prototype.savePlayerScore = function (player, lastScore) {
  const nick = player.getNick(),
      highScore = player.getHighScore();

  // If the player just beats his highscore, record it !
  if (lastScore > highScore) {
    this._bestScore[nick] = lastScore;
    console.info(nick + ' new high score (' + lastScore + ') was saved in the score array !');
  }
};

ScoreSystem.prototype.getHighScores = function (callback) {
  let hsArray = null,
      key;

  // Sort tab
  this._bestScore.sort(function (a, b) {
    if (a > b)
      return (-1);
    if (a < b)
      return (1);
    return (0);
  });

  // Return the NUMBER_OF_HIGHSCORES_TO_RETREIVE best scores
  hsArray = [];

  for (key in this._bestScore) {
    hsArray.push( { player: key, score: this._bestScore[key] } );
  }


  callback(hsArray);
};

module.exports = ScoreSystem;