// @ts-check

import { UIComponent } from "../component.js";

export class UITextInput extends UIComponent {
    /** @param {objInputText} config  */
    constructor(config) { super(config) }

    build() {
        /** @type {HTMLInputElement} */
        const el = createElement('input', { type: 'text', class: 'ui-input', 'data-property': this.config.prop });
        if (this.config.placeholder) el.placeholder = this.config.placeholder;
        if (this.config.details) this.applyBaseAttributes(el);
        return el;
    }
}