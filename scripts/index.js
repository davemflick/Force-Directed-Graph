
const w = 900;
const h = 700;
const p = 50;

const graph = d3.select(".graphContainer")
				.style("width", "1000px")
				.style('height', "800px")
				.style('border', '1px solid black')

const svg = graph.append("svg")
				.attr("class", "svg")
				.attr("width", w + 'px')
				.attr("height", h + 'px')
				.style('border', '1px solid black')


const URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
d3.json(URL, (error, data)=>{
	if(error) {console.error(error)};
	console.log(data)

	const nodes = data.nodes;
	const links = data.links;

	const force = d3.forceSimulation(nodes)
					 .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links))
    .force("center", d3.forceCenter());
});

