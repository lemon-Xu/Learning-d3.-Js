import React, { useRef, useState, useEffect, useReducer } from "react";
import * as d3 from "d3";

interface Data {}

const SimpleLine: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {});

  return (
    <>
      <svg ref={ref}></svg>
    </>
  );
};

export { SimpleLine };
