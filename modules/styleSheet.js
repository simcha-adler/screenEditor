//@ts-check

/** @type {CSSStyleSheet} */
let sheet;

/**
* יוצר חוק ומחזיר אותו.
* זהירות!! אם יש כבר חוק כזה ייווצר חוק נוסף חלש יותר!! לשימוש באתחול או אחרי בדיקה בלבד!!
* @param {string} selector
* @returns {CSSRule | null}
*/
function createRule(selector) {
    try {
        let index = sheet.insertRule(`${selector} {}`);
        return sheet.cssRules[index]; // החזר את החוק החדש שנוצר
    } catch (e) {
        console.error("שגיאה ביצירת חוק CSS:", e, selector);
        return null;
    }
}

/**
 * מחזיר חוק לפי סלקטור. אם החוק לא קיים - יוצר אוביקט CSSRule תואם, ומחזיר אותו.
 * @param {string} selector
 * @returns {CSSRule | null}
 */
function ensureRule(selector) {
    // אם קיים כבר
    const rule = Array.from(sheet.cssRules).find(r => r.selectorText === selector);
    if (rule) return rule;

    // אחרת - צור חוק והחזר אותו
    return createRule(selector);
};


/**
 * מחיקת חוק עיצוב מהגיליון
 * @param {string} selector 
 * @returns {{rule: CSSRule, success: boolean}} - האם נמצא ונמחק החוק, והחוק עצמו 
 */
function deleteRule(selector) {
    let rule;
    let index = -1;
    for (let i = 0; i < sheet.cssRules.length; i++) {
        if (sheet.cssRules[i].selectorText === selector) {
            rule = sheet.cssRules[i]; index = i; break;
        }
    }
    if (index === -1) return { rule: null, success: false };
    sheet.deleteRule(index);
    return { rule, success: true };
}

/** רענון ההפניה לגיליון */
function refreshSheet() {
    // @ts-ignore
    sheet = Array.from(document.styleSheets).find(sheet => sheet.ownerNode.id === 'styles')
}


/**
 * מחזיר את כל החוקים לפי id 
 * @param {string} id 
 * @returns {CSSRule[]}
*/
function findRulesById(id) {
    return Array.from(sheet.cssRules).filter(rule => {
        let d = rule.selectorText.split(':')[0];
        return d === '#' + id;
    });
}

/**
 * מחזיר את כל הקלאסים הקיימים בגיליון
 * @returns {string[]} 
 */
function getAllClasses() {
    return Array.from(sheet.cssRules).filter(rule =>
        rule.selectorText.startsWith('.')
    ).map(rule =>
        rule.selectorText.substring(1).split(':')[0]
    )
}

/**
 * מחזיר את כל הגיליון כטקסט
 * @returns {string}
 */
function getCssText() {
    let text = '';
    Array.from(sheet.cssRules).forEach(rule => text += rule.cssText)
    return text;
    return Array.from(sheet.cssRules).map(rule => rule.cssText).join('/n');
}

/**
 * מחזיר מערך עם כל החוקים בגיליון
 * @returns {CSSRuleList}
 */
function getAllRules() { return sheet.cssRules; }


/** אחראי על תקשורת עם גיליון העיצוב */
export const StyleSheet = {
    createRule,
    ensureRule,
    deleteRule,
    refresh: refreshSheet,
    getCssText,
    getRulesById: findRulesById,
    getAllClasses,
    getAllRules
}
