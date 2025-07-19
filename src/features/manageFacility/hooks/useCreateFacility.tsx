import { postData } from "../../../api/fetchers";
import { CreateFacilityOwnerForm } from "../types";

export const UseCreateFacility = async (Ownerdata: CreateFacilityOwnerForm) => {
  try {
    const response = await postData("/Users/CreateCourtOwner", Ownerdata);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
