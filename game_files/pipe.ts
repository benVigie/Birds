import { constants as Const } from "../constants";

export default class Pipe {
  private _pipeTinyObject: {
    id: number;
    posX: number;
    posY: number;
  };

  constructor(lastPipePosX: number) {
    this._pipeTinyObject = {
      id: new Date().getTime(),
      posX: lastPipePosX + Const.DISTANCE_BETWEEN_PIPES,
      posY: Math.floor(
        Math.random() *
          (Const.MAX_PIPE_HEIGHT -
            Const.HEIGHT_BETWEEN_PIPES -
            Const.MIN_PIPE_HEIGHT +
            1) +
          Const.MIN_PIPE_HEIGHT
      ),
    };
  }

  update(timeLapse: number) {
    this._pipeTinyObject.posX -= Math.floor(timeLapse * Const.LEVEL_SPEED);
  }

  canBeDropped() {
    return this._pipeTinyObject.posX + Const.PIPE_WIDTH < 0;
  }

  getPipeObject() {
    return this._pipeTinyObject;
  }
}
