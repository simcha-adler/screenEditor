// @ts-check

import { UINumberInput } from "./number.js";

export class UIRangeInput extends UINumberInput {
    /** @param {objInputRange} config  */
    constructor(config) { super(config) }

    build() {
        const el = createElement('input', { type: 'range', class: 'ui-range', 'data-property': this.config.prop });
        this.applyNumberAttributes(el);
        return el;
    }
}