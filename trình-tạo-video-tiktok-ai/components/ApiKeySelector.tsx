
import React from 'react';

interface ApiKeySelectorProps {
    onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
    
    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            try {
                await window.aistudio.openSelectKey();
                // Assume success and notify parent component to re-check
                onKeySelected();
            } catch (e) {
                console.error("Lỗi khi mở hộp thoại chọn key:", e);
            }
        } else {
            console.warn("window.aistudio.openSelectKey không khả dụng.");
        }
    };

    return (
        <div className="w-full max-w-md bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-3">Yêu cầu API Key</h2>
            <p className="text-gray-400 mb-4">
                Để tạo video với Veo, bạn cần chọn một API key được liên kết với một dự án Google Cloud đã bật thanh toán.
            </p>
            <p className="text-sm text-gray-500 mb-6">
                Tìm hiểu thêm về <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[#00f2ea] hover:underline">thanh toán API Gemini</a>.
            </p>
            <button
                onClick={handleSelectKey}
                className="w-full bg-[#00f2ea] text-black font-bold py-3 px-4 rounded-lg hover:bg-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00f2ea] focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                Chọn API Key
            </button>
        </div>
    );
};

export default ApiKeySelector;
