import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

interface IGamesDatum {
  name: string;
  popularity: number;
}

interface IDatum {
  name: string;
  children: IDatum | IGamesDatum[];
}

const Tree: React.FC = () => {
  const [width] = useState(1600);
  const [height] = useState(800);
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
      // .domain(
      //   root
      //     .descendants()
      //     .filter((d) => d.depth <= 1)
      //     .map((d) => d.data.name)
      // )
      // .range(d3.schemeCategory10);

      g.selectAll("path")
        .data(root.links())
        .join("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .linkHorizontal<
              d3.HierarchyLink<IDatum>,
              d3.HierarchyNode<IGamesDatum>
            >()
            .x((d: any) => d.y)
            .y((d: any) => d.x)
        )
        .text("1");

      g.selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("cx", (d: any) => d.y)
        .attr("cy", (d: any) => d.x)
        .attr("fill", fill)
        .attr("stroke-width", 3)
        .attr("r", 6);

      g.selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr("text-anchor", (d) => (d.children ? "end" : "start"))
        // note that if d is a child, d.children is undefined which is actually false!
        .attr("x", (d: any) => (d.children ? -6 : 6) + d.y)
        .attr("y", (d: any) => d.x + 5)
        .text((d) => d.data.name);
    };

    d3.json<IDatum>("./data/games.json").then((data: IDatum | undefined) => {
      if (data) {
        root = d3.hierarchy<IDatum>(data);
        d3.tree().size([innerHeight, innerWidth])(root);
        render(root);
      }
    });
  });
  return (
    <>
      <svg ref={svg}></svg>
    </>
  );
};

export { Tree };
