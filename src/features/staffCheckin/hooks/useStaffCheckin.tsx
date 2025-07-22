import { fetcher, postData } from "../../../api/fetchers";

export const useStaffCheckin = () => {
    const getAllBookingInFacility = async () => {
        try {
            const response = await fetcher("/Booking/GetBookingListInFacility");
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
            console.error(error);
            throw error;
          }
    }

    return { getAllBookingInFacility, checkinBooking };
}