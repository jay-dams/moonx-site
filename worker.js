export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.moonx.fi") {
      url.hostname = "moonx.fi";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  }
};
