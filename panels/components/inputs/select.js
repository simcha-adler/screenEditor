// @ts-check

import { UIComponent } from "../component.js";

export class UISelectInput extends UIComponent {
    /** @param {objInputSelect} config  */
    constructor(config) { super(config) }

    build() {
        const select = createElement('select', { class: 'ui-select' });
        if (this.config.prop) select.dataset.property = this.config.prop;
        if (this.config.options) {
            this.config.options.forEach((/** @type {objOptions} */ opt) => {
                const o = createElement('option', { value: opt.value, text: opt.text });
                if (opt.selected) o.selected = true;
                select.appendChild(o);
            });
        }
        if (this.config.details) this.applyBaseAttributes(select);
        return select;
    }

}