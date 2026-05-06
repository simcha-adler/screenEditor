//@ts-check

import { Edit } from "./edit.js";
import { SelectorLock } from "./lock.js";
import { Selector } from "./selector.js";
import { Style } from "./styles.js";


/** @type {number} - אינדקס המצב הנוכחי ברשימת המצבים */
let correctMode = 0;
const modes = ['element', 'class', 'tag'];
const dict = {
    element: toElementMode,
    class: toClassMode,
    tag: toTagMode
}



/** @returns {string} - שם המצב הנוכחי */
const getState = () => modes[correctMode];


/**
 *  @param {string} nameState - שם המצב הרצוי;
 *  @returns {boolean} - אישור עדכון
 */
function updateState(nameState) {
    if (nameState === getState()) return true;
    const index = modes.indexOf(nameState);
    if (index === -1) return false;
    correctMode = index;
    dict[getState()](); // הפעלת פונקציה לפי המוד החדש בשליפה מתוך המילון
    return true;
};

function toElementMode() {
    Edit.elementSelected(Edit.getElement());
}

function toClassMode() {
    const className = Style.getElementClasses(Edit.getElement())[0];
    if (className) { Edit.classSelected(className); return; }
    $('theElement').placeholder = 'אין עדיין קלאסים לאלמנט זה';
    Selector.update('')
}

function toTagMode() {
    Edit.tagSelected(Edit.getElement().tagName);
}

export const Mode = {
    get: getState,
    update: updateState,
}

//@ts-ignore
window.Mode = Mode;