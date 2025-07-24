"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  generateTimeSlots,
  isTimeSlotBooked,
  formatDate,
  createDateTimeString,
} from "./time-utils";
import type {
  BookingResponse,
  PriceRequest,
  BookingRequest,
} from "../../types/booking";
import { Facility } from "../../types/Facility";
import { postData } from "../../api/fetchers";

export function useBooking() {
  const { facilityId } = useParams<{ facilityId: string }>();

  const [facility, setFacility] = useState<Facility | null>(null);
  const [facilityLoading, setFacilityLoading] = useState(true);
  const [facilityError, setFacilityError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date())
  );
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<number>(1);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<string | null>(null);

  const timeSlots = generateTimeSlots();
  const navigate = useNavigate();
  const [courtIds, setCourtIds] = useState<number[]>([]);
  const courts = courtIds;
  useEffect(() => {
    if (facilityId) {
      fetchFacilityData();
    }
  }, [facilityId]);

  useEffect(() => {
    if (facilityId && facility) {
      fetchBookingData();
    }
  }, [selectedDate, facilityId, facility]);

  useEffect(() => {
    if (selectedSlots.length >= 2 && facility) {
      calculatePrice();
    } else {
      setTotalPrice(0);
    }
  }, [selectedSlots, selectedCourt, facility]);

  const fetchFacilityData = async () => {
    try {
      setFacilityLoading(true);
      setFacilityError(null);
      const response = await postData(
        `/Facilities/GetFacilityDetail?facilityId=${facilityId}`,
        {}
      );

      const data = await response;
      console.log(data);
      if (!data) {
        throw new Error("Không nhận được dữ liệu từ API.");
      }
      const mapApiToFacility = (apiData: any): Facility => {
        return {
          FacilityID: apiData.facilityId,
          FacilityStatus: parseInt(apiData.facilityStatus),
          FacilityName: apiData.facilityName,
          Description: apiData.description,
          Phone: apiData.contactPhone,
          Email: apiData.contactEmail,
          OpeningTime: apiData.openingTime,
          ClosingTime: apiData.closingTime,
          Address: apiData.address,
          Ward: apiData.ward,
          District: apiData.district,
          City: apiData.city,
          NumberOfCourts: apiData.totalCourts,
          MinPrice: apiData.minPrice,
          MaxPrice: apiData.maxPrice,
          Distance: apiData.distance ?? 0,
          facilityImageUrl: apiData.facilityImageUrl,
        };
      };
      const mappedFacility = mapApiToFacility(data);
      setFacility(mappedFacility);
      console.log("facility data:", facility);
    } catch (error) {
      console.error("Error fetching facility data:", error);
      setFacilityError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tải thông tin sân"
      );
    } finally {
      setFacilityLoading(false);
    }
  };

  const fetchBookingData = async () => {
    if (!facilityId) return;

    try {
      setLoading(true);
      const response = await postData(
        `https://localhost:7255/api/Facilities/GetBookingTime`,
        {
          facilityId: facilityId,
          bookingDate: selectedDate,
        }
      );
      if (!response.ok) throw new Error("Failed to load booking data");
      const data: BookingResponse = await response;
      console.log("response booking data", data)
      setBookingData(data);
      const ids = data.$values.map((court) => court.courtId);
      setCourtIds(ids);

      if (ids.length > 0 && !selectedCourt) {
        setSelectedCourt(ids[0]);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    if (selectedSlots.length < 2 || !facilityId) return;

    const sortedSlots = [...selectedSlots].sort();
    const startTimes = [createDateTimeString(selectedDate, sortedSlots[0])];
    const endTimes = [
      createDateTimeString(selectedDate, sortedSlots[sortedSlots.length - 1]),
    ];


    try {
      const response = await postData(
        "https://localhost:7255/api/CourtPrice/GetTotalPriceBooking",
        {
      courtId: selectedCourt,
      startTimes: startTimes,
      endTimes: endTimes,
        }
      );
      if (!response.ok) throw new Error("Price API error");
      const data = await response.json();
      setTotalPrice(data || 0);
    } catch (error) {
      console.error("Error calculating price:", error);
    }
  };

  const getCourtBookedSlots = (courtId: number) => {
    if (!bookingData) return [];

    const courtData = bookingData.$values.find(
      (court) => court.courtId === courtId
    );
    if (!courtData || !courtData.startTimes?.$values?.length) return [];

    console.log("courtId:", courtId);
    console.log("courtData.startTimes:", courtData.startTimes.$values);
    console.log("courtData.endTimes:", courtData.endTimes.$values);

    return courtData.startTimes.$values.map((start, index) => ({
      start,
      end: courtData.endTimes.$values[index],
    }));
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    const bookedSlots = getCourtBookedSlots(selectedCourt);

    if (isTimeSlotBooked(timeSlot, bookedSlots, selectedDate)) return;

    const status = getSlotStatus(selectedCourt, timeSlot);
    if (status === "locked" || status === "booked") return;

    if (!isSelecting) {
      setIsSelecting(true);
      setSelectionStart(timeSlot);
      setSelectedSlots([timeSlot]);
    } else {
      if (selectionStart) {
        const startIndex = timeSlots.indexOf(selectionStart);
        const endIndex = timeSlots.indexOf(timeSlot);
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);

        const newSelection = timeSlots.slice(minIndex, maxIndex + 1);

        const hasInvalidSlot = newSelection.some((slot) => {
          const slotStatus = getSlotStatus(selectedCourt, slot);
          return slotStatus === "booked" || slotStatus === "locked";
        });

        if (!hasInvalidSlot) {
          setSelectedSlots(newSelection);
        }
      }

      setIsSelecting(false);
      setSelectionStart(null);
    }
  };

  const getSlotStatus = (courtId: number, timeSlot: string) => {
    const bookedSlots = getCourtBookedSlots(courtId);

    if (isTimeSlotBooked(timeSlot, bookedSlots, selectedDate)) {
      return "booked";
    }

    const slotDateTime = new Date(`${selectedDate} ${timeSlot}`);
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    if (slotDateTime < oneHourLater) {
      return "locked";
    }

    if (courtId === selectedCourt && selectedSlots.includes(timeSlot)) {
      return "selected";
    }

    return "available";
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-red-500";
      case "selected":
        return "bg-green-500";
      case "available":
        return "bg-white border border-gray-300";
      case "locked":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const handleBooking = () => {
    if (
      selectedSlots.length < 3 ||
      totalPrice === 0 ||
      !facilityId ||
      !facility
    )
      return;

    const sortedSlots = [...selectedSlots].sort();

    const startTimes = [createDateTimeString(selectedDate, sortedSlots[0])];
    const endTimes = [
      createDateTimeString(selectedDate, sortedSlots[sortedSlots.length - 1]),
    ];

    const bookingInfo = {
      facilityId: facility.FacilityID,
      facilityName: facility.FacilityName,
      facilityAddress: facility.Address,
      facilityPhone: facility.Phone,
      courtId: selectedCourt,
      selectedDate,
      selectedSlots: sortedSlots,
      totalHours,
      startTimes: startTimes,
      endTimes: endTimes,
      totalPrice,
      note,
    };
    navigate("/bookingConfirmation", { state: bookingInfo });
  };

  const handleCourtChange = (courtId: number) => {
    setSelectedCourt(courtId);
    setSelectedSlots([]);
    setIsSelecting(false);
    setSelectionStart(null);
  };

  const clearSelection = () => {
    setSelectedSlots([]);
    setIsSelecting(false);
    setSelectionStart(null);
    setTotalPrice(0);
  };

  const totalHours = Math.max(0, selectedSlots.length * 0.5);

  return {
    facility,
    facilityLoading,
    facilityError,
    facilityId: facilityId ? Number(facilityId) : null,
    selectedDate,
    bookingData,
    selectedCourt,
    selectedSlots,
    totalPrice,
    note,
    loading,
    isSelecting,
    timeSlots,
    courts,
    totalHours,

    setSelectedDate,
    setNote,

    handleTimeSlotClick,
    handleBooking,
    handleCourtChange,
    clearSelection,
    getSlotStatus,
    getSlotColor,
    getCourtBookedSlots,
    fetchFacilityData,
  };
}
