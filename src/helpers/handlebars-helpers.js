module.exports = {
    // dateFormat: function (timestamp) {
    //     let date = new Date(timestamp * 1000);
    //     console.log(date);
    //     let year = date.getFullYear();
    //     let month = "0" + (date.getMonth() + 1);
    //     let day = "0" + date.getDate();
    //     let hours = date.getHours();
    //     let minutes = "0" + date.getMinutes();
    //     return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hours + ':' + minutes.substr(-2);
    // },

    getCategoryNameById: function (categoryId, viewParams) {
        console.log(viewParams.categories, categoryId);
        let data = viewParams.categories.filter(function (category) {
            return category.id === parseInt(categoryId);
        });
        console.log(data);
        return data[0].name;
    }
};
