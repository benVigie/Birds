define(['../../sharedConstants'], function (Const) {

  return (
    [
      { 
        nightSrc: 'images/night.png',
        width: 500,
        height: 768,
        posY: 0,
        speed: Const.LEVEL_SPEED / 4
      },
      {
        daySrc: 'images/clouds.png',
        nightSrc: 'images/night-clouds.png',
        width: 300,
        height: 256,
        posY: 416,
        speed: Const.LEVEL_SPEED / 3
      },
      {
        daySrc: 'images/city.png',
        nightSrc: 'images/night-city.png',
        width: 300,
        height: 256,
        posY: 416,
        speed: Const.LEVEL_SPEED / 2
      },
      {
        daySrc: 'images/trees.png',
        nightSrc: 'images/night-trees.png',
        width: 300,
        height: 216,
        posY: 456,
        speed: Const.LEVEL_SPEED
      }
    ]);
});