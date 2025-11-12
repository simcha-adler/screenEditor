function buildTreeHTML(element) {
    if (element.nodeType !== 1 || element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
        return '';
    }
    const tagName = element.tagName.toLowerCase();
    const childrenHTML = Array.from(element.children).map(buildTreeHTML).join('');
    const hasChildren = element.children.length > 0;
    const isBody = tagName === 'div' && element.id === 'editor';
    const nodeClass = hasChildren ? 'tree-node ' : 'tree-node no-children';
    const nodeId = isBody ? 'editor-root' : element.tagName.toLowerCase() + Math.random().toString(36).substring(7);
    let html = `<li class="${nodeClass}" data-node-id="${nodeId}" data-tag="${tagName}" data-editor-id="${element.id || ''}">`;
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
    const treeHTML = buildTreeHTML(editor);
    treeContainer.innerHTML = `<h4>מבנה האלמנטים</h4><ul style="padding: 0;">${treeHTML}</ul>`;
}

function closeTree() {
    treeContainer.style.display = 'none';
    editPanel.style.display = 'block';
    toggleTree.innerHTML = '&#127793; עץ אלמנטים';
    updatePanel('');
}

function openTree() {
    editPanel.style.display = 'none';
    treeContainer.style.display = 'block';
    toggleTree.innerHTML = '&#128193; חזור להגדרות';
    updatePanel('tree-panel');
}

treeContainer.whenClick((e) => {
    const toggleButton = e.target.closest('.tree-toggle');
    if (toggleButton) {
        const node = toggleButton.closest('.tree-node');
        const childrenList = node.$1('.tree-children');
        if (childrenList) {
            node.toggleClass('open');
            toggleButton.innerHTML = node.classList.contains('open') ? '&#9660;' : '&#9658;';
        }
    }
    const nodeContent = e.target.closest('.tree-node-content');
    if (nodeContent) {
        const node = nodeContent.closest('.tree-node');
        $$('.tree-node').forEach(n => n.removeClass('selected'));
        node.addClass('selected');
    }
});

toggleTree.whenClick(() => {
    if (thePanel === 'tree-panel') {
        closeTree();
    } else {
        openTree();
        renderElementTree();
    }
});
