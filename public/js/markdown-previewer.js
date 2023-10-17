let md = window.markdownit();

function showTextFromTextareaInBlockBelow() {
    let editor = $('#editor');
    let preview = $('#preview');
    editor.on("input", () => {
        $.post('/markdown-render', {md: editor.val()}, function (data) {
            preview.empty();
            preview.append(data.html);
        });
    });
}

$(document).ready(() => {
    showTextFromTextareaInBlockBelow();
});
