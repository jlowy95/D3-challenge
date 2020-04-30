// Define data path
var csv = "./assets/data/data.csv";

// Define svg dimension
var svgHeight = 500;
var svgWidth = 600;

// Define chart margins
var marginTop = 40;
var marginLeft = 50;
var marginBottom = 50;
var marginRight = 20;

// Define chart dimension
var chartHeight = svgHeight - marginTop - marginBottom;
var chartWidth = svgWidth - marginLeft - marginRight;

// Create svg
var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// Create chartGroup
var chartGroup = svg.append("g")
.attr("transform", `translate(${marginLeft}, ${marginTop})`);


// Call and plot data
d3.csv(csv).then(function(data){
    console.log(typeof(data));
    console.log(data);

    // Cleanup data (convert types to int)
    data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Setup scales
    function padLinear([x0, x1], p){
        return [x0-p,x1+p];
    }

    var xPovertyScale = d3.scaleLinear()
        .domain(padLinear(d3.extent(data, d => d.poverty),1))
        .range([0, chartWidth]);
    
    var yHealthScale = d3.scaleLinear()
        .domain(padLinear(d3.extent(data, d => d.healthcare),1))
        .range([chartHeight, 0]);

    // Define Axes
    var axisPoverty = d3.axisBottom(xPovertyScale);
    var axisHealth = d3.axisLeft(yHealthScale);

    // Append axis to chartGroup
    chartGroup.append("g")
        .call(axisHealth);
        
    chartGroup.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(axisPoverty);

    // Plot Data
    var stateScatters = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xPovertyScale(d.poverty))
        .attr("cy", d => yHealthScale(d.healthcare))
        .attr("r", 16)
        .attr("fill", "cadetblue");

    var text_selection = chartGroup.selectAll()
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xPovertyScale(d.poverty))
        .attr("y", d => yHealthScale(d.healthcare)+6)
        .style("text-anchor", "middle")
        .text(function(d){
            return d.abbr;
        })
        .attr("fill", "white");

    // Append Axes Titles
    chartGroup.append('g')
    .attr('transform', `translate(${chartWidth/2}, -15)`)
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('font-size', '28')
    .text('Healthcare vs. Poverty');

    chartGroup.append('g')
    .attr('transform', `translate(-35, ${chartHeight/2})`)
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Lacks Healthcare (%)');

    chartGroup.append('g')
    .attr('transform', `translate(${chartWidth/2}, ${chartHeight + marginBottom -10})`)
    .append('text')
    .attr('text-anchor', 'middle')
    .text('In Poverty (%)');

    
});