function formatText(command) {
    document.execCommand(command, false, null);
}

function createList(type) {
    document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
}

function generateHTML() {
    const editorContent = document.getElementById('editor').innerText;
    const formattedHTML = convertTextToHTML(editorContent);
    const output = document.getElementById('output');
    output.textContent = formattedHTML;
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
