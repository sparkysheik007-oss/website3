import mongoose from "mongoose";
const schema=new mongoose.Schema({
 title:{type:String,required:true,trim:true,maxlength:120},
 description:{type:String,required:true,maxlength:500},
 image:String,video:String,category:String,active:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model("Campaign",schema);
