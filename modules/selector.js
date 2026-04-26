//@ts-check

let correctSelector = '';

/** @returns {string} */
function getSelector() { return correctSelector };

/** @param {string} selector; @returns {boolean} - אישור עדכון */
function updateSelector(selector) {
    // לוגיקת בדיקת תקינות כאן
    correctSelector = selector;
    // שינויים בעקבות שינוי הסלקטור כאן
    $('theElement').value = selector.replaceAll('_', ' ');
    return true;
};


export const Selector = {
    get: getSelector,
    update: updateSelector,
}

//@ts-ignore
window.Selector = Selector;