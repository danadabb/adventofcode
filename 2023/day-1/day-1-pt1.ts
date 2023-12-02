import path from "path";
import { readFile } from "../../utils/readFile";

const input = readFile(path.resolve(__dirname, "../day-1/day-1-pt1.txt"));

let total = 0;
for (let i = 0; i < input.length; i++) {
  let firstNumber: string;
  let lastNumber: string;
  for (let j = 0; j < input[i].length; j++) {
    const char = input[i][j];
    // check if current character is a number
    if (!isNaN(char as unknown as number)) {
      // if firstNumber hasnt been set, set it
      if (typeof firstNumber === "undefined") {
        firstNumber = char;
      }
      lastNumber = char;
    }
  }
  console.log(`number on line ${i}: ${firstNumber + lastNumber}`);
  total += parseInt(firstNumber + lastNumber);
}
console.log(total);
