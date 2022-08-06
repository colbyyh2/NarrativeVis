Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

async function init() {
    var minifig_info;
    var data;
    var url1 = "https://raw.githubusercontent.com/colbyyh2/NarrativeVis/main/data_new/minifigs.csv";
    var url2 = "https://raw.githubusercontent.com/colbyyh2/NarrativeVis/main/data_new/minifig_count.csv";

    var margin = {left: 60, right: 30, top: 30, bottom: 50 };
    var width = 1200;
    var height = 600;
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
    
    // data contains count of minifigs for each year, minifig_info contains data about each minifig 
    data = await d3.csv(url2);
    minifig_info = await d3.csv(url1);

    var yeargroup = d3.nest()
                        .key(function(d) {return d.fig_num;})
                        .entries(minifig_info);
    var res = yeargroup.map(function(d){return d.key})

    let x = d3.scaleBand().domain(Array.range(1949,2023)).range([0,width]);
    let y = d3.scaleLinear().domain([0,d3.max(data, function(d){return +d.count;})]).range([height, 0])

    var xAxis = d3.axisBottom(x).tickValues(tick_vals).tickFormat(d3.format(""));
    var yAxis = d3.axisLeft(y);    

    var svg = d3.select("#dataviz")
        .append("svg")
        .attr("id", "minifigs")
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
        .text("# Minifigs released this year");

    var bars = svg.selectAll(".minifig-g")
        .data(data)
        .enter().append("g")
            .attr("class", "minifig-g")
            .attr("id", function(d) {return "g-" + d.year;});

    bars.append("rect")
        .attr("id", function(d) {return "bar-" + d.year;})
        .attr("class", "minifig")
        .attr("x", function(d) {return x(d.year);})
        .attr("y", function(d) {return y(d.count);})
        .attr("fill", "#ddd")
        .attr("stroke", "black")
        .attr("width", x.bandwidth() - 1)
        .attr("height", function(d) {return height - y(d.count);});
    
    // Mouseover rects
    var mouse_detectors = bars.append("rect")
        .attr("id", function(d) {return d.year;})
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
            d3.select(this).attr("opacity", 0.25);
            d3.select("#minifig-year").text("Minifigs First Seen in " + d.year + ": " + d.count);
            document.getElementById("bar-"+d.year).setAttribute("stroke-width", "3px");
            document.getElementById("bar-"+d.year).setAttribute("stroke", "red");
        })
        .on("click", function(d) {
            d3.selectAll(".minifig").style("fill", "#ddd");
            d3.select("#bar-"+d.year).style("fill", "#faa");
            
            // List all minifigs
            var selection = d3.select("#selection");
            selection.selectAll("*").remove();

            var mfiginfo = minifig_info.filter(function(a) {return a.year == d.year;});
            console.log(mfiginfo);

            var minifig_divs = selection.selectAll()
                .data(mfiginfo)
                .enter()
                .append("div")
                    .attr("id", function(d) { return d.fig_num;})
                    .attr("class", "mfig-div")
            minifig_divs.append("h5")
                .text(function(d) {return d.name_mfig;});
            minifig_divs.append("p")
                .text(function(d) {return "Fig# " + d.fig_num;}).style("font", "11px sans-serif");
            minifig_divs.append("p")
                .text(function(d) {return d.year;})
            minifig_divs.append("p")
                .text(function(d) {return "First found in: " + d.set_num + " " + d.name_set;});
            minifig_divs.append("p").append("a")
                .attr("href", function(d) {return "https://rebrickable.com/minifigs/" + d.fig_num + "/"})
                .text("Rebrickable link");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("opacity", 0);
            document.getElementById("bar-"+d.year).setAttribute("stroke-width", "1px");
            document.getElementById("bar-"+d.year).setAttribute("stroke", "black");
        });
    
    // Tooltip
    var setinfo = d3.select("#selection");
        
    // Annotations
    const type = d3.annotationLabel;

    const center1x = x(1991) - 1;
    const center1y = y(2195) - 450;

    const annotations = [
        {
            note: {label: "Click on a bar to see all the minifigures released in that year."},
            x: x(2006),
            y: y(245),
            dy:-50,
            dx:-30,
            type: d3.annotationCallout
        },
        {
            note: {label: "The first minifig was released in 1975."},
            x: x(1975),
            y: y(25),
            dy:-50,
            dx: -1,
            type: d3.annotationCallout
        },
        {
            note: {label: "We saw in the last page how sets were getting larger. It makes sense that more minifigs would be released as sets grew more elaborate."},
            x: x(2010),
            y: y(470),
            dy:-50,
            dx:-30,
            type: d3.annotationCallout
        }
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g")
        .attr("class", "annotation-group")
        .style("font-size", "11pt")
        .call(makeAnnotations);
}

function setinfo() {

}