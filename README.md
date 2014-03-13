Birds.js
=====

Multiplayer clone of flappy bird powered by node.js !

![Birds.js](http://imageshack.com/a/img819/6563/r4pf.png "Birds.js")

##How to install

1. Install [Node.js](http://nodejs.org/)

2. Download the project and go into the project directory with your console

3. Install dependecies bt typing `npm install` in your console

4. If you want to change the server port or the websocket address or port, update the file *sharedConstants.js*

5. Launch the server with `node server.js`

6. Open your browser and navigate to `http://yourserver:port/birds` (by default `http://localhost:4242/birds`)

7. Play ! :smile:

#### Optional

If you play as it, players score are store into an array. If you want to save scores in a persistent way, you can install the database birds on a MySQL server.

1. Install the database by import *birds.sql*
2. Update scoreSystem class to add your DB credentials. Open *games_files/scoreSystem.js* and set your parameters to `DB_HOST`, `DB_USER`, `DB_PASS` and `DB_DATA`
3. Restart server. If the DB is available, the server will print the message `[ScoreSystem] Database available and connected !`


##Node Dependencies

**Birds.js** uses express, jade, socket.io and mysql modules.


##Features

* Multiplayer game !

* Parallax background

* Persistent scores

* Sunset effect if you good enough :wink:

* Easy customization - Simply edit constants to change number of pipes, space between them, bird physic, etc...

* Mass fun !


## Notes
