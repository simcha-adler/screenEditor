function buildTreeHTML(elem) {
    if (elem.nodeType !== 1 || elem.tagName === 'SCRIPT' || elem.tagName === 'STYLE') {
        return '';
    }
    const tagName = elem.tagName.toLowerCase();
    const childrenHTML = Array.from(elem.children).map(buildTreeHTML).join('');
    const hasChildren = elem.children.length > 0;
    const isBody = tagName === 'div' && elem.id === 'editor';
    const nodeClass = hasChildren ? 'tree-node ' : 'tree-node no-children';
    const nodeId = isBody ? 'editor-root' : elem.tagName.toLowerCase() + Math.random().toString(36).substring(7);
    let html = `<li class="${nodeClass}" data-node-id="${nodeId}" data-tag="${tagName}" data-editor-id="${elem.id || ''}">`;
    const toggleIcon = hasChildren ? '&#9660;' : '';
    html += `<span class="tree-toggle" data-toggle-id="${nodeId}">${toggleIcon}</span>`;
    html += `<span class="tree-node-content">${isBody ? 'BODY (Editor)' : tagName.toUpperCase()}</span>`;
    if (hasChildren) {
        html += `<ul class="tree-children">${childrenHTML}</ul>`;
    }
    html += `</li>`;
    return html;
}

function renderElementTree() {
    designPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    treeContainer.style.display = 'block';
    const treeHTML = buildTreeHTML(editor);
    treeContainer.innerHTML = `<h4>מבנה האלמנטים</h4><ul style="padding: 0;">${treeHTML}</ul>`;
}

treeContainer.whenClick((e) => {
    const toggleButton = e.target.closest('.tree-toggle');
    if (toggleButton) {
        const node = toggleButton.closest('.tree-node');
        const childrenList = node.querySelector('.tree-children');
        if (childrenList) {
            node.classList.toggle('open');
            toggleButton.innerHTML = node.classList.contains('open') ? '&#9660;' : '&#9658;';
        }
    }
    const nodeContent = e.target.closest('.tree-node-content');
    if (nodeContent) {
        const node = nodeContent.closest('.tree-node');
        $$('.tree-node').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
    }
});

toggleTree.whenClick(() => {
    const isVisible = treeContainer.style.display === 'block';
    if (isVisible) {
        treeContainer.style.display = 'none';
        showDesignPanel('default');
        toggleTree.innerHTML = '&#127793; עץ אלמנטים';
    } else {
        renderElementTree();
        toggleTree.innerHTML = '&#128193; חזור להגדרות';
    }
});
