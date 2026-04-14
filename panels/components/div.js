// @ts-check

import { UIComponent } from "./component.js";

export class UIDiv extends UIComponent {
    /** @param {objDiv} config */
    constructor(config) { super(config); }
    build() {
        return this.applyBaseAttributes(createElement('div'));
    }
}
