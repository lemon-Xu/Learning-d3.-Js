import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { NumberValue } from "d3";

const BarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const data = [
      { name: "Shao-Kui", value: 6 },
      { name: "Wen-Yang", value: 6 },
      { name: "Cai Yun", value: 16 },
      { name: "Liang Yuan", value: 25 },
      { name: "Yuan-Chen", value: 6 },
    ];

    const data2 = [
      { name: "Cai Yun", value: 16 },
      { name: "Liang Yuan", value: 25 },
      { name: "Yuan-Chen", value: 6 },
      { name: "Shao-Kui", value: 6 },
      { name: "Wen-Yang", value: 6 },
    ];

    const svg = d3
      .select(svgRef.current) // 选择dom节点， 可以是'#id' \ '.class' \ 真实dom节点
      .attr("width", 1600)
      .attr("height", 800);

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 60, right: 30, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let max = d3.max(data, (d) => d.value);
    const MAX = max !== undefined ? max : 0;

    // Scale
    const xScale = d3.scaleLinear().domain([0, MAX]).range([0, innerWidth]);
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.1); // padding 预留空间的半分之一的位置，作为间隔

    const g = svg
      .append("g")
      .attr("id", "mainGroup")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
    g.append("g").call(yAxis);

    const xAxis = d3.axisBottom(xScale);
    g.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);

    // 以上是定义坐标轴

    // 以下是绘制条带, 使用添加
    // data.forEach((d) => {
    //   let width = xScale(d.value);
    //   let y = yScale(d.name);
    //   if (!width) width = 0;
    //   if (!y) y = 0;
    //   g.append("rect")
    //     .attr("width", width)
    //     .attr("height", yScale.bandwidth())
    //     .attr("fill", "green")
    //     .attr("y", y);
    // });

    // draw rectangles
    g.selectAll(".dataRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "dataRect")
      .attr("width", (d) => xScale(d.value) || 0)
      .attr("height", yScale.bandwidth())
      .attr("y", (d) => yScale(d.name) || 0)
      .attr("fill", "green")
      .attr("opacity", 0.8);

    // 自由修改坐标轴刻度 里 text 中的字体大小
    d3.selectAll(".tick text").attr("font-size", "1.2em");

    // 添加标题
    g.append("text")
      .text("Members of CSCG")
      .attr("font-size", "3em")
      .attr("transform", `translate(${innerWidth / 2},0)`)
      .attr("text-anchor", "middle");

    // 数据绑定到图元， 出现问题， 索引错误
    // d3.selectAll("rect")
    //   .data(data2)
    //   .attr("width", (d) => xScale(d.value) || 0);

    d3.selectAll("rect")
      .data(data2, (d: any) => {
        return d.value;
      })
      .attr("width", (d) => xScale(d.value) || 0);
  });

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};

export { BarChart };
