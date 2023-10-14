function showTextFromTextareaInBlockBelow() {
let editor = $('#editor');

editor.on("change", () => {
    let editorValue = $('#editor').val();
    $('#preview').append(editorValue);
})
}

$(document).ready(() => {
    showTextFromTextareaInBlockBelow()
})
