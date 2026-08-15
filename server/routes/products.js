import {Router} from "express";
import Product from "../models/Product.js";
import {demoProducts} from "../data/demo.js";
const r=Router();
r.get("/",async(req,res,next)=>{try{if(Product.db.readyState!==1)return res.json({success:true,data:demoProducts,demo:true});res.json({success:true,data:await Product.find({available:true}).lean()})}catch(e){next(e)}});
r.get("/:id",async(req,res,next)=>{try{if(Product.db.readyState!==1){const p=demoProducts.find(x=>x.id===req.params.id||x.slug===req.params.id);return p?res.json({success:true,data:p,demo:true}):res.status(404).json({success:false,message:"Product not found"})}const p=await Product.findOne({$or:[{slug:req.params.id},{_id:req.params.id}]}).lean();if(!p)return res.status(404).json({success:false,message:"Product not found"});res.json({success:true,data:p})}catch(e){next(e)}});
export default r;
