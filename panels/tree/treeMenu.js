import { tree } from "./tree.js";
import { showDiagnosisUI } from "./doctor.js";

/*=============================================
        תצוגת וניהול פעולות התפריט הנפתח
===============================================*/



function showContextMenu(x, y) {
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