import React from 'react'
import Header from '../../components/sections/Header'
import { AdminContent } from '../../features/admin/components/AdminContent'

export const AdminPage = () => {
  return (
    <div className="h-screen bg-gray-50 overflow-y-scroll scrollbar-hide px-8">
        <Header />
        <div className="w-full px-4 py-8">
            <AdminContent />
        </div>
    </div>
  )
}