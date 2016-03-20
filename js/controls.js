'use strict';

var Controls = (function() {
    var controlsTemplate = document.getElementById('controls-template').innerHTML;

    class Controls extends Dispatcher {
        constructor(options) {
            super(options);

            this._render();
            this._timer = options.timer;
            this._timerEl = this._el.querySelector('[data-content="timer"]');
            this._addListeners();
        }

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
        }

        _addListeners() {
            this._el.addEventListener('click', this._onClick.bind(this));
            this._el.addEventListener('change', this._onChange.bind(this));
            this._timer.addEventListener('timeUpdate', this._onTimerUpdate.bind(this));
        }

        _onClick(event) {
            var startBtn = event.target.closest('[data-action="start"]');

            if (!startBtn) {
                return
            }
            this._onStartClick();
        }
        _onStartClick() {
            let options = this._getOptions();

            this.dispatchEvent('start', options);
        }

        _onChange(event) {
            let optionsForm = event.target.closest('[name="options-form"]');

            if (!optionsForm) {
                return;
            }

            this._validateOptions();
        }

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
            this._el.querySelector('[data-range="mines"]').textContent = `(${Default.MIN_MINES}-${maxMines})`;
            this._el.querySelector('[name="mines"]').max = Default.MIN_MINES;
            this._el.querySelector('[name="mines"]').max = maxMines;

            this._setOptions(options);
        }

        _getOptions() {
            let rows = parseInt(this._el.querySelector('[name="rows"]').value);
            let columns = parseInt(this._el.querySelector('[name="columns"]').value);
            let mines = parseInt(this._el.querySelector('[name="mines"]').value);

            return {
                rows: rows,
                columns: columns,
                mines: mines
            }
        }

        _setOptions(options) {
            this._el.querySelector('[name="rows"]').value = options.rows;
            this._el.querySelector('[name="columns"]').value = options.columns;
            this._el.querySelector('[name="mines"]').value = options.mines;
        }

        _getMinesMaxRange(rows, columns) {
            return Math.round(rows*columns/2);
        }

        _onTimerUpdate(event) {
            let time = event.detail;
            let min = Math.floor(time / 60);
            let sec = time % 60;

            function twoDigits(n) {
                return (n < 10 ? '0' : '') + n;
            }

            this._timerEl.textContent = `${twoDigits(min)}:${twoDigits(sec)}`;
        }
    }

    return Controls;
})();
