"use client";
import { fetcher, postData } from "../../../api/fetchers";
import { useState, useEffect } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import {
  isTimeSlotBooked,
  formatDate,
  createDateTimeString,
} from "../../../pages/Booking/time-utils";
import {
  Facility,
  BookingResponse,
  BookingTime,
  CreateBookingStaff,
} from "../type";

const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

export function useBookingStaff() {
  const [facilityId, setFacilityId] = useState<number>(0);

  const [facility, setFacility] = useState<Facility>();
  const [facilityLoading, setFacilityLoading] = useState(true);
  const [facilityError, setFacilityError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date())
  );
  const [bookingData, setBookingData] = useState<BookingTime[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<number>(1);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<string | null>(null);

  let timeSlots = generateTimeSlots(5, 24);
  const [courtIds, setCourtIds] = useState<number[]>([]);
  const courts = courtIds;

  useEffect(() => {
    fetchFacilityData();
  }, []);

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

  const getFacilityIdByStaffId = async () => {
    try {
      const response = await fetcher("/Facilities/GetFacilityByStaffId");
      return Number(response) || 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const fetchFacilityData = async () => {
    try {
      const res = await getFacilityIdByStaffId();
      setFacilityId(res);
      setFacilityLoading(true);
      setFacilityError(null);
      const response = await postData(
        `/Facilities/GetFacilityDetail?facilityId=${res}`,
        {}
      );
      const openingTime = response.openingTime.split(":")[0];
      const closingTime = response.closingTime.split(":")[0];
      timeSlots = generateTimeSlots(openingTime, closingTime);
      setFacility(response);
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
      const requestBody = {
        facilityId: Number(facilityId),
        bookingDate: selectedDate,
      };
      const response = await postData(
        `/Facilities/GetBookingTime`,
        requestBody
      );
      console.log("response:", response);
      setBookingData(response.$values);

      const ids = response.$values.map((court: BookingTime) => court.courtId);
      setCourtIds(ids);
      console.log("ids:", ids);

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

    const priceRequest = {
      courtId: selectedCourt,
      startTimes: startTimes,
      endTimes: endTimes,
    };

    try {
      const response = await postData(
        `/CourtPrice/GetTotalPriceBooking`,
        priceRequest
      );
      
      setTotalPrice(response);
    } catch (error) {
      console.error("Error calculating price:", error);
    }
  };

  const getCourtBookedSlots = (courtId: number) => {
    if (!bookingData) return [];

    const courtData = bookingData.find((court) => court.courtId === courtId);
    if (!courtData || !courtData.startTimes?.$values?.length) return [];
    return courtData.startTimes.$values.map((start, index) => ({
      start,
      end: courtData.endTimes.$values[index],
    }));
  };

  const createBooking = async (bookingData: any) => {
    try {
      const response = await postData("/Booking/CreateBooking", bookingData);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
      default:
        return "bg-gray-300";
    }
  };

  const handleBooking = async () => {
    if (
      selectedSlots.length < 2 ||
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
    const bookingForm: CreateBookingStaff = {
      courtId: selectedCourt,
      note: note,
      totalPrice: totalPrice,
      startTimes: startTimes,
      endTimes: endTimes,
    };
    setFacilityError(null);

    try {
      const response = await postData("/Booking/CreateBooking", bookingForm);
      if (response) {
        fetchFacilityData();
        fetchBookingData();
      } else {
        setFacilityError("Có lỗi xảy ra khi tạo đặt sân");
      }
    } catch (error) {
      setFacilityError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tải thông tin sân"
      );
    }
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

  const totalHours = selectedSlots.length > 0 ? ((selectedSlots.length-1) * 0.5) : ( selectedSlots.length*0.5);

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
    createBooking,
  };
}
