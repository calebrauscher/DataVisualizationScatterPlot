let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();
let values = [];

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const addTitle = () => {
  svg
    .append("text")
    .attr("id", "title")
    .attr("class", "chart-title")
    .attr("x", 150)
    .attr("y", 25)
    .text("Doping in Professional Bicycle Racing");
};

const addLegend = () => {
  const legend = document.createElement("div");
  legend.id = "legend";
  legend.innerHTML =
    "Year (x) vs Time (y) <br /> Red = Doping Allegation <br /> Green = No Doping Allegation";
  document.body.appendChild(legend);
};

const addToolTip = () => {
  const toolTipDiv = document.createElement("div");
  toolTipDiv.id = "tooltip";
  document.body.appendChild(toolTipDiv);
};

const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (item) => {
        return item.Year;
      }) - 1,
      d3.max(values, (item) => {
        return item.Year;
      }) + 1,
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (item) => {
        return new Date(item.Seconds * 1000);
      }),
      d3.max(values, (item) => {
        return new Date(item.Seconds * 1000);
      }),
    ])
    .range([padding, height - padding]);
};

const drawPoints = () => {
  let tooltip = d3.select("#tooltip");

  svg
    .selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (item) => {
      return item.Year;
    })
    .attr("data-yvalue", (item) => {
      return new Date(item.Seconds * 1000);
    })
    .attr("cx", (item) => {
      return xScale(item.Year);
    })
    .attr("cy", (item) => {
      return yScale(new Date(item.Seconds * 1000));
    })
    .attr("fill", (item) => {
      if (item.Doping != "") {
        return "red";
      } else {
        return "green";
      }
    })
    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");

      if (item.Doping != "") {
        tooltip.text(
          `${item.Year} - ${item.Name} - ${item.Time} - ${item.Doping}`
        );
      } else {
        tooltip.text(
          `${item.Year} - ${item.Name} - ${item.Time} - No Allegations`
        );
      }

      tooltip.attr("data-year", item.Year);
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const generateAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};

req.open("GET", url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);
  console.log(values);
  drawCanvas();
  addTitle();
  addLegend();
  addToolTip();
  generateScales();
  drawPoints();
  generateAxes();
};
req.send();

/* let url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let request = new XMLHttpRequest();

let data;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

const timeParse = d3.timeParse("%M:%S");
const timeFormat = d3.timeFormat("%M:%S");

const svg = d3.select("svg");

const drawCanvas = () => {
    svg.attr("width", width);
    svg.attr("height", height);
};

const addTitle = () => {
    svg.append("text")
        .attr("id", "title")
        .attr("class", "chart-title")
        .attr("x", 150)
        .attr("y", 50)
        .text("Doping in Professional Bicycle Racing")
};

const addLabels = () => {
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 + padding - 20)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Time in Minutes");

    svg.append("text")
        .attr("transform",
            "translate(" + width / 2 + " ," + (height - padding + 40) + ")"
        )
        .style("text-anchor", "middle")
        .text("Year");
}

const generateScales = () => {

    const timeArray = [];
    data.forEach((value) => {
        timeArray.push(timeParse(value.Time));
    });

    const minTime = d3.min(timeArray, (d) => {
        return d;
    });

    const maxTime = d3.max(timeArray, (d) => {
        return d;
    });

    const minYear = d3.min(data, (d) => {
        return d.Year
    }) - 1;

    const maxYear = d3.max(data, (d) => {
        return d.Year;
    }) + 1;

    const yScale = d3
        .scaleTime()
        .domain([minTime, maxTime])
        .range([padding, height - padding]);

    const xScale = d3
        .scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, width - padding]);
};

let drawDots = () => {
    let tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")
        .style("wdith", "auto")
        .style("height", "auto");

    svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => {
            return yScale(timeParse(d.Time));
        })
        .attr("r", d => 8)
        .attr("data-year", (item) => {
            return item.Year;
        })
        .attr("data-time", (item) => {
            return timeParse(item.Time);
        })
        .style("fill", function (d) {
            return d.Doping == "" ? "navy" : "red";
        })
        .on("mouseover", (item, i) => {
            if (item.Doping == "") {
                tooltip.transition().style("visibility", "visible");

                tooltip.text(item[0]);

                document.querySelector("#tooltip").setAttribute("data-date", item[0]);
            }
        })
        .on("mouseout", (item) => {
            tooltip.transition().style("visibility", "hidden");
        });
};

const generateAxes = () => {
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    svg
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`);

    svg
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0 )`);
};

request.open("GET", url, true);
request.onload = () => {
    json = JSON.parse(request.responseText);

    const data = json;
    drawCanvas();
    addTitle();
    addLabels();
    generateScales();
    drawDots();
    generateAxes();
};
request.send(); */
