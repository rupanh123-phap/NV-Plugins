// Entry point của NV-Plugins (Tham số đầu tiên bây giờ là ID do Worker truyền sang)
export async function getStreams(id, mediaType, season, episode, userConfig) {
    let streams = [];

    // 1. CHỐT CHẶN AN TOÀN
    // Nếu ID không bắt đầu bằng 'javguru_', nghĩa là phim này của nguồn khác, bỏ qua luôn.
    if (!id || typeof id !== 'string' || !id.startsWith('javguru_')) {
        return streams;
    }

    try {
        // 2. GIẢI MÃ ID LẤY ĐƯỜNG LINK GỐC
        // ID có dạng: javguru_aHR0cHM6... (base64 của link bài viết)
        const b64Part = id.replace("javguru_", "");
        
        // Khôi phục lại định dạng base64 chuẩn
        let base64 = b64Part.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) { base64 += '='; }
        
        // Giải mã ra link bài viết trên jav.guru
        const targetUrl = atob(base64);

        // 3. TRUY CẬP THẲNG VÀO BÀI VIẾT ĐỂ LẤY IFRAME
        const detailRes = await fetch(targetUrl);
        const detailHtml = await detailRes.text();

        const iframeRegex = /<iframe[^>]+src="([^"]+)"/gi;
        let match;
        let foundIframes = [];

        while ((match = iframeRegex.exec(detailHtml)) !== null) {
            let src = match[1];
            if (src.startsWith('http')) {
                foundIframes.push(src);
            }
        }

        // 4. ĐÓNG GÓI LINK TRẢ VỀ CHO NUVIO
        [...new Set(foundIframes)].forEach(url => {
            let hostName = new URL(url).hostname.replace('www.', '').toUpperCase();
            
            streams.push({
                name: "Jav Guru",             
                url: url,                     
                quality: "HD",                
                description: `Server: ${hostName}`, 
                provider: "JavGuru",          
                behaviorHints: {
                    notWebReady: true // Báo Nuvio tự động bóc MP4 từ Iframe
                }
            });
        });

    } catch (error) {
        console.error("Lỗi cào link JavGuru:", error);
    }

    return streams;
}
