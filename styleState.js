
/** @type {CSSStyleSheet} */
let sheet;
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
    state: state,
    getSheet: () => sheet,
    createRule: createRule,
    update: updateStyle,
    /**  שליפת הגיליון האמיתי מתוך האובייקט בזיכרון (ולא מה-HTML הריק) */
    refreshSheet: () => { sheet = Array.from(document.styleSheets).find(sheet => sheet.ownerNode.id === 'styles') },
    /** מאפס את state!! להשתמש בזהירות */
    restart: () => { state = {}; Style.state = state },
    /**@returns {CSSRule} - מחזיר חוק לפי סלקטור */
    findRules: (selector) => Array.from(sheet.cssRules).filter(rule => rule.selectorText === selector),
    /**@returns {CSSRule} - מחזיר חוק לפי סלקטור */
    findRulesById: (id) => Array.from(sheet.cssRules).filter(rule => { let d = rule.selectorText.split(':')[0]; console.log(d); return d === '#' + id }),
    /**  קריאה של כל הקלאסים הנוכחיים */
    getAllClasses: () => Array.from(sheet.cssRules).filter(rule => rule.selectorText.startsWith('.')).map(rule => rule.selectorText.split(':')[0]),
}

window.Style = Style;
