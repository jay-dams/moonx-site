window.MoonxSky=(function(){
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function mount(sky, opts){
    opts=opts||{};
    const sctx=sky.getContext("2d"); let stars=[], shots=[], rocket=null, moonY=1.18, moonT=0, t0=null;
      const density=opts.density||150, PAR=(opts.parallax==null?16:opts.parallax);
      let tx=0,ty=0,px=0,py=0;
    function skySize(){ const r=opts.fill?{width:innerWidth,height:innerHeight}:sky.parentElement.getBoundingClientRect();

      sky.width=Math.max(1,Math.round(r.width*devicePixelRatio));
      sky.height=Math.max(1,Math.round(r.height*devicePixelRatio));
      sky.style.width=r.width+"px"; sky.style.height=r.height+"px";
      stars=[]; for(let i=0;i<density;i++) stars.push({x:Math.random(),y:Math.random(),s:Math.random()<0.15?3:2,p:Math.random()*6.28,r:0.4+Math.random()*1.2,v:0.00004+Math.random()*0.00012,z:0.3+Math.random()});
    }
    const ROCKET=[[0,0,4,1,"#F4F4F4"],[-1,1,6,5,"#DDE6FF"],[-3,4,2,3,"#7FB6FF"],[5,4,2,3,"#7FB6FF"],[1,2,2,2,"#2D7BFF"]];
    function drawRocket(x,y,scale,flicker,ang){ sctx.save(); sctx.translate(x,y); sctx.rotate(ang==null?-0.5:ang); sctx.scale(scale,scale); for(const [rx,ry,w,h,c] of ROCKET){ sctx.fillStyle=c; sctx.fillRect(rx,ry,w,h);} sctx.fillStyle="#FFC93C"; sctx.fillRect(0,6,4,flicker?3:2); sctx.fillStyle="#FF3B6B"; sctx.fillRect(1,9,2,flicker?2:1); sctx.restore(); }

    function moonCell(r){ return Math.max(2,Math.round(r/11)); }
    function drawMoon(cx,cy,r){

      const px=moonCell(r);
      const gx=Math.round(cx), gy=Math.round(cy), n=Math.round(r/px);
      sctx.fillStyle="#E9E6DA";

      const rr=(n+0.5)*(n+0.5);
      for(let j=-n;j<=n;j++){
        const half=Math.floor(Math.sqrt(Math.max(0,rr-j*j)));
        if(half<1) continue;
        sctx.fillRect(gx-half*px, gy+j*px, (half*2+1)*px, px);
      }
      sctx.fillStyle="#C9C6B8";
      for(const [ox,oy,sz] of [[-3,-2,2],[2,1,3],[-1,3,1],[3,-4,1]]){
        sctx.fillRect(gx+ox*px, gy+oy*px, sz*px, sz*px);
      }
    }
    let lastT=null, nextShot=1.5, nextRocket=4;
    function skyDraw(t){
      if(!t0) t0=t; if(lastT===null) lastT=t;

      const dt=Math.min(0.05,(t-lastT)/1000); lastT=t;
      const W=sky.width,H=sky.height,dp=devicePixelRatio;
      sctx.clearRect(0,0,W,H);
      const lit=opts.always||document.body.classList.contains("lit");
      px+=(tx-px)*0.045; py+=(ty-py)*0.045;

      for(const st of stars){ if(lit&&!reduced){ st.y+=st.v*dt*60*(st.s===3?1.8:1); if(st.y>1.02){st.y=-0.02;st.x=Math.random();} } const a=reduced?0.8:0.45+0.55*Math.abs(Math.sin(t*0.0009*st.r+st.p)); sctx.fillStyle=`rgba(244,244,244,${a})`; const ox=px*PAR*dp*st.z, oy=py*PAR*dp*st.z*0.6;
        sctx.fillRect(Math.floor(st.x*W-ox),Math.floor(st.y*H-oy),st.s*dp,st.s*dp); }
      if(lit&&!reduced){

        nextShot-=dt; if(nextShot<=0&&shots.length<2){ nextShot=4+Math.random()*6; const sp=(560+Math.random()*260)*dp; const ang=0.42+Math.random()*0.16; shots.push({x:Math.random()*W*0.9,y:Math.random()*H*0.45,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,life:0}); }
        for(const sh of shots){ sh.x+=sh.vx*dt; sh.y+=sh.vy*dt; sh.life+=dt; const k=Math.max(0,1-sh.life/0.9); sctx.strokeStyle=`rgba(244,244,244,${0.85*k})`; sctx.lineWidth=2*dp; sctx.beginPath(); sctx.moveTo(sh.x,sh.y); sctx.lineTo(sh.x-sh.vx*0.07,sh.y-sh.vy*0.07); sctx.stroke(); }
        shots=shots.filter(sh=>sh.life<0.9&&sh.x<W+60*dp&&sh.y<H+60*dp);

        nextRocket-=dt; if(!rocket&&nextRocket<=0){ nextRocket=12+Math.random()*12; const sp=(120+Math.random()*50)*dp; const ang=-0.62-Math.random()*0.12; rocket={x:-50*dp,y:H*(0.78+Math.random()*0.12),vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,trail:[]}; }
        if(rocket){ rocket.x+=rocket.vx*dt; rocket.y+=rocket.vy*dt;
          rocket.trail.push({x:rocket.x,y:rocket.y,a:1}); if(rocket.trail.length>14) rocket.trail.shift();
          for(let k=0;k<rocket.trail.length;k++){ const p=rocket.trail[k], a=(k/rocket.trail.length)*0.5; sctx.fillStyle=`rgba(255,201,60,${a*0.5})`; sctx.fillRect(p.x-1*dp,p.y-1*dp,2*dp,2*dp); }
          drawRocket(rocket.x, rocket.y, 3*dp, Math.floor(t/90)%2===0, Math.atan2(rocket.vy,rocket.vx)+Math.PI/2);
          if(rocket.x>W+70*dp||rocket.y<-70*dp) rocket=null; }

        if(moonT<1){ moonT=Math.min(1,moonT+dt/7); const e=1-Math.pow(1-moonT,3); moonY=1.18+(0.56-1.18)*e; }
      }

      if(lit&&opts.moon!==false){ const r=Math.min(W*0.13,100*dp);
        const cx=Math.round(W*0.9-px*PAR*dp*0.35), cy=Math.round(H*moonY-py*PAR*dp*0.2);

        const breathe=1+0.06*Math.sin(t*0.0006); const g=sctx.createRadialGradient(cx,cy,r*0.6,cx,cy,r*2.6*breathe); g.addColorStop(0,`rgba(233,230,218,${(0.16+0.05*Math.sin(t*0.0006)).toFixed(3)})`); g.addColorStop(1,"rgba(233,230,218,0)"); sctx.fillStyle=g; sctx.beginPath(); sctx.arc(cx,cy,r*2.6*breathe,0,6.283); sctx.fill();
        drawMoon(cx, cy, r); }
      requestAnimationFrame(skyDraw);
    }

    try{ const jb=document.querySelector('.jband'), jsec=document.getElementById('journey');

      if(jb && jb.parentElement !== document.body) document.body.appendChild(jb);
      if(jb&&jsec&&'IntersectionObserver' in window){
        new IntersectionObserver(es=>{ for(const e of es) jb.classList.toggle('inview', e.isIntersecting); },{threshold:0.05}).observe(jsec);
      }
    }catch(_){}

    addEventListener("pointermove",e=>{ tx=(e.clientX/innerWidth-.5)*2; ty=(e.clientY/innerHeight-.5)*2; },{passive:true});
    addEventListener("deviceorientation",e=>{ if(e.gamma!=null){ tx=Math.max(-1,Math.min(1,e.gamma/30)); ty=Math.max(-1,Math.min(1,(e.beta-45)/30)); } },{passive:true});
    addEventListener("resize",skySize,{passive:true}); addEventListener("load",skySize); skySize();
    if(!opts.fill){ try{ new ResizeObserver(()=>skySize()).observe(sky.parentElement); }catch(_){} }
    requestAnimationFrame(skyDraw);
    return {resize:skySize};
  }
  return {mount};
})();
