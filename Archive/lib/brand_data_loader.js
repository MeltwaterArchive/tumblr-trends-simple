var config = require('../config.json'),
    fs = require('fs'),
	csv = require('node-csv').createParser();

var regexDomain = /[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})/;

/* Module methods and properties */
var brands = function brands(){
    
    this.load = function(callback) {

    	$this = this;
    	$this.all = {};
    	$this.domains = new Array();

        // Load list of brands
		csv.parseFile('./data/brands.csv', function(err, data) {

			var bResults = {};

			// Skip header row
			data = data.slice(1);

			data.forEach(function(brand) {
				$this.all[brand[0]] = { name: brand[1], url: brand[2], image: brand[3] };
				$this.domains.push(brand[2].match(regexDomain)[0]);
			});

			callback();

		});

    };

    this.getBrand = function(key)
    {
        return this.all[key];
    }
 
    if(brands.caller != brands.getInstance){
        throw new Error("This object cannot be instantiated");
    }
}


/*  Singleton pattern */

brands.instance = null;
 
brands.getInstance = function(){
    if(this.instance === null){
        this.instance = new brands();
    }

    return this.instance;
}

module.exports = brands.getInstance();