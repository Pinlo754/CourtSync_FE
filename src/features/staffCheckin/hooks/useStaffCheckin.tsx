import { fetcher, postData } from "../../../api/fetchers";

export const useStaffCheckin = () => {
    const getAllBookingInFacility = async (facilityId: number) => {
        try {
            const response = await fetcher(`/Booking/GetBookingListInFacility?facilityId=${facilityId}`);
            return response || [];
          } catch (error) {
            console.error(error);
            throw error;
          }
    }

    const checkinBooking = async (bookingId: number[]) => {
        try {
            const response = await postData("/Booking/StaffCheckin", bookingId);
            return response;
          } catch (error) {
            throw error;
          }
    }

    const getFacilityIdByStaffId = async () => {
    try {
      const response = await fetcher("/Facilities/GetFacilityByStaffId");
      return Number(response) || 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

    return { getAllBookingInFacility, checkinBooking, getFacilityIdByStaffId };
}