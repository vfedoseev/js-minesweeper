'use strict';

var Controls = (function() {
    var controlsTemplate = document.getElementById('controls-template').innerHTML;
    /**
     * Class representing the control panel
     */
    class Controls extends Dispatcher {
        /**
         * Create controls
         * @param options
         */
        constructor(options) {
            super(options);

            this._render();
            this._timer = options.timer;
            this._timerEl = this._el.querySelector('[data-content="timer"]');
            this._addListeners();
        }

        /**
         * Render controls from template
         * @private
         */
        _render() {
            let defaultOptions = {
                minRows: Default.MIN_ROWS,
                maxRows: Default.MAX_ROWS,
                minCols: Default.MIN_COLUMNS,
                maxCols: Default.MAX_COLUMNS,
                minMines: Default.MIN_MINES,
                maxMines: Default.MAX_MINES,
                rows: Default.ROWS,
                cols: Default.COLUMNS,
                mines: Default.MINES
            };

            this._el.innerHTML = _.template(controlsTemplate)({
                options: defaultOptions
            });

            this._rowsInput = this._el.querySelector(Selectors.ROWS_INPUT);
            this._columnsInput = this._el.querySelector(Selectors.COLUMNS_INPUT);
            this._minesInput = this._el.querySelector(Selectors.MINES_INPUT);
            this._minesRangeText = this._el.querySelector(Selectors.MINES_RANGE_TEXT);
        }

        /**
         * Add main listeners for click (start game), timer update, and options input change
         * @private
         */
        _addListeners() {
            this._el.addEventListener('click', this._onClick.bind(this));
            this._el.addEventListener('change', this._onChange.bind(this));
            this._timer.addEventListener('timeUpdate', this._onTimerUpdate.bind(this));
        }

        /**
         * 'Click' event handler
         * @param {MouseEvent} event - click event
         * @private
         */
        _onClick(event) {
            var startBtn = event.target.closest('[data-action="start"]');

            if (!startBtn) {
                return
            }
            this._triggerStart();
        }

        /**
         * Implement start - dispatch 'start' event with current options
         * @private
         */
        _triggerStart() {
            let options = this._getOptions();

            this.dispatchEvent('start', options);
        }

        /**
         * 'Change' event hadler
         * @param {Event} event - change event
         * @private
         */
        _onChange(event) {
            let optionsForm = event.target.closest('[name="options-form"]');

            if (!optionsForm) {
                return;
            }

            this._validateOptions();
        }

        /**
         * Validate current options
         * @private
         */
        _validateOptions() {
            let options = this._getOptions();
            //Check if input is not valid number
            if (isNaN(options.columns)) {
                options.columns = Default.MIN_COLUMNS;
            }
            if (isNaN(options.rows)) {
                options.rows = Default.MIN_ROWS;
            }
            if (isNaN(options.mines)) {
                options.rows = Default.MIN_MINES;
            }

            options.rows = Math.max(Default.MIN_ROWS, Math.min(options.rows, Default.MAX_ROWS));
            options.columns = Math.max(Default.MIN_COLUMNS, Math.min(options.columns, Default.MAX_COLUMNS));

            //Calculate mines max range
            let maxMines = this._getMinesMaxRange(options.rows, options.columns);
            options.mines = Math.max(Default.MIN_MINES, Math.min(options.mines, maxMines));
            //Set mines range
            this._minesRangeText.textContent = `(${Default.MIN_MINES}-${maxMines})`;
            this._minesInput.max = Default.MIN_MINES;
            this._minesInput.max = maxMines;

            this._setOptions(options);
        }

        /**
         * Get options from DOM
         * @returns {{rows: Number, columns: Number, mines: Number}}
         * @private
         */
        _getOptions() {
            return {
                rows: parseInt(this._rowsInput.value),
                columns: parseInt(this._columnsInput.value),
                mines: parseInt(this._minesInput.value)
            }
        }

        /**
         * Set options to DOM
         * @param options
         * @private
         */
        _setOptions(options) {
            this._rowsInput.value = options.rows;
            this._columnsInput.value = options.columns;
            this._minesInput.value = options.mines;
        }

        _getMinesMaxRange(rows, columns) {
            return Math.round(rows * columns / 2);
        }

        /**
         * Render new timer value
         * @param {CustomEvent} event
         * @private
         */
        _onTimerUpdate(event) {
            let time = event.detail;
            let min = Math.floor(time / 60);
            let sec = time % 60;

            this._timerEl.textContent = `${this._twoDigits(min)}:${this._twoDigits(sec)}`;
        }

        /**
         * Convert n to two-digit string
         * @param {Number} n
         * @private
         */
        _twoDigits(n) {
            return ('0' + n).slice(-2);
        }
    }

    return Controls;
})();
