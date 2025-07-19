import React from 'react'
import Header from '../../components/sections/Header'
import { StaffContent } from '../../features/staff/components/StaffContent'


export const StaffPage = () => {
  return (
    <div className="h-screen bg-gray-50 overflow-y-scroll scrollbar-hide px-8">
        <Header />
        <div className="w-full px-4 py-8">
            <StaffContent />
        </div>
    </div>
  )
}