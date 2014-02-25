// Define all constants usefull by the server and the client
var constant = {

  SERVER_PORT:              4242,
  SOCKET_PORT:              80,
  SOCKET_ADDR:              '127.0.0.1',

  SCREEN_WIDTH:             900,
  SCREEN_HEIGHT:            768,
  FLOOR_POS_Y:              672,
  LEVEL_SPEED:              0.3,
  TIME_BETWEEN_GAMES:       5000,

  BIRD_WIDTH:               85,
  BIRD_HEIGHT:              60,

  // Pipe constants
  PIPE_WIDTH:               148,
  DISTANCE_BETWEEN_PIPES:   250 + this.PIPE_WIDTH,
  MIN_PIPE_HEIGHT:          20,
  MAX_PIPE_HEIGHT:          680,
  HEIGHT_BETWEEN_PIPE:      150
};

// To be use by the server part, we have to provide the object with exports
if (typeof exports != 'undefined') {
  exports.constant = constant;
}
// Else provide the const object to require.js with define()
else {
  define(constant);
}