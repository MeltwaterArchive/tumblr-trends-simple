# Simple Tumblr Trending Wall

This code demonstrates a very simple trending wall for fashion brands on Tumblr, by consuming a [DataSift](http://datasift.com) stream. 

The application relies heavily on two excellent libraries to do the heavy lifting:

* [Node-Redis-Timeseries](https://github.com/tonyskn/node-redis-timeseries)
* [D3](http://d3js.org) 

Tumblr is a great data source for measuring engagement with products and brands. In this case I've chosen fashion brands, and the number of reblogs their original content generates.

## Pre-Requisites

* A local (or accessible) Redis server
* [Node.js](http://nodejs.org/) installed
* A [DataSift account](http://datasift.com/auth/register) (if you register you get some free credit to play with!)

## Running the Application

* Clone the repository to your machine
* Run **npm install**, to install node packages
* Run **node scripts/generate-csdl.js** to generate the CSDL definition to **stream.csdl**.
* Copy the contents of **stream.csdl** into a new DataSift stream. Save the stream, and make a note of the resulting stream hash.
* Create a config.json file in the project root

```javascript
{
    "port": "[port to run a local webserver, e.g. 8000]",
    "datasift": {
        "username": "[your DataSift user name]",
        "apikey": "[your DataSift API key]",
        "stream": "[stream hash from above]"
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

* Check your Redis server is running
* Run **node app.js**
* Open your browser to **http://localhost:8000** (or whatever port you specified)