import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * SEO, written into the built site from src/content/site.json (the same file Nova edits):
 * - <title>, description, canonical, Open Graph / Twitter cards, Google verification
 * - JSON-LD: the person, the service, the showreel as a video
 * - plain text of who/what/links inside <noscript> so crawlers that don't run JavaScript still read the page
 * - sitemap.xml, robots.txt and the IndexNow key file
 */
type Site = Record<string, any>;
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function read(root: string) {
  const site: Site = JSON.parse(fs.readFileSync(path.join(root, "src/content/site.json"), "utf8"));
  const videos: Site = JSON.parse(fs.readFileSync(path.join(root, "src/content/videos.json"), "utf8"));
  return { site, videos };
}

function head(site: Site, videos: Site) {
  const s = site.seo || {};
  const url = String(s.site_url || "").replace(/\/$/, "");
  const img = s.image ? (String(s.image).startsWith("http") ? s.image : url + s.image) : "";
  const name = `${site.hero.first} ${site.hero.last}`;
  const sameAs = Object.entries(site.links || {}).filter(([k]) => k !== "call").map(([, v]) => v);
  const ld: Site[] = [
    { "@context": "https://schema.org", "@type": "Person", name, jobTitle: site.hero.role, url, image: img || undefined,
      email: site.chat?.email ? `mailto:${site.chat.email}` : undefined, address: s.location ? { "@type": "PostalAddress", addressLocality: s.location } : undefined,
      knowsAbout: s.keywords, sameAs },
    { "@context": "https://schema.org", "@type": "ProfessionalService", name: `${name} – video editing`, url, image: img || undefined,
      areaServed: "Worldwide", address: s.location ? { "@type": "PostalAddress", addressLocality: s.location } : undefined,
      description: s.description,
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Editing services", itemListElement: (videos.sections || []).map((x: Site) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x.eyebrow, description: x.subtitle || x.title } })) } },
  ];
  if (site.showreel?.src && url) {
    ld.push({ "@context": "https://schema.org", "@type": "VideoObject", name: `${name} – ${site.showreel.title}`, description: site.showreel.text,
      thumbnailUrl: url + String(site.showreel.poster).replace(/^\./, ""), contentUrl: url + String(site.showreel.src).replace(/^\./, ""),
      uploadDate: s.reel_date || "2026-11-15", duration: "PT1M9S" });
  }
  const tags = [
    `<title>${esc(s.title)}</title>`,
    `<meta name="description" content="${esc(s.description)}" />`,
    s.keywords?.length ? `<meta name="keywords" content="${esc(s.keywords.join(", "))}" />` : "",
    `<meta name="author" content="${esc(name)}" />`,
    url ? `<link rel="canonical" href="${esc(url)}/" />` : "",
    `<meta name="theme-color" content="#0c0818" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:site_name" content="Art by Qureshi" />`,
    `<meta property="og:title" content="${esc(s.title)}" />`,
    `<meta property="og:description" content="${esc(s.description)}" />`,
    url ? `<meta property="og:url" content="${esc(url)}/" />` : "",
    img ? `<meta property="og:image" content="${esc(img)}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(s.title)}" />`,
    `<meta name="twitter:description" content="${esc(s.description)}" />`,
    img ? `<meta name="twitter:image" content="${esc(img)}" />` : "",
    s.google_verification ? `<meta name="google-site-verification" content="${esc(s.google_verification)}" />` : "",
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.filter(Boolean).join("\n    ");
}

function noscript(site: Site, videos: Site) {
  const name = `${site.hero.first} ${site.hero.last}`;
  const secs = (videos.sections || []).map((x: Site) => `<li><b>${esc(x.eyebrow)}</b>: ${esc(x.title)}. ${esc(x.subtitle || "")}</li>`).join("");
  const links = Object.entries(site.links || {}).map(([k, v]) => `<a href="${esc(v)}">${esc(k)}</a>`).join(" · ");
  return `<noscript><main><h1>${esc(name)}, ${esc(site.hero.role)}</h1><p>${esc(site.hero.tagline)}</p>
      <p>${(site.hero.stats || []).map((x: Site) => `${esc(x.value)} ${esc(x.label)}`).join(" · ")}</p><ul>${secs}</ul>
      <p>Email: <a href="mailto:${esc(site.chat?.email)}">${esc(site.chat?.email)}</a> · ${links}</p></main></noscript>`;
}

export function seo(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "abq-seo",
    configResolved(c) { root = c.root; outDir = c.build.outDir; },
    transformIndexHtml(html) {
      const { site, videos } = read(root);
      return html
        .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n    ${head(site, videos)}\n    <!--/seo-->`)
        .replace("<!--noscript-->", noscript(site, videos));
    },
    closeBundle() {
      const { site } = read(root);
      const s = site.seo || {};
      const url = String(s.site_url || "").replace(/\/$/, "");
      const out = path.isAbsolute(outDir) ? outDir : path.join(root, outDir);
      if (!fs.existsSync(out) || !url) return;
      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(path.join(out, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`);
      fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
      if (/^[a-f0-9]{16,64}$/i.test(s.indexnow_key || "")) fs.writeFileSync(path.join(out, `${s.indexnow_key}.txt`), s.indexnow_key);
    },
  };
}
