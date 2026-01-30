import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Register: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Whitelist of allowed email domains or full addresses
  // In a real app, this might come from a database or env var
  const ALLOWED_USERS = [
    'test@example.com',
    'admin@onepage.com',
    // Allow any email from specific domain
    '@feishu.cn',
    '@bytedance.com'
  ]

  const isAllowed = (email: string) => {
    return ALLOWED_USERS.some(allowed => 
        allowed.startsWith('@') ? email.endsWith(allowed) : email === allowed
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAllowed(email)) {
        setError("抱歉，目前仅限受邀用户注册 (Access Restricted)")
        return
    }

    if (!supabase) {
        setError("Supabase 客户端未初始化，请检查 .env 配置")
        return
    }
    
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      alert("注册成功！请检查邮箱完成验证。")
      navigate('/login')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">注册</h1>
        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
            </div>
        )}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded p-2" 
                required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded p-2" 
                required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
