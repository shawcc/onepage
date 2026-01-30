import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Zap, ArrowRight, X, Wand2, Check } from 'lucide-react'
import { mockTemplates, Template } from '../data/mockTemplates'

const Home: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const navigate = useNavigate()

  const handleUseTemplate = () => {
    if (selectedTemplate) {
        navigate(`/editor/${selectedTemplate.id}`)
    }
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      
      {/* Gallery Header */}
      <div className="bg-white border-b py-12 px-6">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">选择一个模板开始</h1>
            <p className="text-gray-500">
                所有模板均经过转化率验证。点击查看详情，或直接开始创作。
            </p>
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTemplates.map((template) => (
            <div 
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col h-full"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img 
                  src={template.thumbnail} 
                  alt={template.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded shadow-sm text-gray-700">
                        {template.category.toUpperCase()}
                    </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                        <Zap size={10} fill="currentColor" />
                        {template.conversionScore}
                    </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{template.description}</p>
                <div className="flex gap-2 flex-wrap">
                    {template.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">#{tag}</span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setSelectedTemplate(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-fade-in">
                
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left: Preview Image (Scrollable) */}
                <div className="w-full md:w-2/3 bg-gray-100 overflow-y-auto max-h-[40vh] md:max-h-full p-8 flex items-start justify-center">
                    <img 
                        src={selectedTemplate.thumbnail} 
                        alt={selectedTemplate.name} 
                        className="w-full max-w-2xl shadow-2xl rounded-lg"
                    />
                </div>

                {/* Right: Info & Action */}
                <div className="w-full md:w-1/3 bg-white p-8 flex flex-col border-l border-gray-100">
                    <div className="mb-6">
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide mb-4">
                            {selectedTemplate.category.toUpperCase()}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedTemplate.name}</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {selectedTemplate.description}
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <Zap size={16} fill="currentColor" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">转化潜力评分: {selectedTemplate.conversionScore}/100</div>
                                    <div className="text-xs text-gray-500">基于 1000+ 成功案例分析</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Layout size={16} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">适用场景</div>
                                    <div className="text-xs text-gray-500">{selectedTemplate.tags?.join(', ')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3">
                        <button 
                            onClick={handleUseTemplate}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                        >
                            <Wand2 size={20} />
                            立即使用 (Remix)
                        </button>
                        <p className="text-center text-xs text-gray-400">
                            点击后将进入 AI 编辑器，可自由修改内容和样式
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}

export default Home
