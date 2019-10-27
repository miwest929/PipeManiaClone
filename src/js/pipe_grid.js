var OOZING_DELAY_MS = 2000.0;
var PipeGrid = /** @class */ (function () {
    function PipeGrid(rows, cols, cellDim) {
        this.rows = rows;
        this.cols = cols;
        this.cellDim = cellDim;
        this.widthInPx = this.cols * this.cellDim;
        this.heightInPx = this.rows * this.cellDim;
        this.startLocation = [0, 0, 0];
        this.endLocation = [0, 0, 0];
        this.hoveredRow = -1;
        this.hoveredCol = -1;
        this.oozeProgressTick = 0.005;
        this.grid = this.initGrid();
    }
    PipeGrid.prototype.placeTile = function (tileId, row, col) {
        this.grid[row][col] = tileId;
    };
    PipeGrid.prototype.loadPuzzle = function (puzzle) {
        var _this = this;
        var startTileId = this.convertToStartTileId(puzzle.startOrient);
        this.placeTile(startTileId, puzzle.startCoord.row, puzzle.startCoord.col);
        this.startLocation[0] = puzzle.startCoord.row;
        this.startLocation[1] = puzzle.startCoord.col;
        this.startLocation[2] = startTileId;
        var endTileId = this.convertToEndTileId(puzzle.endOrient);
        this.placeTile(endTileId, puzzle.endCoord.row, puzzle.endCoord.col);
        this.endLocation[0] = puzzle.endCoord.row;
        this.endLocation[1] = puzzle.endCoord.col;
        this.endLocation[2] = endTileId;
        puzzle.blocks.forEach(function (b) {
            _this.placeTile(Tiles.Indestructible, b.row, b.col);
        });
    };
    PipeGrid.prototype.convertToStartTileId = function (direction) {
        switch (direction) {
            case "NORTH":
                return Tiles.TopStart;
                break;
            case "SOUTH":
                return Tiles.BottomStart;
                break;
            case "WEST":
                return Tiles.LeftStart;
                break;
            case "EAST":
                return Tiles.RightStart;
                break;
        }
    };
    PipeGrid.prototype.convertToEndTileId = function (direction) {
        switch (direction) {
            case "NORTH":
                return Tiles.TopEnd;
                break;
            case "SOUTH":
                return Tiles.BottomEnd;
                break;
            case "WEST":
                return Tiles.LeftEnd;
                break;
            case "EAST":
                return Tiles.RightEnd;
                break;
        }
    };
    PipeGrid.prototype.startOoze = function () {
        if (!this.isOozing) {
            this.oozeProgressTick = 0.005;
            this.isOozing = true;
            this.oozeRow = this.startLocation[0];
            this.oozeCol = this.startLocation[1];
            this.oozeProgressInCell = 0.0;
            this.oozedCells = [];
            this.oozeDirection = getStartingDirection(this.grid[this.oozeRow][this.oozeCol]);
            this.oozeReverse = false;
        }
    };
    PipeGrid.prototype.initGrid = function () {
        this.grid = [];
        for (var r = 0; r < this.rows; r++) {
            var arr = [];
            for (var c = 0; c < this.cols; c++) {
                arr.push(EMPTY);
            }
            this.grid.push(arr);
        }
        return this.grid;
    };
    PipeGrid.prototype.update = function () {
        if (this.isOozing) {
            this.oozeProgressInCell += this.oozeProgressTick;
            // ooze overflowed current cell. Move on to the next
            if (this.oozeProgressInCell > 1.0) {
                console.log("Overflowed. Flowing to next Tile");
                this.oozeProgressInCell = 0.0;
                var oozeCellId = this.grid[this.oozeRow][this.oozeCol];
                if (tileMovements[oozeCellId]) {
                    this.oozeDirection = getNextDirection(oozeCellId, this.oozeDirection);
                    console.log("Default = " + tileMovements[oozeCellId]["DEFAULT"] + ", NextDirection = " + this.oozeDirection);
                    this.oozedCells.push([this.oozeRow, this.oozeCol]);
                    var newCoords = this.getNextOozeCell(this.oozeDirection);
                    this.oozeRow = newCoords[0];
                    this.oozeCol = newCoords[1];
                    var newTileId = this.grid[this.oozeRow][this.oozeCol];
                    this.oozeReverse = tileMovements[newTileId]["DEFAULT"] !== this.oozeDirection;
                }
            }
        }
    };
    PipeGrid.prototype.mouseMove = function (x, y) {
        this.hoveredRow = Math.floor(y / this.cellDim);
        this.hoveredCol = Math.floor(x / this.cellDim);
    };
    PipeGrid.prototype.mouseClick = function (x, y) {
        if (!isNonReplacableTile(this.grid[this.hoveredRow][this.hoveredCol])) {
            eventNotifier.notify(TILE_DROPPED_EVENT, {});
            this.grid[this.hoveredRow][this.hoveredCol] = nextTileView.consumeNextTileId();
        }
    };
    PipeGrid.prototype.fastForwardOoze = function () {
        this.oozeProgressTick = 0.25;
    };
    PipeGrid.prototype.render = function (ctx, x, y) {
        this.renderGrid(ctx, x, y);
        this.renderCells(ctx, x, y);
        if (this.isOozing) {
            this.renderOoze(ctx, x, y);
        }
        if (this.hoveredCol !== -1 && this.hoveredRow !== -1) {
            var hoveredX = this.hoveredCol * this.cellDim;
            var hoveredY = this.hoveredRow * this.cellDim;
            ctx.strokeStyle = "rgb(256,256,256)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(hoveredX + x, hoveredY + y, this.cellDim, this.cellDim);
            ctx.stroke();
        }
    };
    PipeGrid.prototype.renderGrid = function (ctx, x, y) {
        ctx.strokeStyle = "rgb(256, 256, 256)";
        ctx.lineWidth = 1;
        // render horizontal lines
        var startY = y;
        for (var i = 0; i <= this.rows; i++, startY += this.cellDim) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x + this.widthInPx, startY);
            ctx.stroke();
        }
        // render vertical lines
        var startX = x;
        for (var i = 0; i <= this.cols; i++, startX += this.cellDim) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX, y + this.heightInPx);
            ctx.stroke();
        }
    };
    PipeGrid.prototype.renderCells = function (ctx, x, y) {
        var rX = x;
        var rY = y;
        for (var r = 0; r < this.rows; r++, rY += this.cellDim) {
            rX = x;
            for (var c = 0; c < this.cols; c++, rX += this.cellDim) {
                tiles[this.grid[r][c]].renderAt(ctx, rX, rY, this.cellDim, this.cellDim);
            }
        }
    };
    PipeGrid.prototype.renderOoze = function (ctx, x, y) {
        // render already oozed cells
        for (var i = 0; i < this.oozedCells.length; i++) {
            var row = this.oozedCells[i][0];
            var col = this.oozedCells[i][1];
            var tileId_1 = this.grid[row][col];
            if (tileId_1 === Tiles.Cross) {
                if (this.oozeDirection === "WEST" || this.oozeDirection === "EAST") {
                    tileId_1 = Tiles.CrossHorizontal;
                }
                else {
                    tileId_1 = Tiles.CrossVertical;
                }
            }
            var oozedX = col * this.cellDim + x;
            var oozedY = row * this.cellDim + y;
            var oozeProgress_1 = progressByTile[tileId_1];
            if (oozeProgress_1) {
                this.renderOozeCell(ctx, oozedX, oozedY, tileId_1, oozeProgress_1.length);
            }
        }
        var cellX = this.oozeCol * this.cellDim + x;
        var cellY = this.oozeRow * this.cellDim + y;
        var tileId = this.grid[this.oozeRow][this.oozeCol];
        if (tileId === Tiles.Cross) {
            if (this.oozeDirection === "WEST" || this.oozeDirection === "EAST") {
                tileId = Tiles.CrossHorizontal;
            }
            else {
                tileId = Tiles.CrossVertical;
            }
        }
        var oozeProgress = progressByTile[tileId];
        if (oozeProgress) {
            var idx = Math.floor(this.oozeProgressInCell * oozeProgress.length);
            this.renderOozeCell(ctx, cellX, cellY, tileId, idx);
        }
    };
    PipeGrid.prototype.boundingBox = function (x, y) {
        return new BoundingBox(x, y, this.widthInPx, this.heightInPx);
    };
    PipeGrid.prototype.renderOozeCell = function (ctx, x, y, tileId, progress) {
        var oozeProgress = progressByTile[tileId];
        for (var i = 0; i <= progress; i++) {
            var idx = i;
            if (this.oozeReverse) {
                idx = progress - i;
            }
            var progressLine = oozeProgress[idx];
            if (progressLine) {
                var adjustedX = adjustValue(progressLine[0], TILE_DIM, this.cellDim);
                var adjustedY = adjustValue(progressLine[1], TILE_DIM, this.cellDim);
                var adjustedLength = adjustValue(progressLine[2], TILE_DIM, this.cellDim);
                this.renderOozeLine(x + adjustedX, y + adjustedY, adjustedLength, progressLine[3]);
            }
        }
    };
    PipeGrid.prototype.getNextOozeCell = function (direction) {
        var deltaRow = 0;
        var deltaCol = 0;
        if (direction === "NORTH") {
            deltaRow = -1;
        }
        else if (direction === "SOUTH") {
            deltaRow = 1;
        }
        else if (direction === "WEST") {
            deltaCol = -1;
        }
        else if (direction === "EAST") {
            deltaCol = 1;
        }
        return [this.oozeRow + deltaRow, this.oozeCol + deltaCol];
    };
    PipeGrid.prototype.renderOozeLine = function (startX, startY, length, direction) {
        ctx.strokeStyle = "rgb(153, 255, 179)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        if (direction == 0) { // vertical
            ctx.lineTo(startX, startY + length);
        }
        else if (direction == 1) { // horizontal
            ctx.lineTo(startX + length, startY);
        }
        ctx.stroke();
    };
    return PipeGrid;
}());
