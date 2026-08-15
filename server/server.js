import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import productsRouter from "./routes/products.js";
import campaignsRouter from "./routes/campaigns.js";
import newsletterRouter from "./routes/newsletter.js";
import contactRouter from "./routes/contact.js";
import analyticsRouter from "./routes/analytics.js";
import { errorHandler } from "./middleware/error.js";

const app=express();
const PORT=process.env.PORT||5000;
const CLIENT_URL=process.env.CLIENT_URL||"http://localhost:5173";

app.use(cors({origin:CLIENT_URL,credentials:true}));
app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:false,limit:"20kb"}));
app.use("/api",rateLimit({windowMs:15*60*1000,max:120,standardHeaders:true,legacyHeaders:false}));

app.get("/api/health",(req,res)=>res.json({success:true,message:"Taste the Moment API online",demo:process.env.DEMO_MODE==="true"}));
app.use("/api/products",productsRouter);
app.use("/api/campaigns",campaignsRouter);
app.use("/api/newsletter",newsletterRouter);
app.use("/api/contact",contactRouter);
app.use("/api/analytics",analyticsRouter);

app.use(errorHandler);

async function start(){
  if(process.env.MONGODB_URI){
    try{ await mongoose.connect(process.env.MONGODB_URI); console.log("MongoDB connected"); }
    catch(e){ console.warn("MongoDB unavailable; running in demo mode:",e.message); }
  } else console.log("No MONGODB_URI; running in demo mode.");
  app.listen(PORT,()=>console.log(`API: http://localhost:${PORT}`));
}
start();
