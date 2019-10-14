Checks availability of public artworks in an [Openframe](http://openframe.io) database.

It requests all public artwork from the server using [Openframe-JSClient](https://github.com/OpenframeProject/Openframe-JSClient). It then checks every artwork URL. In case it doesn't return with HTTP-Statuscode 200 (OK) an error is displayed. It also shows some statistics.

This should be extended in the future to implement https://github.com/OpenframeProject/Openframe-WebApp/issues/7 and push back the results to the API.
@jmwohl:
> We could probably run a scheduled task that would look for missing art work files and either mark or remove them from the stream and notify their author. Not too complicated, if anyone wants to work on something like that it would happen in the Openframe-APIServer repo. Probably could be an admin authorized endpoint that gets hit via cron?

# Setup

1. `npm install`
2. edit credentials in `credentials.js`

# Run

`node checkAvailability`

# Example output

Output on 15th Oct 2019:
```
Found 324 public artworks.

57841827c0006da8310e8e69 Invalid URL meetar.github.io/terrain-tour
56e4dc3f44973147579abbef ENOTFOUND server can not be found 
57041cdee1f87ce61cc0af07 ENOTFOUND server can not be found 
572114b0c2cb33000be1eea2 ENOTFOUND server can not be found 
570c0c7c708dc5311ca1e4c8 404 Not found 
570f716e507bfb8922c89814 403 Forbidden 
56e0c15e17bbab454407c2b7 404 Not found 
57a85d5bc0006da8310e906b 404 Not found 
576ae072c0006da8310e8b89 404 Not found 
57640ff1c0006da8310e8a94 404 Not found 
57640f99c0006da8310e8a90 404 Not found 
59711251b2462d7382b8f530 404 Not found 
5970fe40b2462d7382b8f52f 404 Not found 
597219fbb2462d7382b8f53f 404 Not found 
5972196db2462d7382b8f53e 404 Not found 
59711293b2462d7382b8f534 404 Not found 
588d38697cb7f28d67893075 404 Not found 
5a7876c3b2462d7382b8fa63 403 Forbidden 
576994d0c0006da8310e8b6c 404 Not found 
5af67553a38167076035b505 403 Forbidden 
5cd6da5aa38167076035bc00 403 Forbidden 
5af67510a38167076035b504 403 Forbidden 
5af67576a38167076035b506 403 Forbidden 
56e5c923a6b560d606184662 404 Not found 
57846752c0006da8310e8e89 404 Not found 
5b3d1c31a38167076035b5d6 403 Forbidden 
584d65957cb7f28d67892d8e 403 Forbidden 
5896d4c6a9c1b11803b240fb 404 Not found 
59b615adb2462d7382b8f5de 404 Not found 
59b615d1b2462d7382b8f5df 404 Not found 
59b61573b2462d7382b8f5dd 404 Not found 

293/324 artworks available
31/324 artworks unavailable
283/324 thumbnails available

Artwork type counts:
openframe-glslviewer: 189
openframe-image: 82
openframe-website: 13
openframe-video: 5
openframe-of: 2
openframe-processing: 2

Duplicate artwork URLs:
https://thebookofshaders.com/log/160306213426.frag: 2
https://goo.gl/images/Y1weHm: 2
https://goo.gl/images/j9YfL2: 2
https://thebookofshaders.com/log/160414134236.frag: 2
```