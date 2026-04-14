// @ts-check

import { UIComponent } from "../component.js";

export class UINumberInput extends UIComponent {
    /** @param {objInputRange} config  */
    constructor(config) { super(config) }

    /** @returns HTMLElement */
    build() {
        /** @type {HTMLInputElement} */
        const el = createElement('input', { type: 'number', class: 'ui-input', 'data-property': this.config.prop });
        this.applyNumberAttributes(el);
        return el;
    }

    /** @param {HTMLInputElement} el  */
    applyNumberAttributes(el) {
        const config = this.config;
        if (config.min) el.min = config.min;
        if (config.max) el.max = config.max;
        if (config.step) el.step = config.step;
        if (config.defaultValue) el.value = config.defaultValue;
        if (config.unit) el.dataset.unit = config.unit;
        if (config.details) this.applyBaseAttributes(el);
    }
}