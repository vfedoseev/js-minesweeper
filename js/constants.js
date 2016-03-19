'use strict';

const CellType = {
    EMPTY: 0,
    MINE: -1
};

const GameState = {
    START: 0,
    WIN: 1,
    LOST: 2
};

const Default = {
    COLUMNS: 9,
    ROWS: 9,
    MINES: 10,
    MIN_ROWS: 9,
    MAX_ROWS: 20,
    MIN_COLUMNS: 9,
    MAX_COLUMNS: 20,
    MIN_MINES: 2,
    MAX_MINES: 40
};