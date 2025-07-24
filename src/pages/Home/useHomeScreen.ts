import { useEffect, useMemo, useState } from "react";
import {
  Facility,
  FilterState,
  filterFacilities,
  sortFacilities,
} from "../../types/Facility";

export default function useHomeScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200000],
    numberOfCourts: [1, 20],
    selectedDistricts: [],
    openingTime: "all",
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      const requestBody = {
        latitude: 0,
        longitude: 0,
      };
      try {
        const res = await fetch(
          "https://localhost:7255/api/Facilities/GetAllFacilities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI0IiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsIkZpcnN0TmFtZSI6InN0cmluZyIsImxhc3ROYW1lIjoic3RyaW5nIiwicm9sZSI6IjQiLCJUb2tlbklkIjoiMjdjODY5OWUtZDVhMS00NGMyLTg0Y2ItMjczMWVhY2M1ZGU2IiwibmJmIjoxNzUzMTk0OTE0LCJleHAiOjE3NTcwODI5MTQsImlhdCI6MTc1MzE5NDkxNH0.ICb5DU7sHa3j8uQRQJa3RTpFLDI0zx2c358oTqsDAr8"}`,
            },
            body: JSON.stringify(requestBody),
          }
        );
        const data = await res.json();
        const mapped: Facility[] = data["$values"].map((item: any) => ({
          FacilityID: item.facilityId,
          FacilityStatus: item.FacilityStatus,
          FacilityName: item.facilityName,
          Description: item.description,
          Phone: item.contactPhone,
          Email: item.contactEmail,
          OpeningTime: item.openingTime,
          ClosingTime: item.closingTime,
          Address: `${item.address}, ${item.ward}, ${item.district}, ${item.city}`,
          Ward: item.ward,
          District: item.district,
          City: item.city,
          Distance: item.distance,
          NumberOfCourts: item.totalCourts,
          MinPrice: item.minPrice,
          MaxPrice: item.maxPrice,
          facilityImageUrl: item.facilittyImageUrl,
        }));
        console.log("Facilities:", mapped); // <-- Thêm dòng này để test
        setFacilities(mapped);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };

    fetchFacilities();
    console.log(facilities);
  }, []);

  const filteredFacilities = useMemo(() => {
    const searchFiltered = facilities.filter((facility) => {
      const search = searchTerm.toLowerCase();
      return (
        facility.FacilityName.toLowerCase().includes(search) ||
        facility.Address.toLowerCase().includes(search) ||
        facility.Description.toLowerCase().includes(search)
      );
    });
    const filtered = filterFacilities(searchFiltered, filters);
    console.log("non-filter:", facilities)
    console.log("filtered:", filtered)
    return sortFacilities(filtered, sortBy);
  }, [facilities, searchTerm, sortBy, filters]);

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 200000],
      numberOfCourts: [1, 20],
      selectedDistricts: [],
      openingTime: "all",
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.selectedDistricts.length > 0 ||
    filters.openingTime !== "all" ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 200000 ||
    filters.numberOfCourts[0] > 1 ||
    filters.numberOfCourts[1] < 20;

  return {
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
  };
}
