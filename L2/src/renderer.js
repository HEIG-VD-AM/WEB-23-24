import { cellPixelSize } from './constants.js';
import { Game } from './game.js';
import { Shape } from './shape.js';
import { GameMap } from './gameMap.js';

function cellToPixel(x) {
	return x * cellPixelSize;
}

export class Renderer {
	constructor(game, context) {
		this.game = game;
		this.context = context;
	}

	/**
	 * Draw a single shape on the context.
	 * @param {Shape} shape
	 */
	drawShape(shape) {
		const coords = shape.getCoordinates();
		this.context.fillStyle = 'green';
		this.context.strokeStyle = 'black';
		coords.forEach(([x, y]) => this.drawCell(shape.row + y, shape.col + x));
	}

	drawCell(row, col) {
		this.context.fillRect(
			cellToPixel(col),
			cellToPixel(row),
			cellPixelSize,
			cellPixelSize
		);
		this.context.strokeRect(
			cellToPixel(col),
			cellToPixel(row),
			cellPixelSize,
			cellPixelSize
		);
	}

	/**
	 * Clears the context and draws all falling and dropped shapes.
	 */
	render() {
		/*
        TODO:
        - Reset context
        - Draw all falling shapes
        - Draw all blocks stored in the game map, i.e. the dropped/grounded shapes.

        You may benefit from splitting this method into smaller ones.
        */
		this.context.reset();

		this.game.forEachShape((shape) => {
			this.drawShape(shape);
		});

		for (let i = 0; i < this.game.map.height; i++) {
			for (let j = 0; j < this.game.map.width; j++) {
				if (this.game.map.getPlayerAt(i, j) !== -1) {
					this.drawCell(i, j);
				}
			}
		}
	}
}
