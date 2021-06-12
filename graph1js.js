const drawLinePlot = async () => {
  // convert date type of properties in an obj
  const convertDataType = (aDataObj) => {
    const timeParser = d3.timeParse('%Y')
    aDataObj.plasticAmountInt = +aDataObj.Global_plastics_production
    aDataObj.yearFormat = timeParser(aDataObj.Year)
    return aDataObj
  }
  // download the data
  const dataObjsArray = await d3.csv(
    'global-plastics-production.csv',
    convertDataType
  )

  const svgDimension = {
    height: 600,
    width: 800,
    marginleft: 100,
    margins:50
  }

  const innerWidth = svgDimension.width - svgDimension.margins * 2
  const innerHeight = svgDimension.height - svgDimension.margins * 2

  // initialise svg element
  const svg = d3
    .select('#graph1')
    .append('svg')
    .attr('height', svgDimension.height)
    .attr('width', svgDimension.width)

  // setup a svg canvas for graphing
  const svgCanvas = svg
    .append('g')
    .attr(
      'transform',
      `translate(${svgDimension.marginleft}, ${svgDimension.margins})`
    )

  const tooltip = d3.select('#tooltip')
  const tooltipDot = svgCanvas
    .append('circle')
    .attr('r', 5)
    .attr('fill', '#fc8781')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .style('opacity', 0)
    .style('pointer-event', 'none')

  const plasticAmountArray = dataObjsArray.map(
    (aDataObj) => aDataObj.plasticAmountInt
  )
  const timeLineArray = dataObjsArray.map((aDataObj) => aDataObj.yearFormat)

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(plasticAmountArray))
    .range([innerHeight, 0])
    .nice()

  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(timeLineArray))
    .range([0, innerWidth])

  // get the date for x values and stock price for y values
  const xValue = (aDataObj) => aDataObj.yearFormat
  const yValue = (aDataObj) => aDataObj.plasticAmountInt

  const lineGenerator = d3
    .line()
    .x((aDataObj) => xScale(xValue(aDataObj)))
    .y((aDataObj) => yScale(yValue(aDataObj)))

  //   console.log(lineGenerator(dataObjsArray))

  // x-axis
  const xAxis = d3.axisBottom(xScale)
  // y-axis
  const yAxis = d3.axisLeft(yScale)

  // draw the x-axis
  const xAxisGroup = svgCanvas
    .append('g')
    .call(xAxis)
    .style('transform', `translateY(${innerHeight}px)`)

  xAxisGroup
    .append('text')
    .attr('x', innerWidth / 2)
    .attr('y', svgDimension.margins - 10)
    .attr('fill', 'black')
    .attr("font-family", "'PT Sans Narrow', sans-serif")
    .attr("font-size", "15px")
    .text('Years')

  // draw the y-axis
  const yAxisGroup = svgCanvas.append('g').call(yAxis)

  yAxisGroup
    .append('text')
    .attr('x', -innerHeight / 2)
    .attr('y', -svgDimension.margins + 15)
    .attr('fill', 'black')
    .attr("font-family", "'PT Sans Narrow', sans-serif")
    .attr("font-size", "15px")
    .text('Tonnes (millions)')
    .style('transform', 'rotate(270deg)')
    .style('text-anchor', 'middle')

  //   draw the line
  // help detect if the mouse hover over the line, u can have multiple event by separating them with space
  // touchmouse event help you detect movement on touch screen
  // the second .on() help you detect if the mouse leave the line
  svgCanvas
    .append('path')
    .datum(dataObjsArray)
    .attr('d', lineGenerator)
    .attr('fill', 'none')
    .attr('stroke', '#30475e')
    .attr('stroke-width', 2)

  // Tooltip
  svgCanvas
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .style('opacity', 0) // the shape will be drawn over the container, don't want to be visible since viewer can't see the line plot
    .on('touchmouse mousemove', function (event) {
      const mousePosition = d3.pointer(event, this)
      const date = xScale.invert(mousePosition[0])

      // custom bisector to tell d3 how to access Date in your dataset
      // any (left, center, right) functions work, but most ex used left func
      const bisectDate = d3.bisector(xValue).left

      const indexInt = bisectDate(dataObjsArray, date)

      const aDataObj = dataObjsArray[indexInt - 1]

      // update image
      tooltipDot
        .style('opacity', 1)
        .attr('cx', xScale(xValue(aDataObj)))
        .attr('cy', yScale(yValue(aDataObj)))
        .raise()

      tooltip
        .style('display', 'block')
        .style('top', yScale(yValue(aDataObj)) - 20 + 'px')
        .style('left', xScale(xValue(aDataObj)) + 'px')

      tooltip.select('.price').text(`million tonnes: ${yValue(aDataObj)}`)

      const dateFormater = d3.timeFormat('%Y')

      tooltip.select('.date').text(`${dateFormater(xValue(aDataObj))}`)
    })
    .on('mouseleave', function (event) {
      tooltipDot.style('opacity', 0)
      tooltip.style('display', 'none')
    })
}

drawLinePlot()

// what we try to achieve when we have the x,y position of the mouse on the svgCanvas
// when we hover or move anywhere on the svgCanvas
// you want it to show you the date and closing stock price of that day
// so we have x,y mouse position, we can use it to find those 2 values
// if we have scale to convert those 2 values into x,y. We can do the opposite

// so when you have the x value, you can convert it back to find the Date
// then with the Date value, we can use bisect function to find the index of the data obj that contain this Date value
// after find the data object, we will know the stock closing price of that day

// PROLEM
// need to customise the bisect func to work with Date type since bisect doesn't know how to deal with Date
