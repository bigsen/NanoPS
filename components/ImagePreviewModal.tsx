
import React, { useState, useEffect, useRef } from 'react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Zoom logic
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    setZoom(prevZoom => {
      if (direction === 'reset') {
        setPosition({ x: 0, y: 0 });
        return 1;
      }
      const newZoom = direction === 'in' ? prevZoom * 1.25 : prevZoom / 1.25;
      const clampedZoom = Math.max(0.2, Math.min(newZoom, 10));
      
      if (clampedZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return clampedZoom;
    });
  };
  
  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0 ? 'in' : 'out');
  };

  // Panning logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsPanning(true);
    setStartPan({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoom <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onWheel={handleWheel}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="全屏预览"
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
            maxWidth: '95vw',
            maxHeight: '95vh',
          }}
          onMouseDown={handleMouseDown}
          draggable="false"
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
        aria-label="关闭预览"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 p-2 rounded-lg text-white backdrop-blur-sm">
        <button onClick={() => handleZoom('out')} className="p-2 rounded-md hover:bg-white/20 transition-colors" aria-label="缩小">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <button onClick={() => handleZoom('reset')} className="min-w-[50px] text-center font-semibold px-2 py-1 rounded-md hover:bg-white/20 transition-colors" aria-label="重置缩放">
          {(zoom * 100).toFixed(0)}%
        </button>
        <button onClick={() => handleZoom('in')} className="p-2 rounded-md hover:bg-white/20 transition-colors" aria-label="放大">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
