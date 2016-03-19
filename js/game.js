'use strict';

var Game = (function() {
    let fieldTemplate = document.getElementById('field-template').innerHTML;

    class Game {

        constructor(options) {
            this._el = options.element;
            this._fieldWrapper = this._el.querySelector('[data-component="field"]');
            this._fieldTemplate = _.template(fieldTemplate);

            this._gameModel = new GameModel();
            this._gameModel.addEventListener('stateChange', this._onGameStateChange.bind(this));
            this._gameModel.addEventListener('cellOpen', this._onCellOpen.bind(this));
            this._gameModel.addEventListener('cellToggle', this._onCellToggle.bind(this));

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
            })
        }

        start(options) {
            this._renderField(options);
            this._addListeners();
            this._gameModel.start(options);
            this._firstClick = false;
            this._timer.reset();
        }

        _onStart(event) {
            let options = event.detail;

            this.start(options);
        }

        _renderField(options) {
            this._fieldWrapper.innerHTML = this._fieldTemplate(options);//fieldHTML;
            this._fieldEl = this._fieldWrapper.querySelector('table');
        }

        _addListeners() {
            this._fieldEl.onclick = this._onFieldLeftClick.bind(this);
            this._fieldEl.oncontextmenu = this._onFieldRightClick.bind(this);
        }

        _removeListeners() {
            this._fieldEl.onclick = null;
            this._fieldEl.oncontextmenu = null;
        }

        _onFieldLeftClick(event) {
            let targetCell = this._getClickedCell(event);

            if (targetCell) {
                this._checkFirstClick();
                this._gameModel.openCell(targetCell.parentNode.sectionRowIndex, targetCell.cellIndex);
            }
        }

        _onFieldRightClick(event) {
            let targetCell = this._getClickedCell(event);

            if (targetCell) {
                this._checkFirstClick();
                this._gameModel.markCell(targetCell.parentNode.sectionRowIndex, targetCell.cellIndex);
            }

            return false;
        }

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

        _onCellOpen(event) {
            let cell = event.detail;
            let cellType = cell.type;
            let cellEl = this._fieldEl.rows[cell.row].cells[cell.column];

            switch (cellType) {
                case CellType.EMPTY:
                    cellEl.classList.add('cell-empty');
                    break;
                case CellType.MINE:
                    cellEl.classList.add('cell-mine');
                    break;
                default:
                    cellEl.classList.add('cell-number');
                    cellEl.innerHTML = cellType;
            }
        }

        _onCellToggle(event) {
            let cell = event.detail;
            let cellEl = this._fieldEl.rows[cell.row].cells[cell.column];

            cellEl.classList.toggle('cell-marked');
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


