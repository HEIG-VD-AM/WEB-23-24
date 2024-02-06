import { Renderer } from './renderer.js';
import { Shape } from './shape.js';
import { Game } from './game.js';
import { PlayerInfo } from './playerInfo.js';
import { GameMap } from './gameMap.js';
import { gameCols, gameRows, stepIntervalMs } from './constants.js';

/*
TODO:
- Create new game, player and renderer.
- Start a game loop that makes the game step every stepIntervalMs milliseconds (see constants.js).
- Start a rendering loop on the renderer using requestAnimationFrame.
*/

const gameMap = new GameMap(gameCols, gameRows);
const game = new Game(gameMap);

const playerInfo = new PlayerInfo(
	1,
	new Shape(Shape.getRandomShapeType(), 1, gameMap.width / 2, 0, 0)
);

game.set(playerInfo.getId(), playerInfo);
const ctx = document.getElementById('canvas').getContext('2d');

const renderer = new Renderer(game, ctx);
setInterval(() => {
	game.step();
	window.requestAnimationFrame(() => renderer.render());
}, stepIntervalMs);
