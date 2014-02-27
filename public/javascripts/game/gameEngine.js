/*
*   Game Engine
*/
require(['canvasPainter', 'playersManager', '../../sharedConstants'], function (canvasPainter, PlayersManager, Const) {

  var enumState = {
    Login: 0,
    WaitingRoom: 1,
    OnGame: 2,
    Ranking: 3
  };

  var enumPanels = {
    Login: 'gs-login',
    Ranking: 'gs-ranking',
    Error: 'gs-error'
  };

  var _gameState = enumState.Login,
      _playerManager,
      _pipeList,
      _isCurrentPlayerReady = false,
      _userID = null,
      _lastTime = null,
      _rankingTimer,
      _ranking_time,
      _socket;

  function draw (currentTime, ellapsedTime) {
    canvasPainter.draw(currentTime, ellapsedTime, _playerManager.getPlayers(), _pipeList);
  }

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


  function gameLoop() {
    var now = new Date().getTime(),
        ellapsedTime = 0;

    // Call for next anim frame
    if (_gameState == enumState.OnGame)
      requestAnimationFrame(gameLoop);

    // Get time difference between the last call and now
    if (_lastTime) {
      ellapsedTime = now - _lastTime;
    }
    _lastTime = now;

    // Call draw with the ellapsed time between the last frame and the current one
    draw(now, ellapsedTime);
  }

  function startClient () {

    _playerManager = new PlayersManager();

    // _socket = io.connect((Const.SOCKET_ADDR + ':' + Const.SOCKET_PORT), { reconnect: false });
    _socket = io.connect('http://172.21.204.213:80', { reconnect: false });
    _socket.on('connect', function() {
      
      console.log('Connection established :)');
      
      // Bind disconnect event
      _socket.on('disconnect', function() {
        document.getElementById('gs-error-message').innerHTML = 'Connection with the server lost';
        showHideMenu(enumPanels.Error, true);
        console.log('Connection with the server lost :( ');
      });
      
      // Draw bg and bind button click
      draw(0, 0);
      showHideMenu(enumPanels.Login, true);
      document.getElementById('player-connection').onclick = loadGameRoom;
  
    });

    _socket.on('connect_failed', function() {
      document.getElementById('gs-error-message').innerHTML = 'Fail to connect the web_socket';
      showHideMenu(enumPanels.Error, true);
      console.log('Cannot connect the web_socket ');
    });
    
  }

  function loadGameRoom () {
    var nick = document.getElementById('player-name').value;

    if (nick == '')
      return (false);

    // Unbind button event to prevent "space click"
    document.getElementById('player-connection').onclick = function() { return false; };

    // Bind new socket events
    _socket.on('player_list', function (playersList) {
      var nb = playersList.length,
          i;

      // Add this player in the list
      for (i = 0; i <nb; i++) {
        _playerManager.addPlayer(playersList[i], _userID);
      };

      // Redraw
      draw(0, 0);
    });
    _socket.on('player_disconnect', function (player) {
      _playerManager.removePlayer(player);
      draw(0, 0);
    });
    _socket.on('new_player', function (player) {
      _playerManager.addPlayer(player);
      draw(0, 0);
    });
    _socket.on('player_ready_state', function (playerInfos) {
      _playerManager.getPlayerFromId(playerInfos.id).updateFromServer(playerInfos);
    });
    _socket.on('update_game_state', function (gameState) {
      changeGameState(gameState);
    });
    _socket.on('game_loop_update', function (serverDatasUpdated) {
      _playerManager.updatePlayerListFromServer(serverDatasUpdated.players);
      _pipeList = serverDatasUpdated.pipes;
    });
    _socket.on('ranking', function (podium, playerScore) {
      console.log(podium);
      console.log(playerScore);
      displayRanking(podium, playerScore);
    });

    // Send nickname to the server
    console.log('Send nickname ' + nick);
    _socket.emit('say_hi', nick, function (serverState, uuid) {
      _userID = uuid;
      changeGameState(serverState);
    });

    // Get keyboard input
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 32) {
            inputsManager();
        }
    });

    // Hide login screen
    showHideMenu(enumPanels.Login, false);
    return (false);
  }

  function displayRanking () {
    // Show menu
    showHideMenu(enumPanels.Ranking, true);
  }

  function changeGameState (gameState) {
    var strLog = 'Server just change state to ';

    _gameState = gameState;

    switch (_gameState) {
      // If we 
      case enumState.WaitingRoom:
        strLog += 'waiting in lobby';
        _isCurrentPlayerReady = false;
        draw(0, 0);
        break;

      case enumState.OnGame:
        strLog += 'on game !';
        gameLoop();
        break;

      case enumState.Ranking:
        strLog += 'display ranking';
        // Start timer for next game
        _ranking_time = Const.TIME_BETWEEN_GAMES / 1000;
        timerNode = document.getElementById('gs-ranking-timer');
        timerNode.innerHTML = (_ranking_time).toString();
        _rankingTimer = window.setInterval(function() {
            // Set seconds left
            timerNode.innerHTML = (--_ranking_time).toString();

            // Stop timer if time is running up
            if (_ranking_time <= 0) {
              // Reset timer
              window.clearInterval(_rankingTimer);
              
              // Reset pipe list and hide ranking panel
              _pipeList = new Array();
              showHideMenu(enumPanels.Ranking, false);
            }
          },
          1000
        );
        break;
      
      default:
        console.log('Unknew game state [' + _gameState + ']');
        strLog += 'undefined state';
        break;
    }

    console.log(strLog);
  }

  function inputsManager () {
    switch (_gameState) {
      case enumState.WaitingRoom:
        _isCurrentPlayerReady = !_isCurrentPlayerReady;
        _socket.emit('change_ready_state', _isCurrentPlayerReady);
        _playerManager.getCurrentPlayer().updateReadyState(_isCurrentPlayerReady);
        break;
      case enumState.OnGame:
        _socket.emit('player_jump');
        break;
      default:
        break;
    }
  }

  function showHideMenu (panelName, isShow) {
    var panel = document.getElementById(panelName),
        currentOverlayPanel = document.querySelector('.overlay');

    if (isShow) {
      if (currentOverlayPanel)
        currentOverlayPanel.classList.remove('overlay');
      panel.classList.add('overlay');
    }
    else {
      if (currentOverlayPanel)
        currentOverlayPanel.classList.remove('overlay');
    }
  }

  // Load ressources and Start the client !
  console.log('Client started, load ressources...');
  canvasPainter.loadRessources(function () {
    console.log('Ressources loaded, connect to server...');
    startClient();
  });

});