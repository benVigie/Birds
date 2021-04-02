/*
 *   Class to manage the canvas. Draw players, backgrounds, etc...
 */
define(["parallax", "backgroundResources", "../../sharedConstants"], function (
  Parallax,
  BgResources,
  Const
) {
  // Sprite resource dimensions
  var SPRITE_PIPE_HEIGHT = 768;
  var SPRITE_PIPE_WIDTH = 148;

  // Const to display score in game
  var SCORE_POS_Y = 200;
  var SCORE_SHADOW_OFFSET = 5;

  // Resources
  var NB_RESOURCES_TO_LOAD = 2;

  // Birds sprites
  var BIRDS_SPRITES = [
    "images/clumsy.png",
    "images/clumsy-blue.png",
    "images/clumsy-red.png",
    "images/clumsy-multi.png",
  ];

  var that = {},
    ctx = document.getElementById("gs-canvas").getContext("2d"),
    _isReadyToDraw = false,
    // Resources
    _nbResourcesToLoad = getNbResourcesToLoad(),
    _picGround,
    _parallaxGround,
    _picPipe,
    _picBG = new Array();
  _picBirds = new Array();

  function getNbResourcesToLoad() {
    var nbResources = NB_RESOURCES_TO_LOAD + BIRDS_SPRITES.length,
      nbBg = BgResources.length,
      i;

    // Search number of BG resources
    for (i = 0; i < nbBg; i++) {
      if (typeof BgResources[i].daySrc !== "undefined") nbResources++;
      if (typeof BgResources[i].nightSrc !== "undefined") nbResources++;
    }

    return nbResources;
  }

  function drawPipe(pipe) {
    // Draw the first pipe
    ctx.drawImage(
      _picPipe,
      0,
      0,
      SPRITE_PIPE_WIDTH,
      SPRITE_PIPE_HEIGHT,
      pipe.posX,
      pipe.posY - SPRITE_PIPE_HEIGHT,
      Const.PIPE_WIDTH,
      SPRITE_PIPE_HEIGHT
    );

    // And the other one
    ctx.drawImage(
      _picPipe,
      0,
      0,
      SPRITE_PIPE_WIDTH,
      SPRITE_PIPE_HEIGHT,
      pipe.posX,
      pipe.posY + Const.HEIGHT_BETWEEN_PIPES,
      Const.PIPE_WIDTH,
      SPRITE_PIPE_HEIGHT
    );
  }

  function drawScore(score) {
    var posX;

    posX = Const.SCREEN_WIDTH / 2 - ctx.measureText(score).width / 2;
    ctx.font = "120px mini_pixel";
    ctx.fillStyle = "black";
    ctx.fillText(
      score,
      posX + SCORE_SHADOW_OFFSET,
      SCORE_POS_Y + SCORE_SHADOW_OFFSET
    );
    ctx.fillStyle = "white";
    ctx.fillText(score, posX, SCORE_POS_Y);
  }

  that.draw = function (
    currentTime,
    ellapsedTime,
    playerManager,
    pipes,
    gameState,
    isNight
  ) {
    var nb,
      i,
      players = playerManager.getPlayers();

    if (!_isReadyToDraw) {
      console.log("[ERROR] : Resources not yet loaded !");
      return;
    }

    // First, draw the background
    ctx.fillStyle = "#0099CC";
    ctx.fillRect(0, 0, Const.SCREEN_WIDTH, window.innerHeight - 96);

    // Then backgrounds pictures
    nb = _picBG.length;
    for (i = 0; i < nb; i++) {
      _picBG[i].draw(ctx, ellapsedTime, isNight);
    }

    // Draw pipes
    if (pipes) {
      nb = pipes.length;
      for (i = 0; i < nb; i++) {
        drawPipe(pipes[i]);
      }
    }

    // Draw birds !
    if (players) {
      nb = players.length;
      for (i = 0; i < nb; i++) {
        players[i].draw(ctx, currentTime, _picBirds, gameState);
      }
    }

    // Draw score
    if (gameState == 2) drawScore(playerManager.getCurrentPlayer().getScore());

    // Last but not least, draw ground
    if (pipes) _parallaxGround.draw(ctx, currentTime);
    else _parallaxGround.draw(ctx, 0);
  };

  that.resetForNewGame = function () {
    var nb = _picBG.length,
      i;
    // Reset state of backgrounds pictures
    for (i = 0; i < nb; i++) {
      _picBG[i].resetToDayCycle();
    }
  };

  that.loadResources = function (onReadyCallback) {
    var bird, dBg, nBg, i;

    // Load ground
    _picGround = new Image();
    _picGround.src = "images/ground.png";
    _picGround.onload = function () {
      onResourceLoaded(onReadyCallback);
    };
    _parallaxGround = new Parallax(
      _picGround,
      null,
      900,
      96,
      Const.LEVEL_SPEED,
      window.innerHeight - 96,
      Const.SCREEN_WIDTH
    );

    // Load pipe
    _picPipe = new Image();
    _picPipe.src = "images/pipe.png";
    _picPipe.onload = function () {
      onResourceLoaded(onReadyCallback);
    };

    // Load birds sprites
    for (i = 0; i < BIRDS_SPRITES.length; i++) {
      bird = new Image();
      bird.src = BIRDS_SPRITES[i];
      bird.onload = function () {
        onResourceLoaded(onReadyCallback);
      };
      // Add bird sprite in our array
      _picBirds.push(bird);
    }

    // Load Backgrounds
    // Be carefull, the position in the array matters. First add, first draw !
    for (i = 0; i < BgResources.length; i++) {
      // If a day resource exists for thi BG, load it
      if (typeof BgResources[i].daySrc !== "undefined") {
        dBg = new Image();
        dBg.src = BgResources[i].daySrc;
        dBg.onload = function () {
          onResourceLoaded(onReadyCallback);
        };
      } else dBg = null;

      // The same for night version of this bg...
      if (typeof BgResources[i].nightSrc !== "undefined") {
        nBg = new Image();
        nBg.src = BgResources[i].nightSrc;
        nBg.onload = function () {
          onResourceLoaded(onReadyCallback);
        };
      } else nBg = null;

      // Create a parallax obj with this resource and add it in the bg array
      _picBG.push(
        new Parallax(
          dBg,
          nBg,
          BgResources[i].width,
          BgResources[i].height,
          BgResources[i].speed,
          BgResources[i].posY,
          Const.SCREEN_WIDTH
        )
      );
    }

    function onResourceLoaded(onReadyCallback) {
      var totalResources = getNbResourcesToLoad();

      if (--_nbResourcesToLoad <= 0) {
        _isReadyToDraw = true;
        onReadyCallback();
      } else {
        document.getElementById("gs-loader-text").innerHTML =
          "Load resource " +
          (totalResources - _nbResourcesToLoad) +
          " / " +
          totalResources;
      }
    }
  };

  return that;
});
