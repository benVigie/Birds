/*
*   Class to manage the canvas. Draw players, backgrounds, etc...  
*/
define(function() {

  function ParallaxBg (ressource, width, height, speed, posY, screenWidth) {
    this.pic    = ressource;
    this.speed  = speed;
    this.posY   = posY;
    this.posX   = 0;
    this.width  = width;
    this.height = height;
    this.maxW   = screenWidth;
  }

  ParallaxBg.prototype.draw = function (ctx, time) {
    var drawPos;

    // Update BG pos. We get the 
    this.posX = (this.posX - (time * this.speed)) % this.width;
    drawPos = this.posX;

    // While we don't completly fill the screen
    while (drawPos < this.maxW) {

      // Draw a part of the bg
      ctx.drawImage(this.pic, drawPos, this.posY, this.width, this.height);

      // Go to the next part to draw
      drawPos += this.width;
    }
  };

  return (ParallaxBg);
});