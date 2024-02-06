export const port = 3000;
export const voteDelay = 5000;
export const gameRows = 20;
export const gameCols = 10;
export const stepIntervalMs = 50;
export const singlePlayerId = 1;
export const gamePixelWidth = 300;
export const gamePixelHeight = 600;
export const scorePerLine = 10;
export const cellPixelSize = Math.min(gamePixelHeight / gameRows, gamePixelWidth / gameCols);
export const teamCount = 4;
export const shapeColors = ['rgba(0, 0, 255, 1)', 'rgba(0, 255, 0, 1)', 'rgba(255, 0, 0, 1)', 'rgba(255, 255, 0, 1)', 'rgba(0, 255, 255, 1)', 'rgba(255, 0, 255, 1)']
export const shapeTypes = [
    [
        [[0, 0], [-1, 0], [1, 0], [0, 1]],
        [[0, 0], [-1, 0], [0, 1], [0, -1]],
        [[0, 0], [-1, 0], [1, 0], [0, -1]],
        [[0, 0], [1, 0], [0, 1], [0, -1]],
    ], // T
    [
        [[0, 0], [1, 0], [-1, 0], [-2, 0]],
        [[0, 0], [0, -1], [0, 1], [0, 2]],
    ], // Line
    [
        [[0, 0], [-1, 0], [-1, 1], [1, 0]],
        [[-1, -1], [0, -1], [0, 0], [0, 1]],
        [[1, 0], [1, 1], [0, 1], [-1, 1]],
        [[0, -1], [0, 0], [0, 1], [1, 1]],
    ], // L
    [
        [[0, 0], [-1, 0], [1, 1], [1, 0]],
        [[-1, 1], [0, -1], [0, 0], [0, 1]],
        [[-1, 0], [1, 1], [0, 1], [-1, 1]],
        [[0, -1], [0, 0], [0, 1], [1, -1]],
    ], // J
    [
        [[0, 0], [1, 0], [0, 1], [-1, 1]],
        [[-1, -1], [-1, 0], [0, 0], [0, 1]]
    ], // S
    [
        [[-1, 0], [0, 0], [0, 1], [1, 1]],
        [[0, 1], [0, 0], [1, 0], [1, -1]],
    ], // Z
    [
        [[0, 0], [1, 0], [1, 1], [0, 1]]
    ], // square
];