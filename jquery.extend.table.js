var tbs = {};

/**
 * 从url加载
 * @param url
 */
$.fn.load = function (url) {
    var id = this.attr("id");
    if (id == undefined) {
        id = getRandomId();
        this.attr("id", id);
    }
    var tb = new Table(id, url);
    tbs[tb.id] = tb;
    $("#" + id).html("load from: " + url);
}
/**
 * 重新加载
 */
$.fn.reload = function () {
    var id = this.attr("id");
    if (id == undefined) {
        console.error("not found element id");
        return;
    }
    var tb = tbs[id];
    if (tb == undefined) {
        console.error("not found load record before");
        return;
    }
    $(this).html("reload from: " + tb.url);
}

function Table(id, url) {
    this.id = id;
    this.url = url;
}

function getRandomId() {
    var id = Date.now().toString(36);
    id += Date.now().toString(36).substr(4);
    return id;
}

$(document).ready(function () {
    $("ul[autofill]").each(function (i, e) {
        var e = $(e);
        var items = e.attr("items").split(",");
        for (var i = 0; i < items.length; i++) {
            e.append("<li>" + items[i] + "</li>");
        }

        e.removeAttr("autofill");
        e.removeAttr("items");
    });

});