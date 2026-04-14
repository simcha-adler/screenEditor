// @ts-check

import { UIComponent } from "./component.js";

export class UISmallTitle extends UIComponent {
    /** @param {objTitle} config */
    constructor(config) { super(typeof config === 'string' ? { label: config } : config); }

    build() {
        return this.applyBaseAttributes(createElement('span', { class: 'ui-title small', text: this.config.label }));
    }
}