//@ts-check

let correctSelector = '';

/** @returns {string} */
function getSelector() { return correctSelector };

/** @param {string} selector; @returns {boolean} - אישור עדכון */
function updateSelector(selector) {
    if (!selector) emptySelector();
    else if (!correctSelector) unemptySelector(); // הסלקטור הקודם היה ריק ולכן הכל מוקפא
    correctSelector = selector;
    if (selector.startsWith('.') || selector.startsWith('#')) selector = selector.substring(1);
    $('theElement').value = selector.replaceAll('_', ' ');
    return true;
};

function emptySelector() {
    $$('.inertable').forEach(
        /**@param {HTMLElement} panel */
        panel => panel.inert = true
    );
}

function unemptySelector() {
    $$('.inertable').forEach(
        /**@param {HTMLElement} panel */
        panel => panel.inert = false
    );
}

export const Selector = {
    get: getSelector,
    update: updateSelector,
}

//@ts-ignore
window.Selector = Selector;