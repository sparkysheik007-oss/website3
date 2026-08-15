import {Router} from "express";
import Subscriber from "../models/Subscriber.js";
import {clean,email,requireFields} from "../middleware/validate.js";
const r=Router();
r.post("/",requireFields(["name","email"]),async(req,res,next)=>{
 try{
  const name=clean(req.body.name), address=clean(req.body.email).toLowerCase();
  if(name.length<2||!email(address)) return res.status(400).json({success:false,message:"Please provide a valid name and email."});
  if(Subscriber.db.readyState!==1 || process.env.DEMO_MODE==="true") return res.status(201).json({success:true,message:"You're in. Welcome to the moment.",demo:true});
  await Subscriber.create({name,email:address});
  res.status(201).json({success:true,message:"You're in. Welcome to the moment."});
 }catch(e){ if(e.code===11000)return res.status(409).json({success:false,message:"That email is already subscribed."}); next(e)}
});
export default r;
