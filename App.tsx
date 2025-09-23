import React, { useState, useCallback } from 'react';
import { ImageData } from './types';
import { editImageWithGemini } from './services/geminiService';
import { PROMPT_TEMPLATES } from './constants';
import Header from './components/Header';
import ImageDisplay from './components/ImageDisplay';
import EditPanel from './components/EditPanel';
import ErrorAlert from './components/ErrorAlert';
import Spinner from './components/Spinner';
import ImagePreviewModal from './components/ImagePreviewModal';

// Result component to display the generated image
interface ResultDisplayProps {
  image: ImageData;
  onAddToInput: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, onAddToInput }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.base64}`;
    const extension = image.mimeType.split('/')[1] || 'png';
    link.download = `ai-generated-image-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const imageUrl = `data:${image.mimeType};base64,${image.base64}`;

  return (
    <>
      <div className="w-full space-y-4 flex flex-col items-center animate-fade-in">
        <div
            className="w-full h-[420px] bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center ring-1 ring-slate-200 cursor-pointer group relative"
            onClick={() => setIsPreviewOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="点击预览大图"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsPreviewOpen(true)}
        >
            <img
                src={imageUrl}
                alt="Generated result"
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
            </div>
        </div>
        <div className="flex w-full gap-4">
          <button
            onClick={handleDownload}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-400/30 transition-all transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载图片
          </button>
          <button
            onClick={onAddToInput}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg shadow-md hover:bg-slate-200 transition-all transform hover:scale-105"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            用作输入
          </button>
        </div>
      </div>
      {isPreviewOpen && (
        <ImagePreviewModal
          imageUrl={imageUrl}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
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

  const SectionHeader: React.FC<{ number: string; title: string; }> = ({ number, title }) => (
    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white font-black text-lg">{number}</span>
        {title}
    </h2>
  );

  return (
    <div className="min-h-screen font-sans p-6 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <Header />
        <main className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column: Controls */}
          <div className="flex flex-col space-y-10">
            <section>
                <SectionHeader number="1" title="上传图片" />
                <ImageDisplay
                    images={galleryImages}
                    onDeleteImage={handleDeleteImage}
                    onAddImages={handleAddImages}
                />
            </section>
            <section>
                <SectionHeader number="2" title="输入提示词" />
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
            <SectionHeader number="3" title="查看生成结果" />
            <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[300px] flex items-center justify-center ring-1 ring-slate-900/5">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                       <Spinner />
                       <p className="mt-4 text-lg text-slate-500 animate-pulse">AI 正在努力创作中...</p>
                    </div>
                ) : resultImage ? (
                    <ResultDisplay image={resultImage} onAddToInput={handleUseResultAsInput} />
                ) : (
                    <div className="text-center text-slate-500 p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <p className="mt-4 text-lg font-semibold text-slate-700">魔法即将在此发生</p>
                        <p className="mt-1 text-sm text-slate-500">在左侧完成设置后，您的创意成果将在这里呈现。</p>
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