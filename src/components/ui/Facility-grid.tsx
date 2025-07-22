"use client"

import { Search } from "lucide-react"
import type { Facility } from "../../types/Facility"
import { FacilityCard } from "./facility-card"

interface FacilityGridProps {
  facilities: Facility[]
}

export function FacilityGrid({ facilities }: FacilityGridProps) {
  if (facilities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Search className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sân nào</h3>
        <p className="text-gray-600">Thử điều chỉnh từ khóa tìm kiếm</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <FacilityCard key={facility.FacilityID} facility={facility} />
      ))}
    </div>
  )
}
