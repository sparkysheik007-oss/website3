import mongoose from "mongoose";
const schema=new mongoose.Schema({
 name:{type:String,required:true,trim:true,maxlength:100},
 email:{type:String,required:true,lowercase:true,trim:true},
 subject:{type:String,required:true,maxlength:160},
 message:{type:String,required:true,maxlength:3000},
 status:{type:String,enum:["new","read","resolved"],default:"new"}
},{timestamps:true});
export default mongoose.model("ContactMessage",schema);
