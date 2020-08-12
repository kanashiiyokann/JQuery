/**
 * 模板填充类
 */
// class Template {
//     constructor(temp) {
//         this.temp = temp || '';
//         this.reg_ph = /({{)[^{}]+(}})/g;
//         this.reg_key = /[a-zA-Z]+/;
//     }
//
//     static of(temp) {
//         return new Template(temp);
//     }
//
//     static fromDocument(id) {
//         return new Template(document.getElementById(id).innerHTML);
//     }
//
//     fill(obj) {
//         if (typeof obj !== 'object') {
//             throw new Error("argument error:object only!");
//         }
//
//         //检查可见性
//         let container = document.createElement("div");
//         container.innerHTML = this.temp;
//         container.querySelectorAll("if").forEach(function (e) {
//             let expression = e.getAttribute("test");
//             if (!eval("obj." + expression)) {
//                 e.remove();
//             }
//         });
//
//         let htm = container.innerHTML;
//
//         //替换内容
//         let placeHolderList = htm.match(this.reg_ph) || [];
//
//         placeHolderList.forEach(ph => {
//             let key = ph.match(this.reg_key);
//             key = key.length > 0 ? key[0] : "";
//             if (key !== "") {
//                 htm = htm.replace(ph, obj[key] || '');
//             }
//         });
//
//         // //检查可见性
//         // container.innerHTML = htm;
//         //
//         // container.querySelectorAll("[available]").forEach(function (value, key, parent) {
//         //     let expression = value.getAttribute("available");
//         //     if (!eval("obj." + expression)) {
//         //         value.remove();
//         //     }
//         // });
//
//
//         return htm;
//     }
//
// }

/**
 * 模板填充类
 */
class Template {
    constructor(temp) {
        this.temp = temp || '';
        this.reg_ph = /({{)[^{}]+(}})/g;
        this.reg_key = /[a-zA-Z\d+]+/;
        this.xmlSerializer = new XMLSerializer();
        this.domParser = new DOMParser();
    }

    static of(temp) {
        return new Template(temp);
    }

    static fromDocument(id) {
        return new Template(document.getElementById(id).innerHTML);
    }

    fill(data = {}) {

        //参数兼容
        if (typeof data !== "object" && data != null) {
            let args = Array.prototype.slice.call(arguments);
            data = {};
            args.forEach((e, i) => data[i] = e);
        }

        //if 表达式处理
        let dom = this.domParser.parseFromString(this.temp, 'text/xml');
        let ifList = dom.getElementsByTagName("if");
        while (ifList.length > 0) {
            let tag = ifList[0];
            let express = tag.getAttribute("test");
            if (eval("data." + express)) {
                while (tag.childNodes.length > 0) {
                    tag.parentElement.insertBefore(tag.childNodes[0], tag);
                }
            }
            tag.remove();
        }
        let htm = this.xmlSerializer.serializeToString(dom);
        //模板填充
        let placeHolderList = htm.match(this.reg_ph) || [];

        placeHolderList.forEach(ph => {
            let key = ph.match(this.reg_key);
            key = key.length > 0 ? key[0] : "";
            if (key !== "") {
                htm = htm.replace(ph, data[key] || '');
            }
        });

        return htm;
    }

}


