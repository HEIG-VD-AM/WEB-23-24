import { Renderer } from "./renderer.js"
import { Replica } from "./game.js"
import { setListeners } from "./inputListener.js"
import { GameMap } from "./gameMap.js"
import { gameCols, gameRows, port } from "./constants.js"
import { MessageCodec, JoinMessage } from "./messages.js"

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

const gameMap = new GameMap(gameCols, gameRows)
const replica = new Replica(gameMap)
const renderer = new Renderer(replica, context)

// Render loop
function loop() {
    renderer.render()
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

// TODO Get hostname from current URL, and use it to open a Web socket to the corresponding `ws://` URL.
const hostname = window.location.hostname
const sock = new WebSocket(`ws://${hostname}:${port}`)

sock.addEventListener('open', (evt) => {
    // TODO Once the socket is open, set the input listener to send messages to the server.
    setListeners(canvas, message => {
        sock.send(MessageCodec.encode(message))
    });
});

sock.addEventListener('message', (evt) => {
    // TODO Handle messages received on that socket from the server. If the message is a `JoinMessage`, set the player id of the renderer. Otherwise, pass the message to the replica.
    const message = MessageCodec.decode(evt.data)
    console.log(message, message instanceof JoinMessage)
    if (message instanceof JoinMessage) {
        renderer.setPlayerId(message.getPlayerId())
    }
    replica.onMessage(message)
});
