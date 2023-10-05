import {quotes, colors} from "./quotes-data.js";

let changeBackgroundColor = () => {
    let quotePage = $(".quote");
    quotePage.css("background-color", () => {
        let randomIndexColor = Math.floor(Math.random() * colors.length);
        return colors[randomIndexColor];
    });
};

let changeNewQuote = () => {
let textQuote = $("#text");
let randomIndexQuote = Math.floor(Math.random() * quotes.length);

}

$(document).ready(() => {
    $("#new-quote").click(changeBackgroundColor);
    $("#new-quote").click(changeNewQuote);
});
