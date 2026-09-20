/* Google Analytics, et rien avant le consentement.

   Etat par defaut: GA_ID vide -> ce fichier ne fait STRICTEMENT rien. Pas de requete, pas de
   cookie, pas de bandeau. Le site reste exactement celui d'aujourd'hui.

   Une fois GA_ID rempli:
     - le Consent Mode v2 demarre avec TOUT refuse, avant meme le chargement de gtag;
     - un bandeau demande. Tant qu'on n'a pas repondu, aucune requete ne part vers Google;
     - "Accept" passe le consentement a granted et charge gtag;
     - "Decline" ecrit le refus et ne charge jamais rien. Le refus est respecte au retour.

   Pourquoi dans cet ordre: le Consent Mode ne sert a rien s'il est pose APRES gtag. La plupart
   des integrations ratees font exactement ca et envoient un premier evenement avant la reponse.

   La reponse est gardee dans localStorage, pas dans un cookie: un site qui pose un cookie pour
   se souvenir qu'on refuse les cookies, c'est une blague qu'on ne fera pas. */

(function () {
  "use strict";

  var GA_ID = "G-Z2QVDGTL5P";  /* <- vide = rien ne se passe. */
  var CLE = "moonx.consent";

  if (!GA_ID) return;

  function lire() { try { return localStorage.getItem(CLE); } catch (_) { return null; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (_) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  /* One door for the site's own events: the signup, later a share or a ride. Safe to call
     before consent: gtag queues, and nothing leaves without analytics_storage granted. */
  window.MOONX_EVENT = function (name, params) { try { gtag("event", name, params || {}); } catch (_) {} };

  /* Tout refuse, avant tout le reste. */
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

  /* Le bandeau. Il emprunte les variables du site: pas une boite grise posee par-dessus. */
  /* LA BANNIERE, VERSION COWBOY DE L'ESPACE. La precedente etait une barre pleine largeur, en
     capitales, sur deux lignes: le ton d'un avertissement, sur un site qui n'est que jeu.
     Ici: une petite pastille en bas a droite, une phrase, deux boutons courts. Le sens
     juridique ne bouge pas -- on compte les visites, rien d'autre, refuser ne change rien --
     mais il est dit comme un cowboy le dirait. */
  function bandeau() {
    if (document.getElementById("consentBar")) return;
    var css = document.createElement("style");
    css.textContent =
      "#consentBar{position:fixed;right:14px;bottom:14px;z-index:60;max-width:min(92vw,360px);" +
      "display:flex;flex-direction:column;gap:10px;padding:14px 16px;border-radius:18px;" +
      "border:1px solid var(--line-2,rgba(150,195,255,.3));background:var(--card,#0B1220);" +
      "box-shadow:0 18px 40px -18px rgba(0,0,0,.9);" +
      "font-family:var(--sans,Inter,system-ui,sans-serif);font-size:13.5px;line-height:1.45;color:#fff}" +
      "#consentBar p{margin:0}" +
      "#consentBar small{display:block;margin-top:4px;font-family:var(--mono,monospace);font-size:10px;" +
      "letter-spacing:.1em;color:var(--dim,#8FA8C8)}" +
      "#consentBar small a{color:var(--dim,#8FA8C8);text-decoration:underline;text-underline-offset:3px}" +
      "#consentBar .b{display:flex;gap:8px}" +
      "#consentBar button{flex:1;font:inherit;font-weight:700;font-size:13px;padding:10px 12px;" +
      "border-radius:12px;border:1px solid var(--line-2,rgba(150,195,255,.3));" +
      "background:transparent;color:var(--dim,#8FA8C8);cursor:pointer}" +
      "#consentBar button#cOk{background:linear-gradient(180deg,#4C8BFF,#2D7BFF);color:#fff;border-color:transparent}" +
      "@media(max-width:640px){#consentBar{left:14px;right:14px;max-width:none}}";
    document.head.appendChild(css);

    var d = document.createElement("div");
    d.id = "consentBar";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-label", "Analytics consent");
    d.innerHTML =
      '<p>Howdy. Mind if we count you in? Just visits, nothing else. No ads, no tracking, ' +
      'and saying no changes nothing.' +
      '<small><a href="privacy.html">WHAT WE KEEP</a></small></p>' +
      '<span class="b"><button type="button" id="cNo">Ride on</button>' +
      '<button type="button" id="cOk">Count me in</button></span>';
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
