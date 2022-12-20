import assert from "assert";
import fs from "fs";

class Board {

    // index is [row][col]
    private grid: number[][];
    public startLocation: { row: number, col: number };
    public endLocation: { row: number, col: number };

    public constructor(filelocation: string) {
        const allLetters = fs.readFileSync(filelocation).toString().split("\n").map(line => line.split(""));
        this.startLocation = { row: 0, col: 0 };
        this.endLocation = { row: 0, col: 0 };

        this.grid = []
        allLetters.forEach((row, rowIndex) => {
            this.grid.push(row.map((s, colIndex) => {
                if (s === "S") {
                    this.endLocation = { row: rowIndex, col: colIndex };
                    return "a".charCodeAt(0) - 97;
                }
                if (s === "E") {
                    this.startLocation = { row: rowIndex, col: colIndex };
                    return "z".charCodeAt(0) - 97;
                }
                return s.charCodeAt(0) - 97;
            }).map(x => -x))
        });
    }

    // undefined if there is nothing there
    public at(row: number, col: number): number | undefined {
        if (row < 0 || col < 0) {
            return undefined;
        }
        if (row >= this.grid.length || col >= this.grid[0].length) {
            return undefined;
        }
        return this.grid[row][col];
    }
}

function getDfsString(width: number, height: number, visited: Set<string>): string {
    let output = "";
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (visited.has(row + "," + col)) {
                output += "X";
            } else {
                output += "."
            }
        }
        output += "\n";
    }
    return output;
}

let bestSoFar = Number.POSITIVE_INFINITY;

// Set is of row,col strings
// Ooops didn't think this through; dfs is definitely worse than bfs
function dfs(currentLocation: { row: number, col: number },
    board: Board, visited: Set<string>, stopEarlyAt: number, level: number): number {
    if (level >= bestSoFar){
        return Number.POSITIVE_INFINITY;
    }
    // console.log(getDfsString(136, 41, visited));
    // console.log(visited.size)
    if (board.endLocation.col === currentLocation.col && board.endLocation.row === currentLocation.row) {
        bestSoFar = Math.min(level, bestSoFar);
        console.log(level, bestSoFar);
        return 0;
    } else {
        const currentBoardVal = board.at(currentLocation.row, currentLocation.col);

        assert(currentBoardVal !== undefined);
        const outputs = [Number.POSITIVE_INFINITY];

        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const newBoardVal = board.at(currentLocation.row + dy, currentLocation.col + dx);
            if (newBoardVal !== undefined && newBoardVal - currentBoardVal <= 1) {
                const newStringLoc = (currentLocation.row + dy) + "," + (currentLocation.col + dx);
                if (!visited.has(newStringLoc)) {
                    visited.add(newStringLoc);
                    outputs.push(1 + dfs({ row: currentLocation.row + dy, col: currentLocation.col + dx }, board, visited, Math.min(...outputs), level + 1));
                    visited.delete(newStringLoc);
                }
            }
        }
        return Math.min(...outputs);
    }
    return Number.POSITIVE_INFINITY;
}

function locationToString(loc: {row: number, col: number}): string {
    return loc.row + "," + loc.col;
}

function bfsSearch(board: Board){
    const start = {...board.startLocation};
    const end = {...board.endLocation};

    let pathHeads: Array<{row: number, col:number}> = [start];
    let nextPathHeads: Array<{row: number, col:number}> = [];
    const alreadySeen: Set<string> = new Set();

    let level = 0;
    while (true){
        for (const {row, col} of pathHeads){
            const currentBoardVal = board.at(row, col);
            if (currentBoardVal === 0){
                return level;
            }
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const newBoardVal = board.at(row + dy, col + dx);
                assert(currentBoardVal !== undefined);
                if (newBoardVal !== undefined && newBoardVal - currentBoardVal <= 1) {
                    const newLocString = locationToString({row: row + dy, col: col + dx})
                    if (!alreadySeen.has(newLocString)){
                        alreadySeen.add(newLocString);
                        nextPathHeads.push({row: row + dy, col: col + dx});
                    }
                }
            }
        }
        pathHeads = nextPathHeads;
        nextPathHeads = [];
        level+=1;
    }

}

function bfsSearch2(board: Board){
    const start = {...board.startLocation};
    const end = {...board.endLocation};

    let pathHeads: Array<{row: number, col:number}> = [start];
    let nextPathHeads: Array<{row: number, col:number}> = [];
    const alreadySeen: Set<string> = new Set();

    let level = 0;
    while (true){
        for (const {row, col} of pathHeads){
            if (row === end.row && col === end.col){
                return level;
            }
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const newBoardVal = board.at(row + dy, col + dx);
                const currentBoardVal = board.at(row, col);
                assert(currentBoardVal !== undefined);
                if (newBoardVal !== undefined && newBoardVal - currentBoardVal <= 1) {
                    const newLocString = locationToString({row: row + dy, col: col + dx})
                    if (!alreadySeen.has(newLocString)){
                        alreadySeen.add(newLocString);
                        nextPathHeads.push({row: row + dy, col: col + dx});
                    }
                }
            }
        }
        pathHeads = nextPathHeads;
        nextPathHeads = [];
        level+=1;
    }

}


function solution1() {
    const board = new Board(__dirname + "/input.txt");
    console.log(bfsSearch(board));
    // console.log(dfs(board.startLocation, board, new Set(), Number.POSITIVE_INFINITY, 0));
}

solution1();