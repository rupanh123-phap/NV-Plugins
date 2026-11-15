var k=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var B=Object.prototype.hasOwnProperty;var I=(e,t)=>{for(var i in t)k(e,i,{get:t[i],enumerable:!0})},E=(e,t,i,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of T(t))!B.call(e,s)&&s!==i&&k(e,s,{get:()=>t[s],enumerable:!(a=D(t,s))||a.enumerable});return e};var K=e=>E(k({},"__esModule",{value:!0}),e);var P={};I(P,{getStreams:()=>C});module.exports=K(P);

var v="https://jav.guru",
    m="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    b="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

// Cập nhật bộ Header đầy đủ để vượt qua kiểm tra Cloudflare trên PC và Android TV
var browserHeaders = {
  "User-Agent": m,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Referer": `${v}/`,
  "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1"
};

var W={"User-Agent":m,Accept:"application/json, text/plain, */*",Referer:`${v}/`},
    Y={"User-Agent":b,Referer:"https://upload18.org/",Origin:"https://upload18.org"},
    U={"User-Agent":b,Referer:"https://upload18.org/",Origin:"https://upload18.org"},
    j={"User-Agent":m,Referer:"https://streamhihi.com/"},
    x={"User-Agent":m,Referer:"https://maxstream.org/"};

function c(e){return!e||typeof e!="string"?"":e.replace(/\\u0026/g,"&").replace(/&amp;/g,"&").replace(/\\/g,"").trim()}
function J(e){return!e||typeof e!="string"?"":e.split("").reverse().join("")}
function G(e){if(!e||typeof e!="string")return"";let t=e.split("").reverse().join(""),i="";for(let a=0;a<t.length;a+=2)i+=String.fromCharCode(parseInt(t.substr(a,2),16));return i}
function S(packed){if(!packed||typeof packed!="string")return null;try{let match=packed.match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\.split\('\|'\)\)\)/);return match?eval(match[0].replace("eval(","(")):null}catch(e){return null}}

function p(e){
  if(!e||typeof e!="string")return null;
  let t=e.replace(/^(mal:)?javguru:/i,"").trim(),
      i=t.match(/FC2[-_ ]?(PPV)?[-_ ]?(\d{5,7})/i);
  if(i)return`FC2-PPV-${i[2]}`;
  let a=t.match(/\[?([A-Za-z]{2,6})[-_ ]?(\d{2,5})\]?/i);
  if(a){let s=a[1].toUpperCase(),r=a[2];if(!["1080P","720P","4K","PART","HD","FHD","JAV","JAVGURU"].includes(s))return`${s}-${r}`}
  return null
}

function q(e){
  if(!e)return!1;
  let t=String(typeof e=="object"?e.id||e.tmdbId||"":e).toLowerCase();
  return t.startsWith("javguru:")||t.startsWith("mal:javguru:")||!!p(t)
}

var y={
  "990355":{id:"990355",code:"SNOS-209",title:"[SNOS-209] (4K) The strongest heroine 100% dominates your dick… Seto Kanna will fuck you for 24 hours",link:"https://jav.guru/990355/snos-209-the-strongest-heroine-100-dominates-your-dick-seto-kanna-will-fuck-you-for-24/",luluUrl:null,wishUrl:"https://maxstream.org/embed-5ghvw402qzzp.html",voeUrl:"https://javlesbians.com/e/ab7bz8wnclqw",sbUrl:"https://javclan.com/e/6350ymvr6446",doodUrl:"https://vide0.net/e/jv24j8hwflum"},
  "990681":{id:"990681",code:"NGHJ-061",title:"[NGHJ-061] (4K) Airline cabin attendants challenge black pantyhose sumata!",link:"https://jav.guru/990681/nghj-061-airline-cabin-attendants-challenge-black-pantyhose-sumata-is-the-rumor-true-that-cas-back-from-flights-want-cock/",luluUrl:null,wishUrl:"https://maxstream.org/embed-0dqayn732gjx.html",voeUrl:"https://javlesbians.com/e/zbheeqoihw5y",sbUrl:"https://javclan.com/e/ahucpv1wck9i",doodUrl:"https://vide0.net/e/xravhqws55bp"}
};

async function O(e){
  if(!e||typeof e!="string")return null;
  try{
    let t=await fetch(e,{headers:browserHeaders});
    if(!t.ok)return null;
    let i=await t.text();
    if(i.includes("cf-browser-verification") || i.includes("Just a moment...")) return null;
    let a=null,s=i.match(/window\.PLAYER_CONFIG\s*=\s*(\{.+?\});/s);
    if(s)try{let r=JSON.parse(s[1]);r.m3u8&&typeof r.m3u8=="string"&&(a=c(r.m3u8))}catch{}
    if(!a){let r=i.match(/"m3u8"\s*:\s*"([^"]+)"/);r&&r[1]&&(a=c(r[1]))}
    return a
  }catch(t){return null}
}

async function V(e){
  if(!e)return null;
  try{
    let t=await fetch(e,{headers:browserHeaders});
    if(!t.ok)return null;
    let i=await t.text();
    if(i.includes("cf-browser-verification")) return null;
    let a=S(i);
    if(a){let s=a.match(/file:\s*"([^"]+)"/)||a.match(/sources:\s*\[\{file:\s*"([^"]+)"/);if(s&&s[1])return c(s[1])}
  }catch(t){}
  return null
}

async function F(e){
  if(!e)return null;
  try{
    let t=await fetch(e,{headers:browserHeaders});
    if(!t.ok)return null;
    let i=await t.text();
    if(i.includes("cf-browser-verification")) return null;
    let a=S(i);
    if(a){let s=a.match(/file:\s*"([^"]+)"/)||a.match(/sources:\s*\[\{file:\s*"([^"]+)"/);if(s&&s[1])return c(s[1])}
  }catch(t){}
  return null
}

var H="https://avdbapi.com/api.php/provide/vod";

async function M(e,t,i,a){
  try{
    if(!q(e))return[];
    let s=String(typeof e=="object"?e.id||e.tmdbId||"":e).trim(),
        r=s.replace(/^(mal:)?javguru:/i,"").trim().toLowerCase(),
        l=p(s)||p(r),
        A=r.replace(/\D/g,""),
        n=null;
    
    if(y&&(n=y[r]||y[A]||null,n&&!l&&(l=n.code||p(n.title||""))),!l)return[];
    
    let d=[],R=`${H}?ac=detail&wd=${encodeURIComponent(l)}`;
    try{
      let o=await fetch(R,{headers:{"User-Agent":m,Accept:"application/json","Referer":`${v}/`}});
      if(o.ok){
        let w=await o.json();
        if(Array.isArray(w.list)&&w.list.length>0){
          let f=w.list[0],u=f.episodes?.server_data,g=null;
          if(u)if(u.Full&&u.Full.link_embed)g=u.Full.link_embed;
          else{let h=Object.values(u)[0];h&&h.link_embed&&(g=h.link_embed)}
          if(g){
            let h=await O(g);
            if(h){
              let z=f.time?` ⏱️ ${f.time}`:"";
              d.push({name:`🚀 JAVGuru • Server VIP (${l})`,title:`1080p • H.264 • HLS (Tốc độ cao)${z}`,description:`1080p • H.264 • HLS${z}`,url:h,quality:"1080p",type:"m3u8",provider:"JAVGuru",headers:U,behaviorHints:{notWebReady:!0,proxyHeaders:{request:U}}})
            }
          }
        }
      }
    }catch(o){}

    if(n?.luluUrl)try{
      let o=await V(n.luluUrl);
      o&&d.push({name:`⚡ JAVGuru • Server LuluStream (${l})`,title:"720p • H.264 • HLS (Dự phòng 1)",description:"720p • H.264 • HLS",url:o,quality:"720p",type:"m3u8",provider:"JAVGuru",headers:j,behaviorHints:{notWebReady:!0,proxyHeaders:{request:j}}})
    }catch(o){}

    if(n?.wishUrl)try{
      let o=await F(n.wishUrl);
      o&&d.push({name:`⚡ JAVGuru • Server StreamWish (${l})`,title:"1080p • H.264 • HLS (Dự phòng 2)",description:"1080p • H.264 • HLS",url:o,quality:"1080p",type:"m3u8",provider:"JAVGuru",headers:x,behaviorHints:{notWebReady:!0,proxyHeaders:{request:x}}})
    }catch(o){}

    return d
  }catch(s){return[]}
}

async function C(e,t,i,a,s){
  try{
    return await M(e,t,i,a)
  }catch(r){return[]}
}

if (typeof module !== "undefined" && module.exports && module.exports.getStreams) {
  if (typeof globalThis !== "undefined") {
    globalThis.getStreams = module.exports.getStreams;
  }
  if (typeof global !== "undefined") {
    global.getStreams = module.exports.getStreams;
  }
}
