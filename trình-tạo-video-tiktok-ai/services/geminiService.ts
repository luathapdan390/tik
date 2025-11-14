
import { GoogleGenAI } from "@google/genai";

// A type guard for the operation response to ensure it has the expected structure.
interface VideoOperationResponse {
    response?: {
        generatedVideos?: {
            video?: {
                uri: string;
            }
        }[];
    };
    done: boolean;
}

const isVideoOperationResponse = (op: any): op is VideoOperationResponse => {
    return typeof op === 'object' && op !== null && typeof op.done === 'boolean';
};

export const generateVideo = async (prompt: string): Promise<string> => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY môi trường biến không được thiết lập.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let operation;
    try {
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            }
        });
    } catch (e) {
        console.error("Lỗi khi bắt đầu tạo video:", e);
        throw new Error("Không thể bắt đầu quá trình tạo video. Vui lòng kiểm tra API key và thử lại.");
    }
    
    if(!isVideoOperationResponse(operation)){
         throw new Error("Phản hồi hoạt động không hợp lệ từ API.");
    }

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            operation = await ai.operations.getVideosOperation({ operation: operation });
            if (!isVideoOperationResponse(operation)) {
                throw new Error("Phản hồi hoạt động không hợp lệ trong quá trình thăm dò.");
            }
        } catch (e) {
            console.error("Lỗi khi thăm dò trạng thái video:", e);
            throw new Error("Không thể lấy trạng thái tạo video.");
        }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("Không thể tạo video. Không tìm thấy liên kết tải xuống.");
    }

    try {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Tải video thất bại với trạng thái: ${response.status}`);
        }
        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);
    } catch (e) {
        console.error("Lỗi khi tải video blob:", e);
        throw new Error("Không thể tải xuống dữ liệu video đã tạo.");
    }
};
