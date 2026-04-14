//@ts-check

import { UIComponent } from "../component.js";

// UIWrapInput מיועד לאינפוטים "ערומים" (למשל בתוך UIGrid) שיכולים לכלול לייבל מעליהם
export class UIWrapInput extends UIComponent {
    /** @param {objWrapInput} config  */
    constructor(config) { super(config); }

    build() {
        /** @type {objWrapInput} */
        const config = this.config;
        const inputControl = config.input.build();

        // עטיפה עם תווית (תואם ל-build.input.wrapper המקורי)
        if (this.config.label) {
            const wrapper = createElement('div', { class: 'ui-control-row' });
            if (this.config.label.length > 1) wrapper.addClass('flex-col');
            const label = createElement('span', { class: 'ui-label', text: this.config.label });
            wrapper.append(label, inputControl);
            return wrapper;
        }
        return inputControl;
    }
}