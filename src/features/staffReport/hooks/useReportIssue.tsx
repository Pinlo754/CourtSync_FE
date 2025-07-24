import { fetcher, postData } from "../../../api/fetchers";
import { ReportIssueRequest } from "../types";

export const useReportIssue = () => {
  const reportIssue = async (request: ReportIssueRequest) => {
    try {
      const response = await postData("/CourtReport/ReportCourt", request);
      return response || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const getFacilityIdByStaffId = async () => {
    try {
      const response = await fetcher("/Facilities/GetFacilityByStaffId");
      return Number(response) || 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  // const getFacilityById = async (facilityId: number) => {
  //   try {
  //     const response = await postData(`/Facilities/GetFacilityDetail?facilityId=${facilityId}`, {});
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }
  const getCourtsByFacilityId = async (facilityId: number) => {
    try {
      const response = await fetcher(
        `/Court/GetCourtsByFacilityId/${facilityId}`
      );
      // Có thể cần map lại dữ liệu nếu backend trả về dạng khác
      return response?.$values || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { reportIssue, getFacilityIdByStaffId, getCourtsByFacilityId };
};
