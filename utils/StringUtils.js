import { printToFileAndConsole } from "./FileUtils";

export function getDateAndTime() {
  return (new Date()).toLocaleString().replace(/(:|\/)/g, '-').replace(/,/g, '').replace(/\s/g, '_');
}

export function textIncludesWords(text, arrayOfWords) {
  for (let stopWord of arrayOfWords) {
    if (text.toLowerCase().includes(stopWord.toLowerCase())) {
      return true;
    }
  }
  return false;
}

export function isAlreadyIncluded(item, collection) {
  const parts = item.split(" --- ");
  const companyAndPosition = parts[0] + " --- " + parts[1];
  for (let job of collection) {
    if (job.includes(companyAndPosition)) {
      //printToFileAndConsole( `${job} contains stop phrase ${companyAndPosition}`)
      return true;
    }
  }
  return false;
}