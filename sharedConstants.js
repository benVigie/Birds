// Define all constants usefull by the server and the client
var constant = {

  SERVER_PORT:              4242,
  SOCKET_PORT:              1337,
  SOCKET_ADDR:              'http://localhost',

  SCREEN_WIDTH:             900,
  SCREEN_HEIGHT:            768,
  FLOOR_POS_Y:              672,
  LEVEL_SPEED:              0.3,
  TIME_BETWEEN_GAMES:       5000,

  BIRD_WIDTH:               42,
  BIRD_HEIGHT:              30,

  // Pipe constants
  PIPE_WIDTH:               100,
  DISTANCE_BETWEEN_PIPES:   380,
  MIN_PIPE_HEIGHT:          60,
  MAX_PIPE_HEIGHT:          630,
  HEIGHT_BETWEEN_PIPES:     150
};

// To be use by the server part, we have to provide the object with exports
if (typeof exports != 'undefined') {
  exports.constant = constant;
}
// Else provide the const object to require.js with define()
else {
  define(constant);
}
