/**
 * אובייקט פרטים כללי
 * @typedef {Object} Details
 * @property {string} [id]
 * @property {string} [class]
 * @property {string} [style]
 */

/**
 * @typedef {Object} objButton
 * @property {string} label
 * @property {Function} onClick
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objSwitchButton
 * @property {string} label
 * @property {string} value
 * @property {string} [class]
 */

/**
 * @typedef {Object} objDiv
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objTitle
 * @property {string} label
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objInputRow
 * @property {string} label
 * @property {UI.input} input
 * @property {Details} [details]
*/

/**
 * מעטפת לאינפוט בתוך שורה (בגריד למשל)
 * @typedef {Object} objWrapInput
 * @property {string} [label]
 * @property {UI.input} input
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objSection
 * @property {string} label
 * @property {Object[]} children
 * @property {boolean} [collapsed]
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objGrid
 * @property {Object[]} children
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objSwitcher
 * @property {objSwitchButton[]} options
 * @property {Details} [details]
 */

/*=====================
    אובייקטי אינפוט
======================*/

/*  פרטי אינפוטים לפי סוג */
/**
 * @typedef {Object} objInputBool
 * @property {string} prop
 * @property {any} v
 * @property {any} x
 * @property {boolean} [defaultValue]
 * @property {Function} [oninput]
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objInputSelect
 * @property {string} prop
 * @property {objOptions[]} options
 * @property {Function} [oninput]
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objOptions
 * @property {string} text
 * @property {string} value
 * @property {boolean} [selected]
*/

/**
 * @typedef {Object} objInputText
 * @property {string} prop
 * @property {string} [placeholder]
 * @property {string} [placeValue]
 * @property {Function} [oninput]
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objInputRange
 * @property {string} prop
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [step]
 * @property {number} [defaultValue] - ערך ברירת מחדל, שמור ב-dataset
 * @property {string} [unit]
 * @property {Function} [oninput]
 * @property {Array<objOptions>} [selectToCombinated]
 * @property {Details} [details]
*/

/**
 * @typedef {Object} objInputColor
 * @property {string} prop
 * @property {string} defaultValue
 * @property {boolean} hasGradient
 * @property {Function} [oninput]
 * @property {Details} [details]
*/

