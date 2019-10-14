const chalk = require('chalk'),
  credentials = require('./credentials')
  OF = require('openframe-jsclient'),
  OF = new OF(),
  isUrl = require('is-url');

var http = require('http');
http.globalAgent.maxSockets = 30;
var https = require('https');
https.globalAgent.maxSockets = 30;
var request = require('request');

console.log(chalk.yellow('=====================================================================')); // just a visual divider on the console 

OF.users.login(credentials)
  .then(token => {
    // console.log(token);
  });

let artworks
let available = 0

OF.artwork.fetch({
    limit: 0,                                
    where: {                                 
      is_public : true                          
    }
  })
  .then(_artworks => {
    artworks = _artworks
    console.log('Found ' + chalk.magenta(artworks.length) + ' public artworks.')
    console.log()
    // console.log(artworks[0])
    
    for (let artwork of artworks) {
            
      if (!isUrl(artwork.url)) {
        console.log(artwork.id + chalk.red(' Invalid URL ') + artwork.url)
        continue
      }
      
      let artworkRequest = request({
          url: artwork.url,
          // maxAttempts: 3,   // (default) try 3 times
          // retryDelay: 2000  // (default) wait for 3s before trying again
        })
        .on('error', function(err) {
          if (err.errno = 'ENOTFOUND') {
            console.log(artwork.id + chalk.red(' ENOTFOUND server can not be found '))
            
          } else {
            console.log(artwork.id + chalk.red(' error ')  + artwork.url)
            console.log(err)            
          }
        })
        .on('response', function(_response) {
          response = _response
          
          if (response.statusCode == 200) {
            // console.log(artwork.id + chalk.green(' available'))
            available++
            // logSingleLine(finished + "/" + count);
          }
          else if (response.statusCode == 403) {
            console.log(artwork.id + chalk.red(' ' + response.statusCode + ' Forbidden '))
            // this.about
          }
          else if (response.statusCode == 404) {
            console.log(artwork.id + chalk.red(' ' + response.statusCode + ' Not found '))
            // this.about
          }
          else {
            console.log(artwork.id + chalk.yellow(' ' + response.statusCode + ' unsure ')  + ' ' + artwork.url)
          } 
          
          artworkRequest.abort()
          // else if (response.statusCode == 400) {
          //   console.log(artwork.id + " failed. Will try again");
          //   // this.about
          // }
          
        })
        .on('end', function(){
          
        })
    }
  });

// TODO: this currently throws an error
// OF.users.logout()
//   .then(() => {
//     // success, no response body
//   })
//   .catch(error => {
//     console.log(error);
//   });


// quick and dirty. doing this on exit ensures that all requests have finished
process.on ('exit', code => {
  if (code > 0) {
    console.log ('Hmm something went wrong');
  } else {
    console.log()
    console.log(chalk.green(available) + '/' + chalk.magenta(artworks.length) + ' artworks available')
    console.log(chalk.red(artworks.length - available) + ' artworks unavailable')
  }
});