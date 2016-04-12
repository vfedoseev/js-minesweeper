'use strict';

exports.CellType = {
    EMPTY: 0,
    MINE: -1
};

exports.GameState = {
    START: 0,
    WIN: 1,
    LOST: 2
};

exports.Default = {
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

exports.Selectors = {
    ROWS_INPUT: '[name="rows"]',
    COLUMNS_INPUT: '[name="columns"]',
    MINES_INPUT: '[name="mines"]',
    MINES_RANGE_TEXT: '[data-range="mines"]'
};

exports.Classes = {
    EMPTY: 'cell-empty',
    MINE: 'cell-mine',
    NUMBER: 'cell-number',
    MARKED: 'cell-marked',
    HIGHLIGHT: 'cell-highlight'
};