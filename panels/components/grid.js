// @ts-check

import { UIComponent } from "./component.js";

export class UIGrid extends UIComponent {
    /** @param {objGrid} config */
    constructor(config) { super(config); }

    build() {
        const grid = createElement('div', { class: 'ui-grid' });
        if (this.config.children) {
            this.config.children.forEach(child => grid.appendChild(child.build()));
        }
        return this.applyBaseAttributes(grid);
    }
}