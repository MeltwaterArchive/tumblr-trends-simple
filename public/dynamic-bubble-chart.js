function DynamicBubbleChart(selector,keyAccessor,valueAccessor,labelAccessor,labelFormatter,options)
{
	this.width = 800;
	this.height = 600;
	this.duration = 500;
	this.fill = d3.scale.category20c();

	if(options)
	{
		if(options.width)
			this.width = options.width;

		if(options.height)
			this.height = options.height;

		if(options.duration)
			this.duration = options.duration;

		if(options.fill)
			this.fill = options.fill;
	}

	if(valueAccessor)
	{
		this.valueAccessor = valueAccessor
	}
	else
	{
		this.valueAccessor = function(d) { return d.value };
	}

	if(labelAccessor)
	{
		this.labelAccessor = labelAccessor
	}
	else
	{
		this.labelAccessor = function(d) { return d.label };
	}

	if(keyAccessor)
	{
		this.keyAccessor = keyAccessor
	}
	else
	{
		this.keyAccessor = function(d) { return d.key };
	}

	this.layout = d3.layout.pack().value(this.valueAccessor).sort(null).size([this.width, this.height]);

	this.chart = d3.select(selector)
		.append("svg")
		.attr("width", this.width)
		.attr("height", this.height);

	this.format = d3.format(",d");

	this.update = function(data) {
	    
	    console.log(data);

	    if(data.length == 0)
	    {
	    	console.log("Ignoring empty data set.");
	    	return;
	    }

	    $this = this;

	    var join = this.chart.selectAll("g")
			.data(this.layout.nodes({children: data}).filter(function(d) { return !d.children; }), $this.keyAccessor);

		// New items
		var newItems = join.enter()
			.append("g")
			.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

		newItems.append("circle")
        	.attr("r", function (d) { return d.r; })
        	.style("fill", function (d) { return $this.fill($this.labelAccessor(d)); });

        newItems.append("text")
        	.attr("text-anchor", "middle")
	        .attr("font-size", this.formatLabel)
	        .text($this.labelAccessor);

        if(this.firstRenderCompleted)
        {
        	// Remove any items that no longer exist
        	join.exit()
        		.selectAll("g")
        		.remove();

			// Move bubble node to new position
			var trans = join.transition().duration(this.duration);

			// update position
			trans.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			    
			// update circle radius
			trans.select("circle")
				.attr("r", function(d) { return d.r; });

			// update text size
			trans.select("text").attr("font-size", this.formatLabel);        	
        }

	    this.firstRenderCompleted = true;

	};

	this.formatLabel = function(d) {
		return ((d.r / 60)) + "em";
	};

}