import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
import { PlayerInfo } from "./playerInfo.js";
import { GameMap } from "./gameMap.js";
import { gameCols, gameRows, stepIntervalMs, singlePlayerId } from "./constants.js";
import { setListeners } from "./inputListener.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const gameMap = new GameMap(gameCols, gameRows)
const game = new Game(gameMap);

const playerId = singlePlayerId;
game.set(playerId, new PlayerInfo(playerId))
game.addNewShape(playerId);

const renderer = new Renderer(game, context);

// Game loop
setInterval(() => {
    game.step();
}, stepIntervalMs);

// Render loop
function loop() {
    renderer.render();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// TODO setup keyboard and mouse listeners
setListeners(canvas, (...args) => {
    game.onMessage(...args);
})