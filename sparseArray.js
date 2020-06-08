class SparseArray {


    constructor(row, column) {
        if (typeof row !== "number" || typeof column !== "number") {
            console.error("create sparse array error with not number args！");
        }
        if (row < 0 || column < 0) {
            console.error("create sparse array error with error size！");
        }
        this.row = row;
        this.column = column;
        this.length = 0;
        this.source = [];
    }

    add(row, column, value) {
        if (row > this.row || column > this.column) {
            console.error("out of range !");
        }
        //check location available
     let data=   this.source.find(e=>e[0]===row && e[1]===column);
        if(data!==undefined){
            console.error("row "+row+" ,column "+column +" already has value!");
        }

        this.length++;
        this.source.push([row, column, value]);
    }

    rollback(step = 1) {

        if (step > this.length) {
            console.error("not enough step to rollback!")
        }
        while (step > 0) {
            this.source.pop();
            this.length--;
        }

    }
}

