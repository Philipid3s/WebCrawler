var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var config = require('./config');

var urlArray = [];
var emailArray = [];

urlToParse = config.url;
levelMax = config.levelMax;

urlArray.push(urlToParse);
parseUrl(urlToParse, 0);

function parseUrl(url, level = 0) {

  if (level > levelMax) {
    return
  }

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {

      const $ = cheerio.load(body);

      $('a').each(function( index ) {
        var urlChild =  $(this).attr("href");

        // check if email address is part of the href
        var email = checkEmail(urlChild);
        if (email != undefined) {
          if(emailArray.indexOf(email) < 0 && email != undefined) {
            // add email to array
            emailArray.push(email);
          };
        }
        else if (urlArray.indexOf(urlChild) < 0 && urlChild != undefined) {
          // add url to array
          urlArray.push(urlChild);

          // appel recursif a parseUrl -- on incremente level
          parseUrl(urlChild, level + 1);
        };
      });
    };
  });
};

function checkEmail(href) {
  if (href != undefined && href.indexOf("mailto:") >= 0) {
    return  href.substr(7);
  };
};

function printResult() {
  console.log("===== urls =====");
  console.log(urlArray);
  console.log("===== emails =====");
  console.log(emailArray);
};

// callback print after 30 sec.
setTimeout(printResult, 30000);
