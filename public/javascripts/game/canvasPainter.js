/*
*   Class to manage the canvas. Draw players, backgrounds, etc...  
*/
define(['parallax', 'backgroundressources', '../../sharedConstants'], function (Parallax, bgRessources, Const) {

  var HEIGHT_BETWEEN_PIPES    = 150;
  var NB_RESSOURCES_TO_LOAD   = 2;
  var BACKGROUNDS = bgRessources;
  var BIRDS_SPRITES = [
    'images/clumsy.png'
  ];

  var that = {},
      ctx = document.getElementById('gs-canvas').getContext('2d'),
      _isReadyToDraw = false,

      // Ressources
      _nbRessourcesToLoad = NB_RESSOURCES_TO_LOAD + BACKGROUNDS.length + BIRDS_SPRITES.length,
      _picGround,
      _parallaxGround,
      _picPipe,
      _picBG = new Array();
      _picBirds = new Array();

  function drawPipe (pipe) {
    // Draw the first pipe
    ctx.drawImage(_picPipe, pipe.posX, pipe.posY - 768, 148, 768);

    // And the other one
    ctx.drawImage(_picPipe, pipe.posX, pipe.posY + HEIGHT_BETWEEN_PIPES, 148, 768);
  };

  that.draw = function (currentTime, ellapsedTime, players, pipes) {
    var nb,
        i;

    if (!_isReadyToDraw) {
      console.log('[ERROR] : Ressources not yet loaded !');
      return;
    }

    // First, draw the background
    ctx.fillStyle = '#0099CC';
    ctx.fillRect(0, 0, 900, 768);
    
    // Then backgrounds pictures
    nb = _picBG.length;
    for (i = 0; i < nb; i++) {
      _picBG[i].draw(ctx, ellapsedTime);
    };

    // Draw pipes
    if (pipes) {
      nb = pipes.length;
      for (i = 0; i < nb; i++) {
        drawPipe(pipes[i]);
      };
    }

    // Draw birds !
    if (players) {
      nb = players.length;
      for (i = 0; i < nb; i++) {
        players[i].draw(ctx, currentTime, _picBirds);
      };
    }

    // Last but not least, draw ground
    // ctx.drawImage(_picGround, 0, 672, 900, 96);
    _parallaxGround.draw(ctx, currentTime);
  };

  that.loadRessources = function (onReadyCallback) {
    var bird,
        bg,
        i;

    // Load ground
    _picGround = new Image();
    _picGround.src = 'images/ground.png';
    _picGround.onload = function() { onRessourceLoaded(onReadyCallback); };
    _parallaxGround = new Parallax(_picGround, 900, 96, Const.LEVEL_SPEED, 672, Const.SCREEN_WIDTH);

    // Load pipe
    _picPipe = new Image();
    _picPipe.src = 'images/pipe.png';
    _picPipe.onload = function() { onRessourceLoaded(onReadyCallback); };    

    // Load birds sprites
    for (i = 0; i < BIRDS_SPRITES.length; i++) {
      bird = new Image();
      bird.src = BIRDS_SPRITES[i];
      bird.onload = function() { onRessourceLoaded(onReadyCallback); };
      // Add bird sprite in our array
      _picBirds.push(bird);
    };

    // Load Backgrounds
    // Be carefull, the position in the array matters. First add, first draw !
    for (i = 0; i < BACKGROUNDS.length; i++) {
      bg = new Image();
      bg.src = BACKGROUNDS[i].src;
      bg.onload = function() { onRessourceLoaded(onReadyCallback); };
      
      // Create a parallax obj with this ressource and add it in the bg array
      _picBG.push(new Parallax(bg, BACKGROUNDS[i].width, BACKGROUNDS[i].height, BACKGROUNDS[i].speed, BACKGROUNDS[i].posY, Const.SCREEN_WIDTH));
    };


    function onRessourceLoaded (onReadyCallback) {
      if (--_nbRessourcesToLoad <= 0) {
        _isReadyToDraw = true;
        onReadyCallback();
      }
    };

  };

  return (that);
});