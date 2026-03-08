import { tree } from "./tree.js";

/*====================================================
        פונקציות לניהול מקביל של העץ וה-dom
======================================================*/


function selectTreeNode(node) {
    const src = $(node.dataset.editorId);
    updateSelectedElement(src);

    // עדכון משתנים גלובליים
    tree.actionTree = node;
    tree.actionDom = src;

    // סימון ויזואלי בעץ
    $$('.tree-life').removeClass('selected');
    node.$1('.tree-life').addClass('selected');
}

function insertElementManager(node, parent, isTree) {
    if (!node || !parent || node === parent) return;
    let nodeTree, parentTree, nodeDom, parentDom;
    if (isTree) {
        nodeTree = node;
        parentTree = parent;
        nodeDom = $(nodeTree.dataset.editorId);
        parentDom = $(parentTree.dataset.editorId);
    } else {
        nodeTree = treePanel.$1(`.tree-node[data-editor-id=${node.id}]`);
        parentTree = treePanel.$1(`.tree-node[data-editor-id=${parent.id}]`);
        nodeDom = node;
        parentDom = parent;
        if (!nodeTree) nodeTree = tree.build.node(nodeDom);
    }

    //  אם אלמנט האב אינו יכול להכיל אלמנטים בתוכו, עבור לאלמנט האב באישור המשתמש
    const voidElements = ['IMG', 'INPUT', 'HR', 'BR', 'VIDEO'];
    if (voidElements.includes(parentDom.tagName))
        if (confirm("אין אפשרות להכניס בתוך האלמנט הנבחר. להכניס אחריו?")) {
            parentDom = parentDom.parentNode;
            parentTree = parentTree.parentNode.closest('.tree-node');
        } else return;

    // מניעת לולאות (הכנסת אבא לבן)
    if (nodeDom.contains(parentDom))
        return alert('שגיאה: לא ניתן להכניס אלמנט לתוך עצמו.');

    // הכנסה בפועל ל-dom ולעץ
    nodeDom.into(parentDom);
    tree.utils.insertNode(nodeTree, parentTree);

    // פתיחת ההורה החדש כדי שנראה את הילד שהתווסף, כולל גם את הוספת אייקון החץ.
    setTimeout(tree.utils.showChildren(parentTree), 50);
    tree.dual.select(nodeTree);
}

function removeElementManager() {
    let del = false;
    if (tree.actionDom.children.length === 0) {
        del = confirm('למחוק את האלמנט?');
    } else {
        del = confirm('למחוק את האלמנט ואת כל האלמנטים שבו?');
    }
    if (del) {
        const parent = tree.actionTree.parentNode.closest('.tree-node');
        tree.actionTree.remove();
        tree.actionDom.remove();
        tree.actionTree = null;
        tree.actionDom = null;
        tree.utils.updateHasChildren(parent);
        updateSelectedElement(null); // איפוס בחירה
    }
}

function duplicateElementManager() {
    let newName = prompt('הכנס שם לאלמנט המשוכפל (מומלץ). השאר ריק ליצירה אוטומטית', tree.actionDom.id.replaceAll('_', ' ') + '_copy');
    if (newName || newName === '') {
        newName = createSafeId(newName, tree.actionDom.tagName);
        if (!newName) return; // שם כפול!
        // שימוש בפונקציית השכפול החכמה מ-servises.js
        const newClone = cloneElementWithUniqueIds(tree.actionDom, newName);

        if (newClone) {
            // הוספה ל-DOM אחרי המקורי
            tree.actionDom.after(newClone);
            // יצירת השורות המקבילות בעץ
            const newTreeItem = tree.build.node(newClone);
            // הוספה לעץ אחרי המקורי
            if (tree.actionTree)
                tree.actionTree.after(newTreeItem);
            // עדכון בחירה
            updateSelectedElement(newClone);
        }
    }
}

export const dual = {
    select: selectTreeNode,
    add: insertElementManager,
    delete: removeElementManager,
    duplicate: duplicateElementManager
}