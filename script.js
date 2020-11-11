
// WILL PETERS
// LAB 8



const margin = ({top: 20, right: 20, bottom: 20, left: 40})
const width = 600- margin.left - margin.right;
const height = 600- margin.top - margin.bottom;

const svg = d3.select('.chart').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const xScale= d3.scaleLinear().range([0,width])
const yScale=d3.scaleLinear().range([height, 0])
//const xAxis=d3.axisBottom()
//const yAxis=d3.axisLeft()

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
  }
function halo(text) {
    text
    .select(function() {
    return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round");
}
function length(path) {
    return d3.create("svg:path").attr("d", path).node().getTotalLength();
  }

d3.csv('driving.csv',d3.autoType).then(drivingData=>{
    console.log(drivingData)

    xScale.domain(d3.extent(drivingData, d=>d.miles)).nice()
    yScale.domain(d3.extent(drivingData, d=>d.gas)).nice()
    
    const line = d3
        .line()
        .x(d=>xScale(d.miles))
        .y(d=>yScale(d.gas))

    const l = length(line(drivingData))
    
    //using examples from Bostock!
    let xAxis = g => g
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(width / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width - 4)
            .attr("y", -4)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .text(drivingData.miles)
            .call(halo))

    let yAxis = g => g
        //.attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(null, "$.2f"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.1))
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(drivingData.gas)
            .call(halo))

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
        //.attr("transform", `translate(0, ${height})`)
        .call(yAxis);

    const scatter=svg.selectAll('.chart')
        .data(drivingData)
        .enter()

    scatter.append('circle')
        .attr('class','labels')
        .attr('cx',d=>xScale(d.miles))
        .attr('cy',d=>yScale(d.gas))
        .attr('r',3)
        .attr('align','center')
        .style('fill', 'none')
        .style('stroke','black')

    svg.append('path')
        .datum(drivingData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${l}`)
        .attr('d',line)
        .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l},${l}`);

    svg.append('text')
        .attr('class', 'xaxisTitle')
        .attr('x', 460)
        .attr('y', 550)
        .attr("font-weight", "bold")
        .text("Miles per Person per Year")
        .style('text-anchor','middle')
        .style('font-size',14)
        
        
    svg.append('text')
        .attr('class','yaxisTitle')
        .attr('x', 75)
        .attr('y', 10)
        .attr("font-weight", "bold")
        .text("Gas Cost per Gallon")
        .style('text-anchor','middle')
        .style('font-size',14)
    
    svg.append('text')
        .attr('class','graphTitle')
        .attr('x', 300)
        .attr('y', -5)
        .attr("font-weight", "bold")
        .attr("font-style", "italic")
        .text("Driving Shifts Into Reverse")
        .style('text-anchor','middle')
        .style('font-size',18)

    scatter.append('text')
        .attr('x',d=>xScale(d.miles))
        .attr('y',d=>yScale(d.gas))
        .text(d=>d.year)
        .style('font-size',10)
        .each(position)
        .call(halo)
})