import { constants as Const } from "../constants";
import { Bird, Pipe } from "../shared";

function checkBirdCollision(pipe: Pipe, birdInstance: Bird) {
  const bird = birdInstance.getPlayerObject();

  // If the bird is inside a pipe on the X axis, check if he touch it
  if (
    bird.posX + Const.BIRD_WIDTH > pipe.posX &&
    bird.posX < pipe.posX + Const.PIPE_WIDTH
  ) {
    // Notify the bird he is inside the pipe
    birdInstance.updateScore(pipe.id);

    // Check if the bird touch the upper pipe
    if (bird.posY < pipe.posY) return true;

    // Check if the bird touch the ground pipe
    if (
      bird.posY + Const.BIRD_HEIGHT >
      pipe.posY + Const.HEIGHT_BETWEEN_PIPES
    ) {
      return true;
    }
  }

  // If the bird hit the ground
  return bird.posY + Const.BIRD_HEIGHT > bird.floor;
}

export function checkCollision(pipe: Pipe[], birdsList: Bird[]) {
  let thereIsCollision = false;

  let i;
  let j;

  for (i = 0; i < pipe.length; i++) {
    for (j = 0; j < birdsList.length; j++) {
      if (checkBirdCollision(pipe[i], birdsList[j]) == true) {
        // Change player state to died
        birdsList[j].sorryYouAreDie(birdsList.length);

        thereIsCollision = true;
      }
    }
  }

  return thereIsCollision;
}
