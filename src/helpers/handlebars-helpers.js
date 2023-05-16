module.exports = {

    getCategoryNameById: function (categoryId, viewParams) {
        console.log(viewParams.categories, categoryId);
        let data = viewParams.categories.filter(function (category) {
            return category.id === parseInt(categoryId);
        });
        console.log(data);
        return data[0].name;
    }
};
