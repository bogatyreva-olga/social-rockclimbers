import {quotes, colors} from "./quotes-data.js";

let changeBackgroundColor = () => {
    let quotePage = $(".quote");
    let nextColorBtn = $("#new-quote")
    let randomIndexColor = Math.floor(Math.random() * colors.length);
    let currentColor = quotePage.css("background-color");

    while (currentColor === colors[randomIndexColor]) {
        randomIndexColor = Math.floor(Math.random() * colors.length);
    }
    quotePage.css("background-color", colors[randomIndexColor]);
    quotePage.css("color", colors[randomIndexColor]);
    nextColorBtn.css("background-color", colors[randomIndexColor])
};

let showNewQuote = () => {
    let textQuote = $("#text");
    let authorQuote = $("#author");
    let randomIndexQuote = Math.floor(Math.random() * quotes.length);
    let currentQuote = textQuote.text();

    while (currentQuote === quotes[randomIndexQuote].text) {
        randomIndexQuote = Math.floor(Math.random() * quotes.length);
    }
    let newAuthor = quotes[randomIndexQuote].author;
    let newQuote = quotes[randomIndexQuote].text;
    return [textQuote.text(newQuote), authorQuote.text(newAuthor)];
};

$(document).ready(() => {
    showNewQuote();
    changeBackgroundColor();
    $("#new-quote").click(changeBackgroundColor);
    $("#new-quote").click(showNewQuote);
});
