;(function ($) {
    var serializer_setting = {};
    serializer_setting.allowEmpty = false;
    serializer_setting.includeHidden = true;
    /**
     * 将表单元素序列化成一个属性对象
     * @param options 可用序列化参数：{allowEmpty:false,includeHidden:true}
     * @return object
     */
    $.fn.serialize2object = function (options) {

        var setting = {};
        setting.allowEmpty = false;//序列化空值
        setting.includeHidden = true;//序列化隐藏值
        setting.trimString = true;//trim值
        setting.extra = undefined;//额外序列化标签
        setting.base = "input,select,textarea";//序列化标签
        $.extend(setting, options);
        var data = {};
        var tags = setting.base;
        if (setting.extra != undefined) {
            tags = tags + "," + setting.extra;
        }
        var items = $(this).find(tags);
        if (items.length == 0) {
            console.log("no filed found in this container");
            return data;
        }
        items.each(function (i, e) {
            var item = $(e);
            var hidden = item.css("display") == "none";
            var name = item.attr("name");
            //没有name属性不序列化
            if (name == undefined || name == "") return;
            var baseTags = setting.base.split(",");
            var isBase = false;
            for (var i = 0; i < baseTags.length; i++) {
                if (item.is(baseTags[i])) {
                    isBase = true;
                    break;
                }
            }
            var value;
            if (isBase) {
                value = item.val();
            }
            else {
                value = item.text();
            }
            //配置要求隐藏元素不序列化
            if (hidden && !setting.includeHidden) return;
            //控件值异常不序列化
            if (value == undefined) return;
            value = value.trim();
            //配置要求空值不序列化
            if (value == "" && setting.allowEmpty == false) return;
            data[name] = value;
        });
        for (var key in data) {
            var value = data[key];
            //去掉字符串前后的空格
            if (setting.trimString) {
                value = typeof(value) == "string" ? value.trim() : value;
                data[key] = value;
            }
            value = data[key];
            //是否允许空值
            if (!setting.allowEmpty && value == "") {
                delete data[key];
            }
        }
        return data;
    }

})(jQuery);