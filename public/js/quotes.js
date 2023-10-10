import {quotes} from "./quotes-data.js";

let changeBackgroundColor = () => {

    $.ajax({
        url: '/random-colors',
        type: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data) {
            let hex = data.value;
            let quotePage = $(".quote");
            let nextColorBtn = $("#new-quote");

            let currentColor = quotePage.css("background-color");

            quotePage.css({
                'background-color': hex,
                'color': hex,
                'transition': 'all 1.5s'
            });

            nextColorBtn.css({
                "background-color": hex,
                'transition': 'all 1.5s'
            });
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
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
    $(".fa-quote-left").hide().fadeIn(1200);
    textQuote.hide().fadeIn(1200);
    authorQuote.hide().fadeIn(1200);

    return [textQuote.text(newQuote), authorQuote.text(newAuthor)];
};

let disableBtn = () => {
    $("#new-quote").attr("disabled", "disabled");
    setTimeout(() => {
        $("#new-quote").removeAttr("disabled");
    }, 1000);
};

$(document).ready(() => {
    showNewQuote();
    changeBackgroundColor();
    $("#new-quote").click(changeBackgroundColor);
    $("#new-quote").click(showNewQuote);
    $("#new-quote").click(disableBtn);
});
