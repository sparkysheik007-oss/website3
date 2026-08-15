import {Router} from "express";
import Campaign from "../models/Campaign.js";
import {demoCampaigns} from "../data/demo.js";
const r=Router();
r.get("/",async(req,res,next)=>{try{if(Campaign.db.readyState!==1)return res.json({success:true,data:demoCampaigns,demo:true});res.json({success:true,data:await Campaign.find({active:true}).lean()})}catch(e){next(e)}});
export default r;
