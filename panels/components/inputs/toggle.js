// @ts-check

import { UIComponent } from "../component.js";

export class UIToggleInput extends UIComponent {
    /** @param {objInputBool} config  */
    constructor(config) { super(config) }

    build() {
        const switchLabel = createElement('label', { class: 'ui-switch' });
        const input = createElement('input', { type: 'checkbox', 'data-v': this.config.v, 'data-x': this.config.x, 'data-property': this.config.prop });
        const slider = createElement('span', { class: 'ui-slider' });
        switchLabel.append(input, slider);
        if (this.config.details) this.applyBaseAttributes(input);
        return switchLabel;
    }
}