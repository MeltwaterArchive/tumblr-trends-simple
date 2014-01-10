// This class uses d3 to generate a dynamic bubble chart. 
// Requires d3 (http://d3js.org) to be available in context as 'd3'.

function DynamicBubbleChart(selector,keyAccessor,valueAccessor,labelAccessor,labelFormatter,options)
{
	// Default properties
	this.width = 800;
	this.height = 600;
	this.duration = 500;
	this.maxLabelLength = 10;
	this.fill = d3.scale.category20c();

	// Overrides by options param
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

		if(options.maxLabelLength)
			this.fill = options.maxLabelLength;
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


	// Sets and updates the chart data
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

        newItems.each($this.appendLabel);
        
        // newItems.append("text")
        // 	.attr("text-anchor", "middle")
	       //  .attr("font-size", this.formatLabel)
	       //  .text($this.labelAccessor);


	    // Only do this if not first time
        if(this.firstRenderCompleted)
        {
        	// Remove any items that no longer exist
        	join.exit()
        		.remove();

			// Move bubble node to new position
			var trans = join.transition().duration(this.duration);

			// Update position
			trans.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			    
			// Update circle radius
			trans.select("circle")
				.attr("r", function(d) { return d.r; });

			// Update text size
			trans.select("text").attr("font-size", function(d) { return $this.fontSize(d) + "em" });        	
        }

	    this.firstRenderCompleted = true;

	};

	this.fontSize = function(d) {
		return ((d.r / 60));
	};

	this.appendLabel = function(d,i) {

		var label = $this.labelAccessor(d);
		var fontSize = $this.fontSize(d);

		var labelEl = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    	labelEl.setAttribute("text-anchor","middle");
    	labelEl.setAttribute("font-size",fontSize + "em");

		// Short labels can go on one line
		if(label.length <= $this.maxLabelLength)
		{
	    	labelEl.appendChild(document.createTextNode(label));
		}
		// Long labels need to be split
		else
		{
			var words = label.split(" ");
			var labelPart = "";
			var lineCount = 0;

			words.forEach(
					function(word,i)
					{
						if(labelPart.length > 0) labelPart += " ";
						labelPart += word;

						// If full line, or last word do text element
						if((labelPart.length + word.length) >= $this.maxLabelLength 
							|| (i-1) == words.length)
						{
							var line = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
					    	line.appendChild(document.createTextNode(labelPart));
					    	line.setAttribute("dy", 16*fontSize);
					    	line.setAttribute("x", 0);
					    	labelEl.appendChild(line);
							labelPart = "";

							lineCount++;
						}
					}
				);


			labelEl.setAttribute("y",fontSize * lineCount * -9);
		}

		this.appendChild(labelEl);
	}

}