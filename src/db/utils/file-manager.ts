import fs from "fs/promises";
import path from "path";

export class FileManager {
  private resolveFilePath = (dirname: string, relativeFilePath: string) => {
    return path.resolve(dirname, relativeFilePath);
  };

  public getDataFromFile = async <T>(currDir: string, relativeFilePath: string) => {
    const filePath = this.resolveFilePath(currDir, relativeFilePath);
    const rawData = await fs.readFile(filePath, "utf-8");
    const data: T[] = JSON.parse(rawData);
    return data;
  };
}
