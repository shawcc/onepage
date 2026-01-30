import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Download, Monitor, Smartphone, Layers, Type, Check, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ImageBuilderProps {
  initialImage?: string;
  onSave: (newImageUrl: string) => void;
  onClose: () => void;
}

const FRAME_STYLES = [
  { id: 'browser', name: '浏览器窗口', icon: <Monitor size={18} /> },
  { id: 'phone', name: '手机外壳', icon: <Smartphone size={18} /> },
  { id: 'glass', name: '毛玻璃卡片', icon: <Layers size={18} /> },
  { id: 'none', name: '原图+阴影', icon: <ImageIcon size={18} /> },
];

const BACKGROUNDS = [
  { id: 'gradient-1', name: '极光紫', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient-2', name: '深海蓝', value: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)' },
  { id: 'gradient-3', name: '落日橙', value: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
  { id: 'solid-gray', name: '高级灰', value: '#f3f4f6' },
  { id: 'solid-dark', name: '暗夜黑', value: '#0f172a' },
  { id: 'transparent', name: '透明', value: 'transparent' },
];

const ImageBuilder: React.FC<ImageBuilderProps> = ({ initialImage, onSave, onClose }) => {
  const [selectedFrame, setSelectedFrame] = useState('browser');
  const [background, setBackground] = useState(BACKGROUNDS[0].value);
  const [uploadedImage, setUploadedImage] = useState<string>(initialImage || 'https://placehold.co/800x500/e2e8f0/64748b?text=Upload+Your+Screenshot');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      // Small delay to ensure render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2, // Retina quality
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
      onClose();
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden flex shadow-2xl animate-fade-in">
        
        {/* Left: Controls */}
        <div className="w-80 bg-gray-50 border-r p-6 flex flex-col gap-8 overflow-y-auto">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">1. 上传截图</h3>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">点击上传产品截图</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">2. 选择外壳</h3>
            <div className="grid grid-cols-2 gap-3">
              {FRAME_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedFrame(style.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedFrame === style.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white border text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {style.icon}
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">3. 背景风格</h3>
            <div className="grid grid-cols-3 gap-3">
              {BACKGROUNDS.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.value)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    background === bg.value ? 'border-blue-600 scale-110' : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ background: bg.value }}
                  title={bg.name}
                >
                  {background === bg.value && <div className="w-full h-full flex items-center justify-center"><Check size={16} className="text-white drop-shadow-md" /></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
             <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isGenerating ? <RefreshCw className="animate-spin" /> : <Download size={20} />}
              {isGenerating ? '生成中...' : '完成并插入'}
            </button>
          </div>
        </div>

        {/* Right: Preview Canvas */}
        <div className="flex-1 bg-gray-200/50 flex items-center justify-center p-8 overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 shadow-sm z-10">
            <X size={20} />
          </button>
          
          <div className="relative shadow-2xl" style={{ maxHeight: '100%', maxWidth: '100%' }}>
            {/* The Capture Area */}
            <div 
              ref={previewRef}
              className="p-12 flex items-center justify-center transition-all duration-300"
              style={{ 
                background: background,
                minWidth: '800px',
                minHeight: '600px'
              }}
            >
              
              {/* Browser Frame */}
              {selectedFrame === 'browser' && (
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-3xl transform transition-transform hover:scale-[1.01]">
                  <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="flex-1 mx-4 bg-white h-6 rounded-md shadow-inner"></div>
                  </div>
                  <img src={uploadedImage} alt="Preview" className="w-full h-auto block" />
                </div>
              )}

              {/* Phone Frame */}
              {selectedFrame === 'phone' && (
                <div className="bg-black rounded-[3rem] p-3 shadow-2xl w-[320px] mx-auto border-4 border-gray-800">
                  <div className="bg-black w-full h-full rounded-[2.5rem] overflow-hidden border border-gray-800 relative">
                     {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
                    <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Glass Frame */}
              {selectedFrame === 'glass' && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl w-full max-w-3xl relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <img src={uploadedImage} alt="Preview" className="w-full h-auto rounded-lg shadow-lg relative z-10" />
                </div>
              )}

              {/* None (Plain) */}
              {selectedFrame === 'none' && (
                <img src={uploadedImage} alt="Preview" className="w-full max-w-3xl rounded-lg shadow-2xl" />
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageBuilder;
