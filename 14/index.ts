import fs, { stat } from "fs";
import assert from "assert";
import { start } from "repl";

type Location = {
    x: number,
    y: number,
};

class SandWorld {

    // Sorted map
    // Index is Y location, then sorted list of [start, stop] pairs
    private currentWorld: Map<number, Array<{ start: number, stop: number }>>;
    private minY: number;

    public constructor() {
        this.currentWorld = new Map();
        this.minY = Number.POSITIVE_INFINITY;
    }

    public addHorizontalLine(start: Location, end: Location): void {
        // TODO
        assert(start.y === end.y, "this is not a horizontal line");
        // start is on the left after this
        this.minY = Math.min(this.minY, start.y);
        if (end.x < start.x) {
            const tmp = end;
            end = start;
            start = tmp;
        }

        if (!this.currentWorld.has(start.y)) {
            this.currentWorld.set(start.y, []);
        }
        const currentYArray = this.currentWorld.get(start.y);
        assert(currentYArray !== undefined);
        currentYArray.push({ start: start.x, stop: end.x });
        currentYArray.sort((a, b) => a.start - b.start);
    }

    public addVerticalLine(start: Location, end: Location): void {
        // TODO
        assert(start.x === end.x, "this is not a vertical line");
        // Can go from start to end with iteration
        if (end.y < start.y) {
            const tmp = end;
            end = start;
            start = tmp;
        }

        this.minY = Math.min(this.minY, start.y);


        for (let y = start.y; y <= end.y; y++) {
            if (!this.currentWorld.has(y)) {
                this.currentWorld.set(y, []);
            }

            const currentYArray = this.currentWorld.get(y);
            assert(currentYArray !== undefined);
            currentYArray.push({ start: start.x, stop: end.x });
            currentYArray.sort((a, b) => a.start - b.start);
        }
    }

    public addSand(location: Location): void {
        if (!this.currentWorld.has(location.y)) {
            this.currentWorld.set(location.y, []);
        }

        const currentYArray = this.currentWorld.get(location.y);
        assert(currentYArray !== undefined);
        currentYArray.push({ start: location.x, stop: location.x });
        currentYArray.sort((a, b) => a.start - b.start);
    }

    public locationIsEmpty(location: Location): boolean {
        const currentYArray = this.currentWorld.get(location.y);
        if (currentYArray === undefined) {
            return true;
        }
        for (const horizontalLine of currentYArray) {
            const [horizontalStart, horizontalEnd] = [horizontalLine.start, horizontalLine.stop];
            if (location.x < horizontalStart) { // left of the leftmost at this point
                break;
            }
            if (horizontalStart <= location.x && location.x <= horizontalEnd) {
                return false;
            }
        }
        return true;

    }

    public addLine(start: Location, end: Location): void {
        if (start.x === end.x){
            return this.addVerticalLine(start, end);
        }
        if (start.y === end.y){
            return this.addHorizontalLine(start, end);
        }
        throw new Error("either start or end should be equal, but got");
    }

    public getNextLandingSpot(start: Location): Location | undefined {
        for (let i = start.y; i >= this.minY; i--) {
            const currentYArray = this.currentWorld.get(i);
            if (currentYArray !== undefined) {
                for (const horizontalLine of currentYArray) {
                    const [horizontalStart, horizontalEnd] = [horizontalLine.start, horizontalLine.stop];
                    if (start.x < horizontalStart) { // left of the leftmost at this point
                        break;
                    }
                    if (horizontalStart <= start.x && start.x <= horizontalEnd) {
                        if (this.locationIsEmpty({ x: start.x - 1, y: i })) {
                            // Check if immediately left (i+1) is open && then if diagonal down (i) left is open
                            return this.getNextLandingSpot({ x: start.x - 1, y: i }); // Basically starting up and to the left of where the blocked spot is
                        } else if (this.locationIsEmpty({ x: start.x + 1, y: i })) {
                            // check if immediately right is open && then if diagonal down right is open
                            return this.getNextLandingSpot({ x: start.x + 1, y: i });
                        } else {
                            assert(this.locationIsEmpty({ x: start.x, y: i + 1 }), "location should be empty");
                            return { x: start.x, y: i + 1 };
                        }
                    }
                }
            }
        }
        return undefined; // Since we hit nothing
    }

    // Returns the resting location of the next sand, otherwise, returns undefined
    public simulateNextSandRestingLocation(): Location | undefined {
        const nextLocation = this.getNextLandingSpot({ x: 500, y: 0 });
        if (nextLocation === undefined) {
            return undefined;
        }
        this.addSand(nextLocation);
        return nextLocation;
    }

    public addBigNegativeLine(): void {
        console.log(this.minY);
        this.addHorizontalLine({x: Number.NEGATIVE_INFINITY, y: this.minY - 2}, {x: Number.POSITIVE_INFINITY, y: this.minY - 2});
    }

    public debugDump(): string {
        return Array.from(this.currentWorld.entries()).sort((a,b) => b[0] - a[0]).map(value => {
            const key = value[0];
            const startStops = value[1];
            return key + ": " + startStops.map(value => value.start + "," + value.stop).join(" ") + "\n";
        }).join("\n");
    }


}

function solution1() {
    const lines = fs.readFileSync(__dirname + "/input.txt").toString().split("\n");
    const world = new SandWorld();
    lines.forEach(line => {
        const coordArray = line.split(" -> ").map(coordString => {
            const [xStr, yStr] = coordString.split(",");
            return { x: parseInt(xStr), y: -parseInt(yStr) }; // Negative since my model assumes y increases up, which is wrong
        });
        coordArray.forEach((coordinate: Location, coordIndex) => {
            if (coordIndex + 1 < coordArray.length) {
                world.addLine(coordinate, coordArray[coordIndex + 1]);
            }
        });
    });

    let count = 0;
    for (let location = world.simulateNextSandRestingLocation(); location != undefined; location = world.simulateNextSandRestingLocation()) {
        count++;
    }
    // console.log(world.debugDump());
    console.log(count);
}

solution1();


function solution2(){
    const lines = fs.readFileSync(__dirname + "/input.txt").toString().split("\n");
    const world = new SandWorld();
    lines.forEach(line => {
        const coordArray = line.split(" -> ").map(coordString => {
            const [xStr, yStr] = coordString.split(",");
            return { x: parseInt(xStr), y: -parseInt(yStr) }; // Negative since my model assumes y increases up, which is wrong
        });
        coordArray.forEach((coordinate: Location, coordIndex) => {
            if (coordIndex + 1 < coordArray.length) {
                world.addLine(coordinate, coordArray[coordIndex + 1]);
            }
        });
    });

    world.addBigNegativeLine();

    let count = 1;
    for (let location = world.simulateNextSandRestingLocation(); location?.x !== 500 || location?.y !== 0; location = world.simulateNextSandRestingLocation()) {
        count++;
        // console.log(count);
    }
    console.log(count);
}

solution2();