import * as fs from "fs";
import * as readline from "readline";

console.time("Time");

// 'File' is a reserved word
type FileNode = {
  name: string;
  size: number;
};

type Directory = {
  parent: Directory;
  name: string;
  files: FileNode[];
  childDirs: Directory[];
  size: number;
};

type Tree = {
  head: Directory;
};

const dirTree: Tree = {
  head: {
    childDirs: [],
    name: "/",
    files: [],
    parent: null,
    size: 0,
  },
};

enum Command {
  LS = "LS",
  CD = "CD",
  DIR = "DIR",
  FILE = "FILE",
}

const commandRegex: Record<Command, RegExp> = {
  [Command.LS]: /^\$ ls/,
  [Command.CD]: /^\$ cd (\w+|\/|\.+)/,
  [Command.DIR]: /^dir (\w+)/,
  [Command.FILE]: /^([0-9]+) ([\w|.]+)/,
};

let totalSize = 0;

const getCommandFromInput = (line: string): Command => {
  const result = Object.entries(commandRegex).find(([_, regex]) =>
    line.match(regex)
  );
  return result[0] as Command;
};

const processOutput = async () => {
  let currentNode = dirTree.head;

  const rl = readline.createInterface({
    input: fs.createReadStream("input.txt"),
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    const command = getCommandFromInput(line);
    switch (command) {
      case Command.DIR:
        const directoryName = line.match(commandRegex.DIR)[1]; // backref
        console.log(`~~~creating directory:${directoryName}`);
        currentNode.childDirs.push({
          parent: currentNode,
          name: directoryName,
          files: [],
          childDirs: [],
          size: 0,
        });
        break;
      case Command.FILE:
        const matchArray = line.match(commandRegex.FILE); // backref
        const file = {
          name: matchArray[2],
          size: Number(matchArray[1]),
        };

        console.log(`~~~creating file:${file.name}`);

        currentNode.files.push(file);
        break;
      case Command.CD:
        const newDir = line.match(commandRegex.CD)[1];

        console.log(`~~~move into directory ${newDir}`);

        if (newDir == "..") {
          currentNode = currentNode.parent;
        } else if (currentNode.childDirs.length > 0) {
          currentNode = currentNode.childDirs.find((dir) => dir.name == newDir);
        }
        break;
      default:
        break;
    }
  });

  await new Promise((res) => rl.once("close", res));

  // just checking used mem and time taken
  console.log("Total size ", totalSize);
  console.log(`Used ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
  console.timeEnd("Time");
};

processOutput().then(() => {
  findDirectoriesToDelete(dirTree.head);
  console.log("sum of the total sizes of those directories:", totalSize);
  const FREE_SPACE = 70000000 - dirTree.head.size;
  const MIN_DIR_SIZE = 30000000 - FREE_SPACE;
  console.log(
    "Size of smallest minimum delete: ",
    findSmallestDir(dirTree.head, MIN_DIR_SIZE)
  );
});

const dirsToDelete: Directory[] = [];
function findDirectoriesToDelete(root: Directory) {
  if (root.childDirs.length > 0) {
    root.childDirs.forEach((childDir) => {
      root.size += findDirectoriesToDelete(childDir);
    });
  }

  root.files.forEach((file) => {
    root.size += file.size;
  });

  if (root.size <= 100000) {
    dirsToDelete.push(root);
    totalSize += root.size;
  }
  return root.size;
}

function findSmallestDir(root: Directory, minimumSize: number) {
  const dirQueue: Directory[] = [root];
  let smallestSoFar = Infinity;
  while (dirQueue.length > 0) {
    const current = dirQueue.pop();
    if (current.size >= minimumSize && current.size < smallestSoFar) {
      smallestSoFar = current.size;
    }
    current.childDirs.forEach((childDir) => {
      dirQueue.push(childDir);
    });
  }

  return smallestSoFar;
}
