const serverless = require("serverless-http");
const express = require("express");
const app = express();
const chromium = require("chrome-aws-lambda");
const isbot = require("isbot");
const { getS3 } = require("./src/s3.js");
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
    await page.goto(
      "http://rudixworld.s3-website.eu-central-1.amazonaws.com" +
        req.originalUrl,
      {
        waitUntil: "networkidle0",
      }
    );
    const html = await page.content(); // serialized HTML of page DOM.
    await browser.close();
    res.end(html);
  } else {
    const contents = await getS3("index.html");

    res.end(
      contents.Body.toString().replace(
        /src="/g,
        'src="https://rudixworld.s3.eu-central-1.amazonaws.com'
      )
    );
  }
});

if (!process.env.LAMBDA_RUNTIME_DIR) {
  app.listen(process.env.PORT || 3000);
  console.log("working on localhost");
}

module.exports.handler = serverless(app);
