import { RemoteJobsOnlyFilter, experienceLevelFilter, jobTypeFilter, password, salaryLevelFilter, username } from "../configs/job-search-config";
import { printToFileAndConsole } from "./FileUtils";
import { isAlreadyIncluded, textIncludesWords } from "./StringUtils";
import { getTextFromElement, isElementPresent } from "./WebElementUtils";

export async function linkedInEnterPosition(text, page) {
  const locatorJobNameInput = "//*[@aria-label='Search by title, skill, or company'][1]";
  await page.locator(locatorJobNameInput).click();
  await page.locator(locatorJobNameInput).clear();
  await page.locator(locatorJobNameInput).type(text);
  await page.waitForTimeout(2000);
}

export async function linkedInEnterLocation(text, page) {
  const locatorJobLocationInput = '//*[@aria-label="City, state, or zip code"][1]';
  await page.locator(locatorJobLocationInput).click();
  await page.locator(locatorJobLocationInput).clear();
  await page.locator(locatorJobLocationInput).type(text);
  await page.waitForTimeout(2000);
}

export async function linkedInSearchPosition(positionName, location) {
  const page = process.playwrightPage;
  printToFileAndConsole(`Search positions: ${positionName}`);
  await linkedInEnterPosition(positionName, page);
  await linkedInEnterLocation(location, page);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
}

export async function linkedInGetTotalResults() {
  const result = await getTextFromElement('.jobs-search-results-list__subtitle');
  printToFileAndConsole('');
  printToFileAndConsole(`Number of results on the top: ${result}`);
  return result;
}

const locatorAuthWall1 = '//button[@class="authwall-join-form__form-toggle--bottom form-toggle"]';
const locatorAuthWall2 = 'a.sign-in-form__sign-in-cta';
const locatorUsername = '//*[@autocomplete="username" or @id="username"]';
const locatorPassword = '//*[@autocomplete="current-password"]';
const locatorSignInButton1 = '//button[@type="submit"][contains(text(),"Sign in")]';
const locatorSignInButton2 = '//button[contains(text(),"Sign in")]';
const locatorJobsMenu = '//*[@title="Jobs"]';

export async function linkedInLogin(page) {
  await page.goto('https://www.linkedin.com/');
  await page.waitForTimeout(5000);
  if ((await page.$$(locatorAuthWall1)).length > 0) {
    await page.locator(locatorAuthWall1).click();
    await page.waitForTimeout(1000);
  }
  if ((await page.$$(locatorUsername)).length == 0) { // sometimes blank page appears
    await page.reload();
    await page.waitForTimeout(5000);
    if ((await page.$$(locatorAuthWall1)).length > 0) {
      await page.locator(locatorAuthWall1).click();
      await page.waitForTimeout(1000);
    }
  }
  if ((await page.$$(locatorAuthWall2)).length > 0) {
    await page.locator(locatorAuthWall2).click();
    await page.waitForTimeout(1000);
  }
  await page.locator(locatorUsername).type(username);
  await page.locator(locatorPassword).type(password);
  if ((await page.$$(locatorSignInButton1)).length > 0) {
    await page.locator(locatorSignInButton1).click();
  } else {
    await page.locator(locatorSignInButton2).first().click();
  }
  await page.waitForTimeout(10000);
  await page.locator(locatorJobsMenu).click();
  await page.waitForTimeout(2000);
}

async function clickOnFilterOption(text) {
  const page = process.playwrightPage;
  if (text === '') {
    return;
  }
  if (await isElementPresent(`//span[text()="${text}"]`)) {
    await page.locator(`//span[text()="${text}"]`).first().click();
    await page.waitForTimeout(2000);
  } else {
    printToFileAndConsole(`..........WARNING: cannot find option [${text}] on the page`);
  }
}

export async function linkedInSetUpFilters(page, linkedinDatePostedFilter) {
  await page.locator('//*[text()="All filters"]').click();
  await page.waitForTimeout(2000);
  // await page.locator('//*[text()="Most recent"]').first().click();
  // await page.waitForTimeout(2000);
  if (experienceLevelFilter) {
    for (const exp of experienceLevelFilter) {
      await clickOnFilterOption(exp);
    }
  }
  if (jobTypeFilter) {
    for (const exp of jobTypeFilter) {
      await clickOnFilterOption(exp);
    }
  }
  if (salaryLevelFilter) {
    await clickOnFilterOption(salaryLevelFilter);
  }
  await page.locator('//button[@data-test-reusables-filters-modal-show-results-button]').click(); // show results button
  await page.waitForTimeout(5000);
  // // set up date posted filter
  await page.locator('//*[text()="Date posted"]').click();
  await page.waitForTimeout(2000);
  await page.locator('//*[text()="' + linkedinDatePostedFilter + '"]').click();
  await page.waitForTimeout(2000);
  await page.locator('//*[text()="Past month"]/following::button[2]').click(); // apply button
  await page.waitForTimeout(5000);
}

export async function linkedInGetJobDescription(page, jobLink) {
  const locatorJobDescriptionOnJobPage = '//*[contains(@class,"jobs-description__content")]';
  const locatorSalaryOnJobPage = '//*[@href="#SALARY" or @class="job-details-jobs-unified-top-card__job-insight"]';
  try {
    await page.goto(jobLink);
  } catch (error) {
    printToFileAndConsole(`..........WARNING: error opening page [${jobLink}], trying again`);
    await page.goto(jobLink);
  }
  await page.waitForTimeout(5000);
  let jd = 'EMPTY JD';
  if ((await page.$$(locatorJobDescriptionOnJobPage)).length > 0) {
    jd = (await page.locator(locatorJobDescriptionOnJobPage).textContent()).trim();
  }
  if ((await page.$$(locatorSalaryOnJobPage)).length > 0) {
    const salary = (await page.locator(locatorSalaryOnJobPage).first().textContent()).trim();
    jd = jd + ' ' + salary;
  }
  if (jd.length < 30) {
    printToFileAndConsole(`..........WARNING: short job description or cannot extract it - ${jobLink}`);
  }
  return jd;
}

const tempSetToExcludeDuplicates = new Set();

export async function linkedInGetAllUnfilteredJobsOnOnePage(page) {
  const unfilteredJobsOnOnePage = new Set();
  const jobNames = [];
  const jobCompanies = [];
  const jobLinks = [];
  const locatorJobNames = 'a.job-card-container__link span strong'; // text // ".artdeco-entity-lockup__title a.job-card-container__link";
  const locatorJobCompanies = '//*[@data-view-name="job-card"]//*[contains(@class,"artdeco-entity-lockup__subtitle")]'; // '.job-card-container__primary-description';
  const locatorJobLinks = 'a.job-card-container__link'; // href
  try {
    if ((await page.$$('//*[text()="No matching jobs found."]')).length > 0) {
      printToFileAndConsole('');
      printToFileAndConsole('No matching jobs found.');
      printToFileAndConsole('');
      return unfilteredJobsOnOnePage;
    }
    try {
      await page.locator(locatorJobNames).first().hover();
    } catch (ingore) {
      printToFileAndConsole('ERROR HOVERING OVER A JOB NAME');
    }
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(1000);
    }
    const jobNamesElements = await page.$$(locatorJobNames);
    for (let el of jobNamesElements) {
      const name = (await el.textContent()).trim();
      jobNames.push(name);
    }
    const jobLinksElements = await page.$$(locatorJobLinks);
    for (let el of jobLinksElements) {
      const href = await el.getAttribute('href');
      let shortUrl = href.substring(0, href.indexOf("?eBP="));
      if (shortUrl === '') {
        if (href.includes('?currentJobId=') && href.includes('&eBP=')) {
          const jobId = href.substring(href.indexOf("?currentJobId=") + 14, href.indexOf("&eBP="));
          shortUrl = `/jobs/view/${jobId}/`;
        } else {
          shortUrl = href;
        }
      }
      jobLinks.push(`https://www.linkedin.com${shortUrl}`);
    }
    const companyNamesElements = await page.$$(locatorJobCompanies);
    for (let el of companyNamesElements) {
      const company = (await el.textContent()).trim();
      jobCompanies.push(company);
    }
    if (jobNames.length < 1) {
      printToFileAndConsole('No matching jobs found.')
    }
    for (let i = 0; i < jobNames.length; i++) {
      const jobEntryIncludingLink = `${jobCompanies[i]} --- ${jobNames[i]} --- ${jobLinks[i]}`
      const jobEntryCompanyAndPositionOnly = `${jobCompanies[i]} --- ${jobNames[i]}`
      if (!tempSetToExcludeDuplicates.has(jobEntryCompanyAndPositionOnly)) {
        tempSetToExcludeDuplicates.add(jobEntryCompanyAndPositionOnly);
        unfilteredJobsOnOnePage.add(jobEntryIncludingLink);
      }
    }
  } catch (error) {
    console.log('page crashed: Error: page.$$: Target crashed');
    await page.reload();
    await page.waitForTimeout(5000);
  }
  return unfilteredJobsOnOnePage;
}

let filteredOutJobs = new Set();

export async function linkedInCollectJobsAfterFiltersApplied(page, jobsFromAllPagesWithFilteredNames, pageLimitToSearch, CompanyOrJobNameToExclude, jobNamePartsToInclude) {
  let pageCount = 1;
  let continueSearch = true;
  while (continueSearch) {
    const unfilteredJobsOnOnePage = await linkedInGetAllUnfilteredJobsOnOnePage(page);
    for (let job of unfilteredJobsOnOnePage) {
      let jobNamePartsToIncludeFlag = true;
      if (jobNamePartsToInclude !== undefined) {
        if (jobNamePartsToInclude.length !== 0) {
          jobNamePartsToIncludeFlag = textIncludesWords(job, jobNamePartsToInclude);
        }
      }
      let CompanyOrJobNameToExcludeFlag = true;
      if (CompanyOrJobNameToExclude !== undefined) {
        if (CompanyOrJobNameToExclude.length !== 0) {
          CompanyOrJobNameToExcludeFlag = !textIncludesWords(job, CompanyOrJobNameToExclude);
        }
      }

      if (jobNamePartsToIncludeFlag && CompanyOrJobNameToExcludeFlag && !isAlreadyIncluded(job, jobsFromAllPagesWithFilteredNames)) {
        jobsFromAllPagesWithFilteredNames.add(job);
      } else {
        filteredOutJobs.add(job);
      }
    }
    pageCount++;
    if ((await page.$$(`//*[@aria-label='Page ${pageCount}']`)).length > 0) {
      if (pageCount > pageLimitToSearch) {
        printToFileAndConsole("More than " + pageLimitToSearch + " pages, stop search");
        continueSearch = false;
      } else {
        printToFileAndConsole("Opening page: " + pageCount);
        await page.locator(`//*[@aria-label='Page ${pageCount}']`).click();
        await page.waitForTimeout(5000);
      }
    } else {
      printToFileAndConsole("No more pages, last page was: Page " + (pageCount - 1));
      continueSearch = false;
    }
  }
}

export async function linkedInOpenEachPosition(set, page, descriptionStopWordsArray) {
  if (descriptionStopWordsArray === undefined || descriptionStopWordsArray.length === 0) {
    return;
  }
  const amountOfJobs = set.size;
  printToFileAndConsole(`Opening each position to check each job description for stop words: ${amountOfJobs} positions found`);
  let m = 1;
  for (let job of set) {
    printToFileAndConsole(`Opening position ${m} out of ${amountOfJobs}`);
    const jd = await linkedInGetJobDescription(page, job.split(" --- ")[2]);
    if (textIncludesWords(jd, descriptionStopWordsArray)) {
      set.delete(job);
    }
    m++;
  }
}