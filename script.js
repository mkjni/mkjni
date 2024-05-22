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
    const prettyHTML = formatHTML(sanitizedContent);
    const output = document.getElementById('output');
    output.textContent = prettyHTML;
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
                    html += '<ul>\n';
                    inList = true;
                }
                html += `  <li>${trimmedLine.substring(2)}</li>\n`;
            } else {
                if (inList) {
                    html += '</ul>\n';
                    inList = false;
                }
                const parts = trimmedLine.split(': ');
                if (parts.length === 2) {
                    html += `<p><strong>${parts[0]}:</strong> ${parts[1]}</p>\n`;
                } else {
                    html += `<p>${trimmedLine}</p>\n`;
                }
            }
        }
    });

    if (inList) {
        html += '</ul>\n';
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

function formatHTML(html) {
    const formatted = html.replace(/>\s+</g, '>\n<');
    const lines = formatted.split('\n');
    let level = 0;
    return lines.map(line => {
        if (line.match(/<\/\w+/)) level--;
        const indent = '  '.repeat(level);
        if (line.match(/<\w[^>]*[^\/]>/)) level++;
        return indent + line;
    }).join('\n');
}

function copyHTML() {
    const output = document.getElementById('output').textContent;
    navigator.clipboard.writeText(output).then(() => {
        alert('HTML code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

