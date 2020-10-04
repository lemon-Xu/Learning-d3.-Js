import React, { useRef, useEffect, useState } from "react";

import * as topojson from "topojson";
import { GeoJsonProperties, Feature } from "geojson";

import * as d3 from "d3";
import { svg } from "d3";
import "d3-tip";
import "../CSS/earth.css";

import "d3-tip";

const InteractionMap: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [width] = useState(1600);
  const [height] = useState(800);
  const [margin] = useState({
    top: 60,
    right: 60,
    bottom: 10,
    left: 60,
  });
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    const svgSelection = d3.select(ref.current);
    svgSelection.attr("width", width).attr("height", height);
    const g = svgSelection
      .append("g")
      .attr("id", "mainGroup")
      .attr("transform", `translate(${margin.left},${margin.right})`);

    const projection = d3.geoNaturalEarth1();

    const geo = d3.geoPath().projection(projection);

    // let tip: any = d3
    //   .tip()
    //   .attr("class", "d3-tip")
    //   .html((d: any) => d.properties.name);
    // svgSelection.call(tip);

    d3.json("./topoJson/countries-110m.json").then((data: any) => {
      let worldMeta: GeoJsonProperties = topojson.feature<GeoJsonProperties>(
        data,
        data.objects.countries
      );

      projection.fitSize([innerWidth, innerHeight], worldMeta as any);

      g.selectAll("path")
        .data(worldMeta.features)
        .enter()
        .append("path")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", (data: any) => geo(data))
        .on("mouseover", function (d) {
          d3.select(this)
            .attr("opacity", 0.5)
            .attr("stroke", "white")
            .attr("stroke-width", 6);

          //   tip.show(d);
        })
        .on("mouseout", function (d) {
          d3.select(this)
            .attr("opacity", 1)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        });
    });
  });

  return (
    <>
      <svg ref={ref}></svg>
    </>
  );
};

export { InteractionMap };
