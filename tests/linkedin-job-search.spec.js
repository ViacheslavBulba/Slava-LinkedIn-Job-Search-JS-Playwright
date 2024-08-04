const { test, expect } = require('@playwright/test');

import { CompanyOrJobNameToExclude, JobDescriptionsStopWordsArray, JobNamePartsToInclude, PositionsToSearch, RemoteJobsOnlyFilter, datePostedFilter, jobLocation, pageLimitToSearchForEachPosition, username } from '../configs/job-search-config';
import { printToFileAndConsole } from '../utils/FileUtils';
import { linkedInCollectJobsAfterFiltersApplied, linkedInLogin, linkedInOpenEachPosition, linkedInSearchPosition, linkedInSearchPositionInLasVegas, linkedInSearchPositionInRemote, linkedInSetUpFilters } from '../utils/LinkedIn';
import { getDateAndTime } from '../utils/StringUtils';

test.beforeEach(async ({ page, context, request }) => {
  process.playwrightPage = page;
  process.playwrightContext = context;
  process.playwrightRequest = request;
  process.fileName = getDateAndTime() + '.txt';
});

export function isAlreadyIncluded(item, collection) {
  const parts = item.split(' --- ');
  const companyAndPosition = parts[0] + ' --- ' + parts[1];
  for (let job of collection) {
    if (job.includes(companyAndPosition)) {
      printToFileAndConsole(`${job} contains stop phrase ${companyAndPosition}`)
      return true;
    }
  }
  return false;
}

async function enterPosition(i) {
  if (RemoteJobsOnlyFilter) {
    await linkedInSearchPosition(PositionsToSearch[i], 'Remote');
  } else {
    await linkedInSearchPosition(PositionsToSearch[i], jobLocation);
  }
}

test('linkedin job search', async ({ page }) => {
  printToFileAndConsole('Start time: ' + new Date().toLocaleString());
  if (username === 'YOUR_LINKEDIN_USERNAME') {
    printToFileAndConsole('');
    printToFileAndConsole('PLEASE SPECIFY YOUR USERNAME AND PASSWORD IN - /Slava-LinkedIn-Job-Search-JS-Playwright/configs/job-search-config.js');
    printToFileAndConsole('');
    expect(username, 'PLEASE SPECIFY YOUR USERNAME AND PASSWORD IN - /Slava-LinkedIn-Job-Search-JS-Playwright/configs/job-search-config.js').not.toBe('YOUR_LINKEDIN_USERNAME');
    return;
  }
  await linkedInLogin(page);
  await enterPosition(0);
  await linkedInSetUpFilters(page, datePostedFilter);
  const jobsFromAllPagesWithFilteredNames = new Set();
  await linkedInCollectJobsAfterFiltersApplied(page, jobsFromAllPagesWithFilteredNames, pageLimitToSearchForEachPosition, CompanyOrJobNameToExclude, JobNamePartsToInclude);
  for (let i = 1; i < PositionsToSearch.length; i++) {
    await enterPosition(i);
    await linkedInCollectJobsAfterFiltersApplied(page, jobsFromAllPagesWithFilteredNames, pageLimitToSearchForEachPosition, CompanyOrJobNameToExclude, JobNamePartsToInclude);
  }
  await linkedInOpenEachPosition(jobsFromAllPagesWithFilteredNames, page, JobDescriptionsStopWordsArray);
  printToFileAndConsole('');
  printToFileAndConsole('FILTERED POSITIONS FROM ALL PAGES: ' + jobsFromAllPagesWithFilteredNames.size);
  printToFileAndConsole('');
  let m = 1;
  for (let job of jobsFromAllPagesWithFilteredNames) {
    printToFileAndConsole(m + ' - ' + job);
    m++;
  }
  printToFileAndConsole('');
  printToFileAndConsole('ADD POSITIONS (AS ALREADY REVIEWED) TO - CompanyOrJobNameToExclude in /configs/job-search-config.js - TO IGNORE NEXT TIME: ' + jobsFromAllPagesWithFilteredNames.size);
  printToFileAndConsole('');
  for (let job of jobsFromAllPagesWithFilteredNames) {
    printToFileAndConsole('\'' + job.split(' --- ')[0] + ' --- ' + job.split(' --- ')[1] + '\',');
  }
  printToFileAndConsole('');
});