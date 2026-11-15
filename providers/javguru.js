export async function getStreams(id) {
    let streams = [];
    if (!id || !id.startsWith('javguru:')) return streams;

    // ID từ Worker truyền xuống có dạng: javguru:MÃ_PHIM:LINK_BASE64
    let parts = id.split(':');
    let javCode = parts[1]; // VD: DLDSS-575
    let b64Link = parts[2]; // VD: aHR0cHM6Ly...

    // ==========================================
    // LUỒNG 1: DÙNG API CHO NHANH (GIỮ TỐC ĐỘ CỦA CODE CŨ)
    // ==========================================
    if (javCode) {
        try {
            let apiRes = await fetch(`https://avdbapi.com/api.php/provide/vod?ac=detail&wd=${javCode}`);
            let apiData = await apiRes.json();
            if (apiData.list && apiData.list.length > 0) {
                let embed = apiData.list[0].episodes?.server_data?.Full?.link_embed;
                if (!embed) embed = Object.values(apiData.list[0].episodes?.server_data || {})[0]?.link_embed;
                
                if (embed) {
                    let htmlApi = await (await fetch(embed)).text();
                    let m3u8Match = htmlApi.match(/"m3u8"\s*:\s*"([^"]+)"/);
                    if (m3u8Match) {
                        streams.push({
                            name: "VIP Server",
                            title: `1080p HLS - ${javCode}`,
                            url: m3u8Match[1].replace(/\\/g, ''),
                            type: "m3u8"
                        });
                    }
                }
            }
        } catch(e) {}
    }

    // ==========================================
    // LUỒNG 2: TỰ BÓC M3U8 TỪ JAV.GURU (DÀNH CHO PHIM API KHÔNG CÓ)
    // ==========================================
    if (b64Link) {
        try {
            // Giải mã link bài viết
            let pad = b64Link.replace(/-/g, '+').replace(/_/g, '/');
            while (pad.length % 4) pad += '=';
            let targetUrl = atob(pad);

            // Tải nội dung bài viết
            let html = await (await fetch(targetUrl)).text();
            
            // Tìm tất cả Iframe trên trang
            let iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;
            let match;
            while ((match = iframeRegex.exec(html)) !== null) {
                let src = match[1];
                
                // Nếu là Iframe của Javclan / Mxzh -> Chui vào bóc m3u8 trực tiếp!
                if (src.includes('javclan') || src.includes('mxzh')) {
                    try {
                        let iframeHtml = await (await fetch(src, {headers: {"Referer": "https://jav.guru/"}})).text();
                        let m3u8 = iframeHtml.match(/(https:\/\/[^"']+\.m3u8[^"']*)/i);
                        if (m3u8) {
                            streams.push({
                                name: "Native ⚡",
                                title: "M3U8 Trực Tiếp (Tự bóc)",
                                url: m3u8[1], // ĐÂY CHÍNH LÀ CÁI LINK MÀ BẠN XEM BẰNG VLC!
                                type: "m3u8"
                            });
                        }
                    } catch(err) {}
                } 
                // Nếu là host khác (Lulu, Wish, Dood) -> Gửi cho Nuvio xử lý
                else if (src.includes('streamwish') || src.includes('lulustream') || src.includes('dood')) {
                    let hostName = new URL(src).hostname.replace('www.', '').toUpperCase();
                    streams.push({
                        name: "Dự phòng",
                        title: hostName,
                        url: src,
                        behaviorHints: { notWebReady: true }
                    });
                }
            }
        } catch(e) {}
    }

    return streams;
}
