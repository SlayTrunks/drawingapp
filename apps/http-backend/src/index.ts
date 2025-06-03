import express from "express";
import {PrismaClient } from "@repo/db/client";
import {jwtsecret,signupSchema,signinSchema} from "@repo/backend-common/client"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";

const app = express()

const prisma = new PrismaClient()
app.use(express.json());
app.post("/signup",async(req,res)=>{
        const body =  signupSchema.safeParse(req.body); 
        if(!body.success){
            res.json({error:body.error.issues[0]?.message})
            return;
        }
        const ifExist = await prisma.user.findFirst({
        where:{
        email:body?.data?.email
        }
        });
        if(ifExist){
            res.json({msg:"user already exist"});
            return;
        }
        else{
        
        const user =  await prisma.user.create({
        data:body.data!,
       });
       res.json({msg:"user created successfully",email:user.email,id:user.id})
       return;
        }
})

app.post("/signin",async(req,res)=>{
        const body = signinSchema.safeParse(req.body);
        if(!body.success){
            res.json({error:body.error.issues[0]?.message})
            return;
        }
        const ifExist = await prisma.user.findFirst({
        where:{
        email:body.data?.email
        }
        });
        if(!ifExist){

            res.json({msg:"user donot exist"});
            return;
        }
        if(ifExist?.password !== body.data?.password){
            res.json({msg:"password donot match"})
            return;
        }else{
            const token = jwt.sign({userId:ifExist?.id},jwtsecret)
            res.json({msg:"login successfully",token})
            return;
        }
})
app.post("/room",middleware,async(req,res)=>{
    try {
        
    const userId = req.userId;

    const room =    await prisma.room.create({
    data:{
    slug: req.body.name,
    adminId:userId!
    }
    })
    res.json({roomId:room.id})
    } catch (error) {
    res.json({msg:"already exists room with this name"})    
    }
})
app.listen(3000)

