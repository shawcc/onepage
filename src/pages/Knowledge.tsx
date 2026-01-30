import React, { useState } from 'react'
import { BookOpen, Search, Filter, ArrowRight } from 'lucide-react'

// --- Data (Simulated Database) ---
const KNOWLEDGE_BASE = [
  {
    id: 1,
    title: "高转化率落地页的 5 个关键要素",
    category: "Landing Page",
    summary: "为什么有些页面转化率高达 20% 而其他的只有 2%？深入解析头部、痛点、解决方案、社会认同和 CTA 的黄金法则。",
    content: "1. 头部 (Hero Section)：3秒内说清你是谁、卖什么。\n2. 痛点 (Pain Points)：用客户的语言描述问题。\n3. 解决方案 (Solution)：不仅是功能，更是价值。\n4. 社会认同 (Social Proof)：真实评价胜过千言万语。\n5. 行动号召 (CTA)：清晰、单一、紧迫。",
    tags: ["Conversion", "Design"]
  },
  {
    id: 2,
    title: "FAB 法则：让文案直击人心的秘密",
    category: "Copywriting",
    summary: "Feature (特性) - Advantage (优势) - Benefit (利益)。不要只卖牛排，要卖滋滋作响的声音。",
    content: "Feature: 我们的充电宝有 20000mAh 容量。\nAdvantage: 它可以连续给 iPhone 充电 5 次。\nBenefit: 出差一周也不用担心手机没电，随时随地保持联系。",
    tags: ["Copywriting", "Framework"]
  },
  {
    id: 3,
    title: "SaaS 产品定价页面的心理学技巧",
    category: "Psychology",
    summary: "利用锚定效应、中间选项倾向和稀缺性原则，引导用户选择你最想卖的方案。",
    content: "1. 锚定效应：先展示一个昂贵的企业版，让标准版看起来更划算。\n2. 推荐标记：明确标注'最受欢迎'的选项。\n3. 诱饵选项：设置一个价格接近但功能少得多的基础版，衬托标准版的性价比。",
    tags: ["Pricing", "Psychology"]
  },
  {
    id: 4,
    title: "B2B 落地页信任感建立指南",
    category: "Trust",
    summary: "在没有面对面交流的情况下，如何让企业客户信任你？Logo墙、案例研究和安全认证缺一不可。",
    content: "1. Logo 墙：展示知名客户的 Logo。\n2. 数据实证：'帮助 500+ 企业提升 30% 效率'。\n3. 权威背书：行业协会认证、媒体报道、GDPR 合规徽章。",
    tags: ["B2B", "Trust"]
  },
  {
    id: 5,
    title: "AIDA 模型：经典的营销漏斗",
    category: "Framework",
    summary: "Attention (注意) - Interest (兴趣) - Desire (欲望) - Action (行动)。",
    content: "Attention: 用抓眼球的标题吸引注意。\nInterest: 用有趣的事实或痛点激发兴趣。\nDesire: 展示产品如何改善生活，创造渴望。\nAction: 告诉他们下一步该做什么。",
    tags: ["Marketing", "Funnel"]
  },
  {
    id: 6,
    title: "CTA 按钮设计的 7 个最佳实践",
    category: "Design",
    summary: "颜色、文案、位置、大小……每一个细节都影响点击率。",
    content: "1. 颜色：使用对比色，确保显眼。\n2. 文案：使用动词（'开始免费试用' vs '提交'）。\n3. 空白：按钮周围留白，减少视觉干扰。\n4. 第一人称：'获取我的报告' 比 '获取你的报告' 点击率更高。",
    tags: ["UI/UX", "Conversion"]
  }
]

const Knowledge: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', ...Array.from(new Set(KNOWLEDGE_BASE.map(k => k.category)))]

  const filteredData = KNOWLEDGE_BASE.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">营销知识库</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            汇集经过验证的转化率优化策略、文案技巧和设计原则。不仅是工具，更是方法论。
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="搜索知识点..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-black text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
                  {item.category}
                </span>
                <BookOpen size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                {item.summary}
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
                <button className="text-sm font-medium text-gray-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                  阅读详情 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Filter size={48} className="mx-auto mb-4 opacity-20" />
            <p>没有找到相关内容，换个关键词试试？</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Knowledge
