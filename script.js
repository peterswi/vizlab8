
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

d3.csv('driving.csv',d3.autoType).then(drivingData=>{
    console.log(drivingData)
    xScale.domain(d3.extent(drivingData, d=>d.miles)).nice()
    yScale.domain(d3.extent(drivingData, d=>d.gas)).nice()
    
})