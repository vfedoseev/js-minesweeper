'use strict';

let modalTemplate = require('../templates/modal-template.hbs');

class Modal {
    constructor(options) {
        this._placeholder = options.placeholder;
        this._options = options;
        this._content = '';
    }

    show() {
        //Lazy rendering
        if (!this._el) {
            this._render();
        }
        if (!this._el.parentNode) {
            this._placeholder.appendChild(this._el);
        }
    }

    hide() {
        this._placeholder.removeChild(this._el);
    }

    setContent(content) {
        this._content = content;
    }

    _render() {
        this._el = document.createElement('div');
        //Append generated HTML to wrapper
        this._el.innerHTML = modalTemplate({
            title: this._options.title,
            content: this._content
        });
        //Set delay for animation
        setTimeout(()=>{
            this._el.querySelector('.modal').classList.remove('js-modal-hidden');
        },20);
        this._el.addEventListener('click', this._onCloseClick.bind(this));
        this._el.addEventListener('contextmenu', this._onContextMenu.bind(this));

        return this._el;
    }

    _onCloseClick(event) {
        let closeBtn = event.target.closest('[data-action="close"]');

        if (closeBtn) {
            this.hide();
        }
    }

    /**
     * Prevent context menu on modal
     */
    _onContextMenu(event) {
        event.preventDefault();
    }
}

module.exports = Modal;