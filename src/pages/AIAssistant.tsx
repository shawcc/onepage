import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react'

// Chat Message Component
const ChatMessage = ({ role, content }: { role: 'user' | 'assistant', content: string }) => (
  <div className={`flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
    <div className={`flex gap-4 max-w-[80%] ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${role === 'assistant' ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {role === 'assistant' ? <Sparkles size={18} /> : <div className="font-bold">U</div>}
        </div>

        {/* Bubble */}
        <div className={`
            p-5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
            ${role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}
        `}>
        {role === 'assistant' && (
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            AI 详情页专家
            </div>
        )}
        {content}
        </div>
    </div>
  </div>
)

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: '你好！我是 OnePage 详情页专家。\n\n我可以帮你：\n1. **撰写文案**：输入产品特点，我来生成高转化介绍。\n2. **优化建议**：把现有文案发给我，我来点评优化。\n3. **功能提炼**：告诉我产品是做什么的，我帮你总结核心卖点。\n\n请告诉我你的需求吧！' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const processAICommand = async (text: string) => {
    setIsTyping(true)
    
    try {
        const response = await fetch('/api/generate-marketing-copy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: text,
                context: "General Marketing Copywriting Mode" 
            })
        })

        if (response.ok) {
            const data = await response.json()
            if (data.copy) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.copy }])
                setIsTyping(false)
                return
            }
        }
    } catch (e) {
        console.warn("Backend AI failed", e)
    }

    // Fallback logic
    setTimeout(() => {
      let response = "抱歉，我现在连接不上大脑（后端服务），无法进行深度思考。请检查网络或稍后再试。"
      
      if (text.includes('你好') || text.includes('hi')) {
          response = "你好！请问有什么可以帮你的？无论是Slogan设计还是功能点提炼，我都在行。"
      } else if (text.includes('文案') || text.includes('介绍')) {
          response = "好的，为你生成一段通用模板：\n\n**[产品名称] - 重新定义您的工作流**\n\n不再为繁琐的流程头疼。我们的产品通过智能自动化，帮助您节省 30% 的工作时间。立即体验，开启高效办公新时代。\n\n(提示：配置 DeepSeek API 后我可以生成更精准的内容)"
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

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex-grow overflow-y-auto p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
            {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 text-sm ml-14 mb-4">
                    <Sparkles size={16} className="animate-spin text-purple-500" />
                    正在思考...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-6 bg-white border-t">
        <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入你的产品描述，或者问我如何写出更好的文案..."
                    className="w-full bg-gray-100 border-0 rounded-2xl px-6 py-4 pr-14 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-base shadow-inner"
                />
                <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-2 top-2 p-2 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
            <div className="mt-4 flex justify-center gap-3">
                {['优化这段文案', '为CRM系统写个Slogan', '如何提高转化率？'].map((hint, i) => (
                    <button 
                        key={i}
                        onClick={() => { setInputValue(hint); }}
                        className="text-xs text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                        {hint}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
