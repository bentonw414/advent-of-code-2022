// Want to find the 
import { INSPECT_MAX_BYTES } from 'buffer';
import fs, { stat } from 'fs';

enum LocationStatus {
    Covered,
    Open,
};

enum Direction {
    Down = "D",
    Up = "U",
    Left = "L",
    Right = "R"
};

type Location = {
    x: number,
    y: number
};

class Game {
    // Covered locations is the set of "x,y" locations, starting at 0,0 that have been covered.
    private _covered_locations: Set<string>;
    private _head_locations: Set<string>;
    private _current_location_head: Location;
    private _current_location_tail: Location;


    public constructor() {
        this._covered_locations = new Set();
        this._current_location_head = { x: 0, y: 0 };
        this._current_location_tail = { x: 0, y: 0 };
        this._head_locations = new Set();
    }

    public makeMove(dx: number, dy: number): {dx: number, dy: number} {
        // console.log("move ", count, " towards ", direction)
        // this._covered_locations.add(this._current_location_tail.x + "," + this._current_location_tail.y);
        // this._head_locations.add(this._current_location_head.x + "," + this._current_location_head.y);
        // console.log(this.getGridRepresentation(), "===========");
        let returnVal = {dx: 0, dy: 0};

        this._current_location_head.x += dx;
        this._current_location_head.y += dy;

        if (this._current_location_head.x === this._current_location_tail.x) {
            // Same row
            if (Math.abs(this._current_location_head.y - this._current_location_tail.y) === 2) {
                returnVal.dy = (this._current_location_head.y - this._current_location_tail.y) / 2;
                this._current_location_tail.y += (this._current_location_head.y - this._current_location_tail.y) / 2;
            }
        } else if (this._current_location_head.y === this._current_location_tail.y) {
            // Same column
            if (Math.abs(this._current_location_head.x - this._current_location_tail.x) === 2) {
                returnVal.dx = (this._current_location_head.x - this._current_location_tail.x) / 2;
                this._current_location_tail.x += (this._current_location_head.x - this._current_location_tail.x) / 2;
            }
        } else {
            // Not in the same row or column
            if (Math.abs(this._current_location_head.x - this._current_location_tail.x) + Math.abs(this._current_location_head.y - this._current_location_tail.y) === 2) {
                // Nothing
            } else {
                if (this._current_location_head.x > this._current_location_tail.x) {
                    this._current_location_tail.x = this._current_location_tail.x + 1
                    returnVal.dx = 1;
                } else {
                    this._current_location_tail.x = this._current_location_tail.x - 1
                    returnVal.dx = -1;
                }

                if (this._current_location_head.y > this._current_location_tail.y) {
                    this._current_location_tail.y = this._current_location_tail.y + 1
                    returnVal.dy = 1;
                } else {
                    this._current_location_tail.y = this._current_location_tail.y - 1
                    returnVal.dy = -1
                }
            }
        }
        this._covered_locations.add(this._current_location_tail.x + "," + this._current_location_tail.y);
        this._head_locations.add(this._current_location_head.x + "," + this._current_location_head.y);
        // console.log("----------------------------------------")
        return returnVal;
    }

    public getNumberOfCoveredSquares(): number {
        return this._covered_locations.size;
    }

    public getGridRepresentation(): string {
        if (!this._head_locations.has(this._current_location_head.x + "," + this._current_location_head.y)) {
            console.log(this._current_location_head.x + "," + this._current_location_head.y, this._head_locations);
            throw new Error("bad");
        }
        const allLocations: Array<Location> = [];

        const full_locations = new Set<string>();
        this._covered_locations.forEach(loc => full_locations.add(loc));
        this._head_locations.forEach(loc => full_locations.add(loc));
        for (const s of full_locations) {
            const [x_str, y_str] = s.split(",");
            const location = {
                x: parseInt(x_str),
                y: parseInt(y_str)
            };

            allLocations.push(location);
        }

        const min_x = allLocations.reduce((prev, curr) => Math.min(prev, curr.x), 0);
        const max_x = allLocations.reduce((prev, curr) => Math.max(prev, curr.x), 0);
        const min_y = allLocations.reduce((prev, curr) => Math.min(prev, curr.y), 0);
        const max_y = allLocations.reduce((prev, curr) => Math.max(prev, curr.y), 0);

        let output = ""

        for (let y = max_y; y >= min_y; y--) {
            for (let x = min_x; x <= max_x; x++) {
                if (x === 0 && y === 0) {
                    output += "S";
                } else if (this._current_location_head.x === x && this._current_location_head.y === y) {
                    output += "H"
                } else if (this._current_location_tail.x === x && this._current_location_tail.y === y) {
                    output += "T"
                }
                else if (this._covered_locations.has(x.toString() + "," + y.toString())) {
                    output += "X";
                } else {
                    output += "."
                }
            }
            output += "\n"
        }

        return output;
    }
}


function solution1(): number {
    const lines = fs.readFileSync(__dirname + "/input.txt").toString().split("\n");
    const game = new Game();
    lines.forEach(line => {
        const [dir, countstr] = line.split(" ");
        const direction: Direction = dir as Direction;
        const count = parseInt(countstr);
        if (isNaN(count)) {
            throw new Error("something has gone wrong since we get NaN");
        }

        // console.log("-------------------------")
        // console.log("move ", count, " in direction ", direction);
        for (let i = 0; i < count; i++) {
            switch (direction) {
                case Direction.Down:
                    game.makeMove(0, -1);
                    break;
                case Direction.Up:
                    game.makeMove(0, 1);
                    break;
                case Direction.Left:
                    game.makeMove(-1, 0);
                    break;
                case Direction.Right:
                    game.makeMove(1, 0);
                    break;
            }
            // console.log(game.getGridRepresentation(), "===========");
        }

    });

    return game.getNumberOfCoveredSquares();
}

class MetaGame {
    private games: Array<Game>
    public constructor(number_of_games: number){
        this.games = [];
        for (let i = 0; i < number_of_games; i++){
            this.games.push(new Game());
        }
    }

    public makeMove(dx: number, dy: number){
        let nextMove = this.games[0].makeMove(dx,dy);
        console.log(nextMove);
        for (let i = 1; i < this.games.length; i++){
            nextMove = this.games[i].makeMove(nextMove.dx, nextMove.dy);
        }
    }

    public getGame(i: number){
        return this.games[i];
    }
}

function solution2(): number {
    const lines = fs.readFileSync(__dirname + "/input.txt").toString().split("\n");

    const game = new MetaGame(10);
    lines.forEach((line, idx) => {
        const [dir, countstr] = line.split(" ");
        const direction: Direction = dir as Direction;
        const count = parseInt(countstr);
        if (isNaN(count)) {
            throw new Error("something has gone wrong since we get NaN");
        }

        console.log("-------------------------")
        console.log("move ", count, " in direction ", direction);
        for (let i = 0; i < count; i++) {
            switch (direction) {
                case Direction.Down:
                    game.makeMove(0, -1);
                    break;
                case Direction.Up:
                    game.makeMove(0, 1);
                    break;
                case Direction.Left:
                    game.makeMove(-1, 0);
                    break;
                case Direction.Right:
                    game.makeMove(1, 0);
                    break;
            }
            // console.log(game.getGame(8).getGridRepresentation(), "===========");
            // console.log(game.getGridRepresentation(), "===========");
        }

    });

    return game.getGame(8).getNumberOfCoveredSquares();
}

console.log(solution1());
console.log(solution2());