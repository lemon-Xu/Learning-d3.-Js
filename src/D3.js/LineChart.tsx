import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
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

    const xValue = (datum: any): Date => {
      return datum["日期"];
    };
    const yValue = (datum: any): number => {
      return datum["现有确诊"];
    };

    let xScale: any, yScale: any;
    let alldates: any;
    let allkeys: any;

    const render_init = (data: any) => {
      let minX = d3.min(data, xValue) || 0;
      let maxX = d3.max(data, xValue) || 0;

      xScale = d3
        .scaleTime()
        .domain([minX, maxX])
        .range([0, innerWidth])
        .nice();

      let minY = d3.min(data, yValue) || 0;
      let maxY = d3.max(data, yValue) || 0;

      yScale = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([0, innerHeight])
        .nice();

      // Adding axes
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(Math.floor(alldates.length / 4))

        .tickSize(-innerHeight);

      // .tickFormat(d3.timeFormat('%b-%d'))

      const xAxisGroup = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

      const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
      const yAxisGroup = g.append("g").call(yAxis);

      g.selectAll(".tick text").attr("font-size", "2em");
      g.append("path").attr("id", "alterPath");
    };

    const renderUpdate = (data: any) => {
      const line = d3
        .line()
        .x((d) => xScale(xValue(d)))
        .y((d) => yScale(yValue(d)))
        .curve(d3.curveCardinal.tension(0.5));

      // lineEmpty is typically used for the first animation that raise the line up;
      const lineEmpty = d3
        .line()
        .x((d) => xScale(xValue(d)))
        .y((d) => yScale(0))
        .curve(d3.curveCardinal.tension(0.5));

      console.log(line);
      console.log(lineEmpty);

      const maingroup = d3.select("#maingroup");
      const pathUpdate = maingroup.selectAll(".datacurve").data([data]);

      const pathEnter = maingroup
        .enter()
        .append("path")
        .attr("class", "datacurve")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", lineEmpty(data) || 0);

      // pathUpdate
      //   .merge(pathEnter)
      //   .transition()
      //   .duration(2000)
      //   .ease(d3.easeLinear)
      //   .attr("d", line);
    };

    const renderUpdateAlter = (data: any) => {
      const line = d3
        .line()
        .x((d: any) => {
          return xScale(xValue(d));
        })
        .y((d: any) => {
          return yScale(yValue(d));
        })
        .curve(d3.curveCardinal.tension(0.5)); // 如何进行闭合，如何进行差值

      d3.select("#alterPath")
        .datum(data)
        .attr("stroke", "green")
        .attr("stroke-width", 2.5)
        .attr("fill", "none")
        .transition()
        .duration(2000)
        .attr("d", line);
    };

    d3.csv("./svc/hubei_day14.csv").then((data: any) => {
      data = data.filter((d: any) => d["地区"] !== "总计");
      data = data.filter((d: any) => d["地区"] !== "湖北");
      data.forEach((datum: any) => {
        datum["现有确诊"] = +datum["现有确诊"];
        datum["日期"] = new Date(datum["日期"]);
      });

      let provinces: any = {};

      allkeys = Array.from(new Set(data.map((d: any) => d["地区"])));
      alldates = Array.from(new Set(data.map((d: any) => d["日期"])));
      allkeys.forEach((key: any) => {
        provinces[key] = [];
      });

      data.forEach((d: any) => {
        provinces[d["地区"]].push(d);
      });

      allkeys.forEach((key: any) => {
        provinces[key] = provinces[key].sort((a: any, b: any) => {
          return a["日期"] - b["日期"];
        });
      });

      render_init(data);
      renderUpdate(data);
      let c = 0;
      let intervalId = setInterval(() => {
        if (c >= allkeys.length) {
          clearInterval(intervalId);
        } else {
          let key = allkeys[c];
          // renderUpdateAlter(provinces[key]);
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
