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
                this.setState(GameState.LOST);
                this._openAll();
                break;
        }

        this._checkGameState();
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
        //Get number of opened cells and number of marked cells
        let openedCells = Object.keys(this._openedCells).length;
        //TODO - check only true marked cells and if all marked cells are correct (equal total mines)
        let markedCells = Object.keys(this._markedCells).filter((key)=>this._markedCells[key]).length;
        let totalCells = this._field.rows * this._field.columns;

        // All cells are marked or opened and number of marked cells equal to total mines.
        // We don't have excess marks
        if (openedCells + markedCells === totalCells && markedCells === this._field.mines) {
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