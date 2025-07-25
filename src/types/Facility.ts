export interface Facility {
  FacilityID: number
  FacilityStatus: number
  FacilityName: string
  Description: string
  Phone: string
  Email: string
  OpeningTime: string
  ClosingTime: string
  Address: string
  Ward: String
  District: String
  City: String
  NumberOfCourts: number
  MinPrice: number     
  MaxPrice: number      
  Distance?: number
  facilityImageUrl: string
}

export interface FilterState {
  priceRange: [number, number]
  courtRange: [number, number]
  districts: string[]
}

export const filterFacilities = (facilities: Facility[], filters: any): Facility[] => {
  return facilities.filter((facility) => {
    const courtMatch = !filters.court || facility.NumberOfCourts >= filters.court;

    let priceMatch = true;
    if (filters.price && typeof filters.price === "number") {
      const minPrice = facility.MaxPrice;

      if (isNaN(minPrice) || minPrice < filters.price) {
        priceMatch = false;
      }
    }

    // Lọc theo quận
    const districtMatch =
      !filters.district || facility.Address.toLowerCase().includes(filters.district.toLowerCase());

    return courtMatch && priceMatch && districtMatch;
  });
};


export const sortFacilities = (
  facilities: Facility[],
  sortBy: string
): Facility[] => {
  const sorted = [...facilities]

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.FacilityName.localeCompare(b.FacilityName))

    case "courts":
      return sorted.sort((a, b) => b.NumberOfCourts - a.NumberOfCourts)

    case "price-low":
      return sorted.sort((a, b) => a.MinPrice - b.MinPrice)

    case "price-high":
      return sorted.sort((a, b) => b.MaxPrice - a.MaxPrice)

    default:
      return sorted
  }
}
