const chalk = require('chalk'),
  credentials = require('./credentials'),
  OF = new (require('openframe-jsclient'))(),
  isUrl = require('is-url');

var http = require('http')
http.globalAgent.maxSockets = 30
var https = require('https')
https.globalAgent.maxSockets = 30
var request = require('request')

//  script options ------------------------------------------

let useLogin = true

//  ------------------------------------------

console.log(chalk.yellow('=====================================================================')) // just a visual divider on the console 

let artworks
let artworkAvailable = 0
let thumbnailsAvailable = 0
let artworkTypeCounts = {}
let artworkUrlCounts = {}

function updateDatabase(artwork, isAvailable) {
  OF.artwork.update(artwork.id, { 
    is_public: false
  })
  .then(() => {
    console.log(artwork.id + chalk.red(' Unpublished artwork'))
  });
}

function emailUser(artwork) {
  OF.user.fetchById(artwork.ownerId)
  .then((user) => {
    // check if user has email address
    // send email 
    
    // console.log(artwork.id + chalk.yellow(' Emailed user'))
  });
}

function checkArtwork(artwork) {
  if (!isUrl(artwork.url)) {
    console.log(artwork.id + chalk.red(' Invalid URL ') + artwork.url)
    return
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
        artworkAvailable++            
        
        if (!artworkTypeCounts[artwork.format]) artworkTypeCounts[artwork.format] = 0;
        if (!artworkUrlCounts[artwork.url]) artworkUrlCounts[artwork.url] = 0;
        
        artworkTypeCounts[artwork.format]++
        artworkUrlCounts[artwork.url]++
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
      
      if (response.statusCode != 200 && useLogin) {
        console.log(artwork.id + ' unpublish artwork and email user')
        // updateDatabase(artwork, false)
        // emailUser(artwork)        
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

function checkThumbnail(artwork) {
  if (artwork.thumb_url) {
    let thumbnailRequest = request({
        url: artwork.thumb_url,
        // maxAttempts: 3,   // (default) try 3 times
        // retryDelay: 2000  // (default) wait for 3s before trying again
      })
      .on('error', function(err) {
        if (err.errno = 'ENOTFOUND') {
          // console.log(artwork.id + chalk.red(' ENOTFOUND server can not be found '))
          
        } else {
          // console.log(artwork.id + chalk.red(' error ')  + artwork.url)
          // console.log(err)            
        }
      })
      .on('response', function(_response) {
        response = _response
        
        if (response.statusCode == 200) {
          // console.log(artwork.id + chalk.green(' available'))
          thumbnailsAvailable++        
        }
        thumbnailRequest.abort()
      })
  } 
}

function analysePublicArtwork() {
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
                
      checkArtwork(artwork)
      checkThumbnail(artwork)

    }
  });
}

function logout() {
  OF.users.logout()
    .then(() => {
      // success, no response body
      console.log("successfully logged out")
    })
    .catch(error => {
      console.log(error);
    });  
}

if (useLogin) {
  // Login is not needed to read public artworks but in order to return the results later on
  OF.users.login(credentials)
    .then(token => {
      // console.log(token);
      analysePublicArtwork()
    });  
}
else {
  analysePublicArtwork()
}



// quick and dirty. doing this on exit ensures that all requests have finished
process.on ('exit', code => {
  if (code > 0) {
    console.log ('Hmm something went wrong');
  } else {
    if (useLogin) logout()
    
    console.log()
    console.log(chalk.green(artworkAvailable) + '/' + artworks.length + ' artworks available')
    console.log(chalk.red(artworks.length - artworkAvailable) + '/' + artworks.length + ' artworks unavailable')
    console.log(chalk.green(thumbnailsAvailable) + '/' + artworks.length + ' thumbnails available')
    
    // artwork type counts
    console.log()
    console.log('Artwork type counts:')
    let artworkTypeCountsSortedKeys = Object.keys(artworkTypeCounts).sort((a,b) => -(artworkTypeCounts[a] - artworkTypeCounts[b]))
    for (let artworkType of artworkTypeCountsSortedKeys) {
      let count = artworkTypeCounts[artworkType]
      console.log(artworkType + ': ' + chalk.yellow(count)) 
    }
    
    // duplicate artwork urls
    console.log()
    console.log('Duplicate artwork URLs:')
    let artworkUrlCountsSortedKeys = Object.keys(artworkUrlCounts).sort((a,b) => -(artworkUrlCounts[a] - artworkUrlCounts[b]))
    for (let artworkURL of artworkUrlCountsSortedKeys) {
      let count = artworkUrlCounts[artworkURL]
      if (count > 1) console.log(artworkURL + ': ' + chalk.yellow(count))
    }
  }
});