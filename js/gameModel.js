'use strict';

const DELIMITER = '-';
/**
 * Class representing the game model
 */
class GameModel extends Dispatcher {
    /**
     * Create game model
     * @param options
     */
    constructor(options) {
        super(options);
    }

    /**
     * Start new game with provideed oprions
     * @param gameOptions
     */
    start(gameOptions) {
        this._openedCells = {}; //make object for easy access by index ('2-3');
        this._markedCells = {};
        this._highlightedCells = {};
        this._field = new FieldModel(gameOptions);
        this._field.generate();
        this.setState(GameState.START);
    }

    setState(state) {
        //WIN and LOST - terminate states. Could only set state to START from them
        if (state !== GameState.START && (this._state === GameState.WIN || this._state === GameState.LOST)) {
            return;
        }

        this._state = state;
        this.dispatchEvent('stateChange', this._state);
        //this._onStateChange(this._state);
    }

    /**
     * Mark cell (has mine/has no mine)
     * @param row
     * @param column
     */
    markCell(row, column) {
        if (this._openedCells[row + DELIMITER + column]) {
            return;
        }

        this._markedCells[row + DELIMITER + column] = !this._markedCells[row + DELIMITER + column];
        this.dispatchEvent('cellToggle', this._field.getCell(row, column));
        this._checkGameState();
    }

    /**
     * Trt to pen cell and check its "content"
     * @param row
     * @param column
     */
    openCell(row, column) {
        let cell = this._checkAndOpenCell(row, column);

        if (!cell) { //cell was already opened
            return;
        }
        switch (cell.type) {
            case CellType.EMPTY: //Cell is empty - open all neighbours cells
                let neighbours = this._field.getNeighbours(row, column);
                neighbours.forEach((neighbourCell) => { //we don't have to check mine because empty neighbours are not mines
                    let neighbourRow = neighbourCell.row;
                    let neighbourColumn = neighbourCell.column;

                    this.openCell(neighbourRow, neighbourColumn);
                });
                break;
            case CellType.MINE: // Cell has mine - game is over
                this._openAll();
                this.setState(GameState.LOST);
                break;
        }

        this._checkGameState();
    }

    /**
     * Hightlight all cells neighbours if the cell has number and it eual to number of marked neighbours
     * @param row
     * @param column
     */
    highlightCell(row, column) {
        let cellType = this._field.getCellType(row, column);
        let cellIsOpened = this._openedCells[row + DELIMITER + column];
        if (!cellIsOpened && cellType > 0) {
            return;
        }
        let neighbours = this._field.getNeighbours(row, column);
        let markedNeighbours = neighbours.filter((neighbourCell) => {
            return this._markedCells[neighbourCell.row + DELIMITER + neighbourCell.column];
        }).length;

        if (markedNeighbours !== cellType) {
            return;
        }
        neighbours.forEach((neighbourCell) => { //we don't have to check mine because empty neighbours are not mines
            let neighbourRow = neighbourCell.row;
            let neighbourColumn = neighbourCell.column;
            let neighbourIsOpened = this._openedCells[neighbourRow + DELIMITER + neighbourColumn];
            let neighbourIsMarked = this._markedCells[neighbourRow + DELIMITER + neighbourColumn];

            if (!neighbourIsOpened && !neighbourIsMarked) {
                this._highlightedCells[neighbourRow + DELIMITER + neighbourColumn] = true;
                this.dispatchEvent('cellHighlight', neighbourCell);
            }
        });
    }

    /**
     * Open all cell, that are currently highlighted (by pressing two buttons on mumber cell)
     */
    openHighlighted() {
        for (let i = 0; i < this._field.rows; i++) {
            for (let j = 0; j < this._field.columns; j++) {
                if (!this._highlightedCells[i + DELIMITER + j]) {
                    continue;
                }
                this.openCell(i, j);
            }
        }
    }

    /**
     * Clear highlight for all cells
     */
    clearHighlight() {
        for (let i = 0; i < this._field.rows; i++) {
            for (let j = 0; j < this._field.columns; j++) {
                if (!this._highlightedCells[i + DELIMITER + j]) {
                    continue;
                }
                let cell = this._field.getCell(i, j);

                this._highlightedCells[i + DELIMITER + j] = false;
                this.dispatchEvent('cellClearHighlight', cell);
            }
        }
    }
    /**
     * Open cell only it is available
     * @param row
     * @param column
     * @param {boolean} force - open anyway (when game is over)
     * @returns {*}
     * @private
     */
    _checkAndOpenCell(row, column, force) {
        let cellOpened = this._openedCells[row + DELIMITER + column];
        let cellMarked = this._markedCells[row + DELIMITER + column];

        if (!cellOpened && !cellMarked || force) {
            let cell = this._field.getCell(row, column);

            this._openedCells[row + DELIMITER + column] = true;
            this.dispatchEvent('cellOpen', cell);

            return cell;
        }
        return null;
    }

    _checkGameState() {
        //Get number of opened cells and number of cells with mines
        let openedCells = Object.keys(this._openedCells).length;
        let totalMines = this._field.mines;
        let totalCells = this._field.rows * this._field.columns;

        // All "safe" cells are opened
        if (openedCells + totalMines === totalCells) {
            this._openAll();
            this.setState(GameState.WIN);
        }
    }

    /**
     * Open all cells (when game is over)
     * @private
     */
    _openAll() {
        for (let i = 0; i < this._field.rows; i++) {
            for (let j = 0; j < this._field.columns; j++) {
                this._checkAndOpenCell(i, j, true);
            }
        }
    }
}