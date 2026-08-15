import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { products, campaigns } from "./data/products";

gsap.registerPlugin(ScrollTrigger);

function ProductMesh({ product, viewer=false }) {
  const group = useRef();
  const liquid = useRef();
  const { viewport, pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!viewer) group.current.rotation.y += delta * 0.35;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.08, 0.06);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.06, 0.06);
    if (liquid.current) liquid.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.012;
  });

  const accent = new THREE.Color(product.accent);
  return (
    <group ref={group} scale={viewport.width < 5 ? 1.15 : 1.45}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.72,0.66,2.65,64]} />
        <meshStandardMaterial color="#141414" metalness={0.75} roughness={0.2} envMapIntensity={1.7}/>
      </mesh>
      <mesh position={[0,0.06,0]} scale={[1.01,0.64,1.01]}>
        <cylinderGeometry args={[0.71,0.71,1,64]} />
        <meshPhysicalMaterial color={accent} metalness={0.35} roughness={0.28} clearcoat={0.8} />
      </mesh>
      <mesh ref={liquid} position={[0,-0.25,0]}>
        <cylinderGeometry args={[0.63,0.63,2.1,64]} />
        <meshPhysicalMaterial color="#4a0909" roughness={0.12} metalness={0.05} transmission={0.04}/>
      </mesh>
      <mesh position={[0,0.04,0.735]} rotation={[0,0,0]}>
        <planeGeometry args={[0.9,0.72]} />
        <meshStandardMaterial color={accent} roughness={0.25} metalness={0.15}/>
      </mesh>
      <mesh position={[0,0.04,0.75]} scale={[0.22,0.22,0.03]}>
        <torusGeometry args={[1,0.38,16,32]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.1}/>
      </mesh>
      <mesh position={[0,1.38,0]} rotation={[Math.PI,0,0]}>
        <cylinderGeometry args={[0.58,0.62,0.08,64]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.95} roughness={0.18}/>
      </mesh>
      <mesh position={[0,-1.38,0]}>
        <cylinderGeometry args={[0.62,0.58,0.08,64]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.9} roughness={0.22}/>
      </mesh>
      {Array.from({length:18}).map((_,i)=>
        <mesh key={i} position={[
          Math.sin(i*2.7)*0.58, -1.0 + (i%7)*0.28, Math.cos(i*2.7)*0.58
        ]} scale={0.018 + (i%3)*0.008}>
          <sphereGeometry args={[1,10,10]}/>
          <meshPhysicalMaterial color="#fff" transparent opacity={0.38} roughness={0.05}/>
        </mesh>
      )}
      <Float speed={1.8} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh position={[0,0.1,0.79]} scale={0.22}>
          <torusGeometry args={[1,0.34,20,48]}/>
          <meshStandardMaterial color="white" metalness={0.1} roughness={0.2}/>
        </mesh>
      </Float>
    </group>
  );
}

function Bubbles({ count=420 }) {
  const ref = useRef();
  const positions = React.useMemo(() => {
    const a = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      a[i*3]=(Math.random()-.5)*8;
      a[i*3+1]=(Math.random()-.5)*7;
      a[i*3+2]=(Math.random()-.5)*4;
    }
    return a;
  },[count]);
  useFrame((_,d)=>{
    if(!ref.current) return;
    const p=ref.current.geometry.attributes.position.array;
    for(let i=1;i<p.length;i+=3){
      p[i]+=d*(0.15+(i%7)*0.012);
      if(p[i]>4) p[i]=-4;
    }
    ref.current.geometry.attributes.position.needsUpdate=true;
  });
  return <points ref={ref}>
    <bufferGeometry><bufferAttribute attach="attributes-position" count={positions.length/3} array={positions} itemSize={3}/></bufferGeometry>
    <pointsMaterial size={0.035} color="#ffffff" transparent opacity={0.48} depthWrite={false}/>
  </points>
}

function HeroScene({ product, viewer=false }) {
  return <Canvas shadows dpr={[1,1.7]} gl={{antialias:true,powerPreference:"high-performance"}} style={{position:"absolute",inset:0}}>
    <PerspectiveCamera makeDefault position={[0,0,6.4]} fov={36}/>
    <ambientLight intensity={0.42}/>
    <spotLight position={[3,5,5]} intensity={70} angle={0.35} penumbra={1} castShadow/>
    <pointLight position={[-3,0,3]} intensity={18} color={product.accent}/>
    <Environment preset="studio"/>
    <Suspense fallback={null}>
      <ProductMesh product={product} viewer={viewer}/>
      <Bubbles count={viewer?180:420}/>
      <Sparkles count={viewer?80:160} scale={[9,7,5]} size={1.4} speed={0.25} color="#ffffff"/>
    </Suspense>
  </Canvas>
}

function Loader({done}) {
  const [n,setN]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setN(v=>Math.min(100,v+4)),35); return()=>clearInterval(t)},[]);
  return <AnimatePresence>{!done && <motion.div className="loader" initial={{opacity:1}} exit={{opacity:0}}><div className="loaderLogo">TASTE<span>THE</span>MOMENT</div><div className="loaderRing"><span>{n}%</span></div></motion.div>}</AnimatePresence>
}

function Nav({menu,setMenu}) {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const f=()=>setScrolled(scrollY>40);addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[]);
  return <header className={`nav ${scrolled?"glass":""}`}>
    <a className="brand" href="#home">TASTE<span>THE</span>MOMENT</a>
    <nav className="desktopNav">{["Home","Experience","Product","Story","Campaign","Contact"].map(x=><a key={x} href={"#"+x.toLowerCase()}>{x}</a>)}</nav>
    <a className="buy" href="#product">BUY NOW</a>
    <button className="menuBtn" aria-label="Open menu" onClick={()=>setMenu(!menu)}><i/><i/></button>
    <AnimatePresence>{menu&&<motion.div className="mobileMenu" initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>{["Home","Experience","Product","Story","Campaign","Contact"].map(x=><a onClick={()=>setMenu(false)} key={x} href={"#"+x.toLowerCase()}>{x}</a>)}<a href="#product">BUY NOW</a></motion.div>}</AnimatePresence>
  </header>
}

function ScrollDirector({heroRef}) {
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.to(".heroProduct",{yPercent:18,rotation:7,scale:1.08,scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
      gsap.to(".heroCopy",{yPercent:45,opacity:.1,scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
      gsap.to(".experienceOrb",{scale:2.2,rotation:160,scrollTrigger:{trigger:"#experience",start:"top bottom",end:"bottom top",scrub:1}});
      gsap.utils.toArray(".reveal").forEach(el=>gsap.fromTo(el,{y:70,opacity:0},{y:0,opacity:1,duration:1,scrollTrigger:{trigger:el,start:"top 82%",toggleActions:"play none none reverse"}}));
      gsap.to(".scrollLine",{scaleX:1,transformOrigin:"left",scrollTrigger:{start:0,end:"max",scrub:.3}});
    },heroRef);
    return()=>ctx.revert();
  },[heroRef]);
  return null;
}

function ProductSection({product,setProduct}) {
  return <section id="product" className="section productSection">
    <div className="sectionKicker">THE LINEUP</div>
    <div className="productGrid">
      <div className="productViewer"><HeroScene product={product} viewer/></div>
      <div className="productInfo reveal">
        <div className="flavors">{products.map(p=><button key={p.id} className={p.id===product.id?"active":""} onClick={()=>setProduct(p)}>{p.name.toUpperCase()}</button>)}</div>
        <div className="eyebrow">TASTE THE DIFFERENCE</div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="specs"><span>{product.flavor}</span><span>{product.nutrition}</span><span>{product.price}</span></div>
        <button className="outlineBtn">DISCOVER {product.name.toUpperCase()}</button>
      </div>
    </div>
  </section>
}

function Story() {
  return <section id="story" className="story">
    <div className="storySticky"><div className="eyebrow">THE STORY</div><h2>MORE<br/><em>THAN</em><br/>A DRINK.</h2><p>Refreshment becomes a ritual when the right people, the right sound and the right moment collide.</p></div>
    <div className="storyPanels">{["REFRESH","TOGETHER","CELEBRATE","REPEAT"].map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><p>{["Cold bubbles. Bright energy. Instant reset.","Good moments get better when everyone is invited.","Turn ordinary minutes into memories worth keeping.","Open another. Make another moment."][i]}</p></article>)}</div>
  </section>
}

function Campaigns() {
  return <section id="campaign" className="section campaign"><div className="eyebrow">CAMPAIGNS</div><h2 className="reveal">MAKE IT <em>ICONIC.</em></h2><div className="campaignGrid">{campaigns.map((c,i)=><article className="campaignCard reveal" key={c.title} style={{"--i":i}}><div className="campaignVisual"><span>0{i+1}</span></div><div><h3>{c.title}</h3><p>{c.description}</p><button>EXPLORE ↗</button></div></article>)}</div></section>
}

function Carbonation() {
  return <section id="experience" className="carbon section"><div className="experienceOrb"/><div className="carbonText reveal"><div className="eyebrow">CARBONATION</div><h2>FEEL THE<br/><em>FIZZ.</em></h2><p>Hundreds of tiny bubbles rise, collide and burst into one unmistakable sensation.</p></div><div className="carbonScene"><HeroScene product={products[0]}/></div></section>
}

function Viewer({product}) {
  const [drag,setDrag]=useState(false);
  return <section className="viewer section"><div className="viewerText"><div className="eyebrow">INTERACTIVE VIEWER</div><h2>DRAG TO<br/><em>EXPLORE.</em></h2><p>Move your pointer or swipe across the product to inspect every detail.</p></div><div className="viewerCanvas" onPointerDown={()=>setDrag(true)} onPointerUp={()=>setDrag(false)}><HeroScene product={product} viewer/></div><div className="viewerHint">{drag?"RELEASE TO RESET":"DRAG TO EXPLORE"}</div></section>
}

function Forms() {
  const [news,setNews]=useState({name:"",email:""}),[contact,setContact]=useState({name:"",email:"",subject:"",message:""});
  const [status,setStatus]=useState({type:"",msg:""});
  const submit=async(path,data,reset)=>{
    setStatus({type:"loading",msg:"SENDING..."});
    try{
      const r=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const j=await r.json(); if(!r.ok) throw new Error(j.message||"Request failed");
      setStatus({type:"ok",msg:j.message||"DONE. WELCOME TO THE MOMENT."}); reset();
    }catch(e){setStatus({type:"error",msg:e.message||"Demo mode: request received."})}
  };
  return <section id="contact" className="contact section">
    <div className="contactIntro"><div className="eyebrow">STAY IN THE MOMENT</div><h2>READY TO<br/><em>TASTE IT?</em></h2><p>Join the community for launches, drops and stories made to be shared.</p></div>
    <form onSubmit={e=>{e.preventDefault();submit("/api/newsletter",news,()=>setNews({name:"",email:""}))}}><h3>JOIN THE MOMENT</h3><input aria-label="Name" required placeholder="Name" value={news.name} onChange={e=>setNews({...news,name:e.target.value})}/><input aria-label="Email" type="email" required placeholder="Email" value={news.email} onChange={e=>setNews({...news,email:e.target.value})}/><button>SUBSCRIBE ↗</button></form>
    <form onSubmit={e=>{e.preventDefault();submit("/api/contact",contact,()=>setContact({name:"",email:"",subject:"",message:""}))}}><h3>CONTACT</h3><input required placeholder="Name" value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})}/><input required type="email" placeholder="Email" value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})}/><input required placeholder="Subject" value={contact.subject} onChange={e=>setContact({...contact,subject:e.target.value})}/><textarea required placeholder="Message" value={contact.message} onChange={e=>setContact({...contact,message:e.target.value})}/><button>SEND MESSAGE ↗</button></form>
    {status.msg&&<div className={`formStatus ${status.type}`}>{status.msg}</div>}
  </section>
}

export default function App(){
  const [loaded,setLoaded]=useState(false),[menu,setMenu]=useState(false),[product,setProduct]=useState(products[0]);
  const root=useRef(null);
  useEffect(()=>{const t=setTimeout(()=>setLoaded(true),1100);return()=>clearTimeout(t)},[]);
  useEffect(()=>{document.documentElement.style.setProperty("--accent",product.accent)},[product]);
  return <div ref={root}><Loader done={loaded}/><Nav menu={menu} setMenu={setMenu}/><div className="scrollLine"/><ScrollDirector heroRef={root}/>
    <main>
      <section id="home" className="hero"><div className="heroGlow"/><div className="heroCopy"><div className="eyebrow">A NEW CAMPAIGN BY TASTE THE MOMENT</div><h1>OPEN THE<br/><em>MOMENT.</em></h1><p>Refresh your world. One iconic taste at a time.</p><div className="heroButtons"><a className="primaryBtn" href="#experience">EXPLORE THE EXPERIENCE <span>↗</span></a><a className="textBtn" href="#product">DISCOVER THE PRODUCT</a></div></div><div className="heroProduct"><HeroScene product={product}/></div><div className="scrollCue">SCROLL TO EXPLORE <span>↓</span></div></section>
      <Carbonation/><ProductSection product={product} setProduct={setProduct}/><Story/><Campaigns/><Viewer product={product}/>
      <section className="finalCta section"><div className="ctaOrb"/><div className="eyebrow">THE MOMENT IS YOURS</div><h2>READY TO TASTE<br/><em>THE MOMENT?</em></h2><div><a className="primaryBtn" href="#product">EXPLORE PRODUCTS <span>↗</span></a><a className="outlineBtn" href="#contact">JOIN THE COMMUNITY</a></div></section>
      <Forms/>
    </main>
    <footer><div className="brand">TASTE<span>THE</span>MOMENT</div><p>Fictional campaign concept. Not affiliated with The Coca-Cola Company.</p><div><a href="#home">TOP ↑</a></div></footer>
  </div>
}
