import { postData } from "../../../api/fetchers";
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
    }

    return { reportIssue };
}