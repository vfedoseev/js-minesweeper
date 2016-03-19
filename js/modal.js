'use strict';

var Modal = (function() {
    let modalTemplate = document.getElementById('modal-template').innerHTML;

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
            this._template = _.template(modalTemplate);
            //Append generated HTML to wrapper
            this._el.innerHTML = this._template({
                title: this._options.title,
                content: this._content
            });
            //Set delay for animation
            setTimeout(()=>{
                this._el.querySelector('.modal').classList.remove('js-modal-hidden');
            },20);
            this._el.addEventListener('click', this._onCloseClick.bind(this));

            return this._el;
        }

        _onCloseClick(event) {
            let closeBtn = event.target.closest('.js-close');

            if (closeBtn) {
                this.hide();
            }
        }
    }

    return Modal;
})();