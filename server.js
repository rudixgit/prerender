const serverless = require("serverless-http");
const express = require("express");
const app = express();
const chromium = require("chrome-aws-lambda");

app.get("*", async function (req, res) {
  res.set("Content-Type", "text/html");
  let browser = null;

  browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  let page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (
      ["image", "stylesheet", "font", "other"].includes(request.resourceType())
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
  await page.goto("https://news.rudixlab.com" + req.originalUrl, {
    waitUntil: "networkidle0",
  });
  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();
  res.end(html);
});

if (!process.env.LAMBDA_RUNTIME_DIR) {
  app.listen(process.env.PORT || 3000);
  console.log("working on localhost");
}

module.exports.handler = serverless(app);
