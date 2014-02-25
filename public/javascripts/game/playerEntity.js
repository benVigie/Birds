/*
*   Represent a player. Can  
*/
define( function() {

  var enumPlayerState = {
    Unset: 1,
    WaintingInLobby: 2,
    Ready: 3,
    Playing: 4
  };

  var BIRD_HEIGHT = 60;
  var BIRD_WIDTH  = 85;
  var COMPLETE_ANNIMATION_DURATION  = 150;
  var ANIMATION_FRAME_NUMBER        = 3;

  function Player (infos, uuid) {
    this._serverInfos = infos;
    this._isMe = false;

    if (uuid && (uuid == infos.id)) {
      this._isMe = true;
      
      console.log('Adding player ' + infos.nick);
    };

    Player.prototype.draw = function (ctx, time, spriteList) {
      var frameNumber;

      if (this._isMe === false) {
        ctx.globalAlpha = 0.6;
      }

      // if player is waiting (!= ready), just draw the bird pic
      if (this._serverInfos.state == enumPlayerState.WaintingInLobby) {
        ctx.drawImage(spriteList[this._serverInfos.color], 0, 0, BIRD_WIDTH, BIRD_HEIGHT, this._serverInfos.posX, this._serverInfos.posY, BIRD_WIDTH, BIRD_HEIGHT);
      }
      // If he is ready or in game, animate the bird !
      else {
        frameNumber = Math.round(time / COMPLETE_ANNIMATION_DURATION) % ANIMATION_FRAME_NUMBER;
        ctx.drawImage(spriteList[this._serverInfos.color], frameNumber * BIRD_WIDTH, 0, BIRD_WIDTH, BIRD_HEIGHT, this._serverInfos.posX, this._serverInfos.posY, BIRD_WIDTH, BIRD_HEIGHT);
      }

      if (this._isMe === false) {
        ctx.globalAlpha = 1;
      }
    };

    Player.prototype.updateFromServer = function (infos) {
      this._serverInfos = infos;
    };

    Player.prototype.isCurrentPlayer = function () {
      return (this._isMe);
    };

    Player.prototype.getId = function () {
      return (this._serverInfos.id);
    };

    Player.prototype.updateReadyState = function (readyState) {
      this._serverInfos.state = (readyState === true) ? enumPlayerState.Ready : enumPlayerState.WaintingInLobby;
      console.log(this._serverInfos.nick + ' is ' + ((this._serverInfos.state == enumPlayerState.Ready) ? 'ready !': 'not yet ready'));
    };

  }

  return (Player);
});