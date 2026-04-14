// @ts-check

import { UIComponent } from "../component.js";

export class UIInputRow extends UIComponent {
    /** @param {objInputRow} config */
    constructor(config) { super(config); }

    build() {
        /** @type {objInputRow} */
        const config = this.config;
        const row = createElement('div', { class: 'ui-control-row' });
        const label = createElement('span', { class: 'ui-label', text: config.label });
        row.appendChild(label);

        // יצירת האינפוט
        row.append(config.input.build());
        return this.applyBaseAttributes(row);
    }
}


// אפשר לבטל את זה לחלוטין ובסכמות לשים תכונה "האם שורה", ואז ברכיבים עצמם לבצע קריאה לעטיפה לפי הצורך
// כרגע לא מבוצע בגלל העבודה הרבה בעניין