//@ts-check

import { UIComponent } from "./component.js";

export class UIButton extends UIComponent {
    /** @param {objButton} config */
    constructor(config) { super(config); }

    build() {
        const btn = createElement('button', { class: 'ui-btn', text: this.config.label });
        if (this.config.onClick) btn.onclick = this.config.onClick;
        return this.applyBaseAttributes(btn);
    }
}
