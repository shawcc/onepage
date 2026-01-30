import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { mockTemplates } from '../data/mockTemplates'
import { Copy, ArrowLeft, ChevronDown, ChevronRight, Send, Sparkles, Settings, MessageSquare, Image as ImageIcon, Star, Download, Globe, ShieldCheck } from 'lucide-react'
import ImageBuilder from '../components/ImageBuilder'

// --- Helper Components ---

// Collapsible Section for Manual Settings
const SidebarSection = ({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
  <div className="border-b last:border-b-0 border-gray-100">
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
    >
      <span className="font-semibold text-gray-700 text-sm">{title}</span>
      {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
    </button>
    {isOpen && <div className="p-4 bg-gray-50 space-y-4 border-t border-gray-100">{children}</div>}
  </div>
)

// Chat Message Component
const ChatMessage = ({ role, content }: { role: 'user' | 'assistant', content: string }) => (
  <div className={`flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
    <div className={`
      max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap
      ${role === 'user' 
        ? 'bg-blue-600 text-white rounded-br-none' 
        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}
    `}>
      {role === 'assistant' && (
        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Sparkles size={12} />
          AI Designer
        </div>
      )}
      {content}
    </div>
  </div>
)

// --- Main Editor Component ---

const Editor: React.FC = () => {
  const { templateId } = useParams()
  const location = useLocation()
  
  const [templateData, setTemplateData] = useState<any>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  
  // UI State
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat')
  const [openSection, setOpenSection] = useState<string>('appInfo')
  const [showImageBuilder, setShowImageBuilder] = useState(false)
  const [currentImageTarget, setCurrentImageTarget] = useState<string | null>(null)
  
  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: '你好！我是你的智能设计助手。我可以帮你撰写专业的应用市场介绍文案。\n\n请告诉我：\n1. 你的应用主要解决什么问题？\n2. 目标用户是谁？\n3. 有什么核心功能亮点？' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize Data
  useEffect(() => {
    if (location.state && location.state.generatedData) {
      setTemplateData(location.state.generatedData)
    } else if (templateId) {
      const template = mockTemplates.find(t => t.id === templateId)
      if (template) {
        setTemplateData(JSON.parse(JSON.stringify(template.initialData)))
      } else {
        setTemplateData(JSON.parse(JSON.stringify(mockTemplates[0].initialData)))
      }
    } else {
        setTemplateData(JSON.parse(JSON.stringify(mockTemplates[0].initialData)))
    }
  }, [templateId, location.state])

  // --- Image Update Logic ---
  const handleImageUpdate = (newImageUrl: string) => {
    // Logic to update specific image fields based on currentImageTarget
    if (currentImageTarget?.startsWith('media-')) {
        const index = parseInt(currentImageTarget.split('-')[1])
        const newMedia = [...templateData.media]
        newMedia[index] = { ...newMedia[index], url: newImageUrl }
        setTemplateData({ ...templateData, media: newMedia })
    }
  }

  // --- AI Logic (Real + Mock Fallback) ---
  const processAICommand = async (text: string) => {
    setIsTyping(true)
    
    // Check if we have backend connectivity (Basic check)
    // For now, we will try to fetch. If it fails or returns mock, we use local logic.
    try {
        const response = await fetch('/api/generate-marketing-copy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: text,
                context: JSON.stringify(templateData) // Send current state as context
            })
        })

        if (response.ok) {
            const data = await response.json()
            if (data.copy && !data.mock) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.copy }])
                setIsTyping(false)
                return
            }
        }
    } catch (e) {
        console.warn("Backend AI failed, falling back to local logic", e)
    }

    // Fallback to local logic (same as before)
    setTimeout(() => {
      let response = ""
      const newData = JSON.parse(JSON.stringify(templateData))
      let hasChanges = false

      // 0. Evaluation Mode (New)
      if (text.includes('评价') || text.includes('建议') || text.includes('review')) {
         response = `🔍 **详情页质量评估报告**\n\n1. **标题吸引力 (8/10)**: 标题清晰，但建议加入核心价值点，例如"变更管理 - 提升项目审批效率 30%"。\n2. **视觉丰富度 (6/10)**: 截图数量不足，建议添加展示"配置流程"的动图。\n3. **信任感 (7/10)**: 已有官方认证，但缺少客户证言或具体的数据案例。\n\n💡 **改进建议**: 尝试添加一段关于"如何帮助团队减少沟通成本"的具体描述。`
      }

      // Optimize Description
      else if (text.includes('介绍') || text.includes('description') || text.includes('文案')) {
          newData.tabs.overview.summary = "Looking to streamline your workflow? Our app provides the ultimate solution for teams of all sizes.\n\n### Why choose us?\n\n* **Seamless Integration**: Connects instantly with your existing tools.\n* **Real-time Analytics**: Make data-driven decisions with our advanced dashboard.\n* **Secure & Reliable**: Enterprise-grade security to keep your data safe.\n\nStart your free trial today and experience the difference."
          response = "已为你生成了一段通用的高转化应用介绍。你可以根据具体功能再微调。"
          hasChanges = true
      }
      
      // Optimize Features
      else if (text.includes('功能') || text.includes('feature')) {
          newData.tabs.overview.features = [
              { title: "Smart Automation", description: "Save time by automating repetitive tasks with our drag-and-drop builder." },
              { title: "Advanced Reporting", description: "Gain insights with customizable reports and export options." },
              { title: "Team Collaboration", description: "Comment, tag, and share updates in real-time." }
          ]
          response = "已为你生成了三个核心功能亮点，强调了自动化、报表和协作。"
          hasChanges = true
      }

      // Optimize Name/Tagline
      else if (text.includes('名称') || text.includes('标题') || text.includes('name')) {
          newData.appInfo.tagline = "The #1 Rated App for Productivity and Team Success"
          response = "已优化了应用的 Slogan，使其更具吸引力。"
          hasChanges = true
      }

      // Fallback
      if (!hasChanges && !response) {
         response = "我是你的详情页撰写专家。我可以帮你：\n\n1. **评价当前页面**：发送'帮我评价一下这个页面'。\n2. **撰写高转化文案**：发送'优化产品介绍'。\n3. **生成功能亮点**：发送'生成功能列表'。"
      }

      if (hasChanges) {
          setTemplateData(newData)
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1000)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const userText = inputValue
    setMessages(prev => [...prev, { role: 'user', content: userText }])
    setInputValue('')
    processAICommand(userText)
  }
  
  const triggerAIOptimize = (prompt: string) => {
      setInputValue(prompt)
      // For demo, we just populate the input. User sends it manually or we could auto-send.
  }

  // --- Copy Logic ---
  const handleCopyHtml = () => {
    if (previewRef.current && templateData) {
      const theme = templateData.theme;
      const wrapperStyle = `
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background-color: ${theme.backgroundColor};
        color: ${theme.textColor};
        padding: 40px;
        width: 100%;
        box-sizing: border-box;
      `.replace(/\s+/g, ' ').trim();

      const htmlContent = `<div style="${wrapperStyle}">${previewRef.current.innerHTML}</div>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([previewRef.current.innerText], { type: 'text/plain' });
      const data = [new ClipboardItem({ "text/html": blob, "text/plain": textBlob })];

      navigator.clipboard.write(data).then(() => {
        alert('🎉 已成功复制！\n\n你可以直接粘贴到 Monday/Jira 的应用描述编辑器中。')
      }, (err) => {
        console.error('Could not copy text: ', err);
        alert('复制失败，请尝试手动全选复制。')
      });
    }
  }

  // --- Save Logic (Supabase) ---
  const handleSaveToCloud = async () => {
      // Basic check for Supabase config
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
          alert("无法连接数据库：请检查 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 配置。")
          return
      }

      // Dynamic import to avoid bundling issues if supabase is not set up
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      try {
          const { data, error } = await supabase
              .from('projects')
              .insert([
                  { 
                      name: templateData.appInfo.name || 'Untitled Project', 
                      data: templateData,
                      // Store a simple identifier since we don't have real user UUIDs
                      owner_code: 'magic-user' 
                  }
              ])
              .select()

          if (error) throw error

          alert('✅ 项目已保存到云端！')
      } catch (err: any) {
          console.error('Save failed:', err)
          alert('保存失败: ' + (err.message || '未知错误'))
      }
  }

  // --- Save Logic (Supabase) ---
  const handleSaveToCloud = async () => {
      // Basic check for Supabase config
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
          alert("无法连接数据库：请检查 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 配置。")
          return
      }

      // Dynamic import to avoid bundling issues if supabase is not set up
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      try {
          const { data, error } = await supabase
              .from('projects')
              .insert([
                  { 
                      name: templateData.appInfo.name || 'Untitled Project', 
                      data: templateData,
                      // Store a simple identifier since we don't have real user UUIDs
                      owner_code: 'magic-user' 
                  }
              ])
              .select()

          if (error) throw error

          alert('✅ 项目已保存到云端！')
      } catch (err: any) {
          console.error('Save failed:', err)
          alert('保存失败: ' + (err.message || '未知错误'))
      }
  }

  if (!templateData) return <div className="flex items-center justify-center h-screen text-gray-500">正在加载设计引擎...</div>

  const { theme } = templateData;

  // --- Layout Renderers ---
  
  // New Editable Wrapper Component
  const EditableField = ({ section, label, children, isActive, onClick }: { section: string, label: string, children: React.ReactNode, isActive: boolean, onClick: (s: string) => void }) => (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(section); }}
      className={`
        relative group cursor-pointer transition-all duration-200 border-2 border-transparent rounded-lg
        ${isActive ? 'border-blue-500 bg-blue-50/10' : 'hover:border-blue-300 hover:bg-blue-50/5'}
      `}
    >
      {children}
      <div className={`
        absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none transition-opacity z-10 shadow-sm
        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        Edit {label}
      </div>
    </div>
  )

  // Marketplace App Listing Layout
  const MarketplaceLayout = () => {
    const { appInfo, media, tabs, sidebar } = templateData
    
    return (
        <div style={{ 
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            color: theme?.textColor || '#172B4D',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            {/* 1. Header Section */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'flex-start' }}>
                {/* App Icon */}
                <EditableField section="appInfo" label="Info" isActive={openSection === 'appInfo'} onClick={setOpenSection}>
                    <div style={{ 
                        width: '96px', height: '96px', borderRadius: '16px', 
                        backgroundColor: theme.secondaryColor, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '48px', flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                        {appInfo.icon}
                    </div>
                </EditableField>
                
                {/* App Details */}
                <div style={{ flex: 1 }}>
                    <EditableField section="appInfo" label="Title & Tagline" isActive={openSection === 'appInfo'} onClick={setOpenSection}>
                        <div className="p-2 -m-2">
                            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', lineHeight: '1.2' }}>
                                {appInfo.name}
                            </h1>
                            <p style={{ fontSize: '16px', color: '#5E6C84', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                                {appInfo.tagline}
                            </p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#5E6C84' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ display: 'flex', color: '#FFAB00' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < Math.floor(appInfo.rating) ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <span style={{ fontWeight: '600', color: '#172B4D' }}>{appInfo.rating}</span>
                                    <span>({appInfo.reviewCount} reviews)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Download size={14} />
                                    <span>{appInfo.installCount} installs</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Globe size={14} />
                                    <span>by <span style={{ color: theme.primaryColor, fontWeight: '500' }}>{appInfo.vendor}</span></span>
                                </div>
                            </div>
                        </div>
                    </EditableField>
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '160px' }}>
                    <button style={{ 
                        backgroundColor: theme.primaryColor, color: 'white', 
                        padding: '10px 20px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold',
                        border: 'none', cursor: 'pointer', textAlign: 'center'
                    }}>
                        Get it now
                    </button>
                    <button style={{ 
                        backgroundColor: 'transparent', color: theme.primaryColor, 
                        padding: '8px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '500',
                        border: 'none', cursor: 'pointer', textAlign: 'center'
                    }}>
                        Try it free
                    </button>
                </div>
            </div>

            {/* 2. Media Gallery (Carousel Mock) */}
            <EditableField section="media" label="Screenshots" isActive={openSection === 'media'} onClick={setOpenSection}>
                <div style={{ marginBottom: '40px', overflowX: 'auto', display: 'flex', gap: '16px', paddingBottom: '16px', padding: '16px', margin: '-16px -16px 24px -16px' }}>
                    {media.map((item: any, idx: number) => (
                        <img 
                            key={idx}
                            src={item.url} 
                            alt={`Screenshot ${idx + 1}`}
                            style={{ 
                                height: '250px', borderRadius: '8px', 
                                border: '1px solid #DFE1E6',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                flexShrink: 0
                            }} 
                        />
                    ))}
                </div>
            </EditableField>

            {/* 3. Navigation Tabs */}
            <div style={{ borderBottom: '2px solid #EBECF0', marginBottom: '32px', display: 'flex', gap: '32px' }}>
                <div style={{ paddingBottom: '12px', borderBottom: `3px solid ${theme.primaryColor}`, fontWeight: '600', color: theme.primaryColor, cursor: 'pointer', marginBottom: '-2px' }}>
                    Overview
                </div>
                <div style={{ paddingBottom: '12px', color: '#5E6C84', cursor: 'pointer', fontWeight: '500' }}>
                    Reviews
                </div>
                <div style={{ paddingBottom: '12px', color: '#5E6C84', cursor: 'pointer', fontWeight: '500' }}>
                    Pricing
                </div>
                <div style={{ paddingBottom: '12px', color: '#5E6C84', cursor: 'pointer', fontWeight: '500' }}>
                    Support
                </div>
            </div>

            {/* 4. Main Content Layout (Left + Sidebar) */}
            <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
                
                {/* Left Column: Description & Features */}
                <div style={{ flex: 1 }}>
                    
                    {/* Summary / Description */}
                    <EditableField section="overview" label="Description" isActive={openSection === 'overview'} onClick={setOpenSection}>
                        <div style={{ marginBottom: '40px', fontSize: '16px', lineHeight: '1.7', color: '#172B4D', whiteSpace: 'pre-wrap', padding: '8px', margin: '-8px' }}>
                            {tabs.overview.summary}
                        </div>
                    </EditableField>

                    {/* Features List */}
                    <EditableField section="features" label="Features" isActive={openSection === 'features'} onClick={setOpenSection}>
                        <div style={{ padding: '8px', margin: '-8px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#172B4D' }}>
                                Key Features
                            </h3>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                {tabs.overview.features.map((feature: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ 
                                            width: '24px', height: '24px', borderRadius: '50%', 
                                            backgroundColor: '#E3FCEF', color: '#006644',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, marginTop: '2px'
                                        }}>
                                            <ShieldCheck size={14} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{feature.title}</h4>
                                            <p style={{ fontSize: '14px', color: '#5E6C84', margin: 0, lineHeight: '1.5' }}>{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </EditableField>
                </div>

                {/* Right Column: Sidebar Info */}
                <div style={{ width: '280px', flexShrink: 0 }}>
                    {sidebar.map((section: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '32px' }}>
                            <h4 style={{ 
                                fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#5E6C84', 
                                marginBottom: '16px', letterSpacing: '0.5px' 
                            }}>
                                {section.title}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {section.items.map((item: any, iIdx: number) => (
                                    <div key={iIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: '#5E6C84' }}>{item.label}</span>
                                        {item.href ? (
                                            <a href={item.href} style={{ color: theme.primaryColor, textDecoration: 'none', fontWeight: '500' }}>
                                                {item.value}
                                            </a>
                                        ) : (
                                            <span style={{ color: '#172B4D', fontWeight: '500' }}>{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    {/* Badge Example */}
                    {appInfo.badge && (
                        <div style={{ 
                            padding: '16px', backgroundColor: '#F4F5F7', borderRadius: '8px', 
                            display: 'flex', alignItems: 'center', gap: '12px' 
                        }}>
                            <ShieldCheck size={24} color={theme.primaryColor} />
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{appInfo.badge}</div>
                                <div style={{ fontSize: '12px', color: '#5E6C84' }}>Security & Reliability</div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
  }

  // Feishu / Lark App Listing Layout
  const FeishuLayout = () => {
    const { appInfo, media, tabs, sidebar } = templateData
    
    return (
        <div style={{ 
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            color: theme?.textColor || '#1f2329',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            {/* 1. Split Header Section */}
            <div style={{ display: 'flex', gap: '40px', padding: '40px', borderBottom: '1px solid #dee0e3' }}>
                
                {/* Left: App Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <EditableField section="appInfo" label="Info" isActive={openSection === 'appInfo'} onClick={setOpenSection}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{ 
                                width: '64px', height: '64px', borderRadius: '12px', 
                                backgroundColor: theme.primaryColor, 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '32px', color: 'white', flexShrink: 0
                            }}>
                                {appInfo.icon}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1f2329' }}>{appInfo.name}</h1>
                                    {appInfo.badge && (
                                        <span style={{ backgroundColor: '#e8ffea', color: '#00b365', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
                                            {appInfo.badge}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: '14px', color: '#646a73', lineHeight: '1.6', marginBottom: '24px' }}>
                            {appInfo.tagline}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#8f959e' }}>安装数</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2329' }}>{appInfo.installCount}</div>
                            </div>
                            <div style={{ width: '1px', height: '24px', backgroundColor: '#dee0e3' }}></div>
                             <div>
                                <div style={{ fontSize: '12px', color: '#8f959e' }}>评分</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2329', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {appInfo.rating} <Star size={12} fill="#ffc107" color="#ffc107"/>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ 
                                backgroundColor: theme.primaryColor, color: 'white', 
                                padding: '8px 32px', borderRadius: '6px', fontSize: '14px', fontWeight: '500',
                                border: 'none', cursor: 'pointer'
                            }}>
                                添加插件
                            </button>
                            <button style={{ 
                                backgroundColor: 'white', color: '#1f2329', 
                                padding: '8px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500',
                                border: '1px solid #dee0e3', cursor: 'pointer'
                            }}>
                                ...
                            </button>
                        </div>
                    </EditableField>
                </div>

                {/* Right: Banner Image */}
                <div style={{ flex: 1 }}>
                     <EditableField section="media" label="Banner" isActive={openSection === 'media'} onClick={setOpenSection}>
                        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '260px', border: '1px solid #dee0e3' }}>
                             {media[0] ? (
                                <img src={media[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Banner" />
                             ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f6f7' }} />
                             )}
                        </div>
                    </EditableField>
                </div>
            </div>

            {/* 2. Tabs */}
            <div style={{ padding: '0 40px', borderBottom: '1px solid #dee0e3', display: 'flex', gap: '32px' }}>
                <div style={{ padding: '16px 0', borderBottom: '2px solid #1f2329', fontWeight: '600', color: '#1f2329', cursor: 'pointer', fontSize: '14px' }}>
                    概述
                </div>
                <div style={{ padding: '16px 0', color: '#646a73', cursor: 'pointer', fontSize: '14px' }}>
                    权限
                </div>
            </div>

            {/* 3. Main Content Layout */}
            <div style={{ display: 'flex', padding: '40px', gap: '40px' }}>
                
                {/* Left: Description Content */}
                <div style={{ flex: 3 }}>
                    <EditableField section="overview" label="Overview" isActive={openSection === 'overview'} onClick={setOpenSection}>
                         <div style={{ whiteSpace: 'pre-wrap', color: '#1f2329', lineHeight: '1.8', fontSize: '15px' }}>
                            {tabs.overview.summary}
                        </div>
                    </EditableField>

                    <EditableField section="features" label="Features" isActive={openSection === 'features'} onClick={setOpenSection}>
                        <div style={{ marginTop: '40px', display: 'grid', gap: '40px' }}>
                            {tabs.overview.features.map((feature: any, idx: number) => (
                                <div key={idx} style={{ 
                                    display: 'flex', gap: '24px', 
                                    flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse',
                                    alignItems: 'center' 
                                }}>
                                    <div style={{ flex: 1, height: '200px', backgroundColor: '#f5f6f7', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee0e3' }}>
                                         <img src={`https://placehold.co/400x300/f5f6f7/a0a0a0?text=Feature+${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2329' }}>{feature.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#646a73', lineHeight: '1.6', margin: 0 }}>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </EditableField>
                </div>

                {/* Right: Sidebar */}
                <div style={{ flex: 1 }}>
                     {sidebar.map((section: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: '32px', border: '1px solid #dee0e3', borderRadius: '8px', padding: '16px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2329', marginBottom: '16px' }}>
                                {section.title}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {section.items.map((item: any, iIdx: number) => (
                                    <div key={iIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: '#646a73' }}>{item.label}</span>
                                        {item.href ? (
                                            <a href={item.href} style={{ color: theme.primaryColor, textDecoration: 'none' }}>
                                                {item.value}
                                            </a>
                                        ) : (
                                            <span style={{ color: '#1f2329' }}>{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
  }

  // Placeholder for old layout if needed (kept for safety, but data is different now)
  const LandingPageLayout = () => <div>Please select a Marketplace Template</div>

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link to="/templates" className="text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            <ArrowLeft size={18} /> <span className="text-sm font-medium">返回模板库</span>
          </Link>
          <div className="h-5 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h1 className="font-bold text-gray-800">OnePage AI Editor</h1>
          </div>
        </div>
        <button 
          onClick={handleSaveToCloud}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium active:scale-95 shadow-lg shadow-blue-200 mr-4"
        >
          <Sparkles size={16} />
          保存项目
        </button>
        <button 
          onClick={handleCopyHtml}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium active:scale-95 shadow-lg shadow-gray-200"
        >
          <Copy size={16} />
          复制 HTML (Copy)
        </button>
      </header>

      <div className="flex-grow flex overflow-hidden">
        
        {/* Left Panel: Chat & Settings */}
        <div className="w-[400px] bg-white border-r flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            
            {/* Tab Switcher */}
            <div className="flex p-2 gap-1 border-b">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'chat' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <MessageSquare size={16} />
                    AI 助手
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Settings size={16} />
                    手动微调
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-hidden relative">
                
                {/* Chat View */}
                {activeTab === 'chat' && (
                    <div className="absolute inset-0 flex flex-col bg-gray-50/50">
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <ChatMessage key={idx} role={msg.role} content={msg.content} />
                            ))}
                            {isTyping && (
                                <div className="flex justify-start mb-4 animate-fade-in">
                                     <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-gray-400 text-sm">
                                        <Sparkles size={14} className="animate-spin" />
                                        Writing...
                                     </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                            <div className="relative flex items-center">
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="描述需求，例如：'优化功能列表'..."
                                    className="w-full bg-gray-100 border-0 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {['帮我写一段吸引人的应用简介', '生成3个核心功能亮点', '优化Slogan'].map((hint, i) => (
                                    <button 
                                        key={i}
                                        type="button"
                                        onClick={() => { setInputValue(hint); }}
                                        className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors border border-transparent hover:border-gray-300"
                                    >
                                        {hint}
                                    </button>
                                ))}
                            </div>
                        </form>
                    </div>
                )}

                {/* Settings View */}
                {activeTab === 'settings' && (
                    <div className="absolute inset-0 overflow-y-auto">
                        
                        {/* 1. App Info */}
                        <SidebarSection 
                            title="📌 应用信息 (App Info)" 
                            isOpen={openSection === 'appInfo'} 
                            onToggle={() => setOpenSection(openSection === 'appInfo' ? '' : 'appInfo')}
                        >
                            <div>
                                <label className="input-label">应用名称</label>
                                <input 
                                    type="text" 
                                    value={templateData.appInfo?.name || ''}
                                    onChange={(e) => setTemplateData({...templateData, appInfo: {...templateData.appInfo, name: e.target.value}})}
                                    className="input-field font-bold"
                                />
                            </div>
                            <div>
                                <label className="input-label">一句话标语 (Tagline)</label>
                                <textarea 
                                    value={templateData.appInfo?.tagline || ''}
                                    onChange={(e) => setTemplateData({...templateData, appInfo: {...templateData.appInfo, tagline: e.target.value}})}
                                    className="input-field min-h-[60px]"
                                />
                            </div>
                            <div>
                                <label className="input-label">开发商 (Vendor)</label>
                                <input 
                                    type="text" 
                                    value={templateData.appInfo?.vendor || ''}
                                    onChange={(e) => setTemplateData({...templateData, appInfo: {...templateData.appInfo, vendor: e.target.value}})}
                                    className="input-field"
                                />
                            </div>
                        </SidebarSection>

                        {/* 2. Media */}
                        <SidebarSection 
                            title="🖼️ 图片展示 (Screenshots)" 
                            isOpen={openSection === 'media'} 
                            onToggle={() => setOpenSection(openSection === 'media' ? '' : 'media')}
                        >
                            <div className="space-y-4">
                                {templateData.media?.map((item: any, idx: number) => (
                                    <div key={idx}>
                                        <label className="input-label mb-2 flex justify-between items-center">
                                            <span>图片 {idx + 1} URL</span>
                                            <button 
                                                onClick={() => { setCurrentImageTarget(`media-${idx}`); setShowImageBuilder(true); }}
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1 font-medium"
                                            >
                                                <ImageIcon size={12} /> 替换
                                            </button>
                                        </label>
                                        <input 
                                            type="text" 
                                            value={item.url}
                                            onChange={(e) => {
                                                const newMedia = [...templateData.media];
                                                newMedia[idx].url = e.target.value;
                                                setTemplateData({...templateData, media: newMedia});
                                            }}
                                            className="input-field text-xs text-gray-500 font-mono"
                                        />
                                        <div className="mt-2 h-20 bg-gray-100 rounded overflow-hidden relative group">
                                            <img src={item.url} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SidebarSection>

                        {/* 3. Description */}
                        <SidebarSection 
                            title="📝 应用介绍 (Overview)" 
                            isOpen={openSection === 'overview'} 
                            onToggle={() => setOpenSection(openSection === 'overview' ? '' : 'overview')}
                        >
                            <div className="flex justify-end mb-2">
                                <button 
                                    onClick={() => triggerAIOptimize("帮我写一段吸引人的应用简介")}
                                    className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded hover:bg-purple-100 flex items-center gap-1 font-medium transition-colors"
                                >
                                    <Sparkles size={12} /> AI 撰写介绍
                                </button>
                            </div>
                            <div>
                              <textarea 
                                  value={templateData.tabs?.overview.summary || ''}
                                  onChange={(e) => setTemplateData({...templateData, tabs: {...templateData.tabs, overview: {...templateData.tabs.overview, summary: e.target.value}}})}
                                  className="input-field min-h-[200px] font-mono text-sm"
                                  placeholder="支持 Markdown 格式..."
                              />
                            </div>
                        </SidebarSection>

                        {/* 4. Features */}
                        <SidebarSection 
                            title="✨ 核心功能 (Features)" 
                            isOpen={openSection === 'features'} 
                            onToggle={() => setOpenSection(openSection === 'features' ? '' : 'features')}
                        >
                             <div className="flex justify-end mb-2">
                                <button 
                                    onClick={() => triggerAIOptimize("生成3个核心功能亮点")}
                                    className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded hover:bg-purple-100 flex items-center gap-1 font-medium transition-colors"
                                >
                                    <Sparkles size={12} /> AI 生成功能
                                </button>
                            </div>
                            <div className="space-y-4">
                                {templateData.tabs?.overview.features.map((feature: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-100">
                                        <input 
                                            type="text" 
                                            value={feature.title}
                                            onChange={(e) => {
                                                const newFeatures = [...templateData.tabs.overview.features];
                                                newFeatures[idx].title = e.target.value;
                                                setTemplateData({...templateData, tabs: {...templateData.tabs, overview: {...templateData.tabs.overview, features: newFeatures}}});
                                            }}
                                            className="input-field mb-2 font-bold"
                                            placeholder="功能标题"
                                        />
                                        <textarea 
                                            value={feature.description}
                                            onChange={(e) => {
                                                const newFeatures = [...templateData.tabs.overview.features];
                                                newFeatures[idx].description = e.target.value;
                                                setTemplateData({...templateData, tabs: {...templateData.tabs, overview: {...templateData.tabs.overview, features: newFeatures}}});
                                            }}
                                            className="input-field min-h-[60px] text-xs"
                                            placeholder="功能描述"
                                        />
                                    </div>
                                ))}
                            </div>
                        </SidebarSection>
                        
                        <div className="p-4 text-center text-xs text-gray-400">
                            更多设置请使用 AI 助手进行修改
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-grow bg-gray-200/50 p-8 overflow-y-auto flex justify-center backdrop-blur-sm">
          <div className="w-full max-w-[1200px] flex flex-col items-center">
            
            {/* The Actual Preview Content */}
            <div 
                className="bg-white shadow-2xl min-h-[800px] w-full animate-fade-in transition-all duration-500 ease-in-out rounded-xl overflow-hidden" 
                ref={previewRef}
            >
                {templateData.layout === 'feishu' ? <FeishuLayout /> : (templateData.layout === 'marketplace' ? <MarketplaceLayout /> : <LandingPageLayout />)}
            </div>
            
            <p className="text-gray-400 mt-6 text-sm mb-12 text-center">
                — 预览区域结束，以上内容均可直接复制 —
            </p>
          </div>
        </div>
      </div>

      {/* Image Builder Modal */}
      {showImageBuilder && (
        <ImageBuilder 
          initialImage=""
          onSave={handleImageUpdate}
          onClose={() => setShowImageBuilder(false)}
        />
      )}
    </div>
  )
}

export default Editor
