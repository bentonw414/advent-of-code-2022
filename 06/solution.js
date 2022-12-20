const fs = require("fs");


function solution1() {
    const content = fs.readFileSync("input.txt").toString();

    let count = 0;

    for (const char of content) {
        if (count < 3) {
            count++;
            continue;
        } else {
            const currentSet = new Set();
            currentSet.add(content.charAt(count));
            currentSet.add(content.charAt(count - 1));
            currentSet.add(content.charAt(count - 2));
            currentSet.add(content.charAt(count - 3));
            if (currentSet.size === 4) {
                return count + 1
            }
        }
        count++;
    }
}


function solution1() {
    const content = fs.readFileSync("input.txt").toString();

    let count = 0;

    for (const char of content) {
        if (count < 13) {
            count++;
            continue;
        } else {
            const currentSet = new Set();
            for (let i = 0; i < 14; i++){
                currentSet.add(content.charAt(count - i));
            }
            if (currentSet.size === 14) {
                return count + 1
            }
        }
        count++;
    }
}

console.log(solution1());