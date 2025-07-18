"use client"

import { useState, useMemo } from "react"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import banner from "../../assets/banner.jpg"
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  SlidersHorizontal,
  X,
  Heart,
  Clock,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
} from "lucide-react"
import Header from "../../components/sections/Header"

interface Court {
  id: number
  name: string
  location: string
  district: string
  city: string
  rating: number
  price: number
  image: string
  amenities: string[]
  availability: string[]
  distance: number
  type: string
  description: string
  isFavorite: boolean
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("distance")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [courtType, setCourtType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - sân cầu lông Việt Nam
  const [courts, setCourts] = useState<Court[]>([
    {
      id: 1,
      name: "Sân cầu lông Tám Khỏe",
      location: "270 Bưng Ông Thoàn",
      district: "Thủ Đức",
      city: "Hồ Chí Minh",
      rating: 4.8,
      price: 80000,
      image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noGlTVzBu9pc0B-bNexISzDw4Cce7nxTOPZzwFkuFtd0KYLJ7PrKpk1S0d8x4ZnMocHXqhxGyc70WN1o1AEzoW-O1lE7MGoV7MD6zDn-U9b1Di57LUdCkRD6xXuI7kqRNKPE80=s1360-w1360-h1020-rw",
      amenities: ["Điều hòa", "Bãi đậu xe", "WiFi", "Căn tin"],
      availability: ["6:00", "8:00", "10:00", "14:00", "16:00", "18:00"],
      distance: 2.5,
      type: "indoor",
      description: "Sân cầu lông chất lượng cao với trang thiết bị hiện đại",
      isFavorite: false,
    },
    {
      id: 2,
      name: "CLB Cầu lông Trúc Long",
      location: "75 Hoàng Hữu Nam",
      district: "Thủ Đức",
      city: "Hồ Chí Minh",
      rating: 4.6,
      price: 70000,
      image: "https://lh3.googleusercontent.com/p/AF1QipNF-c6vCG9eaq6fdyxYaDisvtyz-2icGLIVcMbd=s1360-w1360-h1020-rw",
      amenities: ["Điều hòa", "Phòng tắm", "Cho thuê vợt"],
      availability: ["7:00", "9:00", "11:00", "15:00", "17:00", "19:00"],
      distance: 3.2,
      type: "indoor",
      description: "Câu lạc bộ cầu lông với không gian thoáng mát",
      isFavorite: true,
    },
    {
      id: 3,
      name: "Sân cầu lông Hita",
      location: "44/8 Hoàng Hữu Nam",
      district: "Thủ Đức",
      city: "Hồ Chí Minh",
      rating: 4.9,
      price: 120000,
      image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nphF1cR4uXJXMJCYOP9pARzcEhpRN91iOecB3rTwJBtz-tGk1IPepw784lg7qNI_wbG_XRlEVrt9mL3DfXK4FZcK0AgJEycDJ7dD1s2IVfr9IX4mWw674SgMHIL0k6CmNFRun11=s1360-w1360-h1020-rw",
      amenities: ["VIP Lounge", "Huấn luyện viên", "Spa", "Nhà hàng", "Bãi đậu xe"],
      availability: ["8:00", "10:00", "14:00", "16:00", "18:00"],
      distance: 1.8,
      type: "indoor",
      description: "Sân cầu lông cao cấp với dịch vụ 5 sao",
      isFavorite: false,
    },
    {
      id: 4,
      name: "Sân cầu lông ngoài trời phân khu Origami",
      location: "S603, Khu đô thị Vinhomes Grand Park",
      district: "Thủ Đức",
      city: "Hồ Chí Minh",
      rating: 4.3,
      price: 0,
      image: "https://vinhomebysalereal.vn/wp-content/uploads/2024/07/san-cau-long-vinhomes-smart-city.jpg",
      amenities: ["Bãi đậu xe", "Cơ bản"],
      availability: ["6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
      distance: 4.1,
      type: "outdoor",
      description: "Sân cầu lông miễn phí phù hợp cho mọi người",
      isFavorite: false,
    },
    {
      id: 5,
      name: "Sân cầu lông Eco",
      location: "107 Nguyễn Văn Linh",
      district: "Quận 7",
      city: "Hồ Chí Minh",
      rating: 4.1,
      price: 90000,
      image: "https://lh3.googleusercontent.com/p/AF1QipP6WCsgLT7yC4bUcpQFjsfBzfQd7Av3WRYNLIrx=s1360-w1360-h1020-rw",
      amenities: ["Không khí trong lành", "Bãi đậu xe", "Khu vui chơi"],
      availability: ["6:00", "7:00", "8:00", "17:00", "18:00", "19:00"],
      distance: 5.5,
      type: "indoor",
      description: "Sân cầu lông cao cấp",
      isFavorite: false,
    },
    {
      id: 6,
      name: "Sân cầu lông Marie Curie",
      location: "26 Lê Quý Đôn",
      district: "Quận 3",
      city: "Hồ Chí Minh",
      rating: 4.7,
      price: 100000,
      image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nren8TalpW-qJeYbgC7zoYBOxgG0A_mFiemHAsau3RtBXabHX6a5qbXzaqFFFz-XOPxu99WlPYjzVq_YVXe6KUHKJ2JsF5r_gXNqtBqh3NGnrE7NI-huYdT-rZpcwGCQ9TIiz_z=s1360-w1360-h1020-rw",
      amenities: ["Điều hòa", "Phòng gym", "Căn tin", "WiFi", "Bãi đậu xe"],
      availability: ["7:00", "9:00", "11:00", "13:00", "15:00", "17:00"],
      distance: 6.2,
      type: "indoor",
      description: "Sân cầu lông của trường Marie Curie, chất lượng cao",
      isFavorite: true,
    },
  ])

  const districts = ["Tất cả", "Thủ Đức", "Quận 1", "Quận 7", "Quận 9", "Bình Thạnh", "Gò Vấp"]
  const amenities = [
    "Điều hòa",
    "Bãi đậu xe",
    "WiFi",
    "Căn tin",
    "Phòng tắm",
    "Cho thuê vợt",
    "VIP Lounge",
    "Huấn luyện viên",
    "Phòng gym",
  ]

  const sortOptions = [
    { value: "distance", label: "Khoảng cách gần nhất" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "name", label: "Tên A-Z" },
  ]

  // Filtered and sorted courts
  const filteredCourts = useMemo(() => {
    const filtered = courts.filter((court) => {
      // Search filter
      const matchesSearch =
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.district.toLowerCase().includes(searchTerm.toLowerCase())

      // Price filter
      const matchesPrice = court.price >= priceRange[0] && court.price <= priceRange[1]

      // District filter
      const matchesDistrict =
        selectedDistricts.length === 0 ||
        selectedDistricts.includes("Tất cả") ||
        selectedDistricts.includes(court.district)

      // Amenities filter
      const matchesAmenities =
        selectedAmenities.length === 0 || selectedAmenities.some((amenity) => court.amenities.includes(amenity))

      // Rating filter
      const matchesRating = court.rating >= minRating

      // Type filter
      const matchesType = courtType === "all" || court.type === courtType

      return matchesSearch && matchesPrice && matchesDistrict && matchesAmenities && matchesRating && matchesType
    })

    // Sort courts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [courts, searchTerm, sortBy, priceRange, selectedDistricts, selectedAmenities, minRating, courtType])

  const handleDistrictChange = (district: string, checked: boolean) => {
    if (district === "Tất cả") {
      setSelectedDistricts(checked ? ["Tất cả"] : [])
    } else {
      setSelectedDistricts((prev) => {
        const filtered = prev.filter((d) => d !== "Tất cả")
        return checked ? [...filtered, district] : filtered.filter((d) => d !== district)
      })
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities((prev) => (checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSortBy("distance")
    setPriceRange([0, 200000])
    setSelectedDistricts([])
    setSelectedAmenities([])
    setMinRating(0)
    setCourtType("all")
  }

  const toggleFavorite = (courtId: number) => {
    setCourts((prev) =>
      prev.map((court) => (court.id === courtId ? { ...court, isFavorite: !court.isFavorite } : court)),
    )
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-3 w-3" />
      case "Bãi đậu xe":
        return <Car className="h-3 w-3" />
      case "Căn tin":
        return <Coffee className="h-3 w-3" />
      case "Phòng gym":
        return <Dumbbell className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gray-50 overflow-y-scroll scrollbar-hide px-16">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <div className="relative mb-12">
          <div className="h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden">
            <img
              src={banner}
              alt="Badminton Court Banner"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-end pr-16">
              <div className="text-right text-white">
                <h1 className="text-5xl font-bold mb-4">
                  Badminton
                  <br />
                  Court
                </h1>
                <a href="/courts">
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl">
                    Đặt sân ngay
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sân cầu lông theo tên, địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
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

            {/* Filter Toggle */}
            <Button onClick={() => setShowFilters(!showFilters)} className="h-12 px-6 bg-transparent ">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc
              {(selectedDistricts.length > 0 ||
                selectedAmenities.length > 0 ||
                minRating > 0 ||
                courtType !== "all" ||
                priceRange[0] > 0 ||
                priceRange[1] < 200000) && <Badge className="ml-2 bg-blue-500">!</Badge>}
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredCourts.length}</span> sân cầu lông
            </p>
            {(selectedDistricts.length > 0 ||
              selectedAmenities.length > 0 ||
              minRating > 0 ||
              courtType !== "all" ||
              searchTerm ||
              priceRange[0] > 0 ||
              priceRange[1] < 200000) && (
              <Button variant="secondary" onClick={clearAllFilters} className="text-blue-600">
                <X className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {(selectedDistricts.length > 0 || selectedAmenities.length > 0 || minRating > 0 || courtType !== "all") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedDistricts.map((district) => (
                <Badge key={district} variant="secondary" className="px-3 py-1">
                  {district}
                  <button onClick={() => handleDistrictChange(district, false)} className="ml-2 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedAmenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="px-3 py-1">
                  {amenity}
                  <button onClick={() => handleAmenityChange(amenity, false)} className="ml-2 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {minRating > 0 && (
                <Badge variant="secondary" className="px-3 py-1">
                  Từ {minRating} sao
                  <button onClick={() => setMinRating(0)} className="ml-2 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {courtType !== "all" && (
                <Badge variant="secondary" className="px-3 py-1">
                  {courtType === "indoor" ? "Trong nhà" : "Ngoài trời"}
                  <button onClick={() => setCourtType("all")} className="ml-2 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Courts Grid */}
          <div className="flex-1">
            {filteredCourts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sân nào</h3>
                <p className="text-gray-600">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourts.map((court) => (
                  <Card key={court.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={court.image || "/placeholder.svg"}
                        alt={court.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => toggleFavorite(court.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      >
                        <Heart
                          className={`h-4 w-4 ${court.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                        />
                      </button>
                      <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                        {court.type === "indoor" ? "Trong nhà" : "Ngoài trời"}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-1">{court.name}</CardTitle>
                        <div className="flex items-center ml-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{court.rating}</span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {court.district}, {court.city}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{court.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          
                          <span className="text-lg font-bold text-green-600">
                            {court.price.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-gray-600 ml-1">/giờ</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {court.distance} km
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {court.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs flex items-center gap-1">
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                        {court.amenities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{court.amenities.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {court.availability.length} khung giờ
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          2-4 người
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <a href={`/courts/${court.id}`} className="flex-1">
                          <Button variant="secondary" className="w-full bg-transparent">
                            Xem chi tiết
                          </Button>
                        </a>
                        <a href={`/booking/${court.id}`}>
                          <Button className="px-6">Đặt sân</Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Filter Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              {/* Price Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lọc theo giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200000}
                    min={0}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>{priceRange[0].toLocaleString("vi-VN")}đ</span>
                    <span>{priceRange[1].toLocaleString("vi-VN")}đ</span>
                  </div>
                </CardContent>
              </Card>

              {/* District Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quận/Huyện</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {districts.map((district) => (
                    <div key={district} className="flex items-center space-x-2">
                      <Checkbox
                        id={district}
                        checked={selectedDistricts.includes(district)}
                        onCheckedChange={(checked) => handleDistrictChange(district, checked as boolean)}
                      />
                      <Label htmlFor={district} className="text-sm">
                        {district}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Court Type Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loại sân</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={courtType} onValueChange={setCourtType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="indoor">Trong nhà</SelectItem>
                      <SelectItem value="outdoor">Ngoài trời</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Rating Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Đánh giá tối thiểu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={minRating === rating}
                        onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                      />
                      <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                        {rating === 0 ? (
                          "Tất cả"
                        ) : (
                          <>
                            {rating} <Star className="h-3 w-3 text-yellow-400 fill-current ml-1" /> trở lên
                          </>
                        )}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Amenities Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tiện ích</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                      />
                      <Label htmlFor={amenity} className="text-sm flex items-center gap-2">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
