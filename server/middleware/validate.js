export const clean = v => String(v??"").replace(/[<>]/g,"").trim();
export const email = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export function requireFields(fields){
  return (req,res,next)=>{
    for(const f of fields) if(!clean(req.body[f])) return res.status(400).json({success:false,message:`${f} is required`});
    next();
  };
}
