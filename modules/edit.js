//@ts-check

import { Selector } from "./selector.js";
import { SelectorLock } from "./lock.js";
import { Style } from "./styles.js";
import { Mode } from "./mode.js";
import { Panel } from "./panel.js";

let theElement = null;
let theStyles = null;
// @ts-ignore
let selectedRule;
/**@type {any} */
const state = $('dropdown-states');

/**
 * משנה את הסלקטור של חוק סימון האלמנט הנבחר
 */
function _changeSelectorRule(selector) {
    if (!selectedRule)
        // @ts-ignore
        selectedRule = Array.from(editorDoc.styleSheets).find(sheet => sheet.ownerNode.id === 'selected_element').cssRules[0];
    selectedRule.selectorText = selector; // אם נהרסה ההפניה - היא תתוקן בגישה הבאה לחוק
}

function elementSelected(newElement = editor) {
    if (!_isLocked()) {
        Mode.update('element');
        const selector = '#' + ensureElementId(newElement) + state.value || '';
        theElement = newElement;

        theStyles = getComputedStyle(theElement)
        _changeSelectorRule('#' + newElement.id)
        _changeSelected(selector);
    }
}

function classSelected(className) {
    if (!_isLocked()) {
        const selector = '.' + className + state.value || '';
        Mode.update('class');

        theStyles = Style.getRuleBySelector(selector).style;
        _changeSelectorRule('.' + className);
        _changeSelected(selector);
    }
}

function _emptySelected() {
    if (!_isLocked()) {
        Mode.update('empty');
        theStyles = {};
        _changeSelectorRule('srak123srak456srak789');
        _changeSelected('');
    }
}

function tagSelected(tagName) {
    if (!_isLocked()) {
        const selector = tagName + state.value || '';
        Mode.update('tag');
        theStyles = Style.getRuleBySelector(selector).style;
        _changeSelectorRule(tagName);
        _changeSelected(selector);
    }
}

function _isLocked() {
    const locked = SelectorLock.getState();
    if (locked) Mode.update(Mode.get()); // אם נעול, החזר את הסימון למצב הקודם כי הוא לא השתנה
    return locked;
}

/**@param {string} selector */
function _changeSelected(selector) {
    Selector.update(selector);
    if (Panel.get()) Panel.restart(Panel.get());
}

state.when('change', () => {
    dict[Mode.get()]();
})

const dict = {
    element: () => elementSelected($(Selector.get())),
    class: () => classSelected(Selector.get()),
    tag: () => tagSelected(Selector.get())
}

/**
 * @param {string} mode 
 */
function changeMode(mode) {
    if (!_isLocked()) {
        switch (mode) {
            case 'element':
                elementSelected(Edit.getElement());
                break;
            case 'class':
                const className = Style.getElementClasses(Edit.getElement())[0];
                if (!className) {
                    _emptySelected();
                    $('theElement').placeholder = 'אין עדיין קלאסים לאלמנט זה';
                } else {
                    classSelected(className);
                }
                break;
            case 'tag':
                tagSelected(Edit.getElement().tagName);
                break;
        }
    }
}

export const Edit = {
    /**@returns {HTMLElement} */
    getElement: () => theElement,
    getStyles: () => theStyles,
    elementSelected,
    classSelected,
    tagSelected,
    changeMode
}

//@ts-ignore
window.Edit = Edit;