import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { GeoJsonProperties, Feature } from "geojson";
import { svg } from "d3";

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
      .attr("transform", `trnaslate(${margin.left},${margin.right})`);

    const projection = d3.geoNaturalEarth1();

    const geo = d3.geoPath().projection(projection);

    const init = (data: any) => {};

    d3.json("./topoJson/countries-110m.json").then((data: any) => {
      let worldMeta: GeoJsonProperties = topojson.feature<GeoJsonProperties>(
        data,
        data.objects.countries
      );
      console.log(worldMeta);
      for (let a in worldMeta) {
        console.log(a);
      }

      console.log(geo(worldMeta.features));
      console.log(worldMeta.features);
      g.selectAll("path")
        .data(worldMeta.features)
        .enter()
        .append("path")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", (d: any) => geo(d));
    });
  });

  return (
    <>
      <svg ref={ref}></svg>
    </>
  );
};

export { InteractionMap };
