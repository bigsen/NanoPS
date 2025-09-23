import React from 'react';
import { PromptTemplate } from '../types';

interface EditPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onEdit: () => void;
  isLoading: boolean;
  templates: PromptTemplate[];
  isImageUploaded: boolean;
}

const EditPanel: React.FC<EditPanelProps> = ({ prompt, setPrompt, onEdit, isLoading, templates, isImageUploaded }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 ring-1 ring-slate-900/5">
      <div>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：把照片变成梵高风格"
          rows={4}
          className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
          disabled={isLoading}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-500 mb-3">提示词模板：</h4>
        <div className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => setPrompt(template.prompt)}
              disabled={isLoading}
              className="px-4 py-1.5 bg-slate-100 text-sm text-slate-600 rounded-full hover:bg-cyan-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={onEdit}
        disabled={isLoading || !prompt.trim() || !isImageUploaded}
        className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-2xl hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </>
        ) : (
          '开始生成'
        )}
      </button>
    </div>
  );
};

export default EditPanel;