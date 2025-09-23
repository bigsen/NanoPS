
import { PromptTemplate } from './types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  { name: '3D手办', prompt: 'Use the nano-banana model to create a 1/7 scale model, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text.On the computer screen, display the ZBrush modeling process of the figure.Next to the computer screen, place a TAMIYA-style toy packaging box printedwith the original artwork.' },
  { 
    name: '旧照片修复', 
    prompt: 'Restore and colorize this image. Remove any scratches or imperfections.Change to modern photo style, vibrant colors.Special attention should be paid to maintaining the facial shape and facial features of the characters unchanged' 
  },
    { name: '肖像照', prompt: 'professional headshot portrait, business attire, clean background, studio lighting, high quality, sharp focus' },
];
