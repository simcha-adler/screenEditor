import { tree } from "./tree.js";
import { showDiagnosisUI } from "./doctor.js";

/*=============================================
        תצוגת וניהול פעולות התפריט הנפתח
===============================================*/



function showContextMenu(x, y) {
    if (!tree.actionTree) return; // למניעת קריסה במקרה תקלה
    const menu = $('tree-menu');

    menu.removeClass('hide');
    menu.style.left = (x - 150) + 'px';
    menu.style.top = y + 'px';
}

function hideContextMenu() {
    $('tree-menu').addClass('hide');
}

// פונקציה גלובלית לטיפול בפעולות התפריט
function handleMenuAction(action) {
    if (!action) return;

    switch (action) {
        case 'add-inside':
            toggleActivityPanel($1('.activity-btn[data-panel="panel-add-element"]'));
            break;

        case 'add-after':
            // לסדר, כי עכשיו זה מוסיף לסוף האבא ולא אחרי הנבחר
            updateSelectedElement(tree.actionDom.parentElement);
            toggleActivityPanel($1('.activity-btn[data-panel="panel-add-element"]'));
            break;

        case 'delete':
            tree.dual.delete();
            break;

        case 'empty':
            if (tree.actionTree.$1('UL') && confirm('למחוק את כל האלמנטים שבתוך אלמנט זה?')) {
                $$(`#${tree.actionDom.id} *`).forEach(ch => ch.remove());
                tree.utils.updateHasChildren(tree.actionTree, true);
            }
            break;

        case 'duplicate':
            tree.dual.duplicate();
            break;

        case 'diagnostic':
            showDiagnosisUI(theElement);
            break;

        case 'rename':
            const id = createSafeId(prompt('הכנס את המזהה הרצוי:  '), theElement.tagName);
            if (id) {
                const old = theElement.id;
                theElement.id = id;
                tree.actionTree.dataset.editorId = id;
                let displayName = id.replaceAll("_", " ");
                if (id.startsWith('auto_')) {
                    displayName = `<span style="opacity:0.8">${theElement.tagName.toLowerCase()}</span>`;
                }
                tree.actionTree.$1('.tree-node-content').innerText = displayName;
                const rules = Array.from(Style.getSheet().rules).filter(rule => rule.selectorText === '#' + old);
                rules.forEach(rule => rule.selectorText = '#' + id);
                Style.refreshSheet();
            }
            break;

        case 'to-class':
            const rules = Style.findRulesById(theElement.id);
            let className = prompt('הזן שם רצוי לקלאס. השאר ריק ליצירה אוטומטית (לא מומלץ):  ');
            if (!className) className = `class_${theElement.id}` + Math.random().toString(36).substring(2, 9);
            rules.forEach(rule => {
                rule.selectorText = rule.selectorText.replace('#' + theElement.id, '.' + className);
                theElement.addClass(rule.selectorText.split(':')[0].substring(1));
                Style.state[rule.selectorText] = rule;
            });

        default:
            break;
    }
    tree.menu.hide();
};



export const menu = {
    show: showContextMenu,
    hide: hideContextMenu,
    router: handleMenuAction,
}