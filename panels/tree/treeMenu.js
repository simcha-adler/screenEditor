import { tree } from "./tree.js";
import { showDiagnosisUI } from "./doctor.js";
import { Style } from "../../modules/styles.js"

/*=============================================
        תצוגת וניהול פעולות התפריט הנפתח
===============================================*/


function hideContextMenu() {
    $('tree-menu').addClass('hide');
}

// פונקציה גלובלית לטיפול בפעולות התפריט
function handleMenuAction(action) {
    if (!action) return;
    const theElement = Edit.getElement();

    switch (action) {
        case 'add-inside':
            Panel.update('panel-add-element');
            break;

        case 'add-after':
            // לסדר, כי עכשיו זה מוסיף לסוף האבא ולא אחרי הנבחר
            Edit.elementSelected(tree.actionDom.parentElement);
            Panel.update('panel-add-element');
            break;

        case 'delete':
            tree.dual.delete();
            break;

        case 'empty':
            if (tree.actionTree.$1('UL') && confirm('למחוק את כל האלמנטים שבתוך אלמנט זה?')) {
                editor.$$(`#${tree.actionDom.id} *`).forEach(ch => ch.remove());
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
                let displayName = tree.build.nodeName(id, theElement);
                tree.actionTree.$1('.tree-node-content').innerText = displayName;
                const rules = Array.from(Style.getRulesById(old));
                rules.forEach(rule => Style.replaceSelector(rule, '#' + id));
                Style.refreshSheet();
                Edit.elementSelected(theElement); // רענון הפאנלים עם השם החדש
            }
            break;

        case 'to-class':
            convertToClass(theElement.id);
            break;

        default:
            break;
    }
    tree.menu.hide();
};



export const menu = {
    hide: hideContextMenu,
    router: handleMenuAction,
}