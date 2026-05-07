//@ts-check

/** @type {number} - אינדקס המצב הנוכחי ברשימת המצבים */
let correctMode = 0;
const modes = ['element', 'class', 'tag', 'empty'];
const dict = {
    element: toElementMode,
    class: toClassMode,
    tag: toTagMode,
    empty: toEmptyMode
}
const visual = $('visual-type-selected');
/**@type {any} */
const wrapper = $1('.segmented-control');
const idMode = wrapper.$('id-mode');
const classMode = wrapper.$('class-mode');
const tagMode = wrapper.$('tag-mode');

/** @returns {string} - שם המצב הנוכחי */
const getState = () => modes[correctMode];


/**
 *  @param {string} nameState - שם המצב הרצוי;
 *  @returns {boolean} - אישור עדכון
 */
function updateState(nameState) {
    const index = modes.indexOf(nameState);
    if (index === -1) return false;
    correctMode = index;
    dict[nameState](); // הפעלת פונקציה לפי המוד החדש בשליפה מתוך המילון
    return true;
};

function toElementMode() {
    idMode.checked = true;
    visual.style.background = 'magenta';
}

function toClassMode() {
    classMode.checked = true;
    visual.style.background = 'aqua';
}

function toTagMode() {
    tagMode.checked = true;
    visual.style.background = 'darkgreen';
}

function toEmptyMode() {
    classMode.checked = true; // כרגע זו האפשרות היחידה לסלקטור ריק, ובנוסף, אצטרך לשמור מצב קודם
    visual.style.background = '#bbb';
}

export const Mode = {
    get: getState,
    update: updateState,
}

//@ts-ignore
window.Mode = Mode;