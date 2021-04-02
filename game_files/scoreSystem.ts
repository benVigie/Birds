/*
 * This class will store the best score of all players.
 * It will try to reach a DB by default (best way to store datas). But if you don't have a MySQL server or if the class
 * can't establish a connection, player's score will be store in an array (but values will be lost on server shutdown !)
 *
 */
export default class ScoreSystem {
  private _bestScore: {
    [key: string]: number;
  };

  constructor() {
    this._bestScore = {};
  }

  /**
   * @todo Change 'player' to Player class type
   */
  setPlayerHighScore(player: any) {
    const nick = player.getNick();

    if (typeof this._bestScore[nick] !== "undefined") {
      player.setBestScore(this._bestScore[nick]);
    } else {
      player.setBestScore(0);
    }
  }

  /**
   * @todo Change 'player' to Player class type
   */
  savePlayerScore(player: any, lastScore: number) {
    const nick = player.getNick();

    const highScore = player.getHighScore();

    // If the player just beats his highscore, record it !
    if (lastScore > highScore) {
      this._bestScore[nick] = lastScore;

      console.info(
        nick +
          " new high score (" +
          lastScore +
          ") was saved in the score array !"
      );
    }
  }

  getHighScores(
    callback: (
      hsArray: {
        player: string;
        score: number;
      }[]
    ) => void
  ) {
    const sortedScores = Object.fromEntries(
      Object.entries(this._bestScore).sort(([, a], [, b]) => a - b)
    );

    // Return the NUMBER_OF_HIGHSCORES_TO_RETREIVE best scores
    let hsArray = [];

    for (const key in sortedScores) {
      hsArray.push({
        player: key,
        score: this._bestScore[key],
      });
    }

    callback(hsArray);
  }
}
