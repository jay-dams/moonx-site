/* The rocket that crosses the main buttons. One file for every page: the home used to carry
   this inline and the other four pages had the CSS, the keyframes, and no element to animate.
   Ghost buttons never get one (their CSS hides it anyway); the badge stays on the primary. */
(function(){
  /* The CSS travels with the script: the rule and the keyframes used to live only in the home
     page, so the other four pages had rockets that never moved.
     The selectors are deliberately heavy. The home has `body>nav .go > * {position:relative;
     z-index:2}` to lift a button's children above the stars: a plain `.rk{}` lost to it, the
     rocket became an inline element with no width, and a transform on an inline element does
     nothing. `.go .rk` and friends outweigh it. */
  var CSS=".cta .rk,.go .rk,body>nav .go .rk,.share a .rk,#gateBtn .rk,.btn .rk,.cta-big .rk,#outro .tk .rk{\n  position:absolute;left:0;top:76%;width:15px;height:18px;margin-top:-9px;z-index:0;\n  pointer-events:none;opacity:.95;\n  background:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2212%22%20viewBox%3D%220%200%2010%2012%22%20shape-rendering%3D%22crispEdges%22%3E%3Crect%20x%3D%223%22%20y%3D%220%22%20width%3D%224%22%20height%3D%221%22%20fill%3D%22%23F4F4F4%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%221%22%20width%3D%226%22%20height%3D%225%22%20fill%3D%22%23DDE6FF%22%2F%3E%3Crect%20x%3D%220%22%20y%3D%224%22%20width%3D%222%22%20height%3D%223%22%20fill%3D%22%237FB6FF%22%2F%3E%3Crect%20x%3D%228%22%20y%3D%224%22%20width%3D%222%22%20height%3D%223%22%20fill%3D%22%237FB6FF%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%222%22%20width%3D%222%22%20height%3D%222%22%20fill%3D%22%232D7BFF%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%226%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23FFC93C%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%222%22%20height%3D%223%22%20fill%3D%22%23FF3B6B%22%2F%3E%3C%2Fsvg%3E\") no-repeat center/contain;\n  filter:drop-shadow(-7px 0 9px rgba(255,201,60,.8)) drop-shadow(-14px 0 16px rgba(255,59,107,.45));\n  transform:translateX(-40px) rotate(90deg);\n  animation:ctaRocket 12s linear infinite}\n@keyframes ctaRocket{\n  0%   {transform:translateX(-40px) rotate(90deg);opacity:0}\n  4%   {opacity:1}\n  28%  {opacity:1}\n  32%  {transform:translateX(var(--rkw,320px)) rotate(90deg);opacity:0}\n  100% {transform:translateX(var(--rkw,320px)) rotate(90deg);opacity:0}}\n@media (prefers-reduced-motion:reduce){.rk{display:none}}\n.go.ghost .rk{display:none}";
  function style(){ if(document.getElementById("rkCss")) return; var st=document.createElement("style"); st.id="rkCss"; st.textContent=CSS; document.head.appendChild(st); }
  function poser(){
    style();
    var cibles=document.querySelectorAll(".cta:not(.dealerCta), body>nav .go:not(.ghost), #gateBtn, .btn");   /* jamais dans la section du dealer ni la rangee radio/rodeo */
    Array.prototype.forEach.call(cibles, function(b){
      if(b.querySelector(".rk")) return;
      var i=document.createElement("i"); i.className="rk"; i.setAttribute("aria-hidden","true");
      b.appendChild(i);
      var maj=function(){ i.style.setProperty("--rkw",(b.getBoundingClientRect().width+40)+"px"); };
      maj(); addEventListener("resize",maj,{passive:true});
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",poser); else poser();
})();
