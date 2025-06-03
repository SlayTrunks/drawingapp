import { WebSocketServer } from "ws";
import jwt, {  JwtPayload } from "jsonwebtoken"
import {jwtsecret} from "@repo/backend-common/client"
const wss = new WebSocketServer({port:8080})



interface DecodedToken extends JwtPayload {
  userId: string;
}
wss.on("connection",(ws,request)=>{
    const url  =  request.url
    if(!url) return;
    const queryParams = new URLSearchParams(url.split('?')[1])
    const token  = queryParams.get("token")!;
    
    const decoded = jwt.verify(token,jwtsecret) as DecodedToken;

    if(!decoded.userId){
        ws.send("not loggedin");
        ws.close(); 
        return;
    }

    ws.send(`hi id no ${decoded.userId}`);
    ws.on("message",(data)=>{
    if(data.toString() == "ping"){
        ws.send("pong")}
    })
})
