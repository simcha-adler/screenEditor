function changeBlockTag(newTag) {
    const element = getSelectedElement();
    const blockElement = element.closest('p, h1, h2, h3, h4, h5, h6, pre, div');

    if (blockElement && editor.contains(blockElement) && blockElement.tagName.toLowerCase() !== newTag) {
        const newBlock = document.createElement(newTag);
        newBlock.id = blockElement.id;
        newBlock.style.cssText = blockElement.style.cssText;

        while (blockElement.firstChild) {
            newBlock.appendChild(blockElement.firstChild);
        }

        blockElement.parentNode.replaceChild(newBlock, blockElement);

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(newBlock);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        updateSelectedElement(newBlock);
    }
}

function insertNodeAtCursor(node) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        editor.appendChild(node);
        return;
    }
    const range = selection.getRangeAt(0);
    range.insertNode(node);

    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
}
