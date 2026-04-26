//@ts-check

import { SelectorLock } from "./lock.js";


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
    SelectorLock.off();
}

function toClassMode() {
    SelectorLock.on();
}

function toTagMode() {
    SelectorLock.on();
}

export const Mode = {
    get: getState,
    update: updateState,
}

//@ts-ignore
window.Mode = Mode;