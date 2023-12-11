import * as fs from 'fs';
import path from 'path';

const logsFolder = 'logs';

export const logsFolderPath = logsFolder + path.sep;

export function appendLogFile(fileName, line) {
  try {
    if (!fs.existsSync(logsFolder)) {
      fs.mkdirSync(logsFolder);
    }
  } catch (err) {
    console.error(err);
  }
  fs.appendFileSync(logsFolder + path.sep + fileName, `${line}\n`, 'utf8');
}

export function logToConsoleAndOutputFile(message, fileName) {
  console.log(message);
  appendLogFile(fileName, message);
}

export function printToFileAndConsole(line) {
  const fileName = process.fileName;
  console.log(line);
  if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
  }
  fs.appendFileSync(logsFolder + path.sep + fileName, `${line}\n`, 'utf8');
}