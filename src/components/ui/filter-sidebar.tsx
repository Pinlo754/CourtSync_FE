"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Checkbox } from "./checkbox"
import { Label } from "./label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Slider } from "./slider"
import type { FilterState } from "../../types/Facility"

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const districts = ["Tất cả", "Thủ Đức", "Quận 1", "Quận 3", "Quận 7", "Bình Thạnh", "Gò Vấp"]

const openingTimeOptions = [
  { value: "all", label: "Tất cả" },
  { value: "early", label: "Mở cửa sớm (trước 7:00)" },
  { value: "normal", label: "Mở cửa bình thường (7:00-8:00)" },
  { value: "late", label: "Mở cửa muộn (sau 8:00)" },
]

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handleDistrictChange = (district: string, checked: boolean) => {
    if (district === "Tất cả") {
      onFiltersChange({
        ...filters,
        selectedDistricts: checked ? ["Tất cả"] : [],
      })
    } else {
      const newDistricts = checked
        ? [...filters.selectedDistricts.filter((d) => d !== "Tất cả"), district]
        : filters.selectedDistricts.filter((d) => d !== district)

      onFiltersChange({
        ...filters,
        selectedDistricts: newDistricts,
      })
    }
  }

  const handlePriceRangeChange = (value: [number, number]) => {
    onFiltersChange({
      ...filters,
      priceRange: value,
    })
  }

  const handleCourtsRangeChange = (value: [number, number]) => {
    onFiltersChange({
      ...filters,
      numberOfCourts: value,
    })
  }

  const handleOpeningTimeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      openingTime: value,
    })
  }

  return (
    <div className="w-80 space-y-6">
      {/* Price Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lọc theo giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={200000}
            min={0}
            step={10000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{filters.priceRange[0].toLocaleString("vi-VN")}đ</span>
            <span>{filters.priceRange[1].toLocaleString("vi-VN")}đ</span>
          </div>
        </CardContent>
      </Card>

      {/* Number of Courts Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Số lượng sân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.numberOfCourts}
            onValueChange={handleCourtsRangeChange}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{filters.numberOfCourts[0]} sân</span>
            <span>{filters.numberOfCourts[1]} sân</span>
          </div>
        </CardContent>
      </Card>

      {/* District Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khu vực</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {districts.map((district) => (
            <div key={district} className="flex items-center space-x-2">
              <Checkbox
                id={district}
                checked={filters.selectedDistricts.includes(district)}
                onCheckedChange={(checked) => handleDistrictChange(district, checked as boolean)}
              />
              <Label htmlFor={district} className="text-sm">
                {district}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Opening Time Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Giờ mở cửa</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.openingTime} onValueChange={handleOpeningTimeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {openingTimeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
