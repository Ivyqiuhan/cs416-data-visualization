const produceLineList = ["Electronic accessories", "Fashion accessories", "Food and beverages",
    "Health and beauty", "Home and lifestyle", "Sports and travel"];

const produceLineColor = d3.scaleOrdinal()
    .domain(produceLineList)
    .range(["#457b9d", "#1982c4", "#8ac926",
        "#ff595e", "#ff924c", "#ffca3a"]);

const genderColor = d3.scaleOrdinal()
    .domain(["Female", "Male"])
    .range(["#8ac926", "#ff924c"]);

let supermarketData;

d3.csv("data/supermarket_sale_data.csv").then(data => {

    let parseDate = d3.timeParse("%m/%d/%Y");
    let parseTime = d3.timeParse("%H:%M");

    data.forEach(function (d) {
        d["Date"] = parseDate(d["Date"]);
        d["Time"] = parseTime(d["Time"]);
    });

    supermarketData = data;

    margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


    drawChart1(data);
    drawChart2(data);
    drawChart3(data);
});

function updateChart1() {
    let filteredData = supermarketData;

    produceLineList.forEach(pl => {
        if(!document.getElementById(pl).checked) {
            filteredData = filteredData.filter(d => {
                return d["Product line"] !== pl;
            })
        }
    });

    d3.selectAll("#chart1 > *").remove();
    drawChart1(filteredData);
}

function drawChart1(data) {

    let groupByProduceLine = Array.from(d3.group(data, d => d["Product line"])).map(
        produceLine => {
            let produceLineTotal = 0;
            produceLine[1].forEach(d => produceLineTotal += Number(d["Total"]));
            return {
                category: produceLine[0],
                total: produceLineTotal
            };
        }
    );

    let chart1annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Food and beverages is slightly more popular.",
            },
            x: 450,
            y: 100,
            dy: -15,
            dx: -10
        }]);

    let svg1 = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'svg-2-parent-g');

    let x1 = d3.scaleBand()
        .domain(groupByProduceLine.map(d => {
            return d.category;
        }))
        .range([0, width])
        .padding(0.2);

    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1));

    let y1 = d3.scaleLinear()
        .domain([0, 70000])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));

    svg1.append('g')
        .selectAll("mybar")
        .data(groupByProduceLine)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x1(d.category); })
        .attr("y", function(d) { return y1(d.total); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y1(d.total); })
        .style("fill", function (d) { return produceLineColor(d.category) });

    svg1.append("g").call(chart1annotations);
}

function updateChart2() {
    let filteredData = supermarketData;

    ["Female", "Male"].forEach(gender => {
        if(!document.getElementById(gender).checked) {
            filteredData = filteredData.filter(d => {
                return d["Gender"] !== gender;
            });
        }
    });

    d3.selectAll("#chart2 > *").remove();
    drawChart2(filteredData);
}

function drawChart2(data) {

    Array.from(d3.group(data, d => d["Product line"])).map(
        produceLine => {
            let produceLineTotal = 0;
            produceLine[1].forEach(d => produceLineTotal += Number(d["Total"]));
            return {
                category: produceLine[0],
                total: produceLineTotal
            };
        }
    );

    let svg2 = d3.select("#chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let x2 = d3.scaleLinear()
        .domain([9,21])
        .range([0, width]);
    svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x2));

    let y2 = d3.scaleLinear()
        .domain([5, 130])
        .range([height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y2));

    svg2.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x2(d["Time"].getHours()); })
        .attr("cy", function (d) { return y2(d["Unit price"]); })
        .attr("r", function (d) { return Number(d["Quantity"]); })
        .style("fill", function (d) { return genderColor(d["Gender"]) });

}

function updateChart3() {
    let filteredData = supermarketData;

    let val = document.getElementById("dayRange").value; //gets the oninput value
    switch (val) {
        case "1":
            document.getElementById('output').innerHTML = "January"
            break;
        case "2":
            document.getElementById('output').innerHTML = "February"
            break;
        case "3":
            document.getElementById('output').innerHTML = "March"
            break;
        case "4":
            document.getElementById('output').innerHTML = "All 3 Months"
            break;
    }

    filteredData = val === "4" ? filteredData : filteredData.filter(d => {
        return (Number(d["Date"].getMonth())+1) === Number(val);
    });

    d3.selectAll("#chart3 > *").remove();
    drawChart3(filteredData);
}

function drawChart3(data) {

    let svg3 = d3.select("#chart3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let chart3annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Mid of the month",
            },
            connector: {
                end: "arrow"
            },
            x: 300,
            y: 80,
            dy: -15,
            dx: 0
        }]);

    let x3 = d3.scaleLinear()
        .domain([0,31])
        .range([0, width]);
    svg3.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x3));

    let y3 = d3.scaleLinear()
        .domain([0, 1300])
        .range([height, 0]);
    svg3.append("g")
        .call(d3.axisLeft(y3));

    svg3.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x3(d["Date"].getDate()); })
        .attr("cy", function (d) { return y3(d["Total"]); })
        .attr("r", 4)
        .style("fill", function (d) { return produceLineColor(d["Product line"]) });

    svg3.append("g").call(chart3annotations)
}