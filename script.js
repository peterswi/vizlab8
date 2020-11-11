
// WILL PETERS
// LAB 8



const margin = ({top: 20, right: 20, bottom: 20, left: 40})
const width = 500- margin.left - margin.right;
const height = 500- margin.top - margin.bottom;

const svg = d3.select('.chart').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const xScale= d3.scaleLinear().range([0,width])
const yScale=d3.scaleLinear().range([height, 0])
const xAxis=d3.axisBottom()
const yAxis=d3.axisLeft()

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

d3.csv('driving.csv',d3.autoType).then(drivingData=>{
    console.log(drivingData)

    xScale.domain(d3.extent(drivingData, d=>d.miles)).nice()
    yScale.domain(d3.extent(drivingData, d=>d.gas)).nice()
    xAxis.scale(xScale).ticks(6)
    yAxis.scale(yScale).tickFormat(d3.format("$.2f"))

    svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
        //.attr("transform", `translate(0, ${height})`)
        .call(yAxis);

    const scatter=svg.selectAll('.chart')
        .data(drivingData)
        .enter()

    scatter.append('circle')
        .attr('cx',d=>xScale(d.miles))
        .attr('cy',d=>yScale(d.gas))
        .attr('r',4)
        .attr('align','center')
        .style('fill', 'purple')
        .style('opacity', 0.5)

    scatter.append('text')
        .attr('x',d=>xScale(d.miles)+5)
        .attr('y',d=>yScale(d.gas))
        .attr('pos',d=> function position(d) {
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
          })
        .text(d=>d.year)
        .style('font-size',10)
})