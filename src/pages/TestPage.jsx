import React from 'react'

const TestPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Test Sayfası</h1>
      <p className="text-gray-600">Bu sayfa çalışıyor!</p>
      <div className="mt-4 p-4 bg-green-100 rounded">
        <p>✅ Routing çalışıyor</p>
        <p>✅ Sayfa yükleniyor</p>
        <p>✅ Sidebar navigation aktif</p>
      </div>
    </div>
  )
}

export default TestPage
