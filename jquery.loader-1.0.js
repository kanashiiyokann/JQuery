;(function ($) {
    var instance = new Loader();

    $.loader = instance;

    function Loader() {
        var settings = {};
        settings.urlLable = "url";
        /**
         * load html from url
         * @param selector
         * @param url
         */
        this.load = function (selector, url) {

            var div = $(selector).eq(0);
            if (div == undefined) {
                console.error("element not found!");
                return;
            }

            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                success: function (result) {
                    div.empty().append(result);
                }
            });


        };

        /**
         * reload html from url
         * @param selector
         */
        this.reload = function (selector) {
            var div = $(selector).eq(0);
            if (div == undefined) {
                console.error("element not found!");
                return;
            }
            var url = div.data(settings.urlLable);
            if (isEmpty(url)) {
                console.error("before reload,load first.")
                return;
            }
            this.load(div, url);

        };
    }
    /**
     * check the variable is null（undefined） or meaningless
     * @param variable
     * @returns {boolean}
     */
    function isEmpty(variable) {
        if (variable == undefined || variable == "") return true;
        return false;

    }
})(jQuery);

