
/** @type {CSSStyleSheet} */
let sheet = $('styles').sheet;
let state = {};

/** @param {string} selector; @returns {CSSRule} */
function createRule(selector) {
    if (!state[selector]) {
        let rule;
        rule = Array.from(sheet.cssRules).find(r => r.selectorText === selector);
        if (!rule) rule = insertNewRule(selector);
        state[selector] = rule;
        return rule;
    }
    return state[selector];
};

/**
 * מעדכנת ערכי עיצוב בגיליון css
 * @param {string} selector 
 * @param {string} prop 
 * @param {string} value 
 */
function updateStyle(selector, prop, value) {
    let rule = state[selector];
    // אם אין עדיין חוק כזה, צור אותו.
    if (!rule) rule = createRule(selector);

    if (rule) rule.style[prop] = value;
};

/**
 * מקבל סלקטור, יוצר אוביקט CSSRule תואם, ומחזיר אותו.
 * @param {string} selector
 * @returns {CSSRule | null}
 */
function insertNewRule(selector) {
    try {
        let index = sheet.insertRule(`${selector} {}`);
        return sheet.cssRules[index]; // החזר את החוק החדש שנוצר
    } catch (e) {
        console.error("שגיאה ביצירת חוק CSS:", e, selector);
        return null;
    }
};

export const Style = {
    sheet: sheet,
    state: state,
    createRule: createRule,
    update: updateStyle,
    refreshSheet: () => { sheet = $('styles').sheet; },
    /** מאפס את state!! להשתמש בזהירות */
    restart: () => { state = {}; }
}

window.Style = Style;
window.sheet = sheet;