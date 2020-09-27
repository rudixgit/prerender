require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const chromium = require("chrome-aws-lambda");
const isbot = require("isbot");

app.get("*", async function (req, res) {
  res.set("Content-Type", "text/html");

  if (isbot(req.get("user-agent"))) {
    let browser = null;

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    let page = await browser.newPage();
    await page.goto("https://news.rudixlab.com" + req.originalUrl, {
      waitUntil: "networkidle0",
    });
    const html = await page.content(); // serialized HTML of page DOM.
    await browser.close();
    res.end(html);
  } else {
  }
});

if (!process.env.LAMBDA_RUNTIME_DIR) {
  app.listen(process.env.PORT || 3000);
  console.log("working on localhost");
}

module.exports.handler = serverless(app);
