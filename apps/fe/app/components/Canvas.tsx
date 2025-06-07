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
       <div>

       <canvas ref={canvasRef} width={1320} height={575}></canvas>
     <div className="relative top-0  w-full">
       <div className="flex gap-10 bg-red-500 items-center justify-center text-black w-full h-20">
        
       <button type="button" className="cursor-pointer bg-blue-400 rounded-xl p-4 h-12" onClick={()=>localStorage.setItem("shape","circle")}>circle</button>
       <button type="button" className="cursor-pointer bg-blue-400 rounded-xl p-4 h-12"onClick={()=>localStorage.setItem("shape","line")}>line</button>
       <button type="button" className="cursor-pointer bg-blue-400 rounded-xl p-4 h-12"onClick={()=>localStorage.setItem("shape","rect")}>rectangle</button>
       <button type="button" className="cursor-pointer bg-blue-400 rounded-xl p-4 h-12"onClick={()=>localStorage.setItem("shape","text")}>Text</button>
       </div> 
     </div>
       </div>
   )
}
