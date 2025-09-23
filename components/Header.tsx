import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 pb-2">
        Nano PS 照片编辑器
      </h1>
      <p className="mt-2 text-lg text-slate-600">
        由 Gemini (Nano Banana) 驱动 - 释放您的无限创意
      </p>
    </header>
  );
};

export default Header;