import React from "react";
export default function AdminDashboard(){
  const cards=[["PRODUCTS","4"],["SUBSCRIBERS","—"],["MESSAGES","—"],["CAMPAIGNS","4"],["PAGE VIEWS","—"]];
  return <div style={{minHeight:"100vh",background:"#090909",color:"#fff",padding:"48px",fontFamily:"Inter"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
      <div><small style={{letterSpacing:3,color:"#e21b2d"}}>PROTECTED AREA</small><h1 style={{fontSize:48,margin:"8px 0"}}>Campaign Admin</h1></div>
      <span style={{fontSize:12,color:"#888"}}>Authentication-ready · no hardcoded credentials</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
      {cards.map(([a,b])=><div key={a} style={{border:"1px solid #252525",padding:24}}><small style={{color:"#777"}}>{a}</small><strong style={{display:"block",fontSize:40,marginTop:10}}>{b}</strong></div>)}
    </div>
    <div style={{marginTop:40,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
      {["Products","Campaigns","Subscribers","Messages","Analytics"].map(x=><button key={x} style={{background:"#151515",border:"1px solid #292929",color:"#fff",padding:24,textAlign:"left"}}>{x}<br/><small style={{color:"#777"}}>Connect protected CRUD endpoint</small></button>)}
    </div>
  </div>
}
