
// שינוי קצב האנימציה אוטומטית אם אין קצב, כדי שהאנימציה תופעל
$('panel-animations').when('input', (e) => {
    /** @type {HTMLInputElement} */
    const dur = $('animationDuration');
    if (dur.value === '0' && e.target.id !== 'animationDuration') {
        dur.sendInput('1'); // מעדכן את תיבת הקלט ושולח אירוע אינפוט
    }
});






function toggleGradient() {
    const hide = $('gradientDiv').style.display === 'none';
    $('gradientDiv').style.display = hide ? 'block' : 'none';
}

// להוסיף את יחידות הגרדיאנט בסכמה, ולצרף את המאזין לשם.
function loadDesignListeners() {
    $('gradientBtn').whenClick(toggleGradient);
}

function buildDesignPanel() {
    const inputs = $$('.color-picker-wrapper')
    // שליחת הסלקטור הנוכחי
    const selector = Selector.get(); // (פונקציית עזר שקיימת ב-borders.js וצריך להנגיש אותה)


    inputs.forEach(container => {
        const picker = createColorPicker(selector, 'color');
        container = container.parentNode;
        container.children[1].remove();
        container.appendChild(picker);
    });
}
