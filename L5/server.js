import express from 'express'
import expressWs from 'express-ws'
import { gameCols, gameRows, port, stepIntervalMs } from './src/constants.js'
import { JoinMessage, MessageCodec, SetPlayerMessage, UpdateMapMessage } from './src/messages.js'
import { Game } from './src/game.js'
import { GameMap } from './src/gameMap.js'
import { PlayerInfo } from './src/playerInfo.js'

const app = express()
expressWs(app)

let clients = new Map();
let nextId = 0;

let messageSender = message => {
    clients.forEach((socket) => {
        socket.send(MessageCodec.encode(message));
    });
};

let gameOver = () => {
    clients.forEach((socket) => {
        socket.close();
    });
    clients.clear();
    nextId = 0;
    console.log("Game over");
}

// TODO Create a new Game instance and start a game loop
const game = new Game(new GameMap(gameCols, gameRows), messageSender, gameOver)

setInterval(() => {
    game.step()
    clients.forEach((_, id) => {
        game.sendMessage(new SetPlayerMessage(game.get(id)))
    })
}, stepIntervalMs)

// Serve the public directory
app.use(express.static('public'))

// Serve the src directory
app.use('/src', express.static('src'))

// Websocket game events
app.ws('/', (socket) => {

    const id = ++nextId;
    clients.set(id, socket);
    socket.send(MessageCodec.encode(new JoinMessage(id)));

    console.log(`New client connected. Id: ${id}`)

    game.introduceNewPlayer(new PlayerInfo(id, socket));
    game.sendMessage(new UpdateMapMessage(game.map));

    socket.on('message', data => {    
        // TODO The first message the client receives should be a JoinMessage, containing its player id. The server then sends all current state to that client. Received messages from the client should be forwarded to the game instance.
        const message = MessageCodec.decode(data);
        game.onMessage(id, message)

        // TODO Ensure the game is notified of a player quitting when the socket is closed.
        socket.on('close', () => {
            clients.delete(id)
            game.quit(id)
        })
    })

})

app.listen(port)

console.log("App started.")
