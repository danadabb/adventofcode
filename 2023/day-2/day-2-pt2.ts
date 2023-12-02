import path from "path";
import { readFile } from "../../utils/readFile";

const input = readFile(path.resolve(__dirname, "../day-2/day-2-pt2.txt"));

let total = 0;
for (let i = 0; i < input.length; i++) {
  const gameId = i + 1;
  const outcome = input[i].match(/\d+ \w+/g);

  const results: Record<string, number> = {
    red: 0,
    green: 0,
    blue: 0,
  };

  let eligible = true;
  for (let j = 0; j < outcome.length && eligible; j++) {
    const dice = outcome[j].split(" ");
    const diceNumber = parseInt(dice[0]);
    if (diceNumber > results[dice[1]]) {
      results[dice[1]] = diceNumber;
    }
  }

  total += results.red * results.blue * results.green;
}

console.log(total);
