import { format } from "path";
import React, { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { NumberValue, ScaleLinear } from "d3";
import { BaseType } from "typescript";

const BubbleDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 100, right: 120, bottom: 100, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let xScale: ScaleLinear<number, number>,
      yScale: ScaleLinear<number, number>;

    const xAxisLabel = "累计确诊人数（对数）";
    const yAxisLabel = "新增人数（对数）";

    let xValue = (d: any): number => Math.log(d["确诊人数"] + 1);
    let yValue = (d: any): number => Math.log(d["治愈人数"] + 1);

    let alldates: any[];
    let sequantial: any[] = [];

    let aduration = 1000;

    let color = {
      武汉: "#ff1c12",
      黄石: "#de5991",
      十堰: "#759AA0",
      荆州: "#E69D87",
      宜昌: "#be3259",
      襄阳: "#EA7E53",
      荆门: "#9359b1",
      孝感: "#47c0d4",
      黄岗: "#F49F42",
      咸宁: "#AA312C",
      恩施州: "#b35E45",
      随州: "#4B8E6F",
      仙桃: "#ff8603",
      天门: "#FFDE1D",
      潜江: "#1E9D95",
      神农架: "#7289AB",
    };

    const renderInit = function (data: any) {
      // Linear Scale: Data Space -> Screen .Space;
      let minX = d3.min(data, xValue) || 0;
      let maxX = d3.max(data, xValue) || 0;

      let minY = d3.min(data, yValue) || 0;
      let maxY = d3.max(data, yValue) || 0;
      xScale = d3
        .scaleLinear()
        .domain([minX, maxX])
        .range([0, innerWidth])
        .nice();

      // Introducing y-Scale;
      yScale = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([0, innerHeight])
        .nice();

      // The reason of using group is that nothing is rendered outside svg,
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("id", "maingroup");

      // Adding axes;
      const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

      const xAxis = d3.axisRight(xScale).tickSize(-innerHeight).tickPadding(10);

      let yAxisGroup = g.append("g").call(yAxis).attr("id", "yaxis");

      yAxisGroup
        .append("text")
        .attr("font-size", "2em")
        .attr("transform", "rotate(-90)")
        .attr("x", innerHeight / 2)
        .attr("y", -60)
        .attr("fill", "#333333")
        .text(yAxisLabel)
        .attr("text-anchor", "middle");

      yAxisGroup.selectAll(".domain").remove();

      let xAxisGroup = g
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(${0}, ${innerHeight})`)
        .attr("id", "xaxis");

      xAxisGroup
        .append("text")
        .attr("font-size", "2em")
        .attr("y", 60)
        .attr("x", innerWidth / 2)
        .attr("fill", "#333333")
        .text(xAxisLabel);
      xAxisGroup.selectAll(".domain").remove();
    };

    const renderUpdate = function (seq: any) {
      const g = d3.select("#maingroup");

      let circleUpdates = g.selectAll("circle").data(seq, (d: any) => {
        let a = d["地区"] || 0;
        return a;
      });

      circleUpdates.enter().append("circle");

      let circleenter = circleUpdates
        .enter()
        .append("circle")
        .attr("cx", (d: any) => {
          return xScale(xValue(d)) || 0;
        })
        .attr("cy", (d: any) => {
          return yScale(yValue(d)) || 0;
        })
        .attr("r", 10)
        .attr("fill", (d: any) => {
          return "#3333333";
        })
        .attr("opacity", 0.8);

      circleUpdates
        .data(seq, (d: any) => d["地区"] || 0)
        .transition()
        .ease(d3.easeLinear)
        .duration(aduration)
        .attr("cx", (d: any) => {
          return xScale(xValue(d)) || 0;
        })
        .attr("cy", (d: any) => {
          return yScale(yValue(d)) || 0;
        });
    };

    d3.csv("./svc/hubei.csv").then((data) => {
      //   data = data.filter((d) => d["province"] !== "武汉省");
      data.forEach((d: any) => {
        d["确诊人数"] = parseFloat(d["确诊人数"]);
        d["新增确诊"] = parseFloat(d["新增确诊"]);
        if (d["新增确诊"] < 0) {
          d["新增确诊"] = 0;
        }
      });

      alldates = Array.from(new Set(data.map((d: any) => d["日期"])));
      alldates = alldates.sort((a, b) => {
        let timeA = new Date(a);
        let timeB = new Date(b);
        return timeA.getTime() - timeB.getTime();
      });

      sequantial = [];
      alldates.forEach((d) => {
        sequantial.push([]);
      });

      data.forEach((d) => {
        sequantial[alldates.indexOf(d["日期"])].push(d);
      });
      renderInit(data);

      let c = 0;
      let intervaId = setInterval(() => {
        if (c >= alldates.length) {
          clearInterval(intervaId);
        } else {
          renderUpdate(sequantial[c]);
          c = c + 1;
        }
      }, aduration);

      console.log(sequantial);
    });
  });
  return (
    <>
      <svg ref={svgRef} width="1650" height="920" className="svgs"></svg>
    </>
  );
};

export { BubbleDiagram };
