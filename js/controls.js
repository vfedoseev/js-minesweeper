'use strict';

var Controls = (function() {
    var controlsTemplate = document.getElementById('controls-template').innerHTML;

    class Controls extends Dispatcher {
        constructor(options) {
            super(options);

            this._render();
            this._timer = options.timer;
            this._timerEl = this._el.querySelector('.js-timer');
            this._addListeners();
        }

        _render() {
            let defaultOptions = {
                minRows: Default.MIN_ROWS,
                maxRows: Default.MAX_ROWS,
                minCols: Default.MIN_COLUMNS,
                maxCols: Default.MAX_COLUMNS,
                minMines: Default.MIN_MINES,
                rows: Default.MIN_ROWS,
                cols: Default.MIN_COLUMNS,
                mines: Default.MIN_MINES
            };

            this._el.innerHTML = _.template(controlsTemplate)({
                options: defaultOptions
            });
        }

        _addListeners() {
            let startButton = this._el.querySelector('.js-start');

            startButton.addEventListener('click', this._onStartClick.bind(this));
            this._timer.addEventListener('timeUpdate', this._onTimerUpdate.bind(this));
        }

        _onStartClick() {
            let columnsInput = this._el.querySelector('[name="columns"]');
            let rowsInput = this._el.querySelector('[name="rows"]');
            let minesInput = this._el.querySelector('[name="mines"]');
            let columns = parseInt(columnsInput.value, 10);
            let rows = parseInt(rowsInput.value, 10);
            let mines = parseInt(minesInput.value, 10);

            //Validate input values
            if (isNaN(columns)) {
                columns = columnsInput.value = Default.COLUMNS;
            }
            if (isNaN(rows)) {
                rows = rowsInput.value = Default.ROWS;
            }
            if (isNaN(mines)) {
                mines = minesInput.value = Default.MINES;
            }

            this.dispatchEvent('start', {
                columns: columns,
                rows: rows,
                mines: mines
            });
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
