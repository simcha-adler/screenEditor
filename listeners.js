// import { tree } from "./panels/tree/tree";

function loadDocumentListeners() {

    /**
 * מאזין האירועים הראשי לזיהוי האלמנט הנבחר.
 */
    editor.whenClick((e) => {
        let selected = e.target;
        if (selected === Edit.getElement())
            selected = selected.parentNode;
        Edit.elementSelected(selected);
    });

    $('selectedElement').when('input', (e) => { Edit.elementSelected($(e.target.value)) });// בחירת אלמנט מתיבת הקלט. לא ממומש כרגע


    $('menu').whenClick((e) => {
        e.stopPropagation();
        e.upTo('#menu').$1('.dropdown-menu').toggleClass('collapsed');
    });

    // עדכון שדות הקלט בפאנל הוספת אלמנט לפי הרכיב הנבחר
    $('elementTypeSelect').when('input', () => renderDynamicFields($('elementTypeSelect').value));;

    // מחיקת, העלמת וגלילת תפריטים בעת לחיצה
    document.whenClick((e) => {
        tree.menu.hide();
        $$('.popup').forEach(el => { if (!el.contains(e.target)) el.remove() });
        $$('.hidable').forEach(el => { if (!el.contains(e.target)) el.addClass('d-none') });
        $$('.collapsedable').forEach(el => { if (!el.contains(e.target)) el.addClass('collapsed') });
    });

    // בשינוי ערכי צל, תופס את האירוע ובונה את כל הערכים הנדרשים לצל מתוך השדות
    $('shadow').when('input', (e) => {
        e.stopPropagation();
        let shadowStr = '';
        const inputs = /*$('shadow')*/this.$$('INPUT');
        inputs.forEach(input => shadowStr += ' ' + (input.value || 0) + (input.dataset.unit || ''));
        $('shadow').$1('demoInput').sendValue(shadowStr.slice(1));
    });

    $('lockSelector').when('input', () => {
        if ($('lock').checked === true) SelectorLock.on();
        else SelectorLock.off();
    });


    sidebar.whenClick((e) => {
        const btn = e.upTo('.activity-btn');
        if (btn) Panel.update(btn.dataset.panel, btn);
    });


    // שינוי קצב האנימציה אוטומטית אם אין קצב, כדי שהאנימציה תופעל
    $('panel-animations').when('input', (e) => {
        /** @type {HTMLInputElement} */
        const dur = $('animationDuration');
        if (dur.value === '0' && e.target.id !== 'animationDuration') {
            dur.sendInput('1'); // מעדכן את תיבת הקלט ושולח אירוע אינפוט
        }
    });

    // שינוי סוג הסלקטור הנערך
    $1('.segmented-control').when('change', (e) => { Mode.update(e.target.value) });
}

const designListeners = (e) => {
    const selector = Selector.get();
    const theElement = Edit.getElement();
    if (!selector) return;

    const input = e.target;
    const data = input.dataset;

    let prop = data.property;
    const unit = input.dataset.unit || ''; // למשל 'px'
    let value = input.value;

    if (input.type === 'checkbox') {
        value = input.checked ? data.v : data.x;
    }

    if (prop?.startsWith('boxShadow')) {
        // 1. קריאת המצב *הנוכחי* של האלמנט (כדי לא לאבד את ה-X אם שינינו את ה-Y)
        const currentComputed = getComputedStyle(theElement).boxShadow;
        const currentParts = ShadowParser.parse(currentComputed);

        // 2. הרכבת המחרוזת החדשה עם הערך שהשתנה כרגע
        const newBoxShadowString = ShadowParser.assemble(currentParts, prop, value);

        // 3. שליחת הפקודה האמיתית למערכת (מעדכנים את 'boxShadow' הכללי)
        Style.update(selector, 'boxShadow', newBoxShadowString);
        return;
    }


    if (prop && selector)
        Style.update(selector, prop, value + unit);
};
