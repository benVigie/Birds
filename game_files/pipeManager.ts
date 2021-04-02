import { EventEmitter } from "events";
import { inherits } from "util";
import { constant as Const } from "../constantss";
import Pipe from "./pipe";

let FIRST_PIPE_POSX = Const.SCREEN_WIDTH + 100;
let SPAWN_PIPE_ALERT = Const.SCREEN_WIDTH;
let MAX_PIPE_CHECK_COLLISION = 3;

let _pipeList = [];
let _socket = null;

inherits(PipeManager, EventEmitter);

export default class PipeManager {
  constructor() {
    EventEmitter.call(this);
  }

  setSocket(socket) {
    _socket = socket;
  }

  newPipe() {
    let newPipe;
    let lastPos = FIRST_PIPE_POSX;

    if (_pipeList.length > 0)
      lastPos = _pipeList[_pipeList.length - 1].getPipeObject().posX;

    newPipe = new Pipe(lastPos);
    _pipeList.push(newPipe);

    return newPipe;
  }

  updatePipes(time) {
    let nbPipes = _pipeList.length;
    let i;

    // If the first pipe is out of the screen, erase it
    if (_pipeList[0].canBeDroped()) {
      _pipeList.shift();
      nbPipes--;
    }

    for (i = 0; i < nbPipes; i++) {
      _pipeList[i].update(time);
    }

    if (_pipeList[nbPipes - 1].getPipeObject().posX < SPAWN_PIPE_ALERT)
      this.emit("need_new_pipe");
  }

  getPipeList() {
    let pipes = [];
    let nbPipes = _pipeList.length;
    let i;

    for (i = 0; i < nbPipes; i++) {
      pipes.push(_pipeList[i].getPipeObject());
    }

    return pipes;
  }

  getPotentialPipeHit() {
    let pipes = [];
    let nbPipes = _pipeList.length;
    let i;

    // In multiplayer mode, just check the first 2 pipes
    // because the other ones are too far from the players
    if (nbPipes > MAX_PIPE_CHECK_COLLISION) nbPipes = MAX_PIPE_CHECK_COLLISION;

    for (i = 0; i < nbPipes; i++) {
      pipes.push(_pipeList[i].getPipeObject());
    }

    return pipes;
  }

  flushPipeList() {
    _pipeList = [];
  }
}
