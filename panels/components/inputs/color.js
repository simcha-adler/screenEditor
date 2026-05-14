// @ts-check

import { UIComponent } from "../component.js";

export class UIColorInput extends UIComponent {
    /** @param {objInputColor} config  */
    constructor(config) { super(config) }

    /** @returns {any} */
    build() {
        const el = colorPicker.create(this.config);
        if (this.config.details) this.applyBaseAttributes(el);
        return el;
    }
}