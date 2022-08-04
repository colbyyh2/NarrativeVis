async function init() {
    var data;
    var url = "https://raw.githubusercontent.com/colbyyh2/NarrativeVis/main/data_new/sets_theme_year_cum_stacked.csv";

    var margin = {left: 60, right: 30, top: 30, bottom: 50 };
    var width = 1200;
    var height = 700;
    var tick_vals = [1950, 1955, 1960, 1965, 1970,
                     1975, 1980, 1985, 1990, 1995,
                     2000, 2005, 2010, 2015, 2020];
    /*var line_colors =  ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];*/
    var line_colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

    data = await d3.csv(url);
    let x = d3.scaleLinear().domain([1948,2025]).range([0,width]);
    let y = d3.scaleLinear().domain([0,d3.max(data, function(d){return +d.count;})]).range([height,0]);

    var xAxis = d3.axisBottom(x).tickValues(tick_vals).tickFormat(d3.format(""));
    var yAxis = d3.axisLeft(y);

    var theme_columns = data.columns.slice(1);

    var svg = d3.select("#dataviz")
        .append("svg")
        .attr("id", "theme-lines")
        .attr("width",width + margin.left + margin.right)
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
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
        .attr("stroke", "white")
        .attr("fill", "white")
        .style("text-anchor", "middle")
        .style("font-size", "16pt")
        .text("# Sets");

    
    //https://d3-graph-gallery.com/graph/line_several_group.html
    var linegroup = d3.nest()
                        .key(function(d) {return d.theme;})
                        .entries(data);
    var res = linegroup.map(function(d){return d.key})

    var themelines = svg.selectAll('.theme-line')
        .data(linegroup)
        .enter().append("g")
            .attr("class", "theme-line")
            .attr("id", function(d) {return d.key;});

    themelines.append("path")
        .attr("id", function(d){return d.key;})
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", "2px")
        .attr("stroke", function(d,i){return line_colors[i % line_colors.length]})
        .attr("d", function(d){
            // console.log(d);
            return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.count); })
            (d.values);
        });
    
    themelines.append("text")
        .attr("transform", function(d) {return "translate(" + x(2022) + "," + y(d.values[71].count) + ")";})
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .style("stroke", "none")
        .attr("fill", "white")
        .text(function(d) {
            console.log(d.key + " " + d.key.length);
            if (d.key.length <= 10) {
                return d.key;
            } else {
                return d.key.substring(0, 7) + "...";
            }
        })
        .attr("alt", function(d) {return d.key;});

    // populate checkboxes
    console.log(res)
    var checks = d3.select("#selection")
                    .selectAll()
                    .data(res)
                    .enter()
                    .append("p")
                        .attr("id", function(d) {return d + "_p";})
                    .append("label")
                        .text(function(d) {return d + ": ";})
                        .style("color", function(d,i){return line_colors[i % line_colors.length];})
                    .append("input")
                        .attr("type", "checkbox")
                        .attr("checked", "true")
                        .attr("id", function(d) {return d + "_cbox";})
                        .attr("onchange", "checkboxToggle(this)")

    checks.style("display: table-cell; height: 800px; overflow: scroll; border:1px solid #ccc;");
}

function checkboxToggle(item) {
    var path_id = item.id.split("_")[0];
    console.log(path_id);
    var path = document.getElementById(path_id);
    if (item.checked == true){
        path.style.display = "block";
    } else {
        path.style.display = "none";
    }
}

function hideall() {
    d3.selectAll(".theme-line").style("display", "none");

    checkboxes = d3.select("#selection").selectAll("input");
    checkboxes.property("checked", false);
}

function showall() {
    d3.selectAll(".theme-line").style("display", "block");

    checkboxes = d3.select("#selection").selectAll("input");
    checkboxes.property("checked", true);
}

function search() {
    var input, filter;
    input = document.getElementById('theme-search');
    filter = input.value.toUpperCase();
    sel = d3.select("#selection");
    themes = sel.selectAll('p');
    
    var results = themes.filter(function(d) {
        console.log(d)
        return d.toUpperCase().indexOf(filter) > -1;        
    })
    themes.style("display", "none");
    results.style("display", "");
}