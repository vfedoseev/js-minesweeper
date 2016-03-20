'use strict';
/**
 * Class representing the base event dispathcer
 */
class Dispatcher {
    /**
     * Crrate dispatcher
     * @param options
     */
    constructor(options) {
        options = options || {};
        this._el = options.element || document.createElement('div');
    }

    /**
     * Add event handler
     * @param {string} type
     * @param {function} handler
     * @param {boolean} capture - use capture
     */
    addEventListener(type, handler, capture) {
        this._el.addEventListener(type, handler, capture);
    }

    /**
     * Dispatch custom event
     * @param {string} type
     * @param detail - event data
     * @param {object} options
     */
    dispatchEvent(type, detail, options) {
        options = options || {};

        if (detail != undefined) {
            options.detail = detail;
        }

        let event = new CustomEvent(type, options);
        this._el.dispatchEvent(event);
    }
}
