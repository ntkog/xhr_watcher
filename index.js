
const fs = require('fs');
const url = require('url');
const puppeteer = require('puppeteer');
const md5file = require('md5-file');
const URL_TO_INSPECT = process.argv[2];
const TEMP_PREFIX = '.temp';
const SEPARATOR = '_';
var jsonList = [];

function checkGeo (obj) {
  // Basic and poor check -> If Object has center or zoom as first root keys
  return Object.keys(obj).filter(key => /(zoom|center)/.test(key)).length > 0;
}

function formatFilename(urlStr) {
  return `${url.parse(urlStr).pathname.replace(/\//g, SEPARATOR)}.json`;
}

function checkChanges(f1) {
    let f1md5 = md5file.sync(f1);
    let f1tempmd5 = md5file.sync(`${f1}${TEMP_PREFIX}`);
    if ( f1md5 === f1tempmd5 ) {
      console.log("No changes")
    } else {
      console.log("Detected changes");
    }
    console.log(f1md5);
    console.log(f1tempmd5);

}

function WrapperwriteFileCb(filen) {
  return function (err) {
    if (err) {
        console.log(err);
    }
    if (fs.existsSync(`${filen}${TEMP_PREFIX}`)) {
      checkChanges(filen);
    }  else {
      console.log(`First Time downloading this file : [${filen}]`);
    }
  };
}

function writeToFile(filename, json) {
    fs.writeFile(fs.existsSync(`${filename}`) ? `${filename}${TEMP_PREFIX}` : filename , JSON.stringify(json), WrapperwriteFileCb(filename));
}

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterceptionEnabled(true);
    page.on('request', request => {
        if (request.resourceType === 'XHR') {
            console.log(`Found AJAX request [${request.url}]`);
        }
        request.continue();
    });
    page.on('response', response => {
        if (/json/.test(response.headers['content-type'])) {
            if (response.ok) {
                console.log(`Got JSON from [${response.request().url}]`);
                response.json().then(function(obj) {
                    jsonList.push(Object.assign({}, {fromUrl : response.request().url},obj));
                });
            } else {
                console.error("We couldn't fetch json")
            }
        }
    })

    await page.goto(URL_TO_INSPECT);

    jsonList
      .filter(checkGeo)
      .map(obj => {
        let filename = formatFilename(obj.fromUrl);
        delete obj.fromUrl;
        writeToFile(filename , obj);
      });
    await browser.close();

})();
