import React from 'react'

const Knowledge: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">营销知识库</h1>
      <p className="mb-4">学习高转化率设计原则。</p>
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold">FAB 法则</h3>
          <p>特性 (Feature) - 优势 (Advantage) - 利益 (Benefit)</p>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold">信任信号</h3>
          <p>如何有效利用评价和徽章。</p>
        </div>
      </div>
    </div>
  )
}

export default Knowledge
