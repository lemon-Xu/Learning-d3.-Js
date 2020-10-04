import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import moment from "moment";
import { Series, SeriesPoint } from "d3";
interface IDatum {
  month: Date;
  apples: number;
  bananas: number;
  cherries: number;
  dates: number;
}

const StackBarChart: React.FC = () => {
  const [width] = useState(1600);
  const [height] = useState(800);
  const [margin] = useState({
    left: 160,
    top: 80,
    right: 80,
    bottom: 160,
  });
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgSelection = d3
      .select(svg.current)
      .attr("width", width)
      .attr("height", height);
    const g = svgSelection
      .append("g")
      .attr("id", "maingroup")
      .attr("transform", `translate(${margin.left}, ${margin.right})`);

    const naiveData: IDatum[] = [
      {
        month: new Date(2015, 0, 1),
        apples: 3840,
        bananas: 1920,
        cherries: 960,
        dates: 400,
      },
      {
        month: new Date(2015, 1, 1),
        apples: 1600,
        bananas: 1440,
        cherries: 960,
        dates: 400,
      },
      {
        month: new Date(2015, 2, 1),
        apples: 640,
        bananas: 960,
        cherries: 640,
        dates: 400,
      },
      {
        month: new Date(2015, 3, 1),
        apples: 320,
        bananas: 480,
        cherries: 640,
        dates: 400,
      },
    ];

    const naiveKeys = ["apples", "banans", "cherries", "dates"];

    // remember the following apis are able to modify the 'offset' the data;
    // .offset(d3.stackOffsetNone)
    // .offset(d3.stackOffsetWiggle)

    var naiveStack = d3
      .stack<IDatum, string>()
      .keys(naiveKeys)
      .order(d3.stackOrderNone)(naiveData);

    const xValue = (d: IDatum) => {
      return moment(d.month.toISOString()).format("YYYY-M-D");
    };

    //
    let maxDatumSubd = d3.max(naiveStack, (d: d3.Series<IDatum, string>) =>
      //   d3.max(d, (subd: ) => subd[1])
      d3.max(d, (subd: SeriesPoint<IDatum>) => subd[1])
    );

    const yScale = d3
      .scaleLinear()
      .domain([0, maxDatumSubd || 0])
      .range([innerHeight, 0])
      .nice();

    const xScale = d3
      .scaleBand()
      .domain(naiveData.map((d: any) => xValue(d)))
      .range([0, innerWidth])
      .padding(0.5);

    const naiveAxes = function () {
      const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight);
      const xAxisGroup = g
        .append("g")
        .attr("id", "xaxis")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

      const yAxis = d3
        .axisLeft(yScale)
        //.tickFormat(d3.format('.2r'))
        .tickFormat(d3.format(".1s"))
        //.tickFormat(d3.format('.2s'))
        //.tickFormat(d3.format('.2f'))
        .tickSize(-innerWidth);
      const yAxisGroup = g.append("g").attr("id", "yaxis").call(yAxis);

      return { xAxisGroup: xAxisGroup, yAxisGroup: yAxisGroup };
    };

    naiveAxes();

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(naiveKeys)
      .range(d3.schemeSet3);

    // return;
    // console.log(naiveStack);

    const groupRect = g
      .append("g")
      .selectAll("g")
      .data(naiveStack)
      .enter()
      .append("g")
      .attr("fill", (d: any, i: any) => {
        return color(i);
      })
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("y", (d: any) => {
        return yScale(d[1]) || 0;
      })
      .attr("x", (d: any) => {
        return xScale(xValue(d.data)) || 0;
      })
      .attr("height", (d: any) => {
        let a = yScale(d[0]) || 0;
        let b = yScale(d[1]) || 0;
        return a - b;
      })
      .attr("width", xScale.bandwidth());
    return;
    // start to do data-join;
    groupRect
      .selectAll("rect")
      .data(naiveStack)
      .join("g")
      .attr("class", "maingroup")
      .attr("fill", (d: Series<IDatum, string>) => color(d.key))
      .selectAll(".datarect")
      .attr("y", (d: any) => {
        return yScale(d[1]) || 0;
      })
      .attr("x", (d: any) => {
        return xScale(xValue(d.data)) || 0;
      })
      .attr("height", (d: any) => {
        let a = yScale(d[0]) || 0;
        let b = yScale(d[1]) || 0;
        return a - b;
      })
      .attr("width", xScale.bandwidth());

    d3.selectAll(".tick text").attr("font-size", "2em");
    d3.selectAll("#xaxis text").attr("y", "10");
  });

  return (
    <>
      <svg ref={svg}></svg>
    </>
  );
};

export { StackBarChart };
