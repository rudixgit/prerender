const https = require("https");
const fs = require("fs");
const md5 = require("md5");
const request = require("request");

const download = (url, callback) => {
  request.head(url, (err, res, body) => {
    request(url)
      .pipe(fs.createWriteStream("/tmp/test.jpg"))
      .on("close", callback);
  });
};
const AWS = require("aws-sdk");
const { resolve } = require("path");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "eu-central-1",
});

const getS3 = (id) => {
  return new Promise((resolve, reject) => {
    var s3Params = {
      Bucket: "rudixworld",
      Key: id,
    };
    s3.getObject(s3Params, function (err, res) {
      if (err === null) {
        resolve(res);
      } else {
        console.log(err);
        resolve("404");
      }
    });
  });
};

module.exports = { uploadFile, downloadFile, getS3 };
