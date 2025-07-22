import { postData} from '../../../api/fetchers';
import { Court } from '../type';



export const useBookingStaff = () => {
  const createBooking = async (bookingData: any) => {
    try {
      const response = await postData('/Booking/CreateBooking', bookingData);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Lấy danh sách courts theo facilityId
  const getCourtsByFacilityId = async (facilityId: number) => {
    try {
      const response = await postData(`/Facilities/GetCourtsByFacilityId?facilityId=${facilityId}`,{});
      // Có thể cần map lại dữ liệu nếu backend trả về dạng khác
      return response?.$values || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { createBooking, getCourtsByFacilityId };
}; 