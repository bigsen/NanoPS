import React, { useState, useCallback } from 'react';
import { ImageData } from './types';
import { editImageWithGemini } from './services/geminiService';
import { PROMPT_TEMPLATES } from './constants';
import Header from './components/Header';
import ImageDisplay from './components/ImageDisplay';
import EditPanel from './components/EditPanel';
import ErrorAlert from './components/ErrorAlert';
import Spinner from './components/Spinner';

// Result component to display the generated image
interface ResultDisplayProps {
  image: ImageData;
  onAddToInput: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, onAddToInput }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.base64}`;
    const extension = image.mimeType.split('/')[1] || 'png';
    link.download = `ai-generated-image-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-lg space-y-4 flex flex-col items-center animate-fade-in ring-1 ring-slate-900/5">
        <div className="w-full aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center ring-1 ring-slate-200">
            <img
                src={`data:${image.mimeType};base64,${image.base64}`}
                alt="Generated result"
                className="max-w-full max-h-full object-contain"
            />
        </div>
      <div className="flex w-full gap-4">
        <button
          onClick={handleDownload}
          className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-sky-600 hover:to-indigo-700 transition-all transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载图片
        </button>
        <button
          onClick={onAddToInput}
          className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg shadow-md hover:bg-slate-300 transition-all transform hover:scale-105"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          用作输入
        </button>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
  const [resultImage, setResultImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImages = (images: ImageData[]) => {
    setGalleryImages(prev => [...prev, ...images]);
    setError(null);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setGalleryImages(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleEdit = useCallback(async () => {
    if (galleryImages.length === 0 || !prompt.trim()) {
      setError('请至少上传一张图片并输入有效的编辑提示词。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await editImageWithGemini(galleryImages, prompt);
      if (result) {
        setResultImage(result);
      } else {
        setError('图片编辑失败，模型未能生成有效的图片。请调整提示词后重试。');
      }
    } catch (e) {
      console.error(e);
      setError(`发生错误: ${e instanceof Error ? e.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  }, [galleryImages, prompt]);

  const handleUseResultAsInput = () => {
    if (resultImage) {
      setGalleryImages([resultImage]);
      setResultImage(null);
    }
  };


  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <Header />
        <main className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Controls */}
          <div className="flex flex-col space-y-8">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    <span className="text-sky-500 font-black">1.</span> 上传图片
                </h2>
                <ImageDisplay
                    images={galleryImages}
                    onDeleteImage={handleDeleteImage}
                    onAddImages={handleAddImages}
                />
            </section>
            <section>
                 <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                    <span className="text-sky-500 font-black">2.</span> 输入提示词
                </h2>
                <EditPanel
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onEdit={handleEdit}
                  isLoading={isLoading}
                  templates={PROMPT_TEMPLATES}
                  isImageUploaded={galleryImages.length > 0}
                />
            </section>
            {error && <ErrorAlert message={error} />}
          </div>
          
          {/* Right Column: Result */}
          <div className="flex flex-col space-y-4 lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-200">
                <span className="text-sky-500 font-black">3.</span> 查看生成结果
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-inner min-h-[360px] flex items-center justify-center ring-1 ring-slate-900/5">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                       <Spinner />
                       <p className="mt-4 text-lg text-slate-500 animate-pulse">AI 正在努力创作中...</p>
                    </div>
                ) : resultImage ? (
                    <ResultDisplay image={resultImage} onAddToInput={handleUseResultAsInput} />
                ) : (
                    <div className="text-center text-slate-400 p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 3a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z"></path>
                            <path d="M12 17a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z"></path>
                            <path d="M5.636 5.636a1 1 0 0 0 -1.414 0l-1.414 1.414a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 -1.414l-1.414 -1.414a1 1 0 0 0 0 -1.414z"></path>
                            <path d="M19.778 18.364a1 1 0 0 0 -1.414 0l-1.414 1.414a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 -1.414l-1.414 -1.414a1 1 0 0 0 0 -1.414z"></path>
                            <path d="M3 11a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z"></path>
                            <path d="M17 11a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z"></path>
                            <path d="M5.636 18.364a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l1.414 -1.414a1 1 0 0 0 -1.414 -1.414l-1.414 1.414a1 1 0 0 0 0 0z"></path>
                            <path d="M18.364 5.636a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l1.414 -1.414a1 1 0 0 0 -1.414 -1.414l-1.414 1.414a1 1 0 0 0 0 0z"></path>
                        </svg>
                        <p className="mt-4 text-lg font-semibold text-slate-500">魔法即将在此发生</p>
                        <p className="mt-1 text-sm text-slate-400">在左侧完成设置后，您的创意成果将在这里呈现。</p>
                    </div>
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;