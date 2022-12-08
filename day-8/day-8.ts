import * as fs from "fs";
import { EOL } from "os";

console.time("Time");

const processOutput = () => {
  return fs
    .readFileSync(__dirname + "/input.txt", "utf8")
    .split(EOL)
    .map((a) => a.split(""));
};

const main = async () => {
  const treeGrid = processOutput();
  let totalVisibleTrees = 0;
  let bestScenicScore = 0;
  for (let row = 1; row < treeGrid.length - 1; row++) {
    for (let column = 1; column < treeGrid[row].length - 1; column++) {
      // check left
      let visibleTrees = [true, true, true, true];
      let scenicScore = [0, 0, 0, 0];

      for (let i = column - 1; i >= 0; i--) {
        visibleTrees[0] = false;
        scenicScore[0] = Math.abs(column - i);
        if (treeGrid[row][i] >= treeGrid[row][column]) {
          break;
        }
      }

      // check right
      for (let i = column + 1; i < treeGrid[row].length; i++) {
        scenicScore[1] = Math.abs(column - i);
        if (treeGrid[row][i] >= treeGrid[row][column]) {
          visibleTrees[1] = false;
          break;
        }
      }

      // check top
      for (let i = row - 1; i >= 0; i--) {
        scenicScore[2] = Math.abs(row - i);
        if (treeGrid[i][column] >= treeGrid[row][column]) {
          visibleTrees[2] = false;
          break;
        }
      }

      // check bottom
      for (let i = row + 1; i < treeGrid.length; i++) {
        scenicScore[3] = Math.abs(row - i);
        if (treeGrid[i][column] >= treeGrid[row][column]) {
          visibleTrees[3] = false;
          break;
        }
      }
      if (visibleTrees.includes(true)) {
        totalVisibleTrees++;
      }

      const totalScenicScore = scenicScore.reduce((a, b) => a * b);
      if (totalScenicScore > bestScenicScore) {
        bestScenicScore = totalScenicScore;
      }
    }
  }

  const columns = treeGrid.length;
  const rows = treeGrid[0].length;
  const outsideTrees = columns * 2 + rows * 2 - 4;
  console.log("outside trees", outsideTrees);
  console.log("total trees ", totalVisibleTrees + outsideTrees);
  console.log("Best scenic score ", bestScenicScore);

  // track memory and time usage
  console.log(`Used ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
  console.timeEnd("Time");
};

main();
