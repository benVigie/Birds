Birds.js
=====

Multiplayer clone of flappy bird powered by node.js !

![Birds.js](https://benvigie.gitlab.io/me/images/projects/birds.png "Birds.js")

## How to install

1. Install [Node.js](http://nodejs.org/)

2. Download the project and go into the project directory with your console

3. Install Dependencies by typing `npm install` in your console

4. [Optional] To play on different PC, you must change the websocket address for your local IP. To do it, update `SOCKET_ADDR` in the file *sharedConstants.js*

5. Launch the server with `node server.js`

6. Open your browser and navigate to `http://yourserver:port/birds` (by default `http://localhost:4242/birds`)

7. Play ! :smile:

#### Optional

If you play as it, player scores are stored into an array. If you want to save scores in a persistent way, you can install the birds database on a MySQL server.

1. Install the database by importing *birds.sql*
2. Update `scoreSystem` class to add your DB credentials. Open *games_files/scoreSystem.js* and set your parameters to `DB_HOST`, `DB_USER`, `DB_PASS` and `DB_DATA`
3. Restart server. If the DB is available, the server will print the message `[ScoreSystem] Database available and connected !`


## Node Dependencies

**Birds.js** uses express, jade, socket.io and mysql modules.


## Features

* Multiplayer game !

* Parallax background

* Persistent scores

* Sunset effect if you're good enough :wink:

* Easy customization - Simply edit constants to change number of pipes, space between them, bird physic, etc...

* Mass fun !


## Notes
