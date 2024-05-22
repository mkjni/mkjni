function formatText(command) {
    document.execCommand(command, false, null);
}

function createList(type) {
    document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
}

function generateHTML() {
    const editorContent = document.getElementById('editor').innerHTML;
    const sanitizedContent = sanitizeHTML(editorContent);
    const output = document.getElementById('output');
    output.textContent = sanitizedContent;
}

function sanitizeHTML(input) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = input;

    const allowedTags = ['P', 'STRONG', 'BR', 'UL', 'OL', 'LI'];
    const elements = tempDiv.getElementsByTagName('*');

    for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (!allowedTags.includes(el.tagName)) {
            el.parentNode.removeChild(el);
        } else {
            // Remove all attributes
            for (let j = el.attributes.length - 1; j >= 0; j--) {
                el.removeAttribute(el.attributes[j].name);
            }
        }
    }

    return tempDiv.innerHTML;
}
