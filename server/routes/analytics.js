import {Router} from "express";
const r=Router();
r.get("/",(req,res)=>res.json({success:true,data:{pageViews:0,products:4,campaigns:4,subscribers:0,messages:0},note:"Connect your analytics provider here; no credentials are exposed."}));
export default r;
