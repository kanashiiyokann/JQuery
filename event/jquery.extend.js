$(document).ready(function () {
    //method1
    jQuery.fn.extend({
        byebye: function () {
            $(this).each(function () {
                $(this).html("bye bye");
            });
        }
    });


});

$(function () {
    //method2
    $.extend({
        max: function (a, b) {
            return a > b ? a : b;
        },
        min: function (a, b) {
            return a < b ? a : b;
        }
    });
});