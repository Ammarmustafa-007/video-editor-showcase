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
  const cf = path.join(root, "src/content/cases.json");
  const cases: Site[] = fs.existsSync(cf) ? JSON.parse(fs.readFileSync(cf, "utf8")).cases || [] : [];
  const sf = path.join(root, "src/content/services.json");
  const services: Site[] = fs.existsSync(sf) ? JSON.parse(fs.readFileSync(sf, "utf8")).services || [] : [];
  return { site, videos, cases, services };
}

/** The head of one service page: aimed at one search (e.g. "wedding video editor"), with Service + FAQ data for Google. */
function serviceHead(site: Site, sv: Site) {
  const s = site.seo || {};
  const url = String(s.site_url || "").replace(/\/$/, "");
  const page = `${url}/services/${sv.slug}`;
  const img = s.image ? (String(s.image).startsWith("http") ? s.image : url + s.image) : "";
  const name = `${site.hero.first} ${site.hero.last}`;
  const title = `${sv.title} | ${name}`.slice(0, 95);
  const desc = String(sv.intro).slice(0, 158);
  const ld = [
    { "@context": "https://schema.org", "@type": "Service", name: sv.title, serviceType: sv.keyword, description: sv.intro, url: page,
      areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "Country", name: "Canada" }, { "@type": "Country", name: "United Kingdom" }],
      provider: { "@type": "Person", name, url } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: (sv.faq || []).map(([q, a]: string[]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name, item: url + "/" }, { "@type": "ListItem", position: 2, name: sv.nav, item: page }] },
  ];
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta name="keywords" content="${esc(sv.keyword)}" />`,
    `<link rel="canonical" href="${esc(page)}" />`,
    `<meta name="theme-color" content="#0c0818" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Art by Qureshi" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${esc(page)}" />`,
    img ? `<meta property="og:image" content="${esc(img)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    s.google_verification ? `<meta name="google-site-verification" content="${esc(s.google_verification)}" />` : "",
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");
}

function serviceText(sv: Site) {
  const li = (a: string[]) => (a || []).map((x) => `<li>${esc(x)}</li>`).join("");
  const faq = (sv.faq || []).map(([q, a]: string[]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("");
  return `<noscript><main><h1>${esc(sv.h1)}</h1><p>${esc(sv.intro)}</p><h2>What you get</h2><ul>${li(sv.points)}</ul>
      <h2>How it works</h2><ol>${li(sv.process)}</ol><h2>Questions</h2>${faq}</main></noscript>`;
}

/** The head of one case-study page: its own title, description, address and an Article for Google. */
function caseHead(site: Site, c: Site) {
  const s = site.seo || {};
  const url = String(s.site_url || "").replace(/\/$/, "");
  const page = `${url}/work/${c.slug}`;
  const img = s.image ? (String(s.image).startsWith("http") ? s.image : url + s.image) : "";
  const name = `${site.hero.first} ${site.hero.last}`;
  const title = `${c.client} case study: ${c.title} | ${name}`.slice(0, 90);
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: c.title, description: c.summary, url: page, image: img || undefined,
    author: { "@type": "Person", name, url }, about: { "@type": "Organization", name: c.client, address: c.location || undefined },
    keywords: (c.services || []).join(", ") };
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(c.summary)}" />`,
    `<meta name="author" content="${esc(name)}" />`,
    `<link rel="canonical" href="${esc(page)}" />`,
    `<meta name="theme-color" content="#0c0818" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="Art by Qureshi" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(c.summary)}" />`,
    `<meta property="og:url" content="${esc(page)}" />`,
    img ? `<meta property="og:image" content="${esc(img)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    s.google_verification ? `<meta name="google-site-verification" content="${esc(s.google_verification)}" />` : "",
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");
}

function caseText(c: Site) {
  const li = (a: string[]) => (a || []).map((x) => `<li>${esc(x)}</li>`).join("");
  return `<noscript><main><h1>${esc(c.title)}</h1><p>${esc(c.client)}${c.location ? ", " + esc(c.location) : ""}. ${esc(c.summary)}</p>
      <h2>The problem</h2><ul>${li(c.challenge)}</ul><h2>What we did</h2><ul>${li(c.approach)}</ul><h2>What happened</h2><ul>${li(c.results)}</ul></main></noscript>`;
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

function noscript(site: Site, videos: Site, services: Site[] = [], cases: Site[] = []) {
  const name = `${site.hero.first} ${site.hero.last}`;
  const secs = (videos.sections || []).map((x: Site) => `<li><b>${esc(x.eyebrow)}</b>: ${esc(x.title)}. ${esc(x.subtitle || "")}</li>`).join("");
  const links = Object.entries(site.links || {}).map(([k, v]) => `<a href="${esc(v)}">${esc(k)}</a>`).join(" · ");
  return `<noscript><main><h1>${esc(name)}, ${esc(site.hero.role)}</h1><p>${esc(site.hero.tagline)}</p>
      <p>${(site.hero.stats || []).map((x: Site) => `${esc(x.value)} ${esc(x.label)}`).join(" · ")}</p><ul>${secs}</ul>
      <nav>${services.map((x) => `<a href="/services/${esc(x.slug)}">${esc(x.title)}</a>`).join(" · ")}${cases.map((c) => ` · <a href="/work/${esc(c.slug)}">${esc(c.client)} case study</a>`).join("")}</nav>
      <p>Email: <a href="mailto:${esc(site.chat?.email)}">${esc(site.chat?.email)}</a> · ${links}</p></main></noscript>`;
}

export function seo(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "abq-seo",
    configResolved(c) { root = c.root; outDir = c.build.outDir; },
    transformIndexHtml(html) {
      const { site, videos, services, cases } = read(root);
      return html
        .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n    ${head(site, videos)}\n    <!--/seo-->`)
        .replace("<!--noscript-->", noscript(site, videos, services, cases));
    },
    closeBundle() {
      const { site, cases, services } = read(root);
      const s = site.seo || {};
      const url = String(s.site_url || "").replace(/\/$/, "");
      const out = path.isAbsolute(outDir) ? outDir : path.join(root, outDir);
      if (!fs.existsSync(out) || !url) return;
      const today = new Date().toISOString().slice(0, 10);
      // one real HTML file per case study, so Google gets its own title, description and text for each page
      const base = fs.readFileSync(path.join(out, "index.html"), "utf8");
      for (const c of cases) {
        const dir = path.join(out, "work", c.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), base
          .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n    ${caseHead(site, c)}\n    <!--/seo-->`)
          .replace(/<noscript>[\s\S]*?<\/noscript>/, caseText(c)));
      }
      for (const sv of services) {
        const dir = path.join(out, "services", sv.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), base
          .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n    ${serviceHead(site, sv)}\n    <!--/seo-->`)
          .replace(/<noscript>[\s\S]*?<\/noscript>/, serviceText(sv)));
      }
      const urls = [`  <url><loc>${url}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
        ...services.map((sv) => `  <url><loc>${url}/services/${sv.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`),
        ...cases.map((c) => `  <url><loc>${url}/work/${c.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)];
      fs.writeFileSync(path.join(out, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
      fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
      if (/^[a-f0-9]{16,64}$/i.test(s.indexnow_key || "")) fs.writeFileSync(path.join(out, `${s.indexnow_key}.txt`), s.indexnow_key);
    },
  };
}
