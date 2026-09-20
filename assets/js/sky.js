/* MOONX sky: one starfield for the whole site.
   Stars fall because we are rising, the odd shooting star crosses, a rocket passes on its own
   course, the moon comes up once and stays. The sky also leans with the pointer, and with the
   phone's tilt: near stars move more than far ones, so depth reads without anything jumping.
   The hero and the 404 both mount it, so they can never drift apart.

     MoonxSky.mount(canvas, {fill:true, always:true, density:260, parallax:16, moon:true})

   fill: size to the window instead of the parent. always: run without waiting for body.lit.
   Generated from the hero sky of landing/index.html. */
window.MoonxSky=(function(){
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function mount(sky, opts){
    opts=opts||{};
    const sctx=sky.getContext("2d"); let stars=[], shots=[], rocket=null, moonY=1.18, moonT=0, t0=null;
      const density=opts.density||150, PAR=(opts.parallax==null?16:opts.parallax);
      let tx=0,ty=0,px=0,py=0;
    function skySize(){ const r=opts.fill?{width:innerWidth,height:innerHeight}:sky.parentElement.getBoundingClientRect();
      /* The bitmap must match the element box exactly, or the browser stretches it and the moon turns
         into an ellipse. We set both, and we watch the parent: the hero changes height after the fonts
         and the images land, long after the last resize event. */
      sky.width=Math.max(1,Math.round(r.width*devicePixelRatio));
      sky.height=Math.max(1,Math.round(r.height*devicePixelRatio));
      sky.style.width=r.width+"px"; sky.style.height=r.height+"px";
      stars=[]; for(let i=0;i<density;i++) stars.push({x:Math.random(),y:Math.random(),s:Math.random()<0.15?3:2,p:Math.random()*6.28,r:0.4+Math.random()*1.2,v:0.00004+Math.random()*0.00012,z:0.3+Math.random()});
    }
    const ROCKET=[[0,0,4,1,"#F4F4F4"],[-1,1,6,5,"#DDE6FF"],[-3,4,2,3,"#7FB6FF"],[5,4,2,3,"#7FB6FF"],[1,2,2,2,"#2D7BFF"]];
    function drawRocket(x,y,scale,flicker,ang){ sctx.save(); sctx.translate(x,y); sctx.rotate(ang==null?-0.5:ang); sctx.scale(scale,scale); for(const [rx,ry,w,h,c] of ROCKET){ sctx.fillStyle=c; sctx.fillRect(rx,ry,w,h);} sctx.fillStyle="#FFC93C"; sctx.fillRect(0,6,4,flicker?3:2); sctx.fillStyle="#FF3B6B"; sctx.fillRect(1,9,2,flicker?2:1); sctx.restore(); }
    /* la taille d'une cellule du disque, une seule fois: le halo et le disque doivent partager
       cette valeur, sinon ils glissent l'un contre l'autre. */
    function moonCell(r){ return Math.max(2,Math.round(r/11)); }
    function drawMoon(cx,cy,r){
      /* Lune en pixel art: une grille, des cellules carrees, dessinees depuis le centre. Lignes et
         colonnes partagent le meme pas, donc le disque est rond a toute taille.

         La POSITION n'est plus aimantee sur la grille des cellules. Elle l'etait, et c'etait la
         saccade: la lune monte de 0,62 x la hauteur en sept secondes, en pas de 18 px device, donc
         elle restait immobile cinq ou six images puis sautait de neuf pixels CSS. Mesure avant
         correction: 36 % des images sans aucun mouvement, sauts de 16 a 17 px device.
         Un sprite en pixel art reste parfaitement net des lors qu'il est pose sur un pixel DEVICE
         entier: chaque cellule est un fillRect aligne sur les axes, de taille entiere. On arrondit
         donc au pixel device, et pas a la cellule. Net et fluide, pas l'un ou l'autre. */
      const px=moonCell(r);
      const gx=Math.round(cx), gy=Math.round(cy), n=Math.round(r/px);
      sctx.fillStyle="#E9E6DA";
      /* Rayon majore d'une demi-cellule. Avec n*n strict, la rangee extreme (j = +/-n) vaut une
         seule cellule et le disque porte un ergot d'un pixel en haut et en bas: c'est le defaut
         visible sur les captures. Avec (n+0.5)^2, la rangee extreme fait sept cellules et le
         cercle se ferme proprement, ce qui est la facon usuelle de rasteriser un cercle en
         pixel art. */
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
      /* every motion is per second, not per frame: same speed at 60 or 120 Hz, and a tab that comes back does not jump */
      const dt=Math.min(0.05,(t-lastT)/1000); lastT=t;
      const W=sky.width,H=sky.height,dp=devicePixelRatio;
      sctx.clearRect(0,0,W,H);
      const lit=opts.always||document.body.classList.contains("lit");
      px+=(tx-px)*0.045; py+=(ty-py)*0.045;   /* the lean, eased: a fast pointer never snaps the sky */
      /* stars: they fall because we are rising; the big ones are closer, so they fall faster */
      for(const st of stars){ if(lit&&!reduced){ st.y+=st.v*dt*60*(st.s===3?1.8:1); if(st.y>1.02){st.y=-0.02;st.x=Math.random();} } const a=reduced?0.8:0.45+0.55*Math.abs(Math.sin(t*0.0009*st.r+st.p)); sctx.fillStyle=`rgba(244,244,244,${a})`; const ox=px*PAR*dp*st.z, oy=py*PAR*dp*st.z*0.6;
        sctx.fillRect(Math.floor(st.x*W-ox),Math.floor(st.y*H-oy),st.s*dp,st.s*dp); }
      if(lit&&!reduced){
        /* shooting stars: one every 4 to 10 seconds, never more than two at once */
        nextShot-=dt; if(nextShot<=0&&shots.length<2){ nextShot=4+Math.random()*6; const sp=(560+Math.random()*260)*dp; const ang=0.42+Math.random()*0.16; shots.push({x:Math.random()*W*0.9,y:Math.random()*H*0.45,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,life:0}); }
        for(const sh of shots){ sh.x+=sh.vx*dt; sh.y+=sh.vy*dt; sh.life+=dt; const k=Math.max(0,1-sh.life/0.9); sctx.strokeStyle=`rgba(244,244,244,${0.85*k})`; sctx.lineWidth=2*dp; sctx.beginPath(); sctx.moveTo(sh.x,sh.y); sctx.lineTo(sh.x-sh.vx*0.07,sh.y-sh.vy*0.07); sctx.stroke(); }
        shots=shots.filter(sh=>sh.life<0.9&&sh.x<W+60*dp&&sh.y<H+60*dp);
        /* the rocket crosses every 12 to 24 seconds, nose along its own course, with a fading trail */
        nextRocket-=dt; if(!rocket&&nextRocket<=0){ nextRocket=12+Math.random()*12; const sp=(120+Math.random()*50)*dp; const ang=-0.62-Math.random()*0.12; rocket={x:-50*dp,y:H*(0.78+Math.random()*0.12),vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,trail:[]}; }
        if(rocket){ rocket.x+=rocket.vx*dt; rocket.y+=rocket.vy*dt;
          rocket.trail.push({x:rocket.x,y:rocket.y,a:1}); if(rocket.trail.length>14) rocket.trail.shift();
          for(let k=0;k<rocket.trail.length;k++){ const p=rocket.trail[k], a=(k/rocket.trail.length)*0.5; sctx.fillStyle=`rgba(255,201,60,${a*0.5})`; sctx.fillRect(p.x-1*dp,p.y-1*dp,2*dp,2*dp); }
          drawRocket(rocket.x, rocket.y, 3*dp, Math.floor(t/90)%2===0, Math.atan2(rocket.vy,rocket.vx)+Math.PI/2);
          if(rocket.x>W+70*dp||rocket.y<-70*dp) rocket=null; }
        /* the moon rises once, on a curve: seven seconds from below the fold to its place, easing out at the end */
        if(moonT<1){ moonT=Math.min(1,moonT+dt/7); const e=1-Math.pow(1-moonT,3); moonY=1.18+(0.56-1.18)*e; }
      }
      /* une seule position, arrondie une seule fois, partagee par le halo et le disque: deux
         arrondis sur deux grilles differentes faisaient scintiller le halo contre la lune. */
      if(lit&&opts.moon!==false){ const r=Math.min(W*0.13,100*dp);
        const cx=Math.round(W*0.9-px*PAR*dp*0.35), cy=Math.round(H*moonY-py*PAR*dp*0.2);
        /* a soft halo, drawn under the disc, so the moon sits in the sky instead of on top of it */
        const breathe=1+0.06*Math.sin(t*0.0006); const g=sctx.createRadialGradient(cx,cy,r*0.6,cx,cy,r*2.6*breathe); g.addColorStop(0,`rgba(233,230,218,${(0.16+0.05*Math.sin(t*0.0006)).toFixed(3)})`); g.addColorStop(1,"rgba(233,230,218,0)"); sctx.fillStyle=g; sctx.beginPath(); sctx.arc(cx,cy,r*2.6*breathe,0,6.283); sctx.fill();
        drawMoon(cx, cy, r); }
      raf=requestAnimationFrame(loop);
    }
    /* the lean: pointer on a desktop, tilt on a phone. Passive listeners, nothing blocking. */
    /* Everything registered here is unregistered by stop(): an app that mounts and unmounts
       pages (Turbo, a router) would otherwise stack one animation loop per visit. */
    const onMove=e=>{ tx=(e.clientX/innerWidth-.5)*2; ty=(e.clientY/innerHeight-.5)*2; };
    const onTilt=e=>{ if(e.gamma!=null){ tx=Math.max(-1,Math.min(1,e.gamma/30)); ty=Math.max(-1,Math.min(1,(e.beta-45)/30)); } };
    addEventListener("pointermove",onMove,{passive:true});
    addEventListener("deviceorientation",onTilt,{passive:true});
    addEventListener("resize",skySize,{passive:true}); addEventListener("load",skySize); skySize();
    let ro=null; if(!opts.fill){ try{ ro=new ResizeObserver(()=>skySize()); ro.observe(sky.parentElement); }catch(_){} }
    let alive=true, raf=0;
    const loop=t=>{ if(!alive) return; skyDraw(t); };
    raf=requestAnimationFrame(loop);
    function stop(){ alive=false; cancelAnimationFrame(raf);
      removeEventListener("pointermove",onMove); removeEventListener("deviceorientation",onTilt);
      removeEventListener("resize",skySize); removeEventListener("load",skySize);
      if(ro) ro.disconnect(); }
    return {resize:skySize, stop};
  }
  return {mount};
})();
