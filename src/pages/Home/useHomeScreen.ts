import { useEffect, useMemo, useState } from "react";
import {
  Facility,
  FilterState,
  filterFacilities,
  sortFacilities,
} from "../../types/Facility";
import { useNavigate } from "react-router-dom";

export default function useHomeScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 600000], // giá từ 0 -> 200k
    courtRange: [1, 20], // số sân từ 1 -> 20
    districts: [], // mặc định không chọn quận
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const navigate = useNavigate();
  useEffect(() =>
  {
    const reloadId = sessionStorage.getItem("facilityId")
    sessionStorage.removeItem("facilityId")
    if(reloadId) {
      navigate(`/facility/${reloadId}`)
    }
  })
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
        console.log("Facilities:", mapped);
        setFacilities(mapped);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };

    fetchFacilities();
    console.log(facilities);
  }, []);

  const scrollToSection = () => {
    const element = document.getElementById("targetDiv");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const filteredFacilities = useMemo(() => {
    // 1. Lọc theo searchTerm (FacilityName)
    const search = searchTerm.trim().toLowerCase();
    const searchFiltered = facilities.filter((facility) => {
      const name = facility.FacilityName?.toLowerCase() || "";
      return name.includes(search);
    });

    // 2. Lọc theo các filters: price range, số sân, quận
    const filtered = searchFiltered.filter((facility) => {
      let isValid = true;

      // Lọc theo khoảng giá (giá max hoặc min của sân)
      if (filters.priceRange !== undefined) {
        isValid = isValid && facility.MinPrice >= filters.priceRange[0];
      }
      if (filters.priceRange !== undefined) {
        isValid = isValid && facility.MaxPrice <= filters.priceRange[1];
      }

      // Lọc theo số lượng sân
      if (filters.courtRange !== undefined) {
        isValid =
          isValid &&
          facility.NumberOfCourts >= filters.courtRange[0] &&
          facility.NumberOfCourts <= filters.courtRange[1];
      }

      // Lọc theo quận
      if (filters.districts.length > 0) {
        isValid =
          isValid &&
          facility.District?.toLowerCase() ===
            filters.districts[0]?.toLowerCase();
      }

      return isValid;
    });

    console.log("non-filter:", facilities);
    console.log("filtered:", filtered);

    // 3. Trả về danh sách đã sort
    return sortFacilities(filtered, sortBy);
  }, [facilities, searchTerm, sortBy, filters]);

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 600000],
      courtRange: [1, 20],
      districts: [],
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.districts.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 600000 ||
    filters.courtRange[0] > 1 ||
    filters.courtRange[1] < 20;

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
    scrollToSection,
  };
}

