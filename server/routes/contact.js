import {Router} from "express";
import ContactMessage from "../models/ContactMessage.js";
import {clean,email,requireFields} from "../middleware/validate.js";
const r=Router();
r.post("/",requireFields(["name","email","subject","message"]),async(req,res,next)=>{
 try{
  const data={name:clean(req.body.name),email:clean(req.body.email).toLowerCase(),subject:clean(req.body.subject),message:clean(req.body.message)};
  if(data.name.length<2||!email(data.email)||data.subject.length<2||data.message.length<5)return res.status(400).json({success:false,message:"Please check all fields."});
  if(ContactMessage.db.readyState!==1 || process.env.DEMO_MODE==="true") return res.status(201).json({success:true,message:"Message received. We'll be in touch.",demo:true});
  await ContactMessage.create(data);res.status(201).json({success:true,message:"Message received. We'll be in touch."});
 }catch(e){next(e)}
});
export default r;
