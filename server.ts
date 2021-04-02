import express from "express";
import mustacheExpress from "mustache-express";
import path from "path";
import { constants as Const } from "./constants";
import { startServer } from "./game_files/game";

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
app.set("PORT", Const.SERVER_PORT);

app.listen(app.get("PORT"), () => {
  console.log(`🐦 [server]: listening at ${app.get("PORT")}`);
});

startServer();
