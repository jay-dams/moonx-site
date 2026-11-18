/* Le site est servi tel quel. Deux exceptions seulement.                */
const S3 = "polymarket-upload.s3.us-east-2.amazonaws.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.moonx.fi") {
      url.hostname = "moonx.fi";
      return Response.redirect(url.toString(), 301);
    }

    /* Les ecussons des equipes viennent d'un seau Amazon qui ne renvoie
       aucun en-tete d'origine. Un <img> ordinaire s'en moque, mais une
       image que l'on dessine sur une toile — la carte de partage — doit
       etre chargee en mode "anonymous", et le navigateur la refuse alors.
       D'ou des initiales a la place des ecussons sur chaque carte
       partagee. On les fait donc passer par ici, qui est notre domaine.

       Relais volontairement etroit: un seul hote autorise, en lecture
       seule, et seulement des images. Ce n'est pas un relais ouvert. */
    if (url.pathname === "/crest") {
      const raw = url.searchParams.get("u") || "";
      let target;
      try { target = new URL(raw); } catch { return new Response("bad url", { status: 400 }); }
      if (target.protocol !== "https:" || target.hostname !== S3) {
        return new Response("forbidden host", { status: 403 });
      }
      const up = await fetch(target.toString(), {
        method: "GET",
        cf: { cacheEverything: true, cacheTtl: 86400 },
      });
      if (!up.ok) return new Response("upstream", { status: 502 });
      const type = up.headers.get("content-type") || "";
      if (!type.startsWith("image/")) return new Response("not an image", { status: 415 });
      return new Response(up.body, {
        status: 200,
        headers: {
          "content-type": type,
          "cache-control": "public, max-age=86400, immutable",
          "access-control-allow-origin": "*",
          "cross-origin-resource-policy": "cross-origin",
          "x-content-type-options": "nosniff",
        },
      });
    }

    return env.ASSETS.fetch(request);
  }
};
