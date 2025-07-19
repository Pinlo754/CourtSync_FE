import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 App is working!
        </h1>
        <p className="text-gray-600 mb-4">
          Nếu bạn thấy trang này, có nghĩa là ứng dụng đã hoạt động bình thường.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ React Router hoạt động</p>
          <p className="text-sm text-gray-500">✅ TypeScript hoạt động</p>
          <p className="text-sm text-gray-500">✅ Tailwind CSS hoạt động</p>
        </div>
        <a 
          href="/" 
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  );
};

export default TestPage; 