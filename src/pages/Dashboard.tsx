import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">用户工作台</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">我的项目</h2>
          <div className="border p-4 rounded">项目列表（开发中）</div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">数据分析</h2>
          <div className="border p-4 rounded">统计数据（开发中）</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
