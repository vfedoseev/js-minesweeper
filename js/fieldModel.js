'use strict';

/**
 * Class representing a game field
 */
class FieldModel {
    /**
     * Create a field
     * @param options
     */
    constructor(options) {
        options = options || {};
        this.rows = options.rows || Default.ROWS;
        this.columns = options.columns || Default.COLUMNS;
        this.mines = options.mines || Default.MINES;
    }

    /**
     * Generate new field with mines, numbers and empty cells
     */
    generate() {
        let placedMines = 0;

        this._field = []; // start with empty array
        for (let i = 0; i < this.rows; i++) { // generate empty rows
            this._field[i] = [];
        }

        // place mines at random position unit reach the number of mines
        while (placedMines < this.mines) {
            let rowIndex = Math.floor(Math.random() * this.rows);
            let columnIndex = Math.floor(Math.random() * this.columns);

            if (this.getCellType(rowIndex, columnIndex) === CellType.MINE) {
                continue;
            }

            this._field[rowIndex][columnIndex] = CellType.MINE;
            placedMines++;
        }

        // place numbers in all mines neighbours cells
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (this.getCellType(i, j) === CellType.MINE) {
                    let mineNeighbours = this.getNeighbours(i, j);

                    mineNeighbours.forEach(cellObj => {
                        if (cellObj.type !== CellType.MINE) {
                            this._field[cellObj.row][cellObj.column] = cellObj.type + 1;
                        }
                    });
                }
            }
        }
    }

    /**
     * Get only type for particular cell
     * @param row
     * @param column
     * @returns {number} - cell type (see constants.Defaults)
     */
    getCellType(row, column) {
        return this._field[row][column] || CellType.EMPTY;
    }

    /**
     * Get cell object
     * @param row
     * @param column
     * @returns {{column: number, row: number, type: number}}
     */
    getCell(row, column) {
        return {
            column: column,
            row: row,
            type: this.getCellType(row, column)
        }
    }

    /**
     * Get neighbours of particular cell
     * @param row
     * @param column
     * @returns {Array} - array of neighbours
     */
    getNeighbours(row, column) {
        let neighbours = [];
        let minCol = Math.max(0, column - 1);
        let maxCol = Math.min(this.columns - 1, column + 1);
        let minRow = Math.max(0, row - 1);
        let maxRow = Math.min(this.rows - 1, row + 1);

        for (let i = minRow; i <= maxRow; i++) {
            for (let j = minCol; j <= maxCol; j++) {
                if (i === row && j === column) {
                    continue;
                }
                neighbours.push(this.getCell(i, j));
            }
        }

        return neighbours;
    }
}
