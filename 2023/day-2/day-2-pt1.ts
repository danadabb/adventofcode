import path from "path";
import { readFile } from "../../utils/readFile";

const input = readFile(path.resolve(__dirname, "../day-2/day-2-pt1.txt"));

// 12 red cubes, 13 green cubes, and 14 blue cubes
const MAX_VALUES: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};
let total = 0;
for (let i = 0; i < input.length; i++) {
  const gameId = i + 1;
  const outcome = input[i].match(/\d+ \w+/g);

  let eligible = true;
  for (let j = 0; j < outcome.length && eligible; j++) {
    const dice = outcome[j].split(" ");
    console.log(dice);
    if (parseInt(dice[0]) > MAX_VALUES[dice[1]]) {
      eligible = false;
    }
  }

  if (eligible) {
    total += gameId;
  }
}

console.log(total);
