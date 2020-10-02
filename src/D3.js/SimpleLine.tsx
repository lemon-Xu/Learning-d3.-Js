import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { extent } from "d3";

interface IData {
  date: Date;
  value: number;
}

const SimpleLine: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(1600);
  const [height, setHeight] = useState(800);
  const [margin, setMargin] = useState({
    top: 160,
    right: 80,
    bottom: 160,
    left: 80,
  });

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    const svgSelection = d3.select(ref.current);
    var data: IData[] = [
      { date: new Date(2007, 3, 24), value: 93.24 },
      { date: new Date(2007, 3, 25), value: 95.35 },
      { date: new Date(2007, 3, 26), value: 98.84 },
      { date: new Date(2007, 3, 27), value: 99.92 },
      { date: new Date(2007, 3, 30), value: 99.8 },
      { date: new Date(2007, 4, 1), value: 99.47 },
    ];

    data.forEach((d) => {
      console.log(d.date);
    });

    const xValue = (d: IData): Date => d.date;
    const yValue = (d: IData): number => d.value;

    let xScale: d3.ScaleTime<number, number>,
      yScale: d3.ScaleLinear<number, number>;

    let datesKeys: Date[];

    const g = svgSelection
      .append("g")
      .attr("id", "maingroup")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const init = (data: IData[]) => {
      svgSelection.attr("width", width).attr("height", height);

      let minX = d3.min(data, xValue) || new Date();
      let maxX = d3.max(data, xValue) || new Date();

      let minY = d3.min(data, yValue) || 0;
      let maxY = d3.max(data, yValue) || 0;

      xScale = d3
        .scaleTime()
        .domain([minX, maxX])
        .range([0, innerWidth])
        .nice();
      yScale = d3
        .scaleLinear()
        .domain([maxY, minY])
        .range([0, innerHeight])
        .nice();

      datesKeys = Array.from(new Set(data.map((d) => d.date)));

      // Adding axes
      const xAxis = d3.axisBottom(xScale);
      // .ticks(Math.floor(datesKeys.length / 4))
      // .tickSize(-innerHeight);

      const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);

      const xAxisGroup = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

      const yAxisGroup = g.append("g").call(yAxis);

      g.selectAll(".tick text").attr("font-size", "1em");
      g.append("path").attr("id", "alterPath");
    };

    const renderUpdate = (data: IData[]) => {
      const line = d3
        .line<IData>()
        .x((d: IData) => {
          return xScale(xValue(d)) || 0;
        })
        .y((d: IData) => {
          return yScale(yValue(d)) || 0;
        })
        .curve(d3.curveCardinal.tension(0.5));

      // lineEmpty is typically used for the first animation that raise the line up;
      const lineEmpty = d3
        .line<IData>()
        .x((d: IData) => {
          return xScale(xValue(d)) || 0;
        })
        .y((d: IData) => {
          return yScale(d3.min(data, yValue) || 0) || 0;
        })
        .curve(d3.curveCardinal.tension(0.5));

      // .curve(d3.curveCardinal.tension(0.5));

      const maingroup = d3.select("#maingroup");
      // maingroup
      //   .append("path")
      //   .attr("d", line(data) || "")
      //   .attr("stroke", "black")
      //   .attr("fill", "none");
      const pathUpdate = maingroup.selectAll(".datacurve").data(data);

      const pathEnter = pathUpdate
        .enter()
        .append("path")
        .attr("class", "datacurve")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", line(data) || "");

      pathUpdate
        .merge(d3.selectAll(".datacurve"))
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("d", lineEmpty(data) || "");

      console.log(line(data));
      console.log(lineEmpty(data));
    };

    init(data);
    renderUpdate(data);
  });
  return (
    <>
      <svg ref={ref}></svg>
    </>
  );
};

export { SimpleLine };
