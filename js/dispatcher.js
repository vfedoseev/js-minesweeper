'use strict';

class Dispatcher {
    constructor(options) {
        options = options || {};
        this._el = options.element || document.createElement('div');
    }

    addEventListener(type, handler, capture) {
        this._el.addEventListener(type, handler, capture);
    }

    dispatchEvent(type, detail, options) {
        options = options || {};

        if (detail != undefined) {
            options.detail = detail;
        }

        let event = new CustomEvent(type, options);
        this._el.dispatchEvent(event);
    }
}
