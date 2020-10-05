import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

interface IGamesDatum {
  name: string;
  popularity: number;
}

interface IDatum {
  name: string;
  children: this | IGamesDatum[];
}

const SunBurst: React.FC = () => {
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
    let root: d3.HierarchyNode<IDatum>;
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

    const arc = d3
      .arc<d3.HierarchyRectangularNode<IDatum>>()
      //   .innerRadius((d: any) => {
      //     return d.y0;
      //   })
      .innerRadius((d: d3.HierarchyRectangularNode<IDatum>) => d.y0)
      .outerRadius((d: d3.HierarchyRectangularNode<IDatum>) => d.y1)
      .startAngle((d: d3.HierarchyRectangularNode<IDatum>) => d.x0)
      .endAngle((d: d3.HierarchyRectangularNode<IDatum>) => d.x1)
      .padRadius(Math.PI / 2)
      .padAngle((d: d3.HierarchyRectangularNode<IDatum>) =>
        Math.min((d.x1 - d.x0) / 2, 0.005)
      );

    const render = (data: any) => {
      color = d3.scaleOrdinal(d3.schemeCategory10);
      console.log(data[0]);
      g.selectAll(".datapath")
        .data<d3.HierarchyRectangularNode<IDatum>>(
          data.descendants().filter((d: any) => d.depth !== 0)
        )
        .join("path")
        .attr("class", "datapath")
        .attr("fill", fill)
        .attr("d", arc);

      g.selectAll(".datatext")
        .data(root.descendants().filter((d: any) => d.depth !== 0))
        .join("text")
        .attr("class", "datatext")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("font-size", (d: any) =>
          d.data.name.length < 15 ? "1em" : ".85em"
        )
        .attr("transform", (d: any) => {
          const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
          const y = (d.y0 + d.y1) / 2;
          //
          return `rotate(${x - 90}) translate(${y}, 0) rotate(${
            x < 180 ? 0 : 180
          }) translate(0, 5)`;
        })
        .text((d: any) => d.data.name);
    };

    d3.json("./data/games.json").then((data: any) => {
      root = d3.partition<IDatum>().size([2 * Math.PI, height / 1.6])(
        d3
          .hierarchy<IDatum>(data)
          .sum((d: any) => d.popularity)
          .sort((a: any, b: any) => b.popularity - a.popularity)
      );
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

export { SunBurst };
