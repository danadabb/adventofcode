import path from "path";
import { readFile } from "../../utils/readFile";

const input = readFile(path.resolve(__dirname, "../day-1/day-1-pt2.txt"));

const numberRegex = [
  ["one", "o1e"],
  ["two", "t2o"],
  ["three", "thr3e"],
  ["four", "fo4r"],
  ["five", "f5ve"],
  ["six", "s6x"],
  ["seven", "se7en"],
  ["eight", "ei8ht"],
  ["nine", "n9ne"],
];

let total = 0;
for (let i = 0; i < input.length; i++) {
  let firstNumber: string;
  let lastNumber: string;
  let line = input[i];
  for (let j = 0; j < numberRegex.length; j++) {
    const [search, wordreplace] = numberRegex[j];
    const regex = new RegExp(search, "g");
    line = line.replace(regex, wordreplace);
  }

  // console.log(line);
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    // check if current character is a number
    if (!isNaN(char as unknown as number)) {
      // if firstNumber hasnt been set, set it
      if (typeof firstNumber === "undefined") {
        firstNumber = char;
      }
      lastNumber = char;
    }
  }

  console.log(`${firstNumber}${lastNumber}: ${input[i]}: ${line}`);
  total += parseInt(firstNumber + lastNumber);
}

console.log(total);
