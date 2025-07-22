"use client"

import { Input } from "./Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Search } from "lucide-react"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
}

const sortOptions = [
  { value: "name", label: "Tên A-Z" },
  { value: "courts", label: "Số sân nhiều nhất" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
]

export function SearchBar({ searchTerm, onSearchChange, sortBy, onSortChange }: SearchBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm sân cầu lông theo tên, địa chỉ..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 [&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
        />
      </div>

      {/* Sort Dropdown */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full lg:w-64 h-12">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
