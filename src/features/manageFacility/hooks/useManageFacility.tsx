import { patchData, postData } from "../../../api/fetchers";
import { Facility, ApproveRejectFacility } from "../types";

export const UseGetAllFacility = async () => {
  try {
    const response = await postData("/Facilities/GetAllFacilities", {});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UseToggleFacility = async (facilityId: number) => {
  try {
    const response = await patchData(`/Facilities/ToggleFacilityStatus?facilityId=${facilityId}`,{});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UseApproveFacility = async (data: ApproveRejectFacility) => {
  try {
    const response = await postData(`/Facilities/AdminApproveFacility`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UseRejectFacility = async (data: ApproveRejectFacility) => {
  try {
    const response = await postData(`/Facilities/AdminRejectFacility`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};