let md = window.markdownit();

function showTextFromTextareaInBlockBelow() {
    let editor = $('#editor');

    editor.on("change", () => {
        let editorValue = $('#editor').val();
        let result = md.render(editorValue);
        $('#preview').append(result);
    });
}

$(document).ready(() => {
    showTextFromTextareaInBlockBelow();
});
