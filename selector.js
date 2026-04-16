//@ts-check

let correctSelector = '';
const states = ['element', 'class'];

/** @type {number} - אינדקס המצב הנוכחי ברשימת המצבים */
let correctState = 0;

let lock = false;

/** @returns {string} - שם המצב הנוכחי */
const getState = () => { return states[correctState] };

/**
 *  @param {string} nameState - שם המצב הרצוי;
 *  @returns {boolean} - אישור עדכון
 */
function updateState(nameState) {
    const index = states.findIndex(state => nameState === state);
    if (index === -1) return false;
    correctState = index;
    // if (states[correctState] === 'class') lockTheElement();
    // else if (states[correctState] === 'element') unlockTheElement();
    return true;
};

function lockSelector() { lock = true; $1('.lockLabel').innerHTML = '🔒'; $('lock').checked = true; };
function unlockSelector() { lock = false; $1('.lockLabel').innerHTML = '🔓'; $('lock').checked = false; };
function isLocked() { return lock; };

/** @returns {string} */
function getSelector() { return correctSelector };

/** @param {string} selector; @returns {boolean} - אישור עדכון */
function updateSelector(selector) {
    // לוגיקת בדיקת תקינות כאן
    correctSelector = selector;
    return true;
};


export const Selector = {
    get: getSelector,
    update: updateSelector,
    getState: getState,
    updateState: updateState,
    lock: lockSelector,
    unlock: unlockSelector,
    isLocked: isLocked
}

//@ts-ignore
window.Selector = Selector;