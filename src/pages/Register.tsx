import React from 'react'

const Register: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">注册</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">姓名</label>
            <input type="text" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <input type="email" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <input type="password" className="w-full border rounded p-2" />
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            注册
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
