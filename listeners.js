// import { tree } from "./panels/tree/tree";

function loadDocumentListeners() {

    /**
 * מאזין האירועים הראשי לזיהוי האלמנט הנבחר.
 */
    editor.whenClick((e) => {
        let selected = e.target;
        if (selected === theElement)
            selected = selected.parentNode;
        updateSelectedElement(selected);
    });

    $('selectedElement').when('input', (e) => { updateSelectedElement($(e.target.value)) });


    $('menu').whenClick((e) => {
        e.stopPropagation();
        e.upTo('#menu').$1('.dropdown-menu').toggleClass('collapsed');
    });

    document.whenClick((e) => {
        tree.menu.hide();
        // if (!e.upTo('#menu')) $1('.dropdown-menu').addClass('collapsed'); // תפריט המבורגר
        $$('.popup').forEach(el => { if (!el.contains(e.target)) el.remove() });
        $$('.hidable').forEach(el => { if (!el.contains(e.target)) el.addClass('hide') });
        $$('.collapsedable').forEach(el => { if (!el.contains(e.target)) el.addClass('collapsed') });
    });

    // בשינוי ערכי צל, תופס את האירוע ובונה את כל הערכים הנדרשים לצל מתוך השדות
    // לבדוק איך לעשות את זה, כי הוא לא נותן לשנות את הטארגט. לשנות גם בבילד בחלק של הקלט המשולב
    $('shadow').when('input', (e) => {
        let shadowStr = '';
        const inputs = /*$('shadow')*/this.$$('INPUT');
        inputs.forEach(input => shadowStr += ' ' + (input.value || 0) + (input.unit || ''));
        $('shadow').value = shadowStr.slice(1);
        // e.stopPropagation();
        // $('shadow').inputMode();
        // e.target = $('shadow');
        // e.target.value = shadowStr;
    });
}

const designListeners = (e) => {
    if (!theElement) return;

    //  קבע את הסלקטור
    const state = $('dropdown-states').value; // ':hover', ':focus' או ""
    const selector = '#' + theElement.id + state; // '#כותרת-לדוגמא:hover'
    const input = e.target;
    const data = input.dataset;

    let prop = data.property;
    const unit = input.unit || ''; // למשל 'px'
    let value = input.value;

    if (input.type === 'checkbox') {
        value = input.checked ? data.v : data.x;
    }

    if (prop === 'gradient') {
        prop = 'background'
        value = `linear-gradient(${$('deg').value}deg, ${$('gradient1').value}, ${$('gradient2').value})`;
    }

    if (prop?.startsWith('boxShadow')) {
        // 1. קריאת המצב *הנוכחי* של האלמנט (כדי לא לאבד את ה-X אם שינינו את ה-Y)
        const currentComputed = getComputedStyle(theElement).boxShadow;
        const currentParts = ShadowParser.parse(currentComputed);

        // 2. הרכבת המחרוזת החדשה עם הערך שהשתנה כרגע
        const newBoxShadowString = ShadowParser.assemble(currentParts, prop, value);

        // 3. שליחת הפקודה האמיתית למערכת (מעדכנים את 'boxShadow' הכללי)
        updateStyle(selector, 'boxShadow', newBoxShadowString);
        return;
    }


    if (prop && selector)
        updateStyle(selector, prop, value + unit);
};
