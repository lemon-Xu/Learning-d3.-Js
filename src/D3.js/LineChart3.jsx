import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { keys } from "d3";

const LineChart = () => {
  const svgRef = useRef(null);
  useEffect(() => {
    const svg = svgRef.current;
    const selection = d3.select(svg);

    selection.attr("width", "1600").attr("height", "800");

    const margin = { top: 120, right: 50, bottom: 50, left: 120 };
    const innerWidth = +selection.attr("width") - margin.left - margin.right;
    const innerHeight = +selection.attr("height") - margin.top - margin.bottom;

    const g = selection
      .append("g")
      .attr("id", "maingroup")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xValue = (datum) => {
      return datum["日期"];
    };
    const yValue = (datum) => {
      return datum["现有确诊"];
    };

    let xScale, yScale;
    let alldates;
    let allkeys;

    const render_init = function (data) {
      xScale = d3
        .scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

      yScale = d3
        .scaleLinear()
        .domain([d3.max(data, yValue), d3.min(data, yValue)])
        .range([0, innerHeight])
        .nice();

      // Adding axes
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(Math.floor(alldates.length) / 4)
        //.tickFormat(d3.timeFormat('%b-%d'))
        .tickSize(-innerHeight);
      const xAxisGroup = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

      const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
      const yAxisGroup = g.append("g").call(yAxis);

      g.selectAll(".tick text").attr("font-size", "2em");
      g.append("path").attr("id", "alterPath");
    };

    const render_update = function (data) {
      const line = d3
        .line()
        .x((d) => {
          return xScale(xValue(d));
        })
        .y((d) => {
          return yScale(yValue(d));
        })
        .curve(d3.curveCardinal.tension(0.5));

      // lineEmpty is typically used for the first animation that raise the line up;
      const lineEmpty = d3
        .line()
        .x((d) => {
          return xScale(xValue(d));
        })
        .y((d) => {
          return yScale(0);
        })
        .curve(d3.curveCardinal.tension(0.5));

      const maingroup = d3.select("#maingroup");
      const pathupdate = maingroup.selectAll(".datacurve").data([data]);

      const pathenter = pathupdate
        .enter()
        .append("path")
        .attr("class", "datacurve")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", lineEmpty);

      pathupdate
        .merge(pathenter)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("d", line);
    };

    const render_update_alter = function (data) {
      const line = d3
        .line()
        .x((d) => {
          return xScale(xValue(d));
        })
        .y((d) => {
          return yScale(yValue(d));
        })
        //.curve(d3.curveBasis)
        .curve(d3.curveCardinal.tension(0.5));

      // See https://github.com/d3/d3-shape/blob/v1.3.7/README.md#curves
      d3.select("#alterPath")
        .datum(data)
        .attr("class", "datacurve")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2.5)
        .transition()
        .duration(2000)
        .attr("d", line);
    };

    d3.csv("./static/data/province.csv").then(function (data) {
      data = data.filter((datum) => {
        return datum["省份"] !== "总计";
      });
      data = data.filter((datum) => {
        return datum["省份"] !== "湖北";
      });
      alldates = Array.from(new Set(data.map((d) => xValue(d))));
      data.forEach((datum) => {
        datum["现有确诊"] = +datum["现有确诊"];
        datum["日期"] = new Date(datum["日期"]);
      });
      let provinces = {};
      allkeys = Array.from(new Set(data.map((d) => d["省份"])));
      allkeys.forEach((key) => {
        provinces[key] = [];
      });
      data.forEach((d) => {
        provinces[d["省份"]].push(d);
      });
      allkeys.forEach((key) =>
        provinces[key].sort(function (a, b) {
          return new Date(b["日期"]) - new Date(a["日期"]);
        })
      );
      render_init(data);
      let c = 0;
      let intervalId = setInterval(() => {
        if (c >= allkeys.length) {
          clearInterval(intervalId);
        } else {
          let key = allkeys[c];
          render_update_alter(provinces[key]);
          c = c + 1;
        }
      }, 2000);
    });
  });
  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};

export { LineChart };
