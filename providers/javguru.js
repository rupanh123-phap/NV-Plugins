import * as cheerio from 'cheerio';

const BASE_URL = "https://jav.guru";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};
const fetchHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "vi-VN,vi;q=0.9",
    "Referer": "https://jav.guru/"
};

function jsonResponse(data) { return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
function encodeId(url) { return btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function decodeId(id) { let b = id.replace(/-/g, '+').replace(/_/g, '/'); while(b.length % 4) b+='='; return atob(b); }

const CATALOG_MAP = {
    "javguru_all": "",
    "javguru_decensored": "/category/decensored",
    "javguru_engsub": "/category/english-subbed",
    "javguru_amateur": "/category/amateur",
    "javguru_idol": "/category/idol",
    "javguru_4k": "/category/4k"
};

const manifest = {
    id: "org.jav.guru.catalog",
    version: "7.0.0", 
    name: "Jav Guru (Tự Chủ 100%)",
    description: "Catalog đa danh mục, không phụ thuộc API ngoài.",
    resources: ["catalog", "meta"], // CHỈ LÀM CATALOG VÀ META
    types: ["movie"],
    idPrefixes: ["javguru_"], 
    catalogs: [
        { type: "movie", id: "javguru_all", name: "🌟 Mới nhất (All)", extraSupported: ["skip", "search"], extra: [{name: "skip"}, {name: "search"}] },
        { type: "movie", id: "javguru_decensored", name: "🔞 Không che (Dec)", extraSupported: ["skip"], extra: [{name: "skip"}] },
        { type: "movie", id: "javguru_engsub", name: "🔤 Vietsub/Eng", extraSupported: ["skip"], extra: [{name: "skip"}] },
        { type: "movie", id: "javguru_amateur", name: "📹 Nghiệp dư", extraSupported: ["skip"], extra: [{name: "skip"}] },
        { type: "movie", id: "javguru_idol", name: "✨ Idol JAV", extraSupported: ["skip"], extra: [{name: "skip"}] },
        { type: "movie", id: "javguru_4k", name: "📺 4K Siêu nét", extraSupported: ["skip"], extra: [{name: "skip"}] }
    ]
};

export default {
    async fetch(request) {
        if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
        const url = new URL(request.url);
        const path = decodeURIComponent(url.pathname); 
        if (path === "/" || path === "/manifest.json") return jsonResponse(manifest);

        // 1. PROXY ẢNH
        if (path.startsWith("/proxy-img/")) {
            try {
                const imgReq = await fetch(decodeId(path.replace("/proxy-img/", "")), { headers: fetchHeaders });
                return new Response(imgReq.body, { headers: { ...corsHeaders, "Content-Type": imgReq.headers.get("content-type") || "image/jpeg" } });
            } catch (e) { return new Response(null, { status: 404 }); }
        }

        // 2. CATALOG
        if (path.startsWith("/catalog/movie/javguru_")) {
            try {
                const catId = path.split("/")[3].replace(".json", ""); 
                let page = 1;
                const skipMatch = path.match(/skip=(\d+)/);
                if (skipMatch) page = Math.floor(parseInt(skipMatch[1], 10) / 20) + 1; 

                const searchMatch = path.match(/search=([^/.]+)/);
                let targetUrl = searchMatch 
                    ? (page === 1 ? `${BASE_URL}/?s=${searchMatch[1]}` : `${BASE_URL}/page/${page}/?s=${searchMatch[1]}`)
                    : (page === 1 ? `${BASE_URL}${CATALOG_MAP[catId] || ""}/` : `${BASE_URL}${CATALOG_MAP[catId] || ""}/page/${page}/`);

                const res = await fetch(targetUrl, { headers: fetchHeaders });
                const html = await res.text();
                const $ = cheerio.load(html);
                const metas = [];

                $('.inside-article, .post, .grid-item').each((i, el) => {
                    const titleElement = $(el).find('h2 a, h3 a, .entry-title a').first();
                    const title = titleElement.text().trim();
                    const link = titleElement.attr('href'); 
                    let rawPoster = $(el).find('img').first().attr('data-lazy-src') || $(el).find('img').first().attr('src');
                    if (rawPoster && rawPoster.startsWith('/')) rawPoster = BASE_URL + rawPoster;

                    if (title && link) {
                        const idMatch = link.match(/jav\.guru\/(\d+)/);
                        if (idMatch) {
                            metas.push({
                                id: `javguru_${idMatch[1]}`, // ID chuẩn: javguru_990355
                                type: "movie", name: title,
                                poster: rawPoster ? `${url.origin}/proxy-img/${encodeId(rawPoster)}` : rawPoster,
                                description: `Danh mục: ${manifest.catalogs.find(c => c.id === catId)?.name || 'Khác'}`
                            });
                        }
                    }
                });
                return jsonResponse({ metas });
            } catch (e) { return jsonResponse({ metas: [] }); }
        }

        // 3. META (Thông tin phim)
        if (path.startsWith("/meta/movie/javguru_")) {
            try {
                const postId = path.split("/")[3].replace(".json", "").replace("javguru_", "");
                const res = await fetch(`${BASE_URL}/${postId}/`, { headers: fetchHeaders });
                const html = await res.text();
                const $ = cheerio.load(html);

                const title = $('h1.entry-title, h1').first().text().trim();
                let rawPoster = $('.entry-content img, .imgg img').first().attr('src');
                let finalPoster = (rawPoster && !rawPoster.startsWith('data:image')) ? `${url.origin}/proxy-img/${encodeId(rawPoster)}` : rawPoster;
                
                let cast = [];
                $('a[rel="tag"]').each((i, el) => {
                    let t = $(el).text().trim();
                    if (t && !t.toLowerCase().includes("jav") && !cast.includes(t)) cast.push(t);
                });

                return jsonResponse({
                    meta: {
                        id: `javguru_${postId}`, type: "movie", name: title, poster: finalPoster, background: finalPoster,
                        description: title, cast: cast.length > 0 ? cast : undefined
                    }
                });
            } catch (e) { return jsonResponse({ meta: {} }); }
        }
        return new Response("Not found", { status: 404, headers: corsHeaders });
    }
};
