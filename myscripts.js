function formatText(command) {
    document.execCommand(command, false, null);
}

function createList(type) {
    document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
}

function generateHTML() {
    const editorContent = document.getElementById('editor').innerText;
    const formattedHTML = convertTextToHTML(editorContent);
    const sanitizedContent = sanitizeHTML(formattedHTML);
    const output = document.getElementById('output');
    output.textContent = sanitizedContent;
}

function convertTextToHTML(input) {
    const lines = input.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            if (trimmedLine.startsWith('* ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${trimmedLine.substring(2)}</li>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                const parts = trimmedLine.split(': ');
                if (parts.length === 2) {
                    html += `<p><strong>${parts[0]}:</strong> ${parts[1]}</p>`;
                } else {
                    html += `<p>${trimmedLine}</p>`;
                }
            }
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
}

function sanitizeHTML(input) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = input;

    const allowedTags = ['P', 'STRONG', 'BR', 'UL', 'OL', 'LI'];

    function clean(node) {
        const children = [...node.childNodes];
        for (let child of children) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!allowedTags.includes(child.tagName)) {
                    child.replaceWith(...child.childNodes);
                } else {
                    while (child.attributes.length > 0) {
                        child.removeAttribute(child.attributes[0].name);
                    }
                    clean(child);
                }
            } else if (child.nodeType !== Node.TEXT_NODE) {
                node.removeChild(child);
            }
        }
    }

    clean(tempDiv);
    return tempDiv.innerHTML;
}
