import React, { useRef, useState, useCallback } from 'react';
import { ImageData } from '../types';

interface ImageDisplayProps {
  images: ImageData[];
  onDeleteImage: (index: number) => void;
  onAddImages: (images: ImageData[]) => void;
}

const ImageCard: React.FC<{ image: ImageData; index: number; onDelete: () => void; }> = ({ image, index, onDelete }) => {
  return (
    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative group ring-1 ring-slate-200 hover:ring-sky-500 transition-all">
      <img 
        src={`data:${image.mimeType};base64,${image.base64}`} 
        alt={`gallery image ${index + 1}`} 
        className="w-full h-full object-contain" 
      />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button 
          onClick={onDelete} 
          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 hover:bg-red-600 text-white transition-colors" 
          title="删除图片"
          aria-label={`删除图片 ${index + 1}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const AddImageCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors duration-300"
    aria-label="添加新图片"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
    <span className="mt-2 text-sm font-medium">添加图片</span>
  </button>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, onDeleteImage, onAddImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const processFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const promises = imageFiles.map(file => {
      return new Promise<ImageData>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve({ base64: base64String, mimeType: file.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(imageDataArray => {
      onAddImages(imageDataArray);
    }).catch(error => {
      console.error("Error reading files:", error);
    });
  }, [onAddImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (e.target) {
        e.target.value = '';
    }
  };
  
  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);


  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`bg-white p-6 rounded-xl shadow-lg min-h-[120px] transition-all duration-300 ${isDragging ? 'ring-2 ring-sky-500' : 'ring-1 ring-slate-900/5'}`}
    >
      {images.length === 0 ? (
        <label 
            htmlFor="file-upload-display"
            className="flex flex-col items-center justify-center h-full cursor-pointer text-center text-slate-400 hover:text-sky-500 transition-colors"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold">点击上传图片或直接拖拽</p>
        </label>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <ImageCard 
              key={index}
              image={image}
              index={index}
              onDelete={() => onDeleteImage(index)}
            />
          ))}
          <AddImageCard onClick={() => fileInputRef.current?.click()} />
        </div>
      )}
      <input
        id="file-upload-display"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default ImageDisplay;