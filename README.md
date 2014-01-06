# Simple Tumblr Trending Wall

This code implements a very simple trending wall for fashion brands on Tumblr, by consuming a [DataSift](http://datasift.com) stream. 

## Pre-requisites

* A local (or accessible) Redis server
* [Node.js](http://nodejs.org/) installed
* A [DataSift account](http://datasift.com/auth/register) (if you register you get some free credit to play with!)

## To run...

* Clone the repository to your machine
* Run npm install
* Create a config.json file in the project root

```javascript
{
    "port": "[port to run a local webserver, e.g. 8000]",
    "datasift": {
        "username": "[your DataSift user name]",
        "apikey": "[your DataSift API key]",
        "stream": "[stream GUID created above]"
    },
    "store":
    {
        "prefix": "[prefix for keys in Redis, e.g. wall1]",
        "host": "[redis host, e.g. 127.0.0.1]",
        "port": [redis post, e.g. 6379]
    },
    "publishing":
    {
        "interval": [in milliseconds the time between pushes of results to the front-end, e.g. 5000]
    }
}
```

* Run **node app.js**