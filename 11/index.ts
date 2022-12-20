import assert  from "assert";
import fs from "fs";

class Monkey {

    public static Divisor = 1;

    private currentItems: Array<number>;
    private _number_inspected: number;

    // Takes in an old level, and returns the new worry level
    private operation: (old: number) => number;

    // Takes in a worry level, and returns which monkey to throw to
    private throw_to_monkey: (worry: number) => number;

    constructor(startingItems: Array<number>,
        operation: (old: number) => number,
        throw_to_monkey: (worry: number) => number) {
        this.currentItems = startingItems.slice();
        this.operation = operation;
        this.throw_to_monkey = throw_to_monkey;
        this._number_inspected = 0;
    }

    public takeTurn(): Array<{ worryLevel: number, toMonkey: number }> {
        const output: Array<{ worryLevel: number, toMonkey: number }> = [];

        for (const item of this.currentItems) {
            this._number_inspected += 1;
            // const newWorryLevel = Math.floor(this.operation(item) / 3)// part 1
            const newWorryLevel = Math.floor(this.operation(item) % Monkey.Divisor) // part 2
            output.push({
                worryLevel: newWorryLevel,
                toMonkey: this.throw_to_monkey(newWorryLevel)
            });
        }
        this.currentItems = [];

        return output;
    }

    public addItem(worryLevel: number): void {
        this.currentItems.push(worryLevel);
    }

    public getNumberInspected(): number {
        return this._number_inspected;
    }

}

class FullGame {
    private monkeys: Array<Monkey>;

    public constructor(monkeys: Array<Monkey>) {
        this.monkeys = monkeys;
    }

    public runRound(): void {
        this.monkeys.forEach((monkey) => {
            const monkeyTurnResult = monkey.takeTurn();
            for (const { worryLevel, toMonkey } of monkeyTurnResult) {
                this.monkeys[toMonkey].addItem(worryLevel);
            }
        })
    }

    public getMonkeyInAscendingOrderByNumberInspected(): Array<Monkey> {
        return this.monkeys.slice().sort((a, b) => b.getNumberInspected() - a.getNumberInspected());
    }
}

function makeGame(): FullGame {

    const lines = fs.readFileSync(__dirname + "/input.txt").toString().split("\n");


    const monkeys: Array<Monkey> = [];

    const monkeyData: {
        startingItems: Array<number>,
        operation: (old: number) => number,
        throw_to_monkey: (worry: number) => number
        divisible_by: number
        true_case: number
    } = {
        startingItems: [],
        operation: (x) => x,
        throw_to_monkey: (x) => x,
        divisible_by: 0,
        true_case: 0
    }

    lines.forEach((line, index) => {
        const inputIndex = index % 7;

        switch (inputIndex) {
            case 0: // Monkey X:
                return;
            case 6: // Empty line
                const newMonkey = new Monkey(monkeyData.startingItems, monkeyData.operation, monkeyData.throw_to_monkey);
                monkeys.push(newMonkey);
                return;
            case 1: // Starting items:
                const items = line.trim().slice("Starting items: ".length).split(", ").map(intstr => parseInt(intstr));
                monkeyData.startingItems = items;
                break;
            case 2: // Operation: new = old * 19
                const [first, op, second] = line.trim().slice("Operation: new = ".length).split(" ");
                monkeyData.operation = (old: number) => {
                    let leftVal: number;
                    if (first === "old") {
                        leftVal = old;
                    } else {
                        leftVal = parseInt(first);
                    }

                    let rightVal: number;
                    if (second === "old") {
                        rightVal = old;
                    } else {
                        rightVal = parseInt(second);
                    }

                    if (op === "*") {
                        return leftVal * rightVal;
                    } else {
                        assert(op === "+", "op is "+ op);
                        return leftVal + rightVal;
                    }
                }
                break;
            case 3: // Test: divisible by X
                monkeyData.divisible_by = parseInt(line.trim().slice("Test: divisible by ".length));
                Monkey.Divisor = Monkey.Divisor * monkeyData.divisible_by;
                break;
            case 4: // If true: throw to monkey X
                monkeyData.true_case = parseInt(line.trim().slice("If true: throw to monkey ".length));
                break;
            case 5: // If false: throw to monkey Y
                const false_case = parseInt(line.trim().slice("If false: throw to monkey ".length));
                const true_case = monkeyData.true_case;
                const divisible_by = monkeyData.divisible_by;
                monkeyData.throw_to_monkey = (value) => {
                    if (value % divisible_by === 0) {
                        return true_case;
                    } else {
                        return false_case;
                    }
                }
                break;
        }
    });
    const newMonkey = new Monkey(monkeyData.startingItems, monkeyData.operation, monkeyData.throw_to_monkey);
                monkeys.push(newMonkey);



    return new FullGame(monkeys);
}

function solution1() {
    const game = makeGame();
    for (let i = 0; i < 10000; i++) {
        game.runRound();
    }

    const counts = game.getMonkeyInAscendingOrderByNumberInspected().map(monkey => monkey.getNumberInspected());
    return counts[0]*counts[1];
}

console.log(solution1());