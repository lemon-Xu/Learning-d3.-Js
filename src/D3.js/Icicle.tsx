import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

interface IGamesDatum {
  name: string;
  popularity: number;
}

interface IDatum {
  name: string;
  children: IGamesDatum[];
}

const Icicle: React.FC = () => {
  const [width] = useState(1400);
  const [height] = useState(7000);
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
    let root: d3.HierarchyNode<IDatum>;
    const svgSelection = d3.select(svg.current);
    svgSelection.attr("width", width).attr("height", height);

    const g = svgSelection
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.right})`);
    let color: any;
    const fill = (d: any) => {
      if (d.depth === 0) return color(d.data.name);
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    };

    const render = (data: any) => {
      color = d3.scaleOrdinal(d3.schemeCategory10);

      g.selectAll(".datarect")
        .data(root.descendants())
        .join("rect")
        .attr("class", "datarect")
        .attr("x", (d: any) => d.y0 / 2)
        .attr("y", (d: any) => d.x0 / 4)
        .attr("height", (d: any) => (d.x1 - d.x0) / 4)
        .attr("width", (d: any) => (d.y1 - d.y0) / 2)
        .attr("fill", fill);

      g.selectAll(".datatext")
        .data(root.descendants().filter((d: any) => d.x1 - d.x0 > 50))
        .join("text")
        .attr("class", "datatext")
        .attr("text-anchor", "middle")
        .attr("x", (d: any) => (d.y0 + d.y1) / 4)
        .attr("y", (d: any) => (d.x0 + d.x1) / 8)
        .attr("dy", "0.35em")
        .attr("font-size", "1em")
        .text((d: any) => d.data.name);
    };

    d3.json("./data/games.json").then((data: any) => {
      root = d3.partition<IDatum>().size([height, width])(
        d3
          .hierarchy<IDatum>(data)
          .sum((d: any) => d.popularity)
          .sort((a: any, b: any) => b.popularity - a.popularity)
      );
      console.log(1);
      console.log(root);
      render(root);
    });
  });
  return (
    <>
      <svg ref={svg}></svg>
    </>
  );
};

export { Icicle };
