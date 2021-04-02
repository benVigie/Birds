import express from "express";

var path = require("path");
var Const = require("./sharedConstants").constant;
var game = require("./game_files/game");

const app = express();

// all environments
app.set("port", Const.SERVER_PORT);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, "public")));

if ("development" === app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/birds", (req, res) =>
  res.render("birds", {
    title: "Birds.js",
    wsAddress: Const.SOCKET_ADDR + ":" + Const.SOCKET_PORT,
  })
);

app.listen(app.get("PORT"), () => {
  console.log(`🐦 [server]: listening at ${app.get("PORT")}`);
});

game.startServer();
