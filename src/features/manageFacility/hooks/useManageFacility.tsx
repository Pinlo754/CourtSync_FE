import { postData } from "../../../api/fetchers";

export const UseGetAllFacility = async () => {
  try {
    const response = await postData("/Facilities/GetAllFacilities", {});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UseSuspendFacility = async (facilityId: string) => {
  try {
    const response = await postData(`/Facilities/SuspendFacility?facilityId=${facilityId}`, {});
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};