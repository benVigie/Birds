/*
*   Represent a player. Can  
*/
define(['../../sharedConstants'], function (Const) {

  var enumPlayerState = {
    Unset: 1,
    WaintingInLobby: 2,
    Playing: 3,
    Died: 4
  };

  var SPRITE_BIRD_HEIGHT = 60;
  var SPRITE_BIRD_WIDTH  = 85;
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
      var frameNumber,
          nickPos;

      if (this._isMe === false) {
        // Draw player name
        ctx.globalAlpha = 0.6;
        ctx.font = '25px mini_pixel';
        ctx.fillStyle = '#FFA24A';
        nickPos = this._serverInfos.posX + (Const.BIRD_WIDTH / 2) - (ctx.measureText(this._serverInfos.nick + '(' + this._serverInfos.best_score + ')').width / 2);
        ctx.fillText(this._serverInfos.nick + '(' + this._serverInfos.best_score + ')', nickPos, this._serverInfos.posY - 20);
      }

      if (this._serverInfos.state == enumPlayerState.Unset) {
        return;
      }
      else {
        // Finally draw bird
        if (this._serverInfos.state == enumPlayerState.WaintingInLobby) {
          ctx.drawImage(spriteList[this._serverInfos.color], 0, 0, SPRITE_BIRD_WIDTH, SPRITE_BIRD_HEIGHT, this._serverInfos.posX, this._serverInfos.posY, Const.BIRD_WIDTH, Const.BIRD_HEIGHT);
        }
        // If he is ready or in game, animate the bird !
        else {
          frameNumber = Math.round(time / COMPLETE_ANNIMATION_DURATION) % ANIMATION_FRAME_NUMBER;
          ctx.drawImage(spriteList[this._serverInfos.color], frameNumber * SPRITE_BIRD_WIDTH, 0, SPRITE_BIRD_WIDTH, SPRITE_BIRD_HEIGHT, this._serverInfos.posX, this._serverInfos.posY, Const.BIRD_WIDTH, Const.BIRD_HEIGHT);
        }
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

    Player.prototype.getNick = function () {
      return (this._serverInfos.nick);
    };

    Player.prototype.updateReadyState = function (readyState) {
      this._serverInfos.state = (readyState === true) ? enumPlayerState.Ready : enumPlayerState.WaintingInLobby;
      console.log(this._serverInfos.nick + ' is ' + ((this._serverInfos.state == enumPlayerState.Ready) ? 'ready !': 'not yet ready'));
    };

  }

  return (Player);
});