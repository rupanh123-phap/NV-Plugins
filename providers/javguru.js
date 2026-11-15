// File: providers/javguru.js (Trên GitHub của bạn)
export async function getStreams(id, mediaType, season, episode, userConfig) {
    let streams = [];

    // Chỉ nhận xử lý phim của Javguru
    if (!id || typeof id !== 'string' || !id.startsWith('javguru:')) return streams;

    try {
        // 1. Khôi phục lại đường link bài viết gốc từ ID
        const b64 = id.replace('javguru:', '');
        let pad = b64.replace(/-/g, '+').replace(/_/g, '/');
        while (pad.length % 4) pad += '=';
        const targetUrl = atob(pad);

        // 2. Chui thẳng vào web jav.guru tải HTML
        const res = await fetch(targetUrl);
        const html = await res.text();

        let foundLinks = [];

        // 3. Quét Iframe lộ thiên (Nếu có)
        const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;
        let match;
        while ((match = iframeRegex.exec(html)) !== null) {
            if (match[1].startsWith('http')) foundLinks.push(match[1]);
        }

        // 4. TUYỆT CHIÊU: Quét Iframe giấu trong Base64 (Đặc sản của Jav.guru)
        // 'aHR0c' chính là chữ 'http' đã bị mã hóa
        const b64Regex = /["'](aHR0c[a-zA-Z0-9+/=]+)["']/g;
        while ((match = b64Regex.exec(html)) !== null) {
            try {
                let decoded = atob(match[1]);
                if (decoded.startsWith('http')) foundLinks.push(decoded);
            } catch(e) {}
        }

        // 5. Lọc rác và trả về Nuvio
        const uniqueLinks = [...new Set(foundLinks)];
        uniqueLinks.forEach(url => {
            let hostName = "Dự phòng";
            try { hostName = new URL(url).hostname.replace('www.', '').toUpperCase(); } catch(e){}
            
            // Chặn các link quảng cáo cắm láo vào bài
            const blacklist = ['YOUTUBE', 'EXOCLICK', 'JAV.GURU', 'TWITTER', 'W3.ORG'];
            if (blacklist.some(b => hostName.includes(b))) return;

            streams.push({
                name: "Jav Guru",
                url: url, // Trả thẳng link Doodstream, Mixdrop, Streamtape...
                quality: "HD",
                description: `Server: ${hostName}`,
                provider: "JavGuru",
                behaviorHints: { notWebReady: true } // Kích hoạt bộ bóc MP4 nội bộ của Nuvio
            });
        });

    } catch(e) {
        console.error("Lỗi giải mã Jav.guru:", e);
    }
    return streams;
}
