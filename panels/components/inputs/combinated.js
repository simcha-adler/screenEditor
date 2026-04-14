// @ts-check

import { UIComponent } from "../component.js";
import { UINumberInput } from "./number.js";
import { UISelectInput } from "./select.js";

export class UICombinatedInput extends UIComponent {
    /** @param {objInputRange} config  */
    constructor(config) { super(config) }

    build() {
        const wrapper = createElement('div', { class: 'ui-input-group' });

        const valInput = new UINumberInput(this.config).build();

        const unitInput = new UISelectInput({ options: this.config.selectToCombinated, prop: '' }).build();
        unitInput.addClass('ui-select-unit');

        const demoInput = createElement('input', { type: 'hidden', 'data-property': this.config.prop });
        if (this.config.details) this.applyBaseAttributes(demoInput);

        wrapper.when('input', (/** @type {Event} */ e) => {
            if (e.target === demoInput) return;
            e.stopPropagation();

            const num = valInput.value;
            const unit = unitInput.value;
            const keywords = ['auto', 'none', 'inherit', 'initial', 'unset', 'normal'];
            let finalValue;

            // @ts-ignore
            if (keywords.includes(unit)) {
                finalValue = unit;
                valInput.style.opacity = '0.1'; // החזרתי ל-0.1 כמו במקור שלך
            } else if (num === '') {
                return;
            } else {
                finalValue = num + unit;
                valInput.style.opacity = '1';
            }
            demoInput.sendInput(finalValue);
        });

        wrapper.append(valInput, unitInput, demoInput);
        return wrapper;
    }
}
