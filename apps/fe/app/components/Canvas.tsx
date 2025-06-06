"use client"
import { draw } from "@/draw";
import { useEffect, useRef } from "react";
export function Canvas({
    roomId,socket
}:{
    roomId:string,
    socket:WebSocket
},){
    
  const canvasRef =  useRef<HTMLCanvasElement>(null) 
   useEffect(()=>{
    if(canvasRef.current){
     const canvas = canvasRef.current; 

    draw(canvas,roomId,socket)
    }
   },[canvasRef]) 
   return (
     <canvas ref={canvasRef} width={1320} height={575}></canvas>
   )
}
