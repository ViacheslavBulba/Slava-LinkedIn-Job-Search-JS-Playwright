# Automation for job search on LinkedIn

The project is built on JavaScript + Playwright.

Demo and how to use it video - https://youtu.be/_FYXGBorfyk

Project suppose to work on both Windows and Mac, but I am using Mac and don't have a Windows machine to test it on, so please let me know if you face any issues on Windows and I will do my best to fix issues if any.

# Getting started

1. Download and install NodeJS https://nodejs.org/en/download

Check installation by running in terminal:

```
node -v
```

2. Download and install text editor Visual Studio Code

https://code.visualstudio.com/download

Launch installed Visual Studio Code text editor.

In Visual Studio Code install "Playwright Test for VSCode" extension, it will allow you to run the code from the file in editor directly instead of using the terminal.

3. Download ZIP of the project from github and unarchive it.

In instructions below you will see PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM which refers to the project location in your file system, so please make sure to put your path value instead.

For example, if I have the project downloaded and unzipped to folder ~/Downloads/Slava-LinkedIn-Job-Search-JS-Playwright-main on my mac, then in my case PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM = ~/Downloads/Slava-LinkedIn-Job-Search-JS-Playwright-main

I would not recommend using spaces in folder names in your path to avoid hussle of surrounding path with quotes "", but if you have at least one space in any of your folder names along the way - put the path in "", e.g. - "~/Downloads/Slava-LinkedIn-Job-Search-JS-Playwright-main".

Open terminal and run commands:

```
cd PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM
npm install
```

It will install all dependencies.

After that run in terminal:

```
npx playwright install
```

# Set up config

Open the project folder in Visual Studio Code

Set up your search parameters in PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM/configs/job-search-config.js

```
export const username = "YOUR_LINKEDIN_USERNAME";
export const password = "YOUR_LINKEDIN_PASSWORD";
```

Set up your search parameters in PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM/configs/job-search-config.js

Put desired position names into array:

```
export const PositionsToSearch = [
  'Senior QA Automation Engineer',
  'SDET',
  'Test Automation Engineer',
];
```

# Run the search

Then run in terminal (or from Visual Studio Code under Testing Tab on the left)

```
npx playwright test
```

# Results

Each search run log will be written to a seprate file in logs folder, e.g. PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM/logs/12-9-2023_11-49-55_PM.txt

Log will be output to console/terminal as well as to a log file.

After each run - update config file with positions you already reviewed to filter them out next time when you run the search. To do that - add them into CompanyOrJobNameToExclude array in the job-search-config.js.

![](terminal_results.png)
