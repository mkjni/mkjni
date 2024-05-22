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

    // Function to recursively sanitize the HTML
    function clean(node) {
        const children = [...node.childNodes];
        for (let child of children) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!allowedTags.includes(child.tagName)) {
                    // Replace the child with its contents
                    child.replaceWith(...child.childNodes);
                } else {
                    // Remove all attributes
                    while (child.attributes.length > 0) {
                        child.removeAttribute(child.attributes[0].name);
                    }
                    clean(child);  // Recursively clean child elements
                }
            } else if (child.nodeType === Node.TEXT_NODE) {
                // Allow text nodes
            } else {
                // Remove any other type of node
                node.removeChild(child);
            }
        }
    }

    clean(tempDiv);
    return tempDiv.innerHTML;
}
