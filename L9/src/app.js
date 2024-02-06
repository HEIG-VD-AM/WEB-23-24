import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
import { PlayerInfo } from "./playerInfo.js";
import { GameMap } from "./gameMap.js";
import {
    gameCols,
    gameRows,
    stepIntervalMs,
    singlePlayerId,
    teamCount,
    gamePixelWidth, gamePixelHeight, voteDelay
} from "./constants.js";
import Twitch from "./twitch.js";

let games = new Array(teamCount);
for (let i = 0; i < teamCount; i++) {
    games[i] = singlePlayerGame(i);
}

let twitch = new Twitch(teamCount, games);

twitch.launch_vote();
setTimeout(() => {
    startGames(twitch.games);
}, voteDelay);

function singlePlayerGame(teamId) {
    const container = document.createElement("div");
    container.classList.add("game-container");

    const newCanvas = document.createElement("canvas");
    newCanvas.dataset.canvasId = teamId;
    newCanvas.classList.add("canvas");
    newCanvas.width = gamePixelWidth;
    newCanvas.height = gamePixelHeight;
    container.appendChild(newCanvas);

    const scoreBox = document.createElement("div");
    scoreBox.classList.add("score-box");
    const score = document.createElement("p");
    score.textContent = "Score: 0"; // Default score value, update dynamically as needed
    score.dataset.scoreId = teamId;
    score.classList.add("score");
    scoreBox.appendChild(score);
    container.appendChild(scoreBox);

    const chatBox = document.createElement("div");
    chatBox.dataset.chatId = teamId;
    chatBox.classList.add("chat-box");
    // Populate chatBox with chat messages dynamically
    container.appendChild(chatBox);

    const div = document.getElementById("game");
    div.append(container);

    const gameMap = new GameMap(gameCols, gameRows);

    return new Game(gameMap, teamId);
}


function startGames(games){
    console.log("starting games")
    for (let i = 0; i < games.length; i++) {
        const playerId = singlePlayerId;
        games[i].set(playerId, new PlayerInfo(playerId))
        games[i].addNewShape(playerId);

        const context = document.querySelector(`canvas[data-canvas-id="${i}"]`).getContext("2d");
        const renderer = new Renderer(games[i], context);

        function loop() {
            renderer.render();
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        setInterval(() => {
            games[i].step();
        }, stepIntervalMs);
    }
}