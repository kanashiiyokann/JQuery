;(function ($) {
    var instance;
    $.kit = (function () {
        if (undefined == instance) {
            instance = new Kit();
        }
        return instance;
    })();

    function Kit() {
        /**
         * 将表单元素序列化成一个属性对象
         * @param selector 选择器
         * @param options 可用序列化参数：
         * @return object
         */
        this.serialize2object = function (selector, options) {

            var setting = {};
            setting.allowEmpty = false;//是否序列化空值
            setting.includeHidden = true;//是否序列化隐藏元素
            setting.trimString = true;//是否trim字符串数据

            $.extend(setting, options);
            var data = {};
            var items = $(selector).find("input,select,textarea");
            if (items.size == 0) {
                console.log("no filed found in this container");
                return data;
            }
            items.each(function (i, e) {
                var item = $(e);
                var hidden = item.css("display") == "none";
                var name = item.attr("name");
                //没有name属性不序列化
                if (name == undefined || name == "") return;
                var value = item.val();
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


        /**
         * 清空表单元素(包括不可见的),忽略具有fixed属性的
         * @param selector
         */
        this.clearForm = function (selector) {
            $(selector).find("input,select,textarea").each(function (i, e) {
                e = $(e);
                var fixed = e.attr("fixed");
                if (fixed == undefined) {
                    e.val("");
                }
            });
        }
    }
})(jQuery);