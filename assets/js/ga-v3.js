(function(){"use strict";
var GA="G-Z2QVDGTL5P";
var KEY="moonx.consent";
function lis(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function ecris(v){try{localStorage.setItem(KEY,v)}catch(e){}}
window.dataLayer=window.dataLayer||[];
function g(){window.dataLayer.push(arguments)}
window.gtag=g;
window.MOONX_EVENT=function(n,p){try{g("event",n,p||{})}catch(e){}};
window.MOONX_CONSENT=function(){return lis()};
g("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"denied",personalization_storage:"denied",security_storage:"granted",wait_for_update:2e3});
function charge(){
  if(!GA||document.getElementById("ga-src"))return;
  var s=document.createElement("script");s.id="ga-src";s.async=true;
  s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA);
  document.head.appendChild(s);g("js",new Date);g("config",GA,{anonymize_ip:true});
}
function signale(v){try{window.dispatchEvent(new CustomEvent("moonx:consent",{detail:v}))}catch(e){}}
function oui(){
  ecris("granted");
  g("consent","update",{analytics_storage:"granted",ad_storage:"granted",ad_user_data:"granted",ad_personalization:"granted"});
  charge();ferme();signale("granted");
}
function non(){ecris("denied");ferme();signale("denied")}
function ferme(){var b=document.getElementById("consentBar");if(b)b.remove()}
var etat=lis();
if(etat==="granted"){g("consent","update",{analytics_storage:"granted",ad_storage:"granted",ad_user_data:"granted",ad_personalization:"granted"});charge();return}
if(etat==="denied")return;
function barre(){
  if(document.getElementById("consentBar"))return;
  var st=document.createElement("style");
  st.textContent="#consentBar{position:fixed;right:20px;bottom:14px;z-index:60;max-width:min(92vw,360px);"+
  "display:flex;flex-direction:column;gap:10px;padding:14px 16px;border-radius:18px;"+
  "border:1px solid var(--line-2,rgba(150,195,255,.3));background:var(--card,#0B1220);"+
  "box-shadow:0 18px 40px -18px rgba(0,0,0,.9);"+
  "font-family:var(--sans,Inter,system-ui,sans-serif);font-size:13.5px;line-height:1.45;color:#fff}"+
  "@media (min-width:861px){#consentBar{bottom:96px!important;width:480px;max-width:480px!important}}#consentBar p{margin:0}"+
  "#consentBar small{display:block;margin-top:4px;font-family:var(--mono,monospace);font-size:10px;"+
  "letter-spacing:.1em;color:var(--dim,#8FA8C8)}"+
  "#consentBar small a{color:var(--dim,#8FA8C8);text-decoration:underline;text-underline-offset:3px}"+
  "#consentBar .b{display:flex;gap:8px}"+
  "#consentBar button{flex:1;font:inherit;font-weight:700;font-size:13px;padding:10px 12px;"+
  "border-radius:12px;border:1px solid var(--line-2,rgba(150,195,255,.3));"+
  "background:transparent;color:var(--dim,#8FA8C8);cursor:pointer}"+
  "#consentBar button#cOk{background:linear-gradient(180deg,#4C8BFF,#2D7BFF);color:#fff;border-color:transparent}"+
  "@media(max-width:640px){#consentBar{left:14px;right:14px;max-width:none}}";
  document.head.appendChild(st);
  var d=document.createElement("div");
  d.id="consentBar";d.setAttribute("role","dialog");d.setAttribute("aria-label","Cookie consent");
  d.innerHTML="<p>We count visits, and we measure which of our ads brought you here. "+
  "That second part shares data with Google and Meta. Saying no costs you nothing."+
  '<small><a href="/privacy">WHAT WE KEEP</a></small></p>'+
  '<span class="b"><button type="button" id="cNo">No thanks</button>'+
  '<button type="button" id="cOk">OK</button></span>';
  document.body.appendChild(d);
  document.getElementById("cOk").addEventListener("click",oui);
  document.getElementById("cNo").addEventListener("click",non);
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",barre)}else{barre()}
})();
