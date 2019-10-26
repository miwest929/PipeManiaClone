function getPuzzle(puzzleNum: number): Puzzle {
  const puzzle = puzzles[puzzleNum];
  return {
    startCoord: {row: puzzle['start']['row'], col: puzzle['start']['col']},
    startOrient: puzzle['start']['orientation'],
    endCoord: {row: puzzle['end']['row'], col: puzzle['end']['col']},
    endOrient: puzzle['end']['orientation'],
    blocks: puzzle['blocks']
  };
}

interface Coord {
    row: number;
    col: number;
}

interface Puzzle {
    startCoord: Coord;
    startOrient: string;
    endCoord: Coord;
    endOrient: string;
    blocks: Coord[];
}
