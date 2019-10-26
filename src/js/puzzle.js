function getPuzzle(puzzleNum) {
    var puzzle = puzzles[puzzleNum];
    return {
        startCoord: { row: puzzle['start']['row'], col: puzzle['start']['col'] },
        startOrient: puzzle['start']['orientation'],
        endCoord: { row: puzzle['end']['row'], col: puzzle['end']['col'] },
        endOrient: puzzle['end']['orientation'],
        blocks: puzzle['blocks']
    };
}
