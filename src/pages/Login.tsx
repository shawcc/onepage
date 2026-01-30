import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { KeyRound } from 'lucide-react'

const Login: React.FC = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  // Get the intended destination from navigation state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const success = signIn(code)
    
    if (success) {
      navigate(from, { replace: true })
    } else {
      setError("无效的访问码 (Invalid Access Code)")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <KeyRound size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">访问控制</h1>
            <p className="text-gray-500 mt-2 text-sm">请输入 Magic Code 以继续访问</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium animate-pulse">
                {error}
            </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-2xl font-mono tracking-wider focus:border-black focus:ring-0 outline-none transition-all placeholder:text-gray-300 uppercase" 
                placeholder="CODE"
                autoFocus
                required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg"
          >
            验证并进入
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
                如需获取访问权限，请联系管理员
            </p>
        </div>
      </div>
    </div>
  )
}

export default Login
