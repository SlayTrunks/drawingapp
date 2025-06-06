import { WebSocketServer,WebSocket } from "ws";
import jwt, {  JwtPayload } from "jsonwebtoken"
import {jwtsecret} from "@repo/backend-common/client"
import {  PrismaClient } from "@repo/db/client";
const wss = new WebSocketServer({port:8080})
const prisma = new PrismaClient();
interface DecodedToken extends JwtPayload {
    userId: string;
}
interface User {
    ws: WebSocket,
    rooms:String[],
    userId:String
}
const users:User[] = [];
function checkUser(token:string):string | null{
    try {
        

    const decoded = jwt.verify(token,jwtsecret) as DecodedToken;

    if(!decoded.userId){
        return null;
    }
    return decoded.userId;
    } catch (error) {
        return null
        
    }
}
wss.on("connection",(ws,request)=>{
    const url  =  request.url
    if(!url) return;
    const queryParams = new URLSearchParams(url.split('?')[1])
    const token  = queryParams.get("token")!;
    const userId = checkUser(token);
    if(userId==null){
        ws.close()
    }else{
    
    users.push({
    ws,
    userId,
    rooms:[]
    })
    }

    
    ws.on("message",async(data)=>{ //data is of type rawdata to parse it to object . to parse it to object convert to string first.
        const parsedData = JSON.parse(data.toString()) //parsedData:{type:"",roomId:""}
        if(parsedData.type == "join_room"){
            const user = users.find(x=> x.ws == ws)
            user?.rooms.push(parsedData?.roomId)
            ws.send("joined to room "+ parsedData.roomId)

        }
        if(parsedData.type == "leave_room"){
            const user = users.find(x=> x.ws == ws)
            if(!user){
                return;
            }

            user.rooms = user.rooms.filter(x => x !== parsedData.roomId)

        }
        try {
            
        if(parsedData.type == "chat"){ //parsedData : {type:"chat",message:"",roomId:""}
                const {roomId,message} = parsedData;
               
                if(userId){
                await prisma.chat.create({
                    data:{
                       roomId:parseInt(roomId), 
                        userId  ,
                        message
                    }
                })
                }
                
                users.forEach(user=>{
                    if(user.rooms.includes(roomId)){
                        user.ws.send(JSON.stringify({
                            type:"chat",
                            message:message,
                            roomId:roomId
                        }))
                    }
                })
                
                
        }
        } catch (error) {
            console.log(error)
           return false; 
        }
    })
})
