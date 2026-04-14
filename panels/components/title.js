// @ts-check

import { UIComponent } from "./component.js";

export class UITitle extends UIComponent {
    /** @param {objTitle} config */
    constructor(config) { super(typeof config === 'string' ? { label: config } : config); }
    build() {
        return this.applyBaseAttributes(createElement('div', { class: 'ui-title', text: this.config.label }));
    }
}
