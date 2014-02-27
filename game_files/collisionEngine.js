var Const  = require('../sharedConstants').constant;

function checkBirdCollision (pipe, bird) {
  // If the bird is inside a pipe on the X axis, check if he touch it
  /*if (((bird.posX + Const.BIRD_WIDTH) > pipe.posX) && 
    (bird.posX  < (pipe.posX + Const.PIPE_WIDTH))) {

    // Check if the bird touch the upper pipe
    if (bird.posY < pipe.posY)
      return (true);

    // Check if the bird touch the ground pipe
    if ((bird.posY + Const.BIRD_HEIGHT) > (pipe.posY + Const.HEIGHT_BETWEEN_PIPE)) {
      return (true);
    }
  }*/
  
  // If the bird hit the ground
  if (bird.posY + Const.BIRD_HEIGHT > Const.FLOOR_POS_Y) {
    return (true);
  }

  return (false);
};

exports.checkCollision = function (pipe, birdsList) {
  var thereIsCollision = false,
      i;

  for (i = 0; i < birdsList.length; i++) {
    
    if (checkBirdCollision(pipe, birdsList[i].getPlayerObject()) == true) {
      // Change player state to died
      birdsList[i].sorryYouAreDie();

      thereIsCollision = true;
    }
  };

  return (thereIsCollision);
};