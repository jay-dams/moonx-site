(function () {
  "use strict";

  var GA_ID = "";
  var CLE = "moonx.consent";

  if (!GA_ID) return;

  function lire() { try { return localStorage.getItem(CLE); } catch (_) { return null; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (_) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 2000
  });

  function charger() {
    if (document.getElementById("ga-src")) return;
    var s = document.createElement("script");
    s.id = "ga-src";
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  function accepter() {
    ecrire("granted");
    gtag("consent", "update", { analytics_storage: "granted" });
    charger();
    fermer();
  }

  function refuser() { ecrire("denied"); fermer(); }

  function fermer() {
    var b = document.getElementById("consentBar");
    if (b) b.remove();
  }

  var deja = lire();
  if (deja === "granted") { charger(); return; }
  if (deja === "denied") return;

  function bandeau() {
    if (document.getElementById("consentBar")) return;
    var css = document.createElement("style");
    css.textContent =
      "#consentBar{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;" +
      "display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:center;" +
      "padding:14px 16px;border-radius:16px;border:1px solid var(--line-2,rgba(150,195,255,.3));" +
      "background:var(--card,#0B1220);box-shadow:0 20px 50px -20px rgba(0,0,0,.9);" +
      "font-family:var(--mono,monospace);font-size:10px;letter-spacing:.11em;" +
      "color:var(--dim,#8FA8C8);line-height:1.8}" +
      "#consentBar p{margin:0;max-width:60ch;text-align:center}" +
      "#consentBar a{color:var(--hi,#5A9BFF)}" +
      "#consentBar .b{display:flex;gap:8px}" +
      "#consentBar button{font-family:var(--mono,monospace);font-size:10px;letter-spacing:.11em;" +
      "padding:11px 16px;border-radius:12px;border:1px solid var(--line-2,rgba(150,195,255,.3));" +
      "background:transparent;color:var(--dim,#8FA8C8);cursor:pointer}" +
      "#consentBar button#cOk{background:linear-gradient(180deg,#6BA6FF,#1B45B8);color:#fff;border-color:transparent}" +
      "@media(max-width:640px){#consentBar{flex-direction:column}#consentBar .b{width:100%}" +
      "#consentBar .b button{flex:1}}";
    document.head.appendChild(css);

    var d = document.createElement("div");
    d.id = "consentBar";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-label", "Analytics consent");
    d.innerHTML =
      '<p>WE WOULD LIKE TO COUNT VISITS, NOTHING MORE. NO ADS, NO PROFILING.<br>' +
      'SAY NO AND THE SITE WORKS EXACTLY THE SAME. <a href="privacy.html">WHAT WE STORE</a></p>' +
      '<span class="b"><button type="button" id="cNo">DECLINE</button>' +
      '<button type="button" id="cOk">ACCEPT</button></span>';
    document.body.appendChild(d);
    document.getElementById("cOk").addEventListener("click", accepter);
    document.getElementById("cNo").addEventListener("click", refuser);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bandeau);
  } else {
    bandeau();
  }
})();
