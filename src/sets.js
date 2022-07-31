async function init() {
    var data;
    var url = "https://raw.githubusercontent.com/colbyyh2/NarrativeVis/main/data_new/sets_theme_year_cum_stacked.csv";

    var margin = {left: 60, right: 30, top: 30, bottom: 50 };
    var width = 1200;
    var height = 800;
    var tick_vals = [1950, 1955, 1960, 1965, 1970,
                     1975, 1980, 1985, 1990, 1995,
                     2000, 2005, 2010, 2015, 2020];
    var line_colors =  ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

    data = await d3.csv(url);
    let x = d3.scaleLinear().domain([1945,2025]).range([0,width]);
    let y = d3.scaleLinear().domain([0,2400]).range([height,0]);

    var xAxis = d3.axisBottom(x).tickValues(tick_vals).tickFormat(d3.format(""));
    var yAxis = d3.axisLeft(y);

    var theme_columns = data.columns.slice(1);

    var svg = d3.select("#dataviz")
        .append("svg")
        .attr("width",width + margin.left + margin.right)
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var chartGroup = svg.append("g")
                        .attr("class", "chartGroup");
    
    // add the x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // add the y axis
    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "16pt")
        .text("Sets");

    

}