
const w = 900;
const h = 700;
const p = 50;

//select main div
const graph = d3.select(".graphContainer")
				.style("width", "1000px")
				.style('height', "800px")

//create svg
const svg = graph.append("svg")
				.attr("class", "svg")
				.attr("width", w + 'px')
				.attr("height", h + 'px')

//create tooltip div
const div = graph.append("div").attr("class", "tooltip");
				

//Get json object URL and parse data
const URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
d3.json(URL, (error, data)=>{
	if(error) {console.error(error)};
	
	// Seperate the two data objects into variables
	const nodes = data.nodes;
	const links = data.links;
	
	//Force simulation boundries
	const sim = d3.forceSimulation(nodes)
					.force("link", d3.forceLink(links))
    				.force("charge", d3.forceManyBody().distanceMax(155).distanceMin(50))
    				.force('collide',d3.forceCollide().radius(10))
   					.force("center", d3.forceCenter(w/2,h/2));
   	
   	//Append the links first or will overlap nodes
   	const link = svg.append("g")
					.attr("class", "links")
					.selectAll("line")
					.data(data.links)
					.enter()
					.append("line")
					.attr("class", "link")
						

	//Create Nodes, use images for flages
	const node = graph.append("div")
					.attr("class", 'flagB')
					.selectAll("img")
					.data(data.nodes)
					.enter()
					.append("img")
					.attr('class', (d)=> `flag flag-${d.code}`)
					.call(d3.drag()
							.on("start", startDrag)
							.on('drag', duringDrag)
							.on("end", endDrag))

// Add event functions for tooltip hovering
	node.on("mouseover", (d, i)=> {div.style("visibility", "visible")
												.style("top", (event.pageY - p)+"px")
												.style("left",(event.pageX)+"px")
												.html(d.country)})
		.on("mouseout", (d, i)=> {div.style("visibility", "hidden")})

//Connect the nodes to simulation boundries
	sim.nodes(nodes)
      .on("tick", tickChange);

//connect links to simulation boundries
  	sim.force("link")
      .links(links)
      .distance(10)
//Define node and link X Y coordinates
	function tickChange() {
		node.style("left", (d)=> d.x + p +'px')
	        .style("top", (d)=> d.y + p + 'px');
	    link.attr("x1", (d)=> d.source.x + 5)
	        .attr("y1", (d)=> d.source.y + 5)
	        .attr("x2", (d)=> d.target.x + 5)
	        .attr("y2", (d)=> d.target.y + 5);
	}

	//Defines node/link location at start of drag event
	function startDrag(d){
		if (!d3.event.active) sim.alphaTarget(.2).restart();
  			d.fx = d.x;
  			d.fy = d.y;
	}

	//Defines node/link location durring drag event
	function duringDrag(d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}

	//Defines node/link location at end of drag event
	function endDrag(d) {
	  if (!d3.event.active) sim.alphaTarget(0);
	  	d.fx = null;
	  	d.fy = null;
	}


});

