function formatText(command) {
    document.execCommand(command, false, null);
}

function createList(type) {
    document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
}

function generateHTML() {
    const editorContent = document.getElementById('editor').innerHTML;
    const output = document.getElementById('output');
    output.textContent = editorContent;
}
