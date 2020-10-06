import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const Force: React.FC = () => {
  const [width] = useState(1600);
  const [height] = useState(940);
  const [margin] = useState({
    left: 150,
    top: 60,
    right: 50,
    bottom: 50,
  });
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let root;
    const svgSelection = d3.select(svg.current);
    svgSelection.attr("width", width).attr("height", height);

    const g = svgSelection
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    let color: any;
    const fill = (d: any) => {
      //   if (d.depth === 0) return color(d.data.name);
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    };

    let nodes: any;
    let simulation: any;
    let circles: any, lines: any;
    let links: any;

    // function dragStarted(d: any) {
    //   d3.select(this).raise().attr("stroke", "black");
    //   simulation.stop();
    // }

    // function dragged(d: any) {
    //   d3.select(this)
    //     .attr("cx", (d.x = d3.event.x))
    //     .attr("cy", (d.y = d3.event.y));
    //   ticked();
    // }

    // function dragEnded(d: any) {
    //   d3.select(this).attr("stroke", null);
    //   simulation.restart();
    // }

    // const drag = d3
    //   .drag()
    //   .on("start", dragStarted)
    //   .on("drag", dragged)
    //   .on("end", dragEnded);

    const renderInit = () => {
      lines = svgSelection
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "black")
        .attr("opacoty", 0.8)
        .attr("stroke-width", 0.5);

      circles = svgSelection
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "blue");
      // .call(drag);
    };

    const ticked = () => {
      lines
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      circles.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    };

    const render = (data: any) => {};

    d3.json("./data/socfb-Caltech36.json").then((data: any) => {
      links = data.links;
      nodes = [];
      for (let i = 0; i < data["#nodes"]; i++) {
        nodes.push({ index: i });
      }
      console.log(nodes);
      renderInit();

      simulation = d3
        .forceSimulation(nodes)
        .force("manybody", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(links).strength(0.1).distance(100))
        .on("tick", ticked);
    });
  });

  return (
    <>
      <svg ref={svg}></svg>
    </>
  );
};

export { Force };
