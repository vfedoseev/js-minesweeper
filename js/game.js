'use strict';

var Game = (function() {
    let fieldTemplate = document.getElementById('field-template').innerHTML;
    /**
     * Class representing the main game manager
     */
    class Game {
        /**
         * Create game controller
         * @param options
         */
        constructor(options) {
            this._el = options.element;
            this._fieldWrapper = this._el.querySelector('[data-component="field"]');
            this._fieldTemplate = _.template(fieldTemplate);

            //Bind listeners
            this._onFieldLeftClick = this._onFieldLeftClick.bind(this);
            this._onFieldRightClick = this._onFieldRightClick.bind(this);
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            //Current click - collect data about simultaneous click
            this._currentClick = {};

            this._gameModel = new GameModel();
            this._gameModel.addEventListener('stateChange', this._onGameStateChange.bind(this));
            this._gameModel.addEventListener('cellOpen', this._onCellOpen.bind(this));
            this._gameModel.addEventListener('cellToggle', this._onCellToggle.bind(this));
            this._gameModel.addEventListener('cellHighlight', this._onCellHighlight.bind(this));
            this._gameModel.addEventListener('cellClearHighlight', this._onCellClearHighlight.bind(this));

            this._timer = new Timer();

            let controls = new Controls({
                element: this._el.querySelector('[data-component="controls"]'),
                timer: this._timer
            });
            controls.addEventListener('start', this._onStart.bind(this));

            //Render default field
            this.start({
                rows: Default.ROWS,
                columns: Default.COLUMNS,
                mines: Default.MINES
            });
        }

        /**
         * Start new game with provided options
         * @param options
         */
        start(options) {
            this._renderField(options);
            this._addListeners();
            this._gameModel.start(options);
            this._firstClick = false;
            this._timer.reset();
        }

        /**
         * Handle start event from controls panel
         * @param {CustomEvent} event
         * @private
         */
        _onStart(event) {
            let options = event.detail;

            this.start(options);
        }

        /**
         * Render new game field
         * @param options
         * @private
         */
        _renderField(options) {
            this._fieldWrapper.innerHTML = this._fieldTemplate(options);//fieldHTML;
            this._fieldEl = this._fieldWrapper.querySelector('table');
        }

        /**
         * Add listeners to user interaction
         * @private
         */
        _addListeners() {
            this._fieldEl.addEventListener('click', this._onFieldLeftClick);
            this._fieldEl.addEventListener('contextmenu', this._onFieldRightClick);
            this._fieldEl.addEventListener('mousedown', this._onMouseDown.bind(this));
            document.addEventListener('mouseup', this._onMouseUp.bind(this));
        }

        /**
         * Remove listeners to prevent interaction when game is over
         * @private
         */
        _removeListeners() {
            this._fieldEl.removeEventListener('click', this._onFieldLeftClick);
            this._fieldEl.removeEventListener('contextmenu', this._onFieldRightClick);
            this._fieldEl.removeEventListener('mousedown', this._onMouseDown.bind(this));
            document.removeEventListener('mouseup', this._onMouseUp.bind(this));
        }

        /**
         * User clicks left mouse button
         * @param {MouseEvent} event
         * @private
         */
        _onFieldLeftClick(event) {
            let targetCell = this._getClickedCell(event);

            if (targetCell) {
                this._checkFirstClick();
                this._gameModel.openCell(targetCell.parentNode.sectionRowIndex, targetCell.cellIndex);
            }
        }

        /**
         * User clicks left mouse button
         * @param {MouseEvent} event
         * @private
         */
        _onFieldRightClick(event) {
            let targetCell = this._getClickedCell(event);

            if (targetCell) {
                this._checkFirstClick();
                this._gameModel.markCell(targetCell.parentNode.sectionRowIndex, targetCell.cellIndex);
            }

            event.preventDefault();
        }

        /**
         * User presses mouse button
         * @param event
         * @private
         */
        _onMouseDown(event) {
            let targetCell = this._getClickedCell(event);
            let currentCell = this._currentClick.cell;

            if (!targetCell || (currentCell && targetCell !== currentCell)) {
                this._resetCurrentClick();
                return;
            }

            this._currentClick.cell = targetCell;
            switch (event.which) {
                case 1:
                    this._currentClick.left = true;
                    break;
                case 3:
                    this._currentClick.right = true;
                    break;
            }

            if (this._currentClick.left && this._currentClick.right) {
                this._gameModel.highlightCell(targetCell.parentNode.sectionRowIndex, targetCell.cellIndex);
            }
        }

        /**
         * User releases mouse button
         * @param event
         * @private
         */
        _onMouseUp(event) {
            let targetCell = this._getClickedCell(event);
            let currentCell = this._currentClick.cell;
            let twoButtonsDown = this._currentClick.left && this._currentClick.right;

            if (targetCell && currentCell && targetCell == currentCell && twoButtonsDown) {
                this._gameModel.openHighlighted();
            }
            this._gameModel.clearHighlight();
            this._resetCurrentClick();
        }

        _resetCurrentClick(event) {
            this._currentClick = {};
        }
        /**
         * Check if the click is the first for this new game
         * @private
         */
        _checkFirstClick() {
            if (!this._firstClick) {
                this._firstClick = true;
                this._timer.start();
            }
        }

        _getClickedCell(event) {
            let target = event.target;

            return target.closest('td');
        }

        /**
         * Handle cell opening and update the cell view state
         * @param {CustomEvent} event
         * @private
         */
        _onCellOpen(event) {
            let cell = event.detail;
            let cellType = cell.type;
            let cellEl = this._fieldEl.rows[cell.row].cells[cell.column];

            switch (cellType) {
                case CellType.EMPTY:
                    cellEl.classList.add(Classes.EMPTY);
                    break;
                case CellType.MINE:
                    cellEl.classList.add(Classes.MINE);
                    break;
                default:
                    cellEl.classList.add(Classes.NUMBER);
                    cellEl.innerHTML = cellType;
            }
        }
        /**
         * Handle cell toggling and update the cell view state (place/remove flag)
         * @param {CustomEvent} event
         * @private
         */
        _onCellToggle(event) {
            let cell = event.detail;
            let cellEl = this._fieldEl.rows[cell.row].cells[cell.column];

            cellEl.classList.toggle(Classes.MARKED);
        }
        /**
         * Handle cell highlight (highlight neighbours when two buttons pressed on the cell with number)
         * @param {CustomEvent} event
         * @private
         */
        _onCellHighlight(event) {
            let cell = event.detail;
            let cellEl = this._fieldEl.rows[cell.row].cells[cell.column];

            cellEl.classList.add(Classes.HIGHLIGHT);
        }
        _onCellClearHighlight(event) {
            let cell = event.detail;
            let cellEl = this._fieldEl.rows[cell.row].cells[cell.column];

            cellEl.classList.remove(Classes.HIGHLIGHT);
        }

        _onGameStateChange(event) {
            let state = event.detail;

            switch (state) {
                case GameState.LOST:
                case GameState.WIN:
                    this._end(state);
                    break;
            }
        }

        /**
         * Game is over - show message, clear game data and remove listeners
         * @param state
         * @private
         */
        _end(state) {
            let isWin = (state === GameState.WIN);

            this._timer.stop();
            this._removeListeners();

            let message = `You ${isWin ? 'WIN' : 'LOSE'}`;
            let modal = new Modal({
                placeholder: this._el,
                title: message
            });

            if (isWin) {
                Results.save(this._timer.getValue());
                modal.setContent(Results.render());
            }

            modal.show();
        }
    }

    return Game;
})();


