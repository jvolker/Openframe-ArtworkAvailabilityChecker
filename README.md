Checks availability of public artworks in an [Openframe](http://openframe.io) database.

It requests all public artwork from the server using [Openframe-JSClient](https://github.com/OpenframeProject/Openframe-JSClient). It then checks every artwork URL. In case it doesn't return with HTTP-Statuscode 200 (OK) an error is displayed. It also counts how many are available / failed.

This should be extended in the future to implement https://github.com/OpenframeProject/Openframe-WebApp/issues/7 and push back the results to the API.
@jmwohl:
> We could probably run a scheduled task that would look for missing art work files and either mark or remove them from the stream and notify their author. Not too complicated, if anyone wants to work on something like that it would happen in the Openframe-APIServer repo. Probably could be an admin authorized endpoint that gets hit via cron?

# Setup

1. `npm install`
2. edit credentials in `credentials.js`

# Run

`node checkAvailability`