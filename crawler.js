const puppeteer = require("puppeteer-lambda");

async function crawler({ url }) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  let page = null;
  let html = false;

  try {
    page = await browser.newPage();
    //networkidle0: consider navigation to be finished when
    //there are no more than 2 network connections for at least 500 ms.
    //(https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegobackoptions)
    await page.goto(url, { waitUntil: "networkidle0" });
    html = await page.content();
  } catch (e) {
    debug.warn(`Not able to fetch ${url}`);
  } finally {
    if (page) {
      await page.close();
    }
    return html;
  }
}

module.exports = { crawler };
