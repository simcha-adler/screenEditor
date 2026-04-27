//@ts-check

import { Selector } from "./selector.js";
import { SelectorLock } from "./lock.js";
import { Style } from "./styles.js";
import { Mode } from "./mode.js";
import { Panel } from "./panel.js";

let theElement = null;
let theStyles = null

// משימה! ליצור עוד תגית סטייל בפריים של הנערך לצורך סטיילי עזר.
// אחר כך, במקום להוסיף קלאס של הסלקטד, פשוט ליצור חוק עם העיצוב ולשנות לו את הסלקטור

function elementSelected(newElement = editor) {
    if (SelectorLock.getState() || // אם נעול או נבחר אלמנט שגוי (במקרה תקלה! לא אמור להיות)
        (newElement !== editor && !editor.contains(newElement))) return;
    Mode.update('element');
    // if (theElement === newElement ) return; // אם האלמנט לא השתנה

    const selector = '#' + ensureElementId(newElement) + $('dropdown-states').value || '';
    theElement = newElement;

    _changeSelected(selector);
    // סמן את האלמנט הנבחר
    theElement.addClass('selected-element');
    return newElement;
}

function classSelected(className) {
    if (SelectorLock.getState()) return;
    const selector = '.' + className + $('dropdown-states').value || '';
    Mode.update('class');

    _changeSelected(selector);
    $$('.' + className).addClass('selected-element');
}

function tagSelected(tagName) {
    if (SelectorLock.getState()) return;
    const selector = tagName + $('dropdown-states').value || '';
    Mode.update('tag');
    _changeSelected(selector);
    $$(tagName).addClass('selected-element');
}

function _changeSelected(selector) {
    $$('.selected-element').removeClass('selected-element');
    Selector.update(selector);
    _updateStyles();
    if (Panel.get()) Panel.restart(Panel.get());
}

function _updateStyles() {
    switch (Mode.get()) {
        case 'element':
            theStyles = getComputedStyle(theElement)
            break;

        case 'class':
        case 'tag':
            theStyles = Style.getRuleBySelector(Selector.get()).style;
            break;
    }
}


export const Edit = {
    getElement: () => theElement,
    getStyles: () => theStyles,
    elementSelected,
    classSelected,
    tagSelected
}

//@ts-ignore
window.Edit = Edit;