export class GameMap {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		/** 2D array storing for each position the id of the player whose block is there, or -1 otherwise. */
		// TODO: initialize the map to all -1.
		this.map = new Array(height)
			.fill(null)
			.map(() => new Array(width).fill(-1));
	}

	/**
	 * Drops the given shape, i.e. moves it down until it touches something, and then grounds it.
	 * @param {Shape} shape The shape to be dropped.
	 */
	dropShape(shape) {
		// TODO
		while (this.testShape(shape, shape.row + 1)) {
			shape.row++;
		}
		this.groundShape(shape);
	}

	/**
	 * Grounds the given shape, i.e. transfers it to the map table.
	 * @param {Shape} shape The shape to be grounded.
	 */
	groundShape(shape) {
		// TODO
		shape.getCoordinates(shape.rotation).forEach((coord) => {
			this.map[shape.row + coord[1]][shape.col + coord[0]] =
				shape.playerId;
		});
	}

	/**
	 * Tests whether the given shape is overlapping a block or is out of bounds on the left, right, or bottom of the map.
	 * This method allows the test to be done with row, col and/or rotation that are different from those of the shape itself.
	 *
	 * Note that we do not consider a shape to be out of bounds if it is (even partly) above the top of the map.
	 *
	 * @param {Shape} shape The shape to be tested
	 * @param {Number} row Optional row at which the shape should be tested. If omitted, uses that of the shape.
	 * @param {Number} col Optional col at which the shape should be tested. If omitted, uses that of the shape.
	 * @param {Number} rotation Optional rotation with which the shape should be tested. If omitted, uses that of the shape.
	 * @returns true if and only if the shape does not overlap anything and is not out of bounds.
	 */
	testShape(
		shape,
		row = shape.row,
		col = shape.col,
		rotation = shape.rotation
	) {
		// TODO
		return shape.getCoordinates(rotation).every((coord) => {
			if (
				col + coord[0] < 0 ||
				col + coord[0] >= this.width ||
				row + coord[1] >= this.height
			) {
				return false;
			}
			if (this.map[row + coord[1]][col + coord[0]] !== -1) {
				return false;
			}
			return true;
		});
	}

	/**
	 * Clears any row that is fully complete.
	 */
	clearFullRows() {
		// TODO
		this.map.forEach((row, index) => {
			if (row.every((cell) => cell !== -1)) {
				this.clearRow(index);
			}
		});
	}

	/**
	 * Clears the given row, and moves any row above it down by one.
	 * @param {Number} row The row to be cleared.
	 */
	clearRow(row) {
		// TODO

		// remove row from map, add new row at the top
		this.map.splice(row, 1);
		this.map.unshift(new Array(this.width).fill(-1));
	}

	/**
	 * Returns the id of the player whose block is grounded at the given position, or -1 otherwise.
	 * @param {Number} row the requested row
	 * @param {Number} col the requested column
	 * @returns the id of the player whose block is grounded at the given position, or -1 otherwise
	 */
	getPlayerAt(row, col) {
		return this.map[row][col];
	}
}
