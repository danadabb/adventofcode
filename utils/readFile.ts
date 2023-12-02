import * as fs from "fs";
import { EOL } from "os";

export const readFile = (filePath: string): string[] => {
  return fs.readFileSync(filePath, "utf8").split(EOL);
  // .map((a) => a.split(""));
};
