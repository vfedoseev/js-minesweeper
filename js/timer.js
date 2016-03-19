'use strict';

class Timer extends Dispatcher {

    start() {
        this.startTime = Date.now();
        this.interval = setInterval(() => {
            this.update();
        }, 1000);
        this.update();
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    reset() {
        this.stop();
        this.startTime = Date.now();
        this.update();
    }

    update() {
        this._current = Math.round((Date.now() - this.startTime) / 1000);
        this.dispatchEvent('timeUpdate', this._current);
    }

    getValue() {
        return this._current;
    }
}