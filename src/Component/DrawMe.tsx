import React, {useRef, useEffect, useReducer, useState, ReactNode, ReactElement,Reducer, createContext,useContext, Dispatch, ReducerAction} from 'react';
import {select} from 'd3'

interface IPSCanvas{
    width: number;
    height: number;
    
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
}

type ISCanvas = IPSCanvas & {innerHeight?: number, innerWidth?: number}


interface IState {
    svg?: ReactElement<SVGSVGElement>;
    canvas?: ISCanvas;
}

interface IPayload {
    canvas?:ISCanvas;
}

type IAType = string;
const SET_CANVAS:IAType = "SET_CANVAS"

interface IAction{
    type:IAType;
    payload: IPayload
}

const setCanvas = (canvas:ISCanvas):IAction=>{

    return{
        type: SET_CANVAS,
        payload: {
            canvas
        }
    }
}

const reducer = (state:IState, action:IAction):IState=>{
    switch(action.type){
        case SET_CANVAS:
            if(action.payload.canvas){
                state.canvas = action.payload.canvas
            }
            return {
                ...state,
               
            }
        default:
            return state
    }
}


const Store:React.Context<{state:IState, dispatch:Dispatch<ReducerAction<Reducer<IState,IAction>>>}> = createContext({state:{},dispatch:(action:IAction):void=>{
}});



/**
 * 用于构建画布，它返回一个SVGSVGElement
 * @param props IPSCanvas
 */
const Canvas: React.FC<IPSCanvas> = (props: React.PropsWithChildren<IPSCanvas>)=>{
    const svg = useRef<SVGSVGElement>(null);
    const [state, dispatch] = useReducer<Reducer<IState,IAction>>(reducer, {})
    const {width, height,} = props;
    
    useEffect(()=>{
        let {marginTop, marginRight, marginBottom, marginLeft} = props;
        marginTop = marginTop ? (marginTop > 0 ? marginTop : 0) : 0;
        marginRight = marginRight ? (marginRight > 0 ? marginRight : 0) :0
        marginBottom = marginBottom ? (marginBottom > 0 ? marginBottom : 0)  : 0;
        marginLeft = marginLeft ? (marginLeft > 0 ? marginTop : 0) : 0;

        const innerWidth = width -  marginLeft - marginRight;
        const innerHeight = height - marginTop - marginBottom

        const canvas = {
            width,
            height,
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            innerWidth,
            innerHeight
        }


        console.log(1)
         
        select(svg.current).attr('width', width).attr('height',height).attr('translate', `transform(${marginLeft}, ${marginRight})`)
        if(canvas){
            dispatch(setCanvas(canvas))
        }
    },[props,height,width])
    const children:ReactNode[] = []
    if(props.children){
        React.Children.map(props.children,(c:ReactNode)=>{
            children.push(c)
        })
    }
    
    return (<Store.Provider value={{state,dispatch}}>
        <svg ref={svg}>
            {
               children
            }
        </svg>
    </Store.Provider>)
}


const DrawMe: React.FC = ()=>{
    const [canvas] = useState({height:500, width:500})
    return (
        <>
           <Canvas {...canvas}><p>123</p><p>1234</p></Canvas>
        </>
    )
}

export{
    Canvas,
    DrawMe
}