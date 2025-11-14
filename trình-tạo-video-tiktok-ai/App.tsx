import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo } from './services/geminiService';
import ApiKeySelector from './components/ApiKeySelector';
import VideoGeneratorForm from './components/VideoGeneratorForm';
import LoadingIndicator from './components/LoadingIndicator';
import VideoPlayer from './components/VideoPlayer';

// Fix: Use a named interface 'AIStudio' for window.aistudio to avoid a global type conflict.
interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}
declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

    const checkApiKey = useCallback(async () => {
        if (window.aistudio) {
            try {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            } catch (e) {
                console.error("Error checking API key:", e);
                setApiKeySelected(false);
            }
        } else {
             // If aistudio is not available, assume we are in a different environment
             // and the key is set via process.env. For this app, we'll proceed.
            setApiKeySelected(true);
        }
    }, []);

    useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);

    const handleGenerateVideo = async () => {
        if (!prompt.trim()) {
            setError("Vui lòng nhập mô tả cho video.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
            const url = await generateVideo(prompt);
            setVideoUrl(url);
        } catch (e: any) {
            console.error(e);
            let errorMessage = "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.";
            if (e.message && e.message.includes("Requested entity was not found.")) {
                errorMessage = "API key không hợp lệ hoặc đã bị thu hồi. Vui lòng chọn lại API key.";
                setApiKeySelected(false); // Force re-selection of API key
            } else if (e.message) {
                errorMessage = e.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeySelected = () => {
        setApiKeySelected(true);
        setError(null);
    }

    return (
        <div className="bg-[#121212] min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Trình tạo video <span className="text-[#00f2ea]">TikTok</span> AI
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Biến ý tưởng của bạn thành video lan truyền chỉ trong vài giây.
                    </p>
                </header>

                {!apiKeySelected ? (
                    <ApiKeySelector onKeySelected={handleKeySelected} />
                ) : (
                    <main className="w-full flex flex-col items-center gap-8">
                        <VideoGeneratorForm
                            prompt={prompt}
                            setPrompt={setPrompt}
                            onSubmit={handleGenerateVideo}
                            isLoading={isLoading}
                        />

                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg w-full text-center">
                                <p>{error}</p>
                            </div>
                        )}

                        {isLoading && <LoadingIndicator />}
                        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
                    </main>
                )}
            </div>
        </div>
    );
};

export default App;
