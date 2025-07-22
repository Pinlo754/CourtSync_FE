"use client"

import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/badge"
import { SlidersHorizontal, X } from "lucide-react"
import Header from "../../components/sections/Header"
import { SearchBar } from "../../components/ui/search-bar"
import { FacilityGrid } from "../../components/ui/Facility-grid"
import { FilterSidebar } from "../../components/ui/filter-sidebar"
import banner from "../../assets/banner.jpg"
import useHomeScreen from "./useHomeScreen"

export default function HomePage() {
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    filteredFacilities,
    clearAllFilters,
    hasActiveFilters,
  } = useHomeScreen()

  return (
    <div className="h-screen bg-gray-50 overflow-y-scroll scrollbar-hide px-16">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="relative mb-12">
          <div className="h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden">
            <img
              src={banner}
              alt="Badminton Court Banner"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-end pr-16">
              <div className="text-right text-white">
                <h1 className="text-5xl font-bold mb-4">Badminton<br />Court</h1>
                <a href="/courts">
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl">
                    Đặt sân ngay
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tìm kiếm & Bộ lọc */}
        <div className="mb-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="h-12 px-6">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc
              {hasActiveFilters && <Badge className="ml-2 bg-blue-500">!</Badge>}
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredFacilities.length}</span> sân cầu lông
            </p>
            {(hasActiveFilters || searchTerm) && (
              <Button variant="outline" onClick={clearAllFilters} className="text-blue-600 bg-transparent">
                <X className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.selectedDistricts.map((district) => (
                <Badge key={district} variant="secondary" className="px-3 py-1">
                  {district}
                  <button
                    onClick={() => {
                      const newDistricts = filters.selectedDistricts.filter((d) => d !== district)
                      setFilters({ ...filters, selectedDistricts: newDistricts })
                    }}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.openingTime !== "all" && (
                <Badge variant="secondary" className="px-3 py-1">
                  {{
                    early: "Mở cửa sớm",
                    normal: "Mở cửa bình thường",
                    late: "Mở cửa muộn",
                  }[filters.openingTime]}
                  <button
                    onClick={() => setFilters({ ...filters, openingTime: "all" })}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <FacilityGrid facilities={filteredFacilities} />
          </div>
          {showFilters && (
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          )}
        </div>
      </div>
    </div>
  )
}
