document.getElementById("convertButton").addEventListener("click", function() {
    const textInput = document.getElementById("textInput").value;
    const htmlOutput = textToHTML(textInput);
    document.getElementById("htmlOutput").textContent = htmlOutput;
});

function textToHTML(text) {
    let html = "";
    let inList = false;
    let listType = null;

    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
            continue;
        }

        if (line.startsWith("- ")) {
            if (!inList) {
                html += "<ul>";
                inList = true;
                listType = "ul";
            }
            html += "<li>" + line.slice(2) + "</li>";
        } else if (/^(\d+)\. /.test(line)) {
            if (!inList) {
                html += "<ol>";
                inList = true;
                listType = "ol";
            }
            html += "<li>" + line.slice(line.indexOf(".") + 2) + "</li>";
        } else {
            if (inList) {
                html += "</" + listType + ">";
                inList = false;
            }
            html += "<p>";
            const words = line.split(" ");
            for (let j = 0; j < words.length; j++) {
                const word = words[j];
                if (word.startsWith("*") && word.endsWith("*")) {
                    html += "<strong>" + word.slice(1, -1) + "</strong> ";
                } else {
                    html += word + " ";
                }
            }
            html += "</p>";
        }
    }

    if (inList) {
        html += "</" + listType + ">";
    }

    return html;
}
