import mongoose from "mongoose";
const schema=new mongoose.Schema({
  name:{type:String,required:true,trim:true,maxlength:100},
  slug:{type:String,required:true,unique:true,index:true},
  description:{type:String,required:true,maxlength:500},
  flavor:String,nutrition:String,image:String,model:String,
  price:String,available:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.model("Product",schema);
