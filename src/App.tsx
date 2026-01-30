import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Templates from './pages/Templates'
import Knowledge from './pages/Knowledge'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <header className="border-b p-4 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
        <div className="font-bold text-xl text-gray-900 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-serif text-lg">O</span>
            OnePage
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/knowledge" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">营销知识库</Link>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="space-x-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">登录</Link>
            <Link to="/register" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">免费注册</Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:templateId" element={<Editor />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="border-t p-4 text-center text-gray-500 text-sm">
        &copy; 2024 ISV智能产品页设计工具. 版权所有.
      </footer>
    </div>
  )
}

export default App
