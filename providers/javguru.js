export async function getStreams(id, mediaType, season, episode, userConfig) {
    let streams = [];

    // Chỉ nhận xử lý phim từ nguồn Javguru
    if (!id || typeof id !== 'string' || !id.startsWith('javguru_')) {
        return streams;
    }

    try {
        // Tách lấy Post ID (Ví dụ: Từ javguru_990355 -> lấy 990355)
        const postId = id.replace("javguru_", "");
        const targetUrl = `https://jav.guru/${postId}/`;

        // 1. Chui thẳng vào web gốc jav.guru
        const res = await fetch(targetUrl);
        const html = await res.text();

        // 2. Dùng biểu thức chính quy quét 100% tất cả các thẻ iframe có trong bài
        const iframeRegex = /<iframe[^>]+src="([^"]+)"/gi;
        let match;
        let foundIframes = [];

        while ((match = iframeRegex.exec(html)) !== null) {
            let src = match[1];
            if (src.startsWith('http')) {
                foundIframes.push(src);
            }
        }

        // 3. Quét thêm thẻ <a> chứa link xem video (phòng hờ web nó đổi thiết kế)
        const aRegex = /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?(?:Server|Play|Xem|Watch)[\s\S]*?<\/a>/gi;
        while ((match = aRegex.exec(html)) !== null) {
            let src = match[1];
            if (src.startsWith('http') && !src.includes('jav.guru')) {
                foundIframes.push(src);
            }
        }

        // 4. Lọc trùng lặp và đóng gói Stream
        const uniqueLinks = [...new Set(foundIframes)];
        
        uniqueLinks.forEach(url => {
            let hostName = "Dự phòng";
            try {
                hostName = new URL(url).hostname.replace('www.', '').toUpperCase();
            } catch (e) {}
            
            // Lọc bỏ quảng cáo (Nếu web có nhúng iframe banner)
            if (hostName.includes('YOUTUBE') || hostName.includes('EXOCLICK') || hostName.includes('TWITTER')) return;

            streams.push({
                name: "Jav Guru",             
                url: url, // Đưa thẳng link LuluStream, StreamWish, Doodstream... cho Nuvio xử lý
                quality: "HD",                
                description: `Server: ${hostName}`, 
                provider: "JavGuru",          
                behaviorHints: {
                    notWebReady: true // Cờ này báo cho Nuvio tự dùng Extractor để bóc MP4 từ Iframe
                }
            });
        });

    } catch (error) {
        console.error("Lỗi cào link nội bộ JavGuru:", error);
    }

    return streams;
}
