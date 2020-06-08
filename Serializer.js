class Serializer {
    selection;

    constructor(selector) {
        this.selection = document.querySelectorAll(selector);
        if (!this.selection.length) {
            console.error("couldn't find element with selector:" + selector);
        }
    }

    static of(selector) {
        return new Serializer(selector);
    }

    echo() {

    }


    serialize(options) {
        let defaults = {
            allowEmpty: false,//序列化空值
            includeHidden: true,//序列化隐藏值
            trimString: true,//trim值
            base: "input,select,textarea",//序列化标签
            extra: undefined,//额外序列化标签
            exclude: "exclude",//排除标签
            subSelector: undefined//分组标签
        };

        let setting = this.__mergeObject(defaults, options);


        let nodeList = this.selection;
        //如果有副选择器
        if (setting.subSelector) {
            nodeList = nodeList.querySelectorAll(setting.subSelector);
        }

        let array = [];
        nodeList.forEach((e) => array.push(this.__doSerialize(e, setting)));
        return setting.subSelector ? array : array[0];

    }

    reset() {

    }

    __doSerialize(dom, setting) {
        let data = {};
        let tags = setting.base;
        if (setting.extra) {
            tags = tags + "," + setting.extra;
        }
        let items = dom.querySelectorAll(tags);
        if (items.length === 0) {
            console.log("no filed found in this container");
            return data;
        }
        items.forEach(function (e) {
            let value, tagName;
            //处理隐藏元素
            if (e.hidden && !setting.includeHidden) {
                return;
            }
            //没有name属性不序列化
            if (!e.name) {
                return;
            }
            //设置排除标签的不序列化
            if (e.hasAttribute(setting.exclude)) {
                return;
            }
            value = e.value || e.innerText || "";
            //trim处理
            if (setting.trimString && typeof value === "string") {
                value = value.trim();
            }
            //空值处理
            if (!value && !setting.allowEmpty) {
                return;
            }
            data[e.name] = value;

        });

        //  tagName = e.tagName.toLowerCase();

        //         if (tagName === "input" && e.getAttribute("type") === 'radio') {//多选按钮特殊处理
        //
        //             if (data[name] !== undefined) return;
        //             let $checked = $(setting.area).find("input[name='" + name + "']:checked:visible");
        //             if ($checked.length === 0) return;
        //             data[name] = $checked.val();
        //             let text = $checked.attr("text");
        //
        //             if (text !== undefined) {
        //                 let attrName = name.endsWith("Code") ? name.replace("Code", "") : name + "Text";
        //                 data[attrName] = text;
        //             }
        //         } else if (e.tagName === "INPUT" && $e.attr("type") === 'checkbox') {
        //             data[name] = $e.prop("checked");
        //         } else {
        //
        //             value = $e.val();
        //
        //         }
        //     } else {
        //         value = $e.text();
        //     }
        //     //select双name文本序列化
        //     if (e.tagName === "SELECT" && name.indexOf(",") > -1) {
        //         let names = name.split(",");
        //         data[names[0]] = trimValue;
        //         data[names[1]] = $(e).find("option[value='" + value + "']").text().trim();
        //     } else {
        //         data[name] = trimValue;
        //     }
        // });

        return data;

    }


    __mergeObject(inst, obj) {
        if (typeof obj !== 'object' || typeof inst !== 'object') return inst;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                if (typeof inst[key] === 'object' && typeof obj[key] === 'object') {
                    this.__mergeObject(inst[key], value);
                } else {
                    inst[key] = value;
                }
            }
        }
        return inst;
    }

}

