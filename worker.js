/* Le site est servi tel quel. Trois exceptions seulement.               */
const S3 = "polymarket-upload.s3.us-east-2.amazonaws.com";

/* Les hotes dont on accepte de relayer une image. Le seau Polymarket
   porte les ecussons et les drapeaux, ESPN les photos de joueurs,
   Wikimedia les photos que ESPN n'a pas. Rien d'autre. */
const HOTES = [S3, "a.espncdn.com", "upload.wikimedia.org"];

const UA = "moonx.fi image resolver (contact via https://moonx.fi)";
const SEMAINE = 604800;

const ENTETES = (type) => ({
  "content-type": type,
  "cache-control": "public, max-age=" + SEMAINE + ", immutable",
  "access-control-allow-origin": "*",
  "cross-origin-resource-policy": "cross-origin",
  "x-content-type-options": "nosniff",
});

function mots(s) {
  const t = String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return t ? new Set(t.split(" ")) : new Set();
}
const memeJeu = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const inclus = (a, b) => [...a].every((x) => b.has(x));
const communs = (a, b) => [...a].filter((x) => b.has(x)).length;

let TRACE = null;
function note(k, v) { if (TRACE) TRACE.push(k + "=" + v); }

async function json(u) {
  const r = await fetch(u, { headers: { "user-agent": UA, accept: "application/json" },
    cf: { cacheEverything: true, cacheTtl: 86400 } });
  note("http", r.status);
  if (!r.ok) throw new Error("http " + r.status);
  return await r.json();
}

/* L'identifiant ESPN du joueur. On n'accepte qu'un nom qui coincide
   mot pour mot, dans n'importe quel ordre; a defaut un nom qui contient
   le notre ou l'inverse, avec deux mots communs au moins, ce qui
   rattrape les deuxiemes prenoms ("Dragos Nicolae Cazacu"). En dessous
   on prefere ne rien montrer qu'un visage qui n'est pas le bon. */
async function idEspn(nom, sport) {
  const u = "https://site.web.api.espn.com/apis/common/v3/search?region=us&lang=en"
    + "&limit=12&type=player&query=" + encodeURIComponent(nom);
  let d;
  try { d = await json(u); } catch (e) { note("espnSearch", "ECHEC " + e.message); return null; }
  note("espnItems", (d.items || []).length);
  note("espnSports", (d.items || []).map((x) => x.sport).join("/") || "-");
  const cible = mots(nom);
  let approche = null;
  for (const it of d.items || []) {
    if (it.sport !== sport) continue;
    const vu = mots(it.displayName);
    if (!vu.size) continue;
    if (memeJeu(vu, cible)) return it.id;
    if (!approche && (inclus(vu, cible) || inclus(cible, vu)) && communs(vu, cible) >= 2) approche = it.id;
  }
  return approche;
}

/* L'image principale de la page Wikipedia anglaise. On ne la garde que
   si la page parle bien d'un joueur de tennis ou d'un combattant: sans
   ce controle, un homonyme quelconque finirait sur la fiche du match.
   L'API renvoie aujourd'hui thumb.wikimedia.org, qui sert exactement le
   meme fichier qu'upload.wikimedia.org; on ramene a ce dernier, le seul
   hote que le relais autorise. */
async function visageWiki(nom, sport) {
  const u = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages%7Cdescription"
    + "&piprop=thumbnail&pithumbsize=400&format=json&redirects=1&titles="
    + encodeURIComponent(nom.replace(/\s+/g, "_"));
  let d;
  try { d = await json(u); } catch { return null; }
  const pages = (d.query || {}).pages || {};
  const attendu = sport === "mma" ? /mixed martial|\bmma\b|fighter|boxer|kickbox/i : /tennis/i;
  for (const k of Object.keys(pages)) {
    const p = pages[k];
    const src = (p.thumbnail || {}).source;
    if (!src) continue;
    if (!attendu.test(String(p.description || ""))) continue;
    let t;
    try { t = new URL(src); } catch { continue; }
    if (!/^(upload|thumb)\.wikimedia\.org$/.test(t.hostname)) continue;
    t.hostname = "upload.wikimedia.org";
    t.search = "";
    return t.toString();
  }
  return null;
}

async function image(u) {
  let r;
  try { r = await fetch(u, { headers: { "user-agent": UA },
    cf: { cacheEverything: true, cacheTtl: SEMAINE } }); }
  catch (e) { note("img", "ECHEC " + e.message); return null; }
  note("img", r.status + " " + (r.headers.get("content-type") || "?"));
  if (!r.ok) return null;
  const type = r.headers.get("content-type") || "";
  if (!type.startsWith("image/")) { await r.body?.cancel(); return null; }
  return new Response(r.body, { status: 200, headers: ENTETES(type) });
}

/* Photo ESPN d'abord: un PNG detoure, fait pour etre pose sur un fond.
   Sinon Wikipedia. Sinon rien, et le jeu retombe sur le drapeau ou les
   initiales. */
async function visage(nom, sport) {
  const id = await idEspn(nom, sport);
  note("id", id || "-");
  if (id) {
    const u = "https://a.espncdn.com/i/headshots/" + sport + "/players/full/" + id + ".png";
    const r = await image(u);
    note("headshot", r ? "ok" : "ko");
    if (r) return r;
  }
  const w = await visageWiki(nom, sport);
  note("wiki", w ? "ok" : "-");
  if (w) return await image(w);
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname === "www.moonx.fi") {
      url.hostname = "moonx.fi";
      return Response.redirect(url.toString(), 301);
    }

    /* Le visage d'un combattant ou d'un joueur de tennis. On garde la
       reponse une semaine, y compris l'absence de photo: sans ca chaque
       affichage d'une liste de tennis relancerait deux recherches par
       joueur. */
    if (url.pathname === "/face") {
      const nom = (url.searchParams.get("n") || "").trim().replace(/\s+/g, " ").slice(0, 64);
      const sport = url.searchParams.get("s") === "mma" ? "mma" : "tennis";
      if (nom.length < 3) return new Response("bad name", { status: 400 });
      const clef = new Request("https://moonx.fi/_face/" + sport + "/"
        + encodeURIComponent(nom.toLowerCase()));
      const cache = caches.default;
      const vu = await cache.match(clef);
      if (vu) return vu;
      if (url.searchParams.get("d") === "1") {
        TRACE = [];
        let got = null;
        try { got = await visage(nom, sport); } catch (e) { note("erreur", e.message); }
        const t = TRACE.join(" | ");
        TRACE = null;
        if (got) await got.body?.cancel();
        return new Response(JSON.stringify({ nom, sport, trouve: !!got, etapes: t }, null, 1),
          { headers: { "content-type": "application/json", "cache-control": "no-store" } });
      }
      let rep = null;
      try { rep = await visage(nom, sport); } catch { rep = null; }
      if (!rep) {
        rep = new Response("no face", {
          status: 404,
          headers: { "content-type": "text/plain", "cache-control": "public, max-age=" + SEMAINE },
        });
      }
      ctx.waitUntil(cache.put(clef, rep.clone()));
      return rep;
    }

    /* Une image que l'on dessine sur une toile, la carte de partage,
       doit etre chargee en mode "anonymous", et le navigateur refuse un
       hote qui ne renvoie pas d'en-tete d'origine. On la fait donc
       passer par ici, qui est notre domaine.

       Relais volontairement etroit: trois hotes nommes, en lecture
       seule, et seulement des images. Ce n'est pas un relais ouvert. */
    if (url.pathname === "/crest") {
      const raw = url.searchParams.get("u") || "";
      let target;
      try { target = new URL(raw); } catch { return new Response("bad url", { status: 400 }); }
      if (target.protocol !== "https:" || HOTES.indexOf(target.hostname) < 0) {
        return new Response("forbidden host", { status: 403 });
      }
      const up = await fetch(target.toString(), {
        method: "GET",
        headers: { "user-agent": UA },
        cf: { cacheEverything: true, cacheTtl: 86400 },
      });
      if (!up.ok) return new Response("upstream", { status: 502 });
      const type = up.headers.get("content-type") || "";
      if (!type.startsWith("image/")) return new Response("not an image", { status: 415 });
      return new Response(up.body, { status: 200, headers: ENTETES(type) });
    }

    return env.ASSETS.fetch(request);
  }
};
