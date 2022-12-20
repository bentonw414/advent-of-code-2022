import assert from "assert";
import fs from "fs";

type NestedArray = number | Array<number | NestedArray>;

function parseAList(list: string): NestedArray {
    // console.log(list);
    if (list === "") {
        return [];
    }
    assert(list.charAt(0) === "[" && list.charAt(list.length - 1) === "]");

    const insideList = list.substring(1, list.length - 1);

    const output: NestedArray = []
    let nestCount = 0

    let nextString = "";
    for (let i = 0; i < insideList.length; i++) {
        // console.log(nextString);
        const nextChar = insideList.charAt(i);
        if (/^[0-9]$/.test(nextChar)) {
            nextString += nextChar;
        } else if (nextChar === "," && nestCount !== 0) {
            nextString += nextChar;
        } else if (nextChar === "]" && nestCount !== 0) {
            nextString += nextChar;
            nestCount -= 1;
        } else if (nextChar === "[") {
            nextString += nextChar;
            nestCount += 1;
        } else if (nextChar === "," && nestCount === 0) {
            if (/^[0-9]+$/.test(nextString)) {
                output.push(parseANumber(nextString));
            } else {
                output.push(parseAList(nextString));
            }
            nextString = "";
        }
    }
    if (nextString !== ""){
        if (/^[0-9]+$/.test(nextString)) {
            output.push(parseANumber(nextString));
        } else {
            output.push(parseAList(nextString));
        }
    }
    return output;
}

function parseANumber(numberStr: string): number {
    assert(/^[0-9]+$/.test(numberStr), numberStr);
    return parseInt(numberStr);
}

function areInOrder(left: NestedArray, right: NestedArray): boolean | undefined {
    // console.log("");
    // console.log(left);
    // console.log(right);
    if (typeof left === "number" && typeof right === "number"){
        // console.log("both numbers");
        if (left === right){
            return undefined;
        }
        return left < right;
    } else if (left instanceof Array && right instanceof Array){
        // console.log("both arrays");
        for (let i = 0; i < left.length; i++){
            if (i >= right.length){
                return false;
            }
            const nextInOrder = areInOrder(left[i], right[i]);
            if (nextInOrder === false){
                return false;
            } else if (nextInOrder === true){
                return true;
            } else {
                continue;
            }
        }
        if (left.length === right.length){
            return undefined;
        } else {
            assert(left.length < right.length);
            return true;
        }
    } else {
        let actualLeft: NestedArray;
        if (typeof left === "number"){
            actualLeft = [left];
        } else {
            actualLeft = left;
        }

        let actualRight: NestedArray;
        if (typeof right === "number"){
            actualRight = [right];
        } else {
            actualRight = right;
        }
        return areInOrder(actualLeft, actualRight);
        // console.log("exactly one is a number");
    }
}

function solution1() {
    const allPairs = fs.readFileSync(__dirname + "/input.txt").toString().split("\n").filter((x ,i) => x !== "").map(s => parseAList(s));
    let inOrderCount = 0;
    allPairs.forEach((value, i) => {
        if (i % 2 === 0){
            const left = value;
            const right = allPairs[i+1];
            const inOrder = areInOrder(left, right);
            // console.log("");
            // console.log(left);
            // console.log(right);
            // console.log(inOrder);
            if (inOrder){
                inOrderCount += i/2 + 1;
            }
        }
    });
    console.log(inOrderCount);
}

function solution2(){
    const allPairs = fs.readFileSync(__dirname + "/input.txt").toString().split("\n").filter((x ,i) => x !== "").map(s => parseAList(s));
    const twoArr: NestedArray = [[2]];
    const sixArr: NestedArray = [[6]];
    allPairs.push(twoArr);
    allPairs.push(sixArr);
    let inOrderCount = 0;
    allPairs.sort((a,b) => areInOrder(a,b) ? -1 : 1);
    // console.log(allPairs);

    const twoIndex = allPairs.findIndex(i => i === twoArr) + 1;
    const sixIndex = allPairs.findIndex(i => i === sixArr) + 1;
    console.log(twoIndex);
    console.log(sixIndex);
    console.log(twoIndex * sixIndex);
}

solution1();
solution2();