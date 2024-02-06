import { gameRows, gameCols, cellPixelSize } from './constants.js';
import { Shape } from './shape.js';
import { GameMap } from './gameMap.js';

export class Game extends Map {
	constructor(gameMap) {
		super();
		this.map = gameMap;
		this.isGameOver = false;
	}

	/**
	 * Returns shape of given player, or undefined if no such player or shape.
	 * @param {Number} id Id of the player whose shape is to be returned.
	 */
	getShape(id) {
		// TODO
		const pi = this.get(id);
		return pi?.getShape();
	}

	/**
	 * Executes the provided function on each shape in the game.
	 * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
	 */
	forEachShape(f) {
		// TODO
		for (let playerInfo of this.values()) {
			f(playerInfo.shape);
		}
	}

	/**
	 * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
	 * @param {Number} playerId The id of the player whose shape should be dropped
	 */
	dropShape(playerId) {
		/*
        TODO:
        - Drop the shape on the game map and clear any full rows
        - Add a new shape for that player, and for any other player whose shape is now blocked.
        */
		const shape = this.getShape(playerId);

		if (!shape) {
			return;
		}

		// drop shape on map and clear full rows
		this.map.dropShape(shape);
		this.map.clearFullRows();
		this.addNewShape(playerId);

		this.forEachShape((shape) => {
			if (!this.map.testShape(shape) && shape.playerId !== playerId) {
				this.addNewShape(shape.playerId);
			}
		});
	}

	/**
	 * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
	 */
	step() {
		/*
        TODO:
        - If the game is over, ignore this phase.
        - Move each shape down by one. If it cannot, then that shape is touching the ground and should be force-dropped. Re-use code wheree possible.
        */
		if (!this.isGameOver) {
			// Move each shape down by one
			this.forEachShape((shape) => {
				shape.row++;
			});

			this.forEachShape((shape) => {
				// If it cannot, the shape is touching the ground
				if (!this.map.testShape(shape)) {
					// move it back up by one
					shape.row--;
					// and drop it
					this.dropShape(shape.playerId);
				}
			});
		}
	}

	/**
	 * Replace current shape of given player id (if any) with a new random shape.
	 * @param {Number} id Id of the player whose shape should be replaced.
	 */
	addNewShape(id) {
		/*
        TODO
        - Add a shape of random type to the given player.
        - If that shape is overlapping something, then the game is over.
        */
		let shapeCol = this.map.width / 2;
		let shape = new Shape(Shape.getRandomShapeType(), id, shapeCol, 0, 0);

		let playerInfo = this.get(id);
		playerInfo.shape = shape;

		if (!this.map.testShape(shape)) {
			this.gameOver();
		}
	}

	/**
	 * Resets the game upon game over.
	 */
	gameOver() {
		// TODO: reset the map and all players.
		this.isGameOver = true;
		this.map = new GameMap(this.map.height, this.map.width);
		this.clear();
		console.log('Game over!');
	}
}
