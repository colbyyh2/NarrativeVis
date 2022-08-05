Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

async function init() {
    var data;
    var url = "https://raw.githubusercontent.com/colbyyh2/NarrativeVis/main/data_new/largest_sets.csv";

    var margin = {left: 60, right: 30, top: 30, bottom: 50 };
    var width = 1200;
    var height = 700;
    var tick_vals = [1950, 1955, 1960, 1965, 1970,
                     1975, 1980, 1985, 1990, 1995,
                     2000, 2005, 2010, 2015, 2020];


    var colors =  ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
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
    console.log(data);

    var yeargroup = d3.nest()
                        .key(function(d) {return d.set_num;})
                        .entries(data);
    var res = yeargroup.map(function(d){return d.key})

    let x = d3.scaleBand().domain(Array.range(1949,2023)).range([0,width]);
    let y = d3.scaleLinear().domain([0,1000+d3.max(data, function(d){return +d.num_parts;})]).range([height, 0])

    var xAxis = d3.axisBottom(x).tickValues(tick_vals).tickFormat(d3.format(""));
    var yAxis = d3.axisLeft(y);

    var themes = [...new Set(yeargroup.map(function(d){return d.values[0].theme}))];
    var theme_colors = {};
    for (var i = 0; i < themes.length; i++) {
        theme_colors[themes[i]] = colors[i % colors.length];
    }
    console.log(theme_colors);
    

    var svg = d3.select("#dataviz")
        .append("svg")
        .attr("id", "largest-sets")
        .attr("width",width + margin.left + margin.right)
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add the x axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .attr("stroke", "none");

    // add the y axis
    svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis)
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .attr("stroke", "white")
        .attr("fill", "white")
        .style("text-anchor", "middle")
        .style("font-size", "16pt")
        .text("# Parts");

    var setrects = svg.selectAll(".legoset")
        .data(data)
        .enter().append("g")
            .attr("class", "legoset-g")
            .attr("id", function(d) {return d.set_num;});

    setrects.append("rect")
        .attr("id", function(d) {return d.set_num;})
        .attr("class", "legoset")
        .attr("x", function(d) {return x(d.year);})
        .attr("y", function(d) {return y(d.num_parts);})
        .attr("fill", function(d, i) {return theme_colors[d.theme];})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return height - y(d.num_parts);});
    
    // Mouseover rects
    var mouse_detectors = setrects.append("rect")
        .attr("id", function(d) {return d.set_num;})
        .attr("class", "mouseover-rect")
        .attr("x", function(d) {return x(d.year);})
        .attr("y", 0)
        .attr("fill", "lightblue")
        .attr("opacity", 0)
        .attr("stroke", "none")
        .attr("width", x.bandwidth())
        .attr("height", height)
        .attr('pointer-events', 'all')
        .on("mouseover", function(d) {
            console.log("hello");
            d3.select(this).attr("opacity", 0.25);
            d3.select("#set-image").attr("src", "https://img.bricklink.com/ItemImage/SL/" + d.set_num + ".png");
            d3.select("#set-number").text(d.set_num);
            d3.select("#set-name").text(d.set_name);
            d3.select("#set-year").text("Year: " + d.year);
            d3.select("#set-theme").text("Theme: " + d.theme);
            d3.select("#set-size").text("Pieces: " + d.num_parts);
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("opacity", 0);
        });
    
    // Tooltip
    var setinfo = d3.select("#selection");
    setinfo.append("img")
        .attr("id", "set-image")
        .attr("width", "100%")
        .attr("height", "auto")
        .style("max-height", "500px")
        .style("display", "block")
        .style("margin-left", "auto")
        .style("margin-right", "auto")
        .attr("src", "https://img.bricklink.com/ItemImage/SL/31203-1.png");
    setinfo.append("h1")
        .attr("id", "set-number")
        .text("31203-1");
    
    setinfo.append("h3")
        .attr("id", "set-name")
        .text("World Map");
    setinfo.append("p")
        .attr("id", "set-year")
        .text("Year: 2021");
    setinfo.append("p")
        .attr("id", "set-theme")
        .text("Theme: LEGO Art");
    setinfo.append("p")
        .attr("id", "set-size")
        .text("Pieces: 11695");        
}

function setinfo() {

}