function Validator() {
    var validator_settings;
    initInnerVariables();

    /**
     * 验证表单
     * @param selector 父级选择器
     * @return {number} 验证失败个数
     */
    this.validate = function (selector) {

        var failed = 0;
        //part input
        $(selector).find("input").each(function (i, e) {
            var $input = $(e);
            var flag = true;
            var methods = new Array("requireCheck", "numberCheck", "regexCheck");
            for (var i = 0; i < methods.length; i++) {
                var fn = eval(methods[i]);
                flag = fn.call(null, $input);
                if (!flag) {
                    failed++;
                    break;
                }
            }

        });

        //part select
        $(selector).find("select").each(function (i, e) {
            var select = $(e);
            var flag = true;
            var methods = ["selectCheck"];
            for (var i = 0; i < methods.length; i++) {
                var fn = eval(methods[i]);
                flag = fn.call(null, select);
                if (!flag) {
                    failed++;
                    break;
                }
            }
        });

        return failed;
    };

    /**
     * 设置参数
     * @param options: type,delay,regexLable,messageLable
     */
    this.setParameters = function (options) {
        $.extend(validator_settings, options);
    }

    /**
     * 清除输入框后面存在的提示信息
     * @param input input元素
     */
    function clearMessage(input) {
        var next = input.next();
        if (next.attr("name") == "autoalert") {
            next.remove();
        }
    }

    /**
     * 显示正则验证失败的提示信息
     * @param $input input元素
     * @param time 提示延迟消失的时间（毫秒）
     */
    function showMessage($input, message) {
        if (validator_settings.tipFn != undefined) {
            validator_settings.tipFn($input, message);
            return;
        }
        var hint = $input.attr(validator_settings.messageLable);
        if (hint != undefined && hint != "") {
            message = hint;
        }
        var offset = $input.offset();
        var css_angle, x, y;
        if (validator_settings.type == "below") {
            css_angle = validator_settings.belowAngleCss;
            x = offset.left;
            y = offset.top + $input.outerHeight();
        }
        else {
            css_angle = validator_settings.afterAngleCss;
            x = offset.left + $input.outerWidth();
            y = offset.top;
        }
        clearMessage($input);

        var container = $(document.createElement("div"));
        container.css(validator_settings.containerCss);
        container.css("top", y);
        container.css("left", x);
        container.attr("name", "autoalert");

        var angle = $(document.createElement("div"));
        angle.css(css_angle);

        var square = $(document.createElement("span"));
        square.css(validator_settings.squareCss);
        square.append(message);

        container.append(angle);
        container.append(square);
        $input.after(container);
        setTimeout(function () {
            container.remove();
        }, validator_settings.delay)
    }

    /**
     * 判断多个值是否是空值
     * @param variables 变量
     * @returns {boolean} true：全为空或未定义
     */
    function isContainEmpty(variables) {

        for (var i = 0; i < variables.length; i++) {
            if (isEmptyOrUndefined(variables[i])) return true;
        }
        return false;
    }

    /**
     * 判断值是否是空值
     * @param variable 变量
     * @returns {boolean} true：为空或未定义
     */
    function isEmptyOrUndefined(varialable) {
        if (varialable == undefined) return true;

        var type = typeof(varialable);

        if (type == "string" && varialable.trim() == "") {
            return true;
        }
        else if (varialable == null) {
            return true;
        }
        return false;
    }

    /**
     * 数字验证
     * @param $input
     */
    function numberCheck($input) {

        var rule = $input.attr(validator_settings.numberLable);
        var value = $input.val().trim();
        if (undefined == rule) return;
        var regex = "^-?(?!0[0-9]+)[0-9]+(\\.[0-9]+)?$";
        var partten = new RegExp(regex);
        if (!partten.test(value)) {
            showMessage($input, "请输入一个数字。", validator_settings.delay);
            return false;
        }
        rule = rule.trim();
        if (rule == "") return;
        regex = "^[0-9,\\s]+$";
        partten = new RegExp(regex);
        if (!partten.test(rule)) {
            showErro("不合法的表达式[min，max，precision]");
            return;
        }

        var num = parseFloat(value);
        var args = rule.split(",");

        if (args.length > 0 && args[0].trim() != "") {
            var min = parseFloat(args[0]);
            if (num < min) showMessage($input, "请输入一个不小于" + min + "的数字。");
        }
        if (args.length > 1 && args[1].trim() != "") {
            var max = parseFloat(args[1]);
            if (num > max) showMessage($input, "请输入一个不大于" + max + "的数字。");
        }
        if (args.length > 2 && args[2].trim() != "") {
            var precision = args[2];
            regex = "(?<=\\.)[0-9]*";
            var str = new RegExp(regex).exec(value);
            var len = str == null ? 0 : str.toString().length;
            if (len > precision && precision > 0) {
                showMessage($input, "小数部分请不要超过" + precision + "位");
                return false;
            }
            else if (len > precision && precision == 0) {
                showMessage($input, "请输入一个整数！");
                return false;
            }
        }
        return true;
    }

    /**
     * 必填验证
     * @param input
     * @returns {boolean} true：验证通过
     */
    function requireCheck(input) {
        var essential = input.attr(validator_settings.essentialLable);
        var val = input.val().trim();
        if (essential != undefined && isEmptyOrUndefined(val)) {
            var name = "该字段";
            if (essential != "" && essential != "essential") {
                name = essential;
            }
            showMessage(input, name + "不能为空！", validator_settings.delay);
            return false;
        }
        return true;
    }

    /**
     * 正则验证
     * @param regex 正则表达式
     * @param value 值
     * @returns {boolean} true：验证通过
     */
    function regexCheck(input) {
        var regex = input.attr(validator_settings.regexLable);
        var msg = input.attr(validator_settings.messageLable);
        var value = input.val().trim();
        if (isContainEmpty([regex, msg, value])) return true;
        var partten = new RegExp(regex);
        if (!partten.test(value)) {
            showMessage(input, msg, validator_settings.delay);
            return false;
        }
        return true;
    }

    /**
     * 初始化一些内置变量
     */
    function initInnerVariables() {

        validator_settings = {
            type: "after",
            essentialLable: "essential",
            numberLable: "number",
            regexLable: "regex",
            messageLable: "message",
            delay: 5000,
            showError: false,
            tipFn: undefined
        };

        var css_container = {
            "position": "absolute",
            "color": "red",
        };
        validator_settings.containerCss = css_container;
        var css_angle_below = {
            "width": 0,
            "height": 0,
            "border-bottom": "6px solid #e78081",
            "border-left": "6px solid transparent",
            "margin-left": 3
        };
        validator_settings.belowAngleCss = css_angle_below;
        var css_angle_after = {
            "width": 0,
            "height": 0,
            "float": "left",
            "border-right": "6px solid #e78081",
            "border-top": "6px solid transparent",
            "margin-top": 3
        };
        validator_settings.afterAngleCss = css_angle_after;
        var css_square = {
            "height": 8,
            "background-color": "#e78081",
            "padding": "2px 4px",
            "border-radius": 3,
            "color": "white",
            "font-size": 12,
            "box-shadow": "1px 2px 1px #888888",
            "magrin": 0
        };
        validator_settings.squareCss = css_square;
    }

    /**
     * 检查是否有选择值
     * @param select
     */
    function selectCheck(select) {
        var value = select.val();
        var essential = select.attr(validator_settings.essentialLable);
        if (essential == undefined) {
            return true;
        }
        else if (isEmptyOrUndefined(value)) {
            var name = "该选项";
            if (essential != "" && essential != validator_settings.essentialLable) {
                name = essential;
            }
            showMessage(select, "请选择" + name + "。", validator_settings.delay);
            return false;
        }
        return true;
    }

    function showErro(msg) {
        if (validator_settings.showError) {
            console.error(msg);
        }
    }

}
