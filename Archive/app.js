var webserver = require('./lib/webserver'),
	datasift = require('./lib/datasift'),
	publisher = require('./lib/publisher'),
    brands = require('./lib/brand_data_loader');

brands.load(function() {
	datasift.start();
	webserver.start();
	publisher.start();
});

