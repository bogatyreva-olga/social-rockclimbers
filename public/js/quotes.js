import {quotes, colors} from "./quotes-data.js";

let changeBackgroundColor = () => {
    let quotePage = $(".quote");
    let randomIndexColor = Math.floor(Math.random() * colors.length);
    let currentColor = quotePage.css("background-color");

    while (currentColor === colors[randomIndexColor]) {
        randomIndexColor = Math.floor(Math.random() * colors.length);
    }
    quotePage.css("background-color", colors[randomIndexColor]);
};

$(document).ready(() => {
    changeBackgroundColor();
    $("#new-quote").click(changeBackgroundColor);
});
