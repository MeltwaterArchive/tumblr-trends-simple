var config = require('../config.json'),
    DataSift = require('datasift'),
    tracker = require('./tracker');

module.exports = {

	consumer: null,
	sourceBrands: new Array(),

	// Connects to DataSift streaming API
	start: function() {

		console.log("Connecting to DataSift API.");
		$this = this;

		this.consumer = new DataSift(config.datasift.username, config.datasift.apikey);
		this.consumer.on("connect", this.on_connected);
		this.consumer.on("interaction", this.on_interaction.bind(this));
		this.consumer.connect();
		
	},

	// On connected event, susbribe to stream
	on_connected: function() {
		console.log("Connected to DataSift API.");
		$this.consumer.subscribe(config.datasift.stream);
	},

	// When an interaction (piece of content) is received, track the appropriate events
	on_interaction: function(data) {
		
		try {
			tracker.trackEvents(data.data);
		}
		catch(err)
		{
			console.log("WARNING: Failed to process interaction: " + err.stack);
		}
	}

};