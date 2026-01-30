import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Templates from './pages/Templates'
import Knowledge from './pages/Knowledge'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ImageStudio from './pages/ImageStudio'
import AIAssistant from './pages/AIAssistant'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Sparkles, Image as ImageIcon } from 'lucide-react'

const Navigation = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="border-b p-4 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
      <div className="font-bold text-xl text-gray-900 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-serif text-lg">O</span>
          OnePage
        </Link>
        <div className="hidden md:flex ml-8 gap-6 text-sm font-medium text-gray-600">
            <Link to="/templates" className="hover:text-black">模板库</Link>
            <Link to="/ai-expert" className="hover:text-purple-600 flex items-center gap-1">
                <Sparkles size={14} className="text-purple-500" /> AI 专家
            </Link>
            <Link to="/image-studio" className="hover:text-blue-600 flex items-center gap-1">
                <ImageIcon size={14} className="text-blue-500" /> 配图工具
            </Link>
            <Link to="/knowledge" className="hover:text-black">知识库</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
             <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">工作台</Link>
             <button onClick={handleSignOut} className="text-sm font-medium text-red-600 hover:text-red-700">退出</button>
             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                {user.email?.slice(0, 2).toUpperCase()}
             </div>
          </div>
        ) : (
          <div className="space-x-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">登录</Link>
            <Link to="/register" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">免费注册</Link>
          </div>
        )}
      </div>
    </header>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans text-gray-900">
        <Navigation />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor/:templateId" element={<Editor />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/image-studio" element={<ImageStudio />} />
            <Route path="/ai-expert" element={<AIAssistant />} />
          </Routes>
        </main>

        <footer className="border-t p-4 text-center text-gray-500 text-sm">
          &copy; 2024 ISV智能产品页设计工具. 版权所有.
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
