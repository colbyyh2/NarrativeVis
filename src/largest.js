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
    let x = d3.scaleBand().domain(Array.range(1949,2023)).range([0,width]);
    let y = d3.scaleLinear().domain([0,1000+d3.max(data, function(d){return +d.num_parts;})]).range([height, 0])

    var xAxis = d3.axisBottom(x).tickValues(tick_vals).tickFormat(d3.format(""));
    var yAxis = d3.axisLeft(y);

    var themes = [...new Set(data.theme)];
    var theme_colors = {};
    for (var i = 0; i < themes.length; i++) {
        theme_colors[themes[i]] = colors[i % colors.length];
    }
    console.log(themes);

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
        .attr("fill", function(d, i) {return colors[i % colors.length];})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return height - y(d.num_parts);});
    
    // Mouseover rects
    var mouse_detectors = setrects.append("rect")
        .attr("id", function(d) {return d.set_num;})
        .attr("class", "mouseover-rect")
        .attr("x", function(d) {return x(d.year);})
        .attr("y", 0)
        .attr("fill", "none")
        .attr("stroke", "none")
        .attr("width", x.bandwidth())
        .attr("height", height);
    
    // Tooltips

    

    //https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
    var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");
    mouseG.append("path")
        .attr("class", "mouse-line")
        .style("stroke", "#ccc")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
              .style("opacity", "0");
        })
        .on("mouseover", function() {
            d3.select(".mouse-line")
                .style("opacity", "1");
        })
        .on("mousemove", function() {
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
            .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
            }); 
        });
        
}