// @ts-check

import { UIComponent } from "./component.js";

export class UISection extends UIComponent {
    /** @param {objSection} config */
    constructor(config) { super(config); }

    build() {
        const section = createElement('div', { class: 'ui-section' });
        if (this.config.collapsed) section.addClass('collapsed');

        const head = createElement('div', { class: 'ui-section-head', text: this.config.label });
        head.onclick = () => section.toggleClass('collapsed');

        const body = createElement('div', { class: 'ui-section-body' });
        if (this.config.children) {
            this.config.children.forEach(child => body.append(child.build()));
        }

        section.append(head, body);
        return this.applyBaseAttributes(section);
    }
}
