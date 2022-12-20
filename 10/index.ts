// Want to find the 
import fs from 'fs';

function solution1(){
    let total_sum = 0;
    let running_val = 1;
    let index = 0
    fs.readFileSync(__dirname + "/input.txt").toString().split("\n").forEach((value, f) => {
        if (value === "noop"){
            index += 1
            if ((index -20)%40 === 0){
                console.log(value, running_val, index, "A" , f);
                total_sum += index * running_val
            }

            // nothing
        } else {
            index+=1;
            if ((index -20)%40 === 0){
                console.log(running_val, index , "B");
                total_sum += index * running_val
            }
            index+=1
            if ((index -20)%40 === 0){
                console.log(value, running_val, index, "C", f);
                total_sum += index * running_val
            }
            running_val += parseInt(value.substring(5));
        }
    })
    console.log(total_sum);
}

// solution1();


function solution2(){
    let output = ""
    let running_val = 1;
    let index = 0
    fs.readFileSync(__dirname + "/input.txt").toString().split("\n").forEach((value, f) => {

        
        if (value === "noop"){
            const current_pixel = index%40;
            console.log("sprite at", running_val, "pixel at", current_pixel);
            if (Math.abs(current_pixel - running_val) <= 1){
                output += "#";
            } else {
                output += ".";
            }
            index += 1
            if ((index)%40 === 0){
                output += "F\n"
            }

            // nothing
        } else {
            let current_pixel = index%40;
            console.log("sprite at", running_val, "pixel at", current_pixel);
            if (Math.abs(current_pixel - running_val) <= 1){
                output += "#";
            } else {
                output += ".";
            }
            index+=1;
            if ((index)%40 === 0){
                output += "U\n"
            }
            current_pixel = index%40;
            console.log("sprite at", running_val, "pixel at", current_pixel);
            if (Math.abs(current_pixel - running_val) <= 1){
                output += "#";
            } else {
                output += ".";
            }
            index+=1

            if ((index)%40 === 0){
                output += "L\n"
            }
            running_val += parseInt(value.substring(5));
        }
    })
    console.log(output);
}

solution2();