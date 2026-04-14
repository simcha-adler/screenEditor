// ===מציאת אוביקט לפי סלקטור===

/** @param {string} selector */
function $(selector) {
    return document.getElementById(selector);
}

/** @param {string} selector  */
function $$(selector) {
    return document.querySelectorAll(selector);
}

/** @param {string} selector */
function $1(selector) {
    return document.querySelector(selector);
}


/** @param {string} selector */
HTMLElement.prototype.$ = function (selector) {
    return this.querySelector('#' + selector);
}

/** @param {string} selector */
HTMLElement.prototype.$$ = function (selector) {
    return this.querySelectorAll(selector);
}

/** @param {string} selector */
HTMLElement.prototype.$1 = function (selector) {
    return this.querySelector(selector);
}

Event.prototype.upTo = function (selector) {
    return this.target.closest(selector);
}


// ===הוספת מאזין===

/**
 * @param {function} callback 
 * @returns {EventTarget}
 */
EventTarget.prototype.whenClick = function (callback) {
    this.addEventListener('click', callback);
    return this;
}

NodeList.prototype.whenClick = function (callback) {
    this.forEach(el => el.whenClick(callback));
    return this;
}

EventTarget.prototype.when = function (eventName, callback) {
    this.addEventListener(eventName, callback);
    return this;
}

NodeList.prototype.when = function (eventName, callback) {
    this.forEach(element => element.addEventListener(eventName, callback));
    return this;
}

// ===הכנסת אלמנט לתוך אלמנט אחר===

function into(parent) {
    // אפשרות שה-parent הוא סלקטור (כמו "#app")
    if (typeof parent === 'string') {
        parent = document.querySelector(parent);
    }

    // מוסיף לסוף התוכן הקיים
    if (this instanceof String) {
        parent.insertAdjacentHTML('beforeend', this);

        // אם this הוא אלמנט בודד
    } else if (this instanceof Node) {
        parent.append(this);

        // אם this הוא רשימת אלמנטים (מ-getAllElements) או מערך
    } else if (this instanceof NodeList || this instanceof HTMLCollection || Array.isArray(this)) {
        this.forEach(node => parent.append(node));
    }

    return this; // החזרת 'this' מאפשרת שרשור
}
Element.prototype.into = into;
String.prototype.into = into;
NodeList.prototype.into = into;

// ===ניהול קלאסים===

HTMLElement.prototype.addClass = function (className) {
    this.classList.add(className);
    return this;
}

NodeList.prototype.addClass = function (className) {
    this.forEach(el => el instanceof HTMLElement ? el.classList.add(className) : pass);
    return this;
}

HTMLElement.prototype.removeClass = function (className) {
    this.classList.remove(className);
    return this;
}

NodeList.prototype.removeClass = function (className) {
    this.forEach(el => el instanceof HTMLElement ? el.classList.remove(className) : pass);
    return this;
}

Node.prototype.toggleClass = function (className) {
    this.classList.toggle(className);
    return this;
}

NodeList.prototype.toggleClass = function (className) {
    this.forEach(el => el instanceof HTMLElement ? el.classList.toggle(className) : pass);
    return this;
}

// ===גישה לאטריביוטים===
HTMLElement.prototype.attr = function (name, value) {
    // אם סופק ערך, קבע אותו (setter)
    if (value !== undefined) {
        this.setAttribute(name, value);
        return this; // אפשר שרשור
    }
    // אם לא סופק ערך, החזר את הערך הקיים (getter)
    return this.getAttribute(name);
}

NodeList.prototype.attr = function (name, value) {
    this.forEach(el => el.attr(name, value));
    return this;
}

// הפעלת תהליך אינפוט מ-js, ללא קלט אמיתי
HTMLInputElement.prototype.sendInput = function (value) {
    this.value = value;
    const event = new Event('input', { bubbles: true, cancelable: true });
    this.dispatchEvent(event);
}



// ===יצירת אלמנט עם תכונות מובנות===
//  מקבלת אוביקט שמכיל זוגות של מאפיינים (כשדות) וערכים. מצורפת דוגמת שימוש

/** @param {string} tagName; @param {{}} properties */
function createElement(tagName, properties = {}) {
    const el = document.createElement(tagName);
    return updateElement(el, properties);
}

// דוגמת שימוש:
// const myButton = createElement('button', {
//     class: 'btn primary',
//     text: 'לחץ כאן',
//     id: 'submit-btn',
//     style: 'width: 100%; color: blue;'
// });

/** @param {any} element; @param {{}} properties*/
function updateElement(element, properties = {}) {
    for (const [key, value] of Object.entries(properties)) {
        if (value !== '')
            switch (key) {
                case 'class':
                    const classes = properties.class.split(" ");
                    classes.forEach(cls => { if (cls) element.addClass(cls) });
                    break;

                case 'text':
                    element.textContent += properties.text;
                    break;

                case 'in':
                    element.innerHTML += properties.in;
                    break;

                case 'style':
                    element.style.cssText += properties.style;
                    break;

                default:
                    element.setAttribute(key, value);
                    break;
            }
    }
    return element;
}