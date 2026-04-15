//@ts-check

import { UIComponent } from './component.js';
import { UIButton } from './button.js';
import { UITitle } from './title.js';
import { UISwitcher } from './switcher.js';
import { UISmallTitle } from './smallTitle.js';
import { UIDiv } from './div.js';
import { UISection } from './section.js';
import { UIGrid } from './grid.js';
import { UIInputRow } from './inputs/inputRow.js';
import { UIWrapInput } from './inputs/wrapInput.js';

import { UIRangeInput } from './inputs/range.js';
import { UINumberInput } from './inputs/number.js';
import { UIToggleInput } from './inputs/toggle.js';
import { UICombinatedInput } from './inputs/combinated.js';
import { UITextInput } from './inputs/text.js';
import { UISelectInput } from './inputs/select.js';
import { UIColorInput } from './inputs/color.js';



const build = {
    /** @param {string} panelName; @param {Object} schema; @param {function} [listener] */
    panel: (panelName, schema, listener) => {
        const panel = build.fillChildren(panelName, schema);
        if (listener) {
            // @ts-ignore
            panel.when('input', (/** @type {Event} */ e) => listener(e));
        }
        fillValues.panel(panel);
    },

    /** @param {string} containerName; @param {Object} schema; */
    fillChildren: (containerName, schema) => {
        const container = $(containerName);
        container.innerHTML = '';
        schema.forEach(/** @param {UIComponent} item */ item => { container.append(item.build()) });
        return container;
    }
}

export const UI = {
    component: UIComponent,
    button: UIButton,
    title: UITitle,
    switcher: UISwitcher,
    smallTitle: UISmallTitle,
    div: UIDiv,
    section: UISection,
    grid: UIGrid,
    inputRow: UIInputRow,
    wrapInput: UIWrapInput,
    input: {
        range: UIRangeInput,
        number: UINumberInput,
        toggle: UIToggleInput,
        select: UISelectInput,
        text: UITextInput,
        combinated: UICombinatedInput,
        color: UIColorInput
    },
    buildPanel: build.panel,
    fillChildren: build.fillChildren
}

// @ts-ignore
window.UI = UI;