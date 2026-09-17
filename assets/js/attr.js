(function(){
  var KEY="moonx.attr", DAYS=30;
  function lire(){ try{ var a=JSON.parse(localStorage.getItem(KEY)||"null"); if(a&&a.at&&Date.now()-a.at<DAYS*86400000) return a; }catch(_){} return null; }
  function propre(v){ return String(v||"").trim().toLowerCase().slice(0,64); }
  function hote(u){ try{ return new URL(u).hostname.replace(/^www\./,""); }catch(_){ return ""; } }
  function capter(){
    var q=new URLSearchParams(location.search);
    var src=propre(q.get("utm_source")), med=propre(q.get("utm_medium")), cmp=propre(q.get("utm_campaign")), cnt=propre(q.get("utm_content")), trm=propre(q.get("utm_term"));
    var ref=hote(document.referrer); var interne=!ref||/(^|\.)moonx\.fi$/.test(ref);
    var deja=lire();
    if(src){ if(!deja||!deja.src||deja.src==="direct"||deja.med==="referral"){ ecrire({src:src,med:med||"unknown",cmp:cmp,cnt:cnt,trm:trm,ref:ref,landing:location.pathname,at:Date.now()}); } return; }
    if(deja) return;
    ecrire(interne?{src:"direct",med:"none",ref:"",landing:location.pathname,at:Date.now()}:{src:ref,med:"referral",ref:ref,landing:location.pathname,at:Date.now()});
  }
  function ecrire(a){ try{ localStorage.setItem(KEY,JSON.stringify(a)); }catch(_){} }

  function propager(){
    var a=lire(); if(!a||!a.src||a.src==="direct") return;
    var p=new URLSearchParams(); p.set("utm_source",a.src); if(a.med) p.set("utm_medium",a.med); if(a.cmp) p.set("utm_campaign",a.cmp); if(a.cnt) p.set("utm_content",a.cnt);
    document.querySelectorAll('a[href^="https://lfg.moonx.fi"]').forEach(function(l){ try{ var u=new URL(l.href); p.forEach(function(v,k){ u.searchParams.set(k,v); }); l.href=u.toString(); }catch(_){} });
  }
  capter();
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",propager); else propager();
  window.MOONX_ATTR=function(){ var a=lire()||{}; return {source:a.src||"direct",medium:a.med||"none",campaign:a.cmp||"",content:a.cnt||"",term:a.trm||"",referrer:a.ref||"",landing:a.landing||""}; };
})();
