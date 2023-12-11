export async function getAttributeFromElements(page, locator, attribute) {
  const elements = await page.$$(locator);
  const values = new Set();
  for (let b of elements) {
    const c = await b.getAttribute(attribute);
    values.add(c);
  }
  return values;
}

export async function isElementPresent(locator) {
  const page = process.playwrightPage;
  return (await page.$$(locator)).length > 0
}

export async function getTextFromElement(locator) {
  const page = process.playwrightPage;
  let result = '';
  if (await isElementPresent(locator)) {
    const textContent = await (await page.$(locator)).textContent();
    result = textContent.trim().replace(/\n/g, ' ');
  }
  return result;
}