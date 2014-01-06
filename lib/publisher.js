var config = require('../config.json'),
    webserver = require('./webserver'),
    brands = require('./brand_data_loader'),
    tracker = require('./tracker');

/* Module methods and properties */
var publisher = function publisher(){
    
    this.publish = function() {

        tracker.getStats(function(stats) {

            stats.forEach(function(stat,index,arr) {
                arr[index].label = brands.getBrand(stat.key).name;
            });

            webserver.pushResults(stats);
        });

    };

    this.start = function() {
	    // Set publishing (interval is number of milliseconds)
	    setInterval(this.publish.bind(this), config.publishing.interval);
    };
 
    if(publisher.caller != publisher.getInstance){
        throw new Error("This object cannot be instantiated");
    }
}

/*  Singleton pattern */

publisher.instance = null;
 
publisher.getInstance = function(){
    if(this.instance === null){
        this.instance = new publisher();
    }

    return this.instance;
}

module.exports = publisher.getInstance();