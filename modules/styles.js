//@ts-check

import { StyleSheet } from './styleSheet.js';

/** אובייקט קיצור דרך לחוקים למניעת חיפוש בכל פעם */
let stylesList = {};

// באתחול דף, כדאי להפנות ליצירת חוק ולא לווידוא חוק כדי לחסוך פעולות (O(N) במקום O(n^2)).
// לבדוק איך לעשות את זה

/** @param {string} selector; @returns {CSSRule} */
function ensureRule(selector) {
    if (!stylesList[selector]) {
        const rule = StyleSheet.ensureRule(selector);
        if (!rule) return null;
        stylesList[selector] = rule;
    }
    return stylesList[selector];
};

function createRule(selector) {
    const rule = StyleSheet.createRule(selector);
    stylesList[selector] = rule;
    return rule;
}

/**
 * מוחק חוק עיצוב מכל המערכת ומחזיר אותו (לאפשר ביטול הפעולה)
 * @param {string} selector
 * @returns {{rule: CSSRule, nodes: NodeListOf<Element>} | null} 
 */
function deleteRule(selector) {
    const result = StyleSheet.deleteRule(selector);
    if (!result.success) return null;

    if (stylesList[selector]) delete stylesList[selector];
    const nodes = $$(selector)
    nodes.removeClass(selector);

    return { rule: result.rule, nodes };
}

/**
 * מעדכנת ערכי עיצוב בגיליון css
 * @param {string} selector 
 * @param {string} prop 
 * @param {string} value 
 */
function updateStyle(selector, prop, value) {
    let rule = stylesList[selector];
    // אם אין עדיין חוק כזה, צור אותו.
    if (!rule) rule = ensureRule(selector);

    if (rule) rule.style[prop] = value;
};


/**
 * מחליף סלקטור לחוק
 * @param {CSSRule} rule 
 * @param {string} newName 
 * @returns {CSSRule} 
 */
function replaceSelector(rule, newName) {
    stylesList[newName] = rule;
    delete stylesList[rule.selectorText];
    rule.selectorText = newName;
    return rule;
}

/**
 * מחבר חוק קיים לרשימה
 * @param {CSSRule} rule
 * @returns {CSSRule} 
 */
function connectRule(rule) {
    stylesList[rule.selectorText] = rule;
    return rule;
}

/**
 * מנתק חוק מהרשימה
 * @param {string} selector 
 */
function reconnectRule(selector) {
    delete stylesList[selector];
}

/**
 * מחבר את כל החוקים בגיליון לרשימה
 */
function connectAllRules() {
    Array.from(StyleSheet.getAllRules()).forEach(rule => stylesList[rule.selectorText] = rule);
}

/**
 * מחזיר חוק לפי סלקטור מדויק. אם אין, יוצר ומחזיר 
 * @param {string} selector 
 * @returns {CSSRule | null}
 */
function getRuleBySelector(selector) {
    let rule = stylesList[selector];
    if (!rule) rule = ensureRule(selector);
    return rule;
}

export const Style = {
    createRule,
    ensureRule,
    deleteRule,
    connectRule,
    reconnectRule,
    connectAllRules,
    refreshSheet: StyleSheet.refresh,

    getCssText: StyleSheet.getCssText,
    getRuleBySelector,
    getRulesById: StyleSheet.getRulesById,
    getAllClasses: StyleSheet.getAllClasses,
    hasRule: (selector) => stylesList[selector] !== undefined,
    replaceSelector,
    update: updateStyle,
    /** מאפס את stylesList!! להשתמש בזהירות */
    restart: () => { stylesList = {}; Style.stylesList = stylesList },
}

//@ts-ignore
window.Style = Style;
