import { DropMessage, MoveMessage, RotateMessage} from './messages.js';
import { cellPixelSize, gameCols } from './constants.js';
import { singlePlayerId } from './constants.js';
var previousCol = -1;

export function handleMouseMove(event, callback) {
    let col = Math.floor(event.offsetX / cellPixelSize);
        
    // issue a message only if the column is different from the previous one
    if (col === previousCol) {
        return;
    }
    previousCol = col;
    callback(singlePlayerId, new MoveMessage(col));
}

/**
 * Sets up all event listeners for user interactions:
 * - A click on the canvas or a key press on the down arrow will send a `DropMessage`.
 * - A movement of the mouse on the canvas will send a `MoveMessage` with the corresponding column.
 * - A key press on the left or right arrow will send a left or right `RotateMessage`.
 * @param canvas The canvas on which the game is drawn
 * @param messageListener The callback function handling the messages to be sent. It expects a `Message` as unique argument.
 */
export function setListeners(canvas, messageListener) {
    // TODO
    canvas.addEventListener('click', () => messageListener(singlePlayerId, new DropMessage()));
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    canvas.addEventListener('mousemove', (event) => {
        handleMouseMove(event, messageListener);
    });


    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            messageListener(singlePlayerId, new RotateMessage('left'));
        } else if (event.key === 'ArrowRight') {
            messageListener(singlePlayerId, new RotateMessage('right'));
        }
        if (event.key === 'ArrowDown') {
            messageListener(singlePlayerId, new DropMessage());
        }

        if (event.key == 'q') {
            messageListener(singlePlayerId, new RotateMessage('left'));
        }

        if (event.key == 'e') {
            messageListener(singlePlayerId, new RotateMessage('right'));
        }
    });



    document.addEventListener('keypress', (event) => {
        if (event.key === 'a') {
            previousCol = clamp(previousCol - 1, 0, gameCols)
            messageListener(singlePlayerId, new MoveMessage(clamp(previousCol, 0, gameCols)));
        } else if (event.key === 'd') {
            previousCol = clamp(previousCol + 1, 0, gameCols)
            messageListener(singlePlayerId, new MoveMessage(clamp(previousCol, 0, gameCols)));
        }
    });
}