import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { HierarchyNode } from "d3";
import { isDate } from "moment";

interface IGamesDatum {
  name: string;
  popularity: number;
}

interface IDatum {
  name: string;
  children: this[] | IGamesDatum[];
}

interface IDatumSum {
  name: string;
  children: this | IGamesDatum[];
  popularity: number;
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
    let root: d3.HierarchyRectangularNode<IDatum>;
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

    const render = (data: d3.HierarchyRectangularNode<IDatum>) => {
      color = d3.scaleOrdinal(d3.schemeCategory10);

      g.selectAll(".datarect")
        .data(root.descendants())
        .join("rect")
        .attr("class", "datarect")
        .attr("x", (d: d3.HierarchyRectangularNode<IDatum>) => d.y0 / 2)
        .attr("y", (d: d3.HierarchyRectangularNode<IDatum>) => d.x0 / 4)
        .attr(
          "height",
          (d: d3.HierarchyRectangularNode<IDatum>) => (d.x1 - d.x0) / 4
        )
        .attr(
          "width",
          (d: d3.HierarchyRectangularNode<IDatum>) => (d.y1 - d.y0) / 2
        )
        .attr("fill", fill);

      g.selectAll(".datatext")
        .data(
          root
            .descendants()
            .filter(
              (d: d3.HierarchyRectangularNode<IDatum>) => d.x1 - d.x0 > 50
            )
        )
        .join("text")
        .attr("class", "datatext")
        .attr("text-anchor", "middle")
        .attr(
          "x",
          (d: d3.HierarchyRectangularNode<IDatum>) => (d.y0 + d.y1) / 4
        )
        .attr(
          "y",
          (d: d3.HierarchyRectangularNode<IDatum>) => (d.x0 + d.x1) / 8
        )
        .attr("dy", "0.35em")
        .attr("font-size", "1em")
        .text((d: d3.HierarchyRectangularNode<IDatum>) => d.data.name);
    };

    d3.json<IDatum>("./data/games.json").then((data: IDatum | undefined) => {
      if (data) {
        root = d3.partition<IDatum>().size([height, width])(
          d3
            .hierarchy<IDatum>(data, (d: any) => {
              console.log(d, "valueFn");
              return d.children;
            })
            .sum((d: any) => {
              console.log(d);
              return d.popularity;
            })
            .sort((a: any, b: any) => b.popularity - a.popularity)
        );

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

export { Icicle };
