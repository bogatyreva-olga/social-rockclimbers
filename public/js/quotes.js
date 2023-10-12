let changeBackgroundColor = () => {
    const dataColorId = "data-colorId";

    let quotePage = $(".quote");

    let currentColorId = quotePage.attr(dataColorId);
    let requestColorId = "";

    if (currentColorId !== undefined) {
        requestColorId = "?excludeId=" + currentColorId;
    }

    $.ajax({
        url: `/random-colors${requestColorId}`,
        type: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data) {
            let hex = data.value;
            let currentIdColor = data.id;
            let nextColorBtn = $("#new-quote");
            quotePage.attr(dataColorId, currentIdColor);
            quotePage.css({
                'background-color': hex,
                'color': hex,
                'transition': 'all 1.5s'
            });

            nextColorBtn.css({
                "background-color": hex,
                'transition': 'all 1.5s'
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
};

let showNewQuote = () => {
    let textQuote = $("#text");
    let authorQuote = $("#author");
    const dataQuoteId = "data-quote-id";
    let currentQuoteId = textQuote.attr(dataQuoteId);
    let requestQuoteId = "";
    if (currentQuoteId !== undefined) {
        requestQuoteId = "?excludeId=" + currentQuoteId;
    }

    $.ajax({
            url: `/random-quotes${requestQuoteId}`,
            type: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                let newAuthor = data.author;
                let newQuote = data.text;
                let currentQuoteId = data.id;
                textQuote.attr(dataQuoteId, currentQuoteId);
                $(".fa-quote-left").hide().fadeIn(1200);
                textQuote.hide().fadeIn(1200);
                authorQuote.hide().fadeIn(1200);

                return [textQuote.text(newQuote), authorQuote.text(newAuthor)];
            },
            error: function (data) {
                console.log(data);
            }
        },
    );

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
