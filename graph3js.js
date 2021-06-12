const drawHistogram = async () => {
  // download the data
  const dataObjsArray = await d3.json('plastic-types.json')
  // console.log(dataObjsArray.slice(1, 10))

  // svg dimensions
  const svgDimension = {
    width: 800,
    height: 500,
    margins: 50,
  }

  // the graph dimension
  const innerHeight = svgDimension.height - svgDimension.margins * 2
  const innerWidth = svgDimension.width - svgDimension.margins * 2

  //svg creation
  const svg = d3
    .select("#graph3")
    .append('svg')
    .attr('width', svgDimension.width)
    .attr('height', svgDimension.height)

    console.log("fhfuh");

  const svgCanvas = svg
    .append('g')
    .attr(
      'transform',
      `translate(${svgDimension.margins}, ${svgDimension.margins})`
    )

  const labelsGroup = svgCanvas.append('g').classed('bar-labels', true)

  // grouping the x-axis
  const xAxisGroup = svgCanvas
    .append('g')
    .style('transform', `translateY(${innerHeight}px)`)
    .classed('axis', true)

  const meanLine = svgCanvas.append('line').classed('mean-line', true)

  // the metric arg will tell which metric data it should use to update the chart
  function updateHistogram(metric) {
    const xValue = (aDataObj) => aDataObj[metric]
    const yValue = (aBinArray) => aBinArray.length // find the frequence of a bin by knowing the length of that bin array

    const minMaxHumidityArrays = d3.extent(dataObjsArray, xValue)

    const xScale = d3
      .scaleLinear()
      .domain(minMaxHumidityArrays)
      .range([0, innerWidth])
      .nice()




    // this function will format the dataset into a collection of groups, which is suitable for ploting histogram
    const binsFormatter = d3
      .bin()
      .domain(xScale.domain()) // min and max of ur x values
      .value(xValue) // this func tells d3 which properies it should the data with, in this case - humidity
      .thresholds(10) // specify how many bins or groups d3 should returns, the value is recommendation, but not always fit, d3 tries it best

    const padding = 1

    const formatedDataArray = binsFormatter(dataObjsArray)
    console.log(formatedDataArray)

    const binsDomainArray = [0, d3.max(formatedDataArray, yValue)]

    // we need binDomainArray that's why we put yScale down here
    const yScale = d3
      .scaleLinear()
      .domain(binsDomainArray)
      .range([innerHeight, 0])
      .nice()

    const exitTransition = d3.transition().duration(500)
    const updateTransition = d3.transition().duration(500)


    var ylabel= svgCanvas.append('text')
    .attr('x', -innerHeight / 2)
    .attr('y', -svgDimension.margins + 15)
    .attr('fill', 'black')
    .attr("font-family", "'PT Sans Narrow', sans-serif")
    .attr("font-size", "15px")
    .text('Number of individual')
    .style('transform', 'rotate(270deg)')
    .style('text-anchor', 'middle')

    var xlabel= svgCanvas.append('text')
      .attr('x', (innerWidth/2 -100))
      .attr('y', svgDimension.height - svgDimension.margins -5 )
      .attr('fill', 'black')
      .attr("font-family", "'PT Sans Narrow', sans-serif")
      .attr("font-size", "15px")
      .text('Waste generated annually (kgs/year)')
    // draw the bins
    // draw the plot
    // (1): the idea is to find the width between 2 values x0 and x1
    // (1): the value of those 2 will be put in an array that has another value of 0
    // (1): then the highest value will be picked from this array, the idea is to prevent a negative value for the width
    // (1): but if the value between x1, x0 is negative, max() will return 0, then how d3 deals with the width has value of 0?
    svgCanvas
      .selectAll('rect')
      .data(formatedDataArray)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('width', (aBinArray) =>
              d3.max([0, xScale(aBinArray.x1) - xScale(aBinArray.x0) - padding])
            ) // (1)
            .attr('height', 0)
            .attr('x', (aBinArray) => xScale(aBinArray.x0))
            .attr('y', innerHeight)
            .attr('fill', '#b8de6f'),
        (update) => update,
        (exit) =>
          exit
            .attr('fill', '#f39233')
            .transition(exitTransition)
            .attr('y', innerHeight)
            .attr('height', 0)
            .remove()
      )
      .transition(updateTransition)
      .attr('width', (aBinArray) =>
        d3.max([0, xScale(aBinArray.x1) - xScale(aBinArray.x0) - padding])
      ) // (1)
      .attr('height', (aBinArray) => innerHeight - yScale(yValue(aBinArray)))
      .attr('x', (aBinArray) => xScale(aBinArray.x0))
      .attr('y', (aBinArray) => yScale(yValue(aBinArray)))
      .attr('fill', '#01c5c4')

    // value label of bins
    labelsGroup
      .selectAll('text')
      .data(formatedDataArray)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr(
              'x',
              (aBinArray) =>
                xScale(aBinArray.x0) +
                (xScale(aBinArray.x1) - xScale(aBinArray.x0)) / 2
            )
            .attr('y', innerHeight)
            .text(yValue),
        (update) => update,
        (exit) =>
          exit.transition(exitTransition).attr('y', innerHeight).remove()
      )
      .transition(updateTransition)
      .attr(
        'x',
        (aBinArray) =>
          xScale(aBinArray.x0) +
          (xScale(aBinArray.x1) - xScale(aBinArray.x0)) / 2
      )
      .attr('y', (aBinArray) => yScale(yValue(aBinArray)) - 10)
      .text(yValue)

    const average = d3.mean(dataObjsArray, xValue)

    meanLine
      .raise()
      .transition(updateTransition)
      .attr('x1', xScale(average))
      .attr('y1', 0)
      .attr('x2', xScale(average))
      .attr('y2', innerHeight)

    // Axes
    const xAxis = d3.axisBottom(xScale)
    // draw x-axis
    xAxisGroup.transition().call(xAxis)
  }

  d3.select('#metric').on('change', function (event) {
    event.preventDefault() // always good idea to stop the default behave to stop some unexpected thing happen

    updateHistogram(this.value)
  })

  updateHistogram('packaging')
}

drawHistogram()
