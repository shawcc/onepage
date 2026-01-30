import React from 'react'
import { Link } from 'react-router-dom'
import { mockTemplates } from '../data/mockTemplates'
import { ArrowRight, Layout, Zap, Briefcase, Wand2 } from 'lucide-react'

const Templates: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">模板库</h1>
        <p className="text-gray-600">从我们精心设计的高转化率模板中选择，快速开始您的设计。</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockTemplates.map((template) => (
          <div key={template.id} className="border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white group">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img 
                src={template.thumbnail} 
                alt={template.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Zap size={12} fill="currentColor" />
                转化分: {template.conversionScore}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  template.category === 'marketplace' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {template.category === 'marketplace' ? '插件/应用' : '其他'}
                </span>
                {template.tags && template.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Briefcase size={10} /> {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                {template.description}
              </p>
              
              <Link 
                to={`/editor/${template.id}`}
                className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                使用此模板
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Templates
