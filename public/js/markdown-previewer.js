let md = window.markdownit();

function showTextFromTextareaInBlockBelow() {
    let editor = $('#editor');
    let preview = $('#preview');
    editor.on("input", () => {
        let editorValue = $('#editor').val();
        let result = md.render(editorValue);
        preview.empty();
        preview.append(result);
    });
    $.ajax({
        type: "POST",
        url: "/markdown-render",
    });
}

$(document).ready(() => {
    showTextFromTextareaInBlockBelow();
});
