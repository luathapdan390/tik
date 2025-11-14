
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Đang khởi tạo yêu cầu của bạn...",
    "AI đang phân tích kịch bản...",
    "Dựng những cảnh quay đầu tiên...",
    "Kết hợp các yếu tố hình ảnh...",
    "Áp dụng phong cách điện ảnh...",
    "Kết xuất video của bạn...",
    "Sắp xong rồi, chỉ một lát nữa thôi!",
];

const LoadingIndicator: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#00f2ea]"></div>
            <p className="text-white mt-4 text-lg font-medium">{loadingMessages[messageIndex]}</p>
            <p className="text-gray-400 mt-1 text-sm">Quá trình này có thể mất vài phút.</p>
        </div>
    );
};

export default LoadingIndicator;
