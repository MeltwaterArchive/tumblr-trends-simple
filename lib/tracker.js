var config = require('../config.json'),
    TimeSeries = require('redis-timeseries'),
    async = require('async'),
    redis = require('redis').createClient(config.store.port, config.store.host);

/* Module methods and properties */
var tracker = function tracker(){

    // Create a new instance of redis-timeseries class
    var ts = new TimeSeries(redis, config.store.prefix);

    ts.granularities =  {
        '1minute'  : { ttl: ts.hours(2), duration: ts.minutes(1) }
    };

    this.getStore = function(){
        return ts;
    };

    this.trackEvents = function(object) {

        // Use first brand tag as key
        this.recordHit(object.interaction.tag_tree.brand[0]);

    };

    this.recordHit = function(key) {

        // Record timeseries data
        ts.recordHit(key).exec();

        // Add to set of mentions this hour
        var set_key = config.store.prefix + ":mentions:1hour:" + this.getCurrentHour();
        redis.sadd(set_key,key);
        redis.expire(set_key,ts.days(1));

    };

    // Gets aggregated set of stats for pushing to UI
    this.getStats = function(callback) {

        $this = this;

        // Get mentions of object in time window (2 hours)
        this.getMentionedInTimeWindow(2, function(err, mentions) {

            if(err)
                console.log("Error getting mentioned items: " + err.stack);
            else
            {
                $this.getEventCounts(mentions, 1, callback);
            }

        });

    };

    // Gets a list of all keys (brands) mentioned in a time window
    this.getMentionedInTimeWindow = function(hours, success) {

        var now = this.getCurrentHour();
        var set_keys = new Array();

        for(var h = 0; h < hours; h++)
        {
            var stamp = now - ts.hours(h);
            set_keys.push(config.store.prefix + ":mentions:1hour:" + stamp);
        }

        redis.sunion(set_keys, function(err, results){
            success(null, results);    
        }); 
    };

    // Gets aggregated counts for a set of keys in a time window
    this.getEventCounts = function(keys,hours,complete) {

        var key_data = new Array();
        $this = this;

        async.each(keys, 
            function(key,done) {

                $this.getStore().getHits(key, '1minute', hours*60, function(err, data) {
                    key_data[key] = data;
                    done();
                });

            },
            function(err){
                if(err)
                {
                    console.log(err);
                    complete();
                }
                else
                {
                    var counts = new Array();

                    for(key in key_data)
                    {
                        var total = key_data[key].reduce(function(a, b) {
                            return a + b[1];
                        },0);

                        counts[counts.length] = { key: key, value: total };
                    }

                    var results = counts.filter(function(a){
                        return a.value > 0;
                    }).sort(function(a, b) {
                        return b.value - a.value;
                    });

                    complete(results.slice(0,10));
                }
            }
        );
    }

    // Generates a numeric stamp for the current hour
    this.getCurrentHour = function() {
        time = Math.floor(Date.now() / 1000);
        return Math.floor(time / ts.hours(1)) * ts.hours(1);
    };
 
    if(tracker.caller != tracker.getInstance){
        throw new Error("This object cannot be instantiated");
    }
}

/*  Singleton pattern */

tracker.instance = null;
 
tracker.getInstance = function(){
    if(this.instance === null){
        this.instance = new tracker();
    }

    return this.instance;
}

module.exports = tracker.getInstance();