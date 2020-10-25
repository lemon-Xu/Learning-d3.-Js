import React, {
    useRef,
    useEffect,
    useReducer,
    useState,
    ReactNode,
    ReactElement,
    Reducer,
    createContext,
    useContext,
    Dispatch,
    ReducerAction,
  } from "react";
  import { select, Selection, drag, line, curveBasis } from "d3";
  
  interface IPSCanvas {
    width: number;
    height: number;
  
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
  }
  
  type ISCanvas = IPSCanvas & { innerHeight?: number; innerWidth?: number };
  
  interface IState {
    svg?: SVGSVGElement | null;
    canvas?: ISCanvas;
  }
  
  interface IPayload {
    canvas?: ISCanvas;
    svg?: SVGSVGElement | null;
  }
  
  type IAType = string;
  const SET_CANVAS: IAType = "SET_CANVAS";
  
  interface IAction {
    type: IAType;
    payload: IPayload;
  }
  
  const setCanvas = (canvas: ISCanvas, svg: SVGSVGElement | null): IAction => {
    return {
      type: SET_CANVAS,
      payload: {
        canvas,
        svg,
      },
    };
  };
  
  const reducer = (state: IState, action: IAction): IState => {
    switch (action.type) {
      case SET_CANVAS:
        if (action.payload.canvas) {
          state.svg = action.payload.svg;
          state.canvas = action.payload.canvas;
        }
        return {
          ...state,
        };
      default:
        return state;
    }
  };
  
  const Store: React.Context<{
    state: IState;
    dispatch: Dispatch<ReducerAction<Reducer<IState, IAction>>>;
  }> = createContext({ state: {}, dispatch: (action: IAction): void => {} });
  
  /**
   * 用于构建画布，它返回一个SVGSVGElement
   * @param props IPSCanvas
   */
  const Canvas: React.FC<IPSCanvas> = (
    props: React.PropsWithChildren<IPSCanvas>
  ) => {
    const svg = useRef<SVGSVGElement>(null);
    const {
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
    } = props;
    const [state, dispatch] = useReducer<Reducer<IState, IAction>>(reducer, {
      svg: svg.current,
      canvas: {
        width,
        height,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
      },
    });
  
    useEffect(() => {
      let { marginTop, marginRight, marginBottom, marginLeft } = props;
      marginTop = marginTop ? (marginTop > 0 ? marginTop : 0) : 0;
      marginRight = marginRight ? (marginRight > 0 ? marginRight : 0) : 0;
      marginBottom = marginBottom ? (marginBottom > 0 ? marginBottom : 0) : 0;
      marginLeft = marginLeft ? (marginLeft > 0 ? marginTop : 0) : 0;
  
      const innerWidth = width - marginLeft - marginRight;
      const innerHeight = height - marginTop - marginBottom;
  
      const canvas = {
        width,
        height,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        innerWidth,
        innerHeight,
      };
  
      console.log(1);
  
      select(svg.current)
        .attr("width", width)
        .attr("height", height)
        .attr("translate", `transform(${marginLeft}, ${marginRight})`);
  
      if (svg.current) {
        console.log(svg.current);
        dispatch(setCanvas(canvas, svg.current));
      }
    }, [props, height, width, svg.current]);
    const children: ReactNode[] = [];
    if (props.children) {
      React.Children.map(props.children, (c: ReactNode) => {
        children.push(c);
      });
    }
  
    return (
      <Store.Provider value={{ state, dispatch }}>
        <svg ref={svg}>{children}</svg>
      </Store.Provider>
    );
  };
  
  const usedLine = line<[number, number]>()
    .curve(curveBasis)
    .x((d) => d[0] | 0)
    .y((d) => d[1] | 0);
  //   .x((d: [number, number]) => d[0] | 0)
  //   .y((d: [number, number]) => d[1] | 0);
  
  const DrawMe: React.FC = () => {
    const { state, dispatch } = useContext(Store);
    const { svg } = state;
  
    const [array, setArray] = useState<[number, number][]>([]);
  
    const linePointer: [number, number][] = [];
    const dragstarted = (event: any) => {
      if (svg) {
        linePointer[0] = [event.x, event.y];
        
      }
    };
  
    const draging = (event: any) => {
      if (svg) {
        const sw = "3px";
  
        // currentEvent.on("drag", (event: any)=>{
        //   let x0 = event.x;
        //   let y0 = event.y;
        //   const x1 = event.x;
        //   const y1 = event.y;
        //   const dx = x1 - x0;
        //   const dy = y1 - y0;
  
        //   if (dx * dx + dy * dy > 36) d.push([(x0 = x1), (y0 = y1)]);
        //   else d[d.length - 1] = [x1, y1];
        linePointer[1] = [event.x, event.y];
  
        const str = usedLine(linePointer);
        console.log(str);
          select(svg)
          .select('g')
          .select('path')
          .attr("d", str !== null ? str : "")
          .style("stroke-width", sw)
          .style("stroke", "red")
          .style("fill", "red");
        console.log(select(svg).select('#view'))
      }
    };
  
    const dragsended = (event: any) => {
      if (svg) {
        // settings from UI
        const color = "#9999";
        const sw = "3px";
  
        // currentEvent.on("drag", (event: any)=>{
        //   let x0 = event.x;
        //   let y0 = event.y;
        //   const x1 = event.x;
        //   const y1 = event.y;
        //   const dx = x1 - x0;
        //   const dy = y1 - y0;
  
        //   if (dx * dx + dy * dy > 36) d.push([(x0 = x1), (y0 = y1)]);
        //   else d[d.length - 1] = [x1, y1];
        linePointer[1] = [event.x, event.y];
  
        const str = usedLine(linePointer);
        console.log(str);
          select(svg)
          .append('path')
          .attr("d", str !== null ? str : "")
          .style("stroke-width", sw)
          .style("stroke", "red")
          .style("fill", "red");
        console.log(select(svg).select('#view'))
      }
    };
  
    useEffect(() => {
      if (svg) {
        const svgSelection: any =
          //   : Selection<
          //     SVGSVGElement,
          //     unknown,
          //     null,
          //     undefined
          //   >
          select(svg);
        select(svg).append('g').attr('id', '#view').append("path")
        svgSelection.call(
          drag<SVGElement, unknown, unknown>()
            //   .subject((event: any)=>{
            //       const p = [event.x, event.y]
            //       return [p, p];
            //   })
            .on("start", dragstarted)
            .on("drag", draging)
            .on("end", dragsended)
        );
      } else {
        console.log(svg);
      }
    }, [svg]);
    console.log(state);
    return <></>;
  };
  
  const Demo = () => {
    const [canvas] = useState({ height: 500, width: 500 });
    return (
      <>
        <Canvas {...canvas}>
          <DrawMe />
        </Canvas>
      </>
    );
  };
  
  export { Canvas, DrawMe, Demo };
  