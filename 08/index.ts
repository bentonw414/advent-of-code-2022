// Want to find the 
import fs, { stat } from 'fs';

function solution1(): number {
    const lines = fs.readFileSync(__dirname + "/input.txt").toString().split("\n");

    const rows = lines.map(line => line.split('').map(c => parseInt(c)));

    // found similar thing online; should work
    const cols = rows[0].map((row_value, row_index) => rows.map(row => row[row_index]));

    let totalVisible = new Set<string>();
    for (const [row_i, row] of rows.entries()) {
        let previous = -1;
        for (const [col_i, value] of row.entries()) {
            if (value > previous) {
                previous = Math.max(previous, value);
                totalVisible.add(row_i.toString() + "," + col_i.toString());
            } else if (value === previous) {
                continue
            } else {

            }
        }
    }

    for (const [row_i, row] of rows.entries()) {
        let previous = -1;
        for (const [col_i, value] of row.slice().reverse().entries()) {
            if (value > previous) {
                previous = Math.max(previous, value);
                totalVisible.add((row_i).toString() + "," + (row.length - 1 - col_i).toString());
            } else {

            }
        }
    }

    for (const [col_i, col] of cols.entries()) {
        let previous = -1;
        for (const [row_i, value] of col.entries()) {
            if (value > previous) {
                previous = Math.max(previous, value);
                totalVisible.add(row_i.toString() + "," + col_i.toString());
            } else {

            }
        }
    }

    for (const [col_i, col] of cols.entries()) {
        let previous = -1;
        for (const [row_i, value] of col.slice().reverse().entries()) {
            if (value > previous) {
                previous = Math.max(previous, value);
                totalVisible.add((col.length - 1 - row_i).toString() + "," + col_i.toString());
            } else {

            }
        }
    }
    return totalVisible.size;
}

console.log(solution1());

function solution2(): number {
    const lines = fs.readFileSync(__dirname + "/input.txt").toString().split("\n");

    const rows = lines.map(line => line.split('').map(c => parseInt(c)));

    let maxScore = 0;
    rows.forEach((row, row_i) => {
        row.forEach((value, col_i) => {
            // Up
            let upScore = 0
            for (let i = col_i - 1; i >= 0; i--) {
                upScore += 1
                if (row[i] >= value) {
                    break
                } else {
        
                }
            }

            // Down
            let downScore = 0
            for (let i = col_i + 1; i < row.length; i++) {
                downScore += 1
                if (row[i] >= value) {
                    break
                } else {
                }
            }


            // Left
            let leftScore = 0
            for (let i = row_i - 1; i >= 0; i--) {
                leftScore += 1
                if (rows[i][col_i] >= value) {
                    break
                } else {
                }
            }

            // right
            let rightScore = 0
            for (let i = row_i + 1; i < rows.length; i++) {
                rightScore += 1
                if (rows[i][col_i] >= value) {
                    break
                } else {
                }
            }
            console.log([row_i, col_i, upScore, downScore, leftScore, rightScore].join(", "))
            maxScore = Math.max(maxScore, upScore * downScore * rightScore * leftScore)
        })
    })

    return maxScore;
}

console.log(solution2());