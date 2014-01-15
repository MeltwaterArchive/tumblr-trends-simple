var express = require('express'),
    http = require('http'),
    config = require('../config.json'),
    sockets = require('socket.io');

/* Module methods and properties */
var webserver = function webserver(){

	this.start = function() {

		// Create the web server
		var app = express();
		var server = http.createServer(app);

		console.log("Starting server, listening on: " + process.env.PORT + ", or " + config.port);
		server.listen(process.env.PORT || config.port);

		this.io = sockets.listen(server, { log: false });

		// Setup view engine
		app.engine('.html', require('ejs').__express);
		app.set('views', './views');
		app.set('view engine', 'html');
		app.use(express.static('./public'));

		app.get('/', function (req, res) {
		  res.render('index');
		});

	};

	this.pushResults = function(results) {
		this.io.sockets.emit('results', results );
	};

};

/*  Singleton pattern */

webserver.instance = null;
 
webserver.getInstance = function(){
    if(this.instance === null){
        this.instance = new webserver();
    }

    return this.instance;
}

module.exports = webserver.getInstance();