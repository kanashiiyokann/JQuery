class Queue {

   static of(...fns) {
        return new Promise((resolve) => {
            let dataBundle = [];
            let count = 0;
            fns.forEach((fn, i) => {
                new Promise(fn).then(data => {
                    dataBundle[i] = data;
                    count++;
                    if (count === fns.length) {
                        resolve(dataBundle);
                    }
                })

            })

        });
    }

}