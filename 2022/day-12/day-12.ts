import * as fs from "fs";
import { EOL } from "os";

console.time("Time");

const processInput = () => {
  return fs
    .readFileSync(__dirname + "/input.txt", "utf8")
    .split(EOL)
    .map((a) => a.split(""));
};

function getNextChar(char: string) {
  return String.fromCharCode(char.charCodeAt(0) + 1);
}

type Node = {
  parent: Node;
  x: number;
  y: number;
  value: string;
  visited: boolean;
};

type Position = [x: number, y: number];

const DIRECTION_OFFSET: Record<string, Position> = {
  L: [-1, 0],
  R: [1, 0],
  U: [0, 1],
  D: [0, -1],
};

const tileIsAccessible = (from: string, to: string): boolean => {
  return from == "z" || getNextChar(from).localeCompare(to) >= 0;
};

const BFS = (
  graph: Node[][],
  root: Node,
  end: Node,
  reverse: boolean = false
): Node => {
  const pq = [];
  root.visited = true;
  pq.push(root);
  graph[root.y][root.x].visited = true;
  while (pq.length > 0) {
    const currentNode = pq.shift();
    if (currentNode.value == end.value) {
      return currentNode;
    }

    Object.entries(DIRECTION_OFFSET).forEach(([direction, offset]) => {
      const coordinates: Position = [
        currentNode.x + offset[0],
        currentNode.y + offset[1],
      ];
      if (
        coordinates[0] < 0 ||
        coordinates[1] < 0 ||
        coordinates[1] >= graph.length ||
        coordinates[0] >= graph[0].length
      ) {
        return;
      }

      const vertex = graph[coordinates[1]][coordinates[0]];
      const canAccessTile = reverse
        ? tileIsAccessible(vertex.value, currentNode.value)
        : tileIsAccessible(currentNode.value, vertex.value);
      if (
        !vertex.visited &&
        (canAccessTile || currentNode.value == "S" || currentNode.value == "E")
      ) {
        vertex.visited = true;
        vertex.parent = currentNode;
        pq.push(vertex);
      }
    });
  }
};

const input = processInput();

let graph: Node[][] = [];
let startPosition: Node;
let endPosition: Node;

for (let i = 0; i < input.length; i++) {
  graph[i] = [];
  for (let j = 0; j < input[i].length; j++) {
    graph[i][j] = {
      parent: null,
      x: j,
      y: i,
      value: input[i][j],
      visited: false,
    };
    if (input[i][j] == "S") {
      startPosition = {
        parent: null,
        x: j,
        y: i,
        value: "S",
        visited: false,
      };
    }

    if (input[i][j] == "E") {
      endPosition = {
        parent: null,
        x: j,
        y: i,
        value: "z",
        visited: false,
      };
      graph[i][j].value = "z";
    }
  }
}

// part 1

let path = BFS(graph, startPosition, endPosition);

let part1: string[] = [];

while (path.parent != null) {
  part1.unshift(path.value);
  path = path.parent;
}

console.log("shortest path from start to end", part1.length);

// part 2

// reset graph
for (let i = 0; i < graph.length; i++) {
  for (let j = 0; j < graph[i].length; j++) {
    graph[i][j].visited = false;
    graph[i][j].parent = null;
  }
}

path = BFS(
  graph,
  endPosition,
  {
    value: "a",
    visited: false,
    parent: null,
    x: null,
    y: null,
  },
  true
);

const part2: string[] = [];
while (path.parent != null) {
  part2.push(path.value);
  path = path.parent;
}

console.log("Shortest path from a", part2.length);
