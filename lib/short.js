// ===מציאת אוביקט לפי סלקטור===

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// ===הוספת מאזין===

function whenClick(callback) {
    this.addEventListener('click', callback);
    return this;
}
Element.prototype.whenClick = whenClick;
Document.prototype.whenClick = whenClick;

NodeList.prototype.whenClick = function (callback) {
    this.forEach(el => el.whenClick(callback));
    return this;
}

Element.prototype.when = function (eventName, callback) {
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

    // אם this הוא מחרוזת (לטקסט או HTML)
    if (typeof this === 'string') {
        parent.innerHTML = this;

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

Element.prototype.addClass = function (className) {
    this.classList.add(className);
    return this;
}

NodeList.prototype.addClass = function (className) {
    this.forEach(el => el.addClass(className));
    return this;
}

Element.prototype.removeClass = function removeClass(className) {
    this.classList.remove(className);
    return this;
}

NodeList.prototype.removeClass = function (className) {
    this.forEach(el => el.removeClass(className));
    return this;
}

Element.prototype.toggleClass = function toggleClass(className) {
    this.classList.toggle(className);
    return this;
}

NodeList.prototype.toggleClass = function (className) {
    this.forEach(el => el.toggleClass(className));
    return this;
}

// ===גישה לאטריביוטים===
Element.prototype.attr = function attr(name, value) {
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

// ===יצירת אלמנט עם תכונות מובנות===

// מקבלת אוביקט עם שדות אופציונליים: קלאס, טקסט, ואוביקט
//  attrs
//  שמכיל זוגות של מאפיינים (כשדות) וערכים. מצורפת דוגמת שימוש

function createElement(tagName, options = {}) {
    const el = document.createElement(tagName);

    // הוספת קלאסים
    if (options.class) {
        el.className = options.class; // אפשר גם .classList.add(options.class)
    }

    // הוספת תוכן
    if (options.text) {
        el.textContent = options.text;
    }

    // הוספת מאפיינים אחרים (id, src, href וכו')
    if (options.attrs) {
        for (const [key, value] of Object.entries(options.attrs)) {
            el.setAttribute(key, value);
        }
    }

    return el;
}

// דוגמת שימוש:
// const myButton = createElement('button', {
//     class: 'btn primary',
//     text: 'לחץ כאן',
//     attrs: { id: 'submit-btn' }
// });
