var fs = require('fs');
var csv = require('node-csv').createParser();
var urls = new Array();
var csdl = "";

// Check command line arguments
if(!process.argv[2])
{
	console.log("USAGE: node generate-csdl.js [path to data file]");
	process.exit(1);
}

// Read CSV file
console.log("Reading data from CSV file:" + process.argv[2]);

csv.parseFile(process.argv[2], function(err, data) {

	console.log("Generating tags...");

	// Skip header row
	data = data.slice(1);

    data.forEach(function(brand) {
    	if(brand[0])
    	{
    		url = brand[2];

    		csdl += 'tag.brand "' + brand[0] + '" { tumblr.reblogged.root.url contains "' + url + '" } \n';

			urls.push(url);
    	}
    });

    console.log("Generating return statement...");

    csdl += '\nreturn {\n  tumblr.activity == "createpost" AND \n  tumblr.reblogged.root.url contains_any "' + urls.join(',') + '" \n}';

	console.log("Writing definition to stream.csv");

	fs.writeFile("./stream.csdl", csdl, function(err) {
	      if(err)
			console.log(err);
		});

	console.log("Completed.");

});
