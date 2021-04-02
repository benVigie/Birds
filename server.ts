import express from "express";
import path from "path";
import mustacheExpress from "mustache-express";

// import game from "./game_files/game";

const Const = {
  SERVER_PORT: 4242,
  SOCKET_PORT: 1337,
  SOCKET_ADDR: "http://localhost",
};

const app = express();

app.set("views", `${__dirname}/views`);
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes
 */
app.get("/birds", (req, res) =>
  res.render("birds", {
    wsAddress: `${Const.SOCKET_ADDR}:${Const.SOCKET_PORT}`,
  })
);

/**
 * Setup
 */
app.set("port", Const.SERVER_PORT);

app.listen(app.get("PORT"), () => {
  console.log(`🐦 [server]: listening at ${app.get("PORT")}`);
});

// game.startServer();
