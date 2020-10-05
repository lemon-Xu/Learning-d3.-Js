import React from "react";
import "./App.css";

// import { BarChart } from "./D3.js/BarChart";
// import { BarChart } from "./D3.js/BarChart.Data-Join";
// import { BarChart } from "./D3.js/BarChart.transiton.duration";
// import { BubbleDiagram } from "./D3.js/BubbleDiagram";
// import { LineChart } from "./D3.js/LineChart";
// import { SimpleLine } from "./D3.js/SimpleLine";
// import { InteractionMap } from "./D3.js/Interaction.Map";
// import { StackBarChart } from "./D3.js/StackBarChart.Simple";
import { Tree } from "./D3.js/Tree";
import { Icicle } from "./D3.js/Icicle";
import { SunBurst } from "./D3.js/SunBurst";
function App() {
  return (
    <>
      <Tree></Tree>
      <Icicle></Icicle>
      <SunBurst></SunBurst>
    </>
  );
}

export default App;
