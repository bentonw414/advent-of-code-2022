// Want to find the 
import fs, { stat } from 'fs';


interface MyFileSystem {
    // Returns the size
    size(): number;

    // Returns all of the children
    children(): Array<MyFileSystem>;

    // Returns true iff this is a directory
    isDirectory(): boolean;

    // Returns the name of the file/folder
    getName(): string;

    // Add a child to this: should only work for directories
    addChild(child: MyFileSystem): MyFileSystem;

    // Undefined in the case that we are at the root
    getParent(): MyFileSystem | undefined;

}


class SingleFile implements MyFileSystem {

    private _size: number;
    private _name: string;
    private _parent: MyFileSystem | undefined;

    public constructor(size: number, name: string, parent: MyFileSystem | undefined){
        if (isNaN(size)){
            throw new Error("got isNan");
        }
        this._size = size;
        this._name = name;
        this._parent = parent;
    }

    size(): number {
        return this._size;
    }

    children(): MyFileSystem[] {
        return []
    }

    isDirectory(): boolean {
        return false;
    }

    getName(): string {
        return this._name;
    }
    addChild(child: MyFileSystem): MyFileSystem {
        throw new Error("cannot add a child to a single file");
    }
    getParent(): MyFileSystem | undefined {
        return this._parent;
    }

    toString(): string {
        return "- " + this.getName() + " (file, size=" + this.size() + ")";
    }
}

class SingleDirectory implements MyFileSystem {

    private _name: string;
    private _children: Array<MyFileSystem>;
    private _parent: MyFileSystem | undefined;

    public constructor(name: string, parent: MyFileSystem | undefined){
        this._children = [];
        this._name = name;
        this._parent = parent;
    }

    size(): number {
        return this._children.map(child => child.size()).reduce((prev, current) => prev + current, 0);
    }

    children(): MyFileSystem[] {
        return this._children.slice();
    }

    isDirectory(): boolean {
        return true;
    }

    getName(): string {
        return this._name;
    }
    addChild(child: MyFileSystem): MyFileSystem {
        const alreadyExisting = this._children.filter(c => c.getName() === child.getName() && child.isDirectory() === c.isDirectory());
        if (alreadyExisting.length === 0){
            this._children.push(child);
            return child;
        } else {
            if (alreadyExisting.length > 1){
                throw new Error("should not have this many matches");
            }
            return alreadyExisting[0];
        }
    }
    getParent(): MyFileSystem | undefined {
        return this._parent;
    }

    toString(): string {
        let output = "- " + this.getName() + " (dir)";// size=" + this.size().toString() + ")";
        let childOutput = this._children.map(c => {
            return c.toString().split("\n").map(line => "  " + line).join("\n");
        }).join("\n");
        // return output + "\n" + this._children.map(c => c.toString()).join("\n");
        return output + "\n" + childOutput; // TODO maybe need a \n here but not sure
    }
}


function buildFiles(): MyFileSystem {
    const fileContent = fs.readFileSync(__dirname + "/input.txt").toString();
    const lines = fileContent.split("\n");

    const root: MyFileSystem = new SingleDirectory("/", undefined);
    let currentDirectory = root;

    for (const line of lines){
        if (line === "$ cd /"){
            currentDirectory = root;
        } else if (line == "$ cd .."){
            currentDirectory = currentDirectory.getParent() ?? root;
        } else if (line.startsWith("$ cd ")){
            const subDirectoryName = line.substring(5); // everything past "$ cd "
            currentDirectory = currentDirectory.addChild(new SingleDirectory(subDirectoryName, currentDirectory));
        } else if (line.startsWith("$ ls")){
            continue;
        } else if (line.startsWith("dir")){
            const subDirectoryName = line.substring(4); // everything after "dir " in something like "dir hellodir"
            currentDirectory.addChild(new SingleDirectory(subDirectoryName, currentDirectory));
        } else { // should have just a size with a file
            const [size, filename] = line.split(" ");
            const newFile = new SingleFile(parseInt(size), filename, currentDirectory);
            currentDirectory.addChild(newFile);
        }

    }

    return root;
}

// const allFiles = buildFiles();
// console.log("BEFORE")
// console.log(allFiles.toString())
// console.log(allFiles.size())

function helper1(start: MyFileSystem): number {
    if (!start.isDirectory()){
        return 0;
    } else {
        if (start.size() <= 100000){
            return start.size() + start.children().map(c => helper1(c)).reduce((u,v) => u + v, 0);
        } else {
            return start.children().map(c => helper1(c)).reduce((u,v) => u + v, 0);
        }
    }
}

function solution1(){
    return helper1(buildFiles());
}

console.log(solution1());

function helper2(start: MyFileSystem, targetSize: number): number | undefined{
    if (!start.isDirectory()){
        return undefined;
    } else if (start.size() < targetSize){
        return undefined;
    } else {
        const possibleSubFiles: Array<number> = start.children().map(c => helper2(c, targetSize)).filter(c => c !== undefined).map(c => c as number);
        if (possibleSubFiles.length > 0){
            return Math.min(...possibleSubFiles);
        } else {
            return start.size();
        }
    }
}

function solution2(){
    const root = buildFiles();
    console.log(root.size(), " is the root size")
    const targetSize = root.size() - 40000000;
    console.log(helper2(root, targetSize));

}

solution2();

