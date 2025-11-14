
import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
    videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Cleanup function to revoke the object URL when the component unmounts or the URL changes
        return () => {
            if (videoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);
    
    // Add an observer to auto-play when visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    videoRef.current?.play().catch(error => {
                        console.log("Autoplay was prevented:", error);
                        // Autoplay was prevented. Show a "Tap to unmute" or similar UI.
                        // For simplicity, we just log it.
                    });
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.5 } // 50% of the video must be visible to play
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full max-w-sm mx-auto mt-4">
            <h2 className="text-2xl font-bold text-center mb-4">Video của bạn đã sẵn sàng!</h2>
            {/* Phone-like frame */}
            <div className="bg-black border-8 border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full aspect-[9/16] relative">
                    <video
                        ref={videoRef}
                        key={videoUrl} // Re-mount component when URL changes
                        className="w-full h-full object-cover"
                        src={videoUrl}
                        controls
                        loop
                        autoPlay
                        muted // Muted is often required for autoplay to work in browsers
                        playsInline
                    >
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                </div>
            </div>
            <div className="text-center mt-4">
                <a
                    href={videoUrl}
                    download={`tiktok-ai-video-${Date.now()}.mp4`}
                    className="inline-block bg-[#00f2ea] text-black font-bold py-2 px-6 rounded-lg hover:bg-white transition-colors duration-300"
                >
                    Tải Video
                </a>
            </div>
        </div>
    );
};

export default VideoPlayer;
