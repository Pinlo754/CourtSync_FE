import axiosInstance from "../axiosInstance";
import { handleApiError } from "../errorHandler";
import { CourtReportListResponse, CourtReportStatus } from "../../features/staffReport/types";
import { AxiosError } from "axios";

// Backend Response Interfaces (Simplified - no nested objects)
export interface BackendFacility {
    $id: string;
    facilityId: number;
    facilityName: string;
    description: string;
    contactPhone: string;
    contactEmail: string;
    openingTime: string;
    closingTime: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    latitude: number;
    longtitude: number;
    facilityStatus: string;
    ownerId: number;
    staffId: number;
}

export interface GetMyFacilitiesResponse {
    $id: string;
    $values: BackendFacility[];
}

// Frontend Interfaces (simplified for UI)
export interface Facility {
    id: string;
    facilityName: string;
    description: string;
    address: string;
    city: string;
    status: 'active' | 'inactive';
    courtsCount: number;
    contactPhone: string;
    contactEmail: string;
    openingTime: string;
    closingTime: string;
    ward: string;
    district: string;
}

// Create Facility Request Interface
export interface CreateFacilityRequest {
    facilityName: string;
    description: string;
    contactPhone: string;
    contactEmail: string;
    openingTime: string;
    closingTime: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    latitude: number;
    longtitude: number;
    // Staff account info
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface CreateFacilityResponse {
    message: string;
    success: boolean;
    facilityId?: number;
}

// API Functions
export const getMyFacilities = async (): Promise<Facility[]> => {
    try {
        const response = await axiosInstance.get<GetMyFacilitiesResponse>('/Facilities/GetMyFacilities');
        console.log('GetMyFacilities response:', response.data); // Debug log

        // Check if response has expected structure
        if (!response.data || !response.data.$values) {
            console.error('Invalid response structure:', response.data);
            return [];
        }

        // Transform backend data to frontend format
        return response.data.$values.map((backendFacility: BackendFacility, index: number) => {
            console.log(`✅ Processing facility ${index + 1}:`, backendFacility); // Debug log with index

            // Clean string fields
            const facilityName = backendFacility.facilityName?.trim();
            const description = backendFacility.description?.trim();
            const address = backendFacility.address?.trim();
            const ward = backendFacility.ward?.trim();
            const district = backendFacility.district?.trim();
            const city = backendFacility.city?.trim();

            return {
                id: backendFacility.facilityId.toString(),
                facilityName: facilityName || `Facility ${index + 1}`,
                description: description || '',
                address: [address, ward, district].filter(Boolean).join(', ') || 'No address',
                city: city || '',
                status: backendFacility.facilityStatus === '1' ? 'active' : 'inactive',
                courtsCount: 0, // TODO: Get courts count from separate API if needed
                contactPhone: backendFacility.contactPhone?.trim() || '',
                contactEmail: backendFacility.contactEmail?.trim() || '',
                openingTime: backendFacility.openingTime || '07:00:00',
                closingTime: backendFacility.closingTime || '22:00:00',
                ward: ward || '',
                district: district || '',
            };
        });
    } catch (error) {
        console.error('Error fetching facilities:', error);
        throw error;
    }
};

export const createFacility = async (facilityData: CreateFacilityRequest): Promise<CreateFacilityResponse> => {
    try {
        const response = await axiosInstance.post('/Facilities/CreateFacility', facilityData);
        console.log('CreateFacility response:', response); // Debug log
        console.log('CreateFacility response.data:', response.data); // Debug log

        // Handle different response formats
        if (response.status === 200 || response.status === 201) {
            // If response is successful (200/201), consider it as success
            return {
                success: true,
                message: 'Facility created successfully',
                facilityId: response.data?.facilityId || response.data?.id
            };
        }

        return response.data || { success: false, message: 'Unknown error' };
    } catch (error) {
        console.error('Error creating facility:', error);
        throw error;
    }
};

// Thêm function lấy thông tin chi tiết của facility
export const getFacilityById = async (facilityId: number): Promise<BackendFacility> => {
    try {
        const response = await axiosInstance.post(`/Facilities/GetFacilityDetail?facilityId=${facilityId}`);
        console.log('GetFacilityById response:', response.data);
        
        if (!response.data) {
            throw new Error('Invalid response structure');
        }
        
        return response.data;
    } catch (error) {
        console.error('Error fetching facility details:', error);
        throw error;
    }
};

// Staff interface
export interface StaffInfo {
  $id: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  userStatus: string;
  facilityId: number;
  facilityName: string;
}

// Get staff by facility ID
export const getStaffByFacilityId = async (facilityId: number): Promise<StaffInfo> => {
  try {
    const response = await axiosInstance.get(`/Facilities/GetStaffByFacilityId/${facilityId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff information:', error);
    throw error;
  }
};

// Court Interfaces - Backend Response
export interface BackendCourtImage {
    $id: string;
    imageId: number;
    imageUrl: string;
}

export interface BackendCourtPrice {
    $id: string;
    courtPriceId: number;
    dayType: string; // "1" = weekday, "2" = weekend
    startTime: string;
    endTime: string;
    courtPriceStatus: string;
    price: number;
}

export interface BackendCourt {
    $id: string;
    courtId: number;
    courtName: string;
    courtStatus: string; // "1" = active, "0" = inactive
    facilityId: number;
    images: {
        $id: string;
        $values: BackendCourtImage[];
    };
    courtPrices: {
        $id: string;
        $values: BackendCourtPrice[];
    };
}

export interface GetCourtsByFacilityResponse {
    $id: string;
    $values: BackendCourt[];
}

// Frontend Court Interface
export interface Court {
    id: number;
    name: string;
    status: 'active' | 'inactive' | 'maintenance';
    facilityId: number;
    images: string[];
    pricing: CourtPricing[];
}

export interface CourtPricing {
    id: number;
    courtId: number;
    priceType: 'weekday_morning' | 'weekday_afternoon' | 'weekend_morning' | 'weekend_afternoon';
    price: number;
    status: number;
    startTime: string;
    endTime: string;
}

// Create Court Interfaces
export interface CreateCourtPriceTimeRange {
    dayType: string; // "1" = weekday, "2" = weekend/holiday
    startTime: string; // HH:mm:ss format
    endTime: string; // HH:mm:ss format
    price: number;
}

export interface CreateCourtRequest {
    facilityId: number;
    courtName: string;
    imageUrl: string;
    courtPriceTimeRanges: CreateCourtPriceTimeRange[];
}

export interface CreateCourtResponse {
    success: boolean;
    message: string;
    courtId?: number;
}

// Court API Functions
export const getCourtsByFacilityId = async (facilityId: number): Promise<Court[]> => {
    try {
        const response = await axiosInstance.get<GetCourtsByFacilityResponse>(`/Court/GetCourtsByFacilityId/${facilityId}`);
        console.log('GetCourtsByFacilityId response:', response.data);

        if (!response.data || !response.data.$values) {
            console.error('Invalid courts response structure:', response.data);
            return [];
        }

        return response.data.$values.map((backendCourt: BackendCourt) => {
            // Transform images
            const images = backendCourt.images?.$values?.map(img => img.imageUrl) || [];

            // Transform pricing with time logic
            const pricing: CourtPricing[] = backendCourt.courtPrices?.$values?.map(price => {
                const startHour = parseInt(price.startTime.split(':')[0]);
                let priceType: CourtPricing['priceType'];

                if (price.dayType === '1') { // Weekday
                    priceType = startHour < 12 ? 'weekday_morning' : 'weekday_afternoon';
                } else { // Weekend/Holiday
                    priceType = startHour < 12 ? 'weekend_morning' : 'weekend_afternoon';
                }

                return {
                    id: price.courtPriceId,
                    courtId: backendCourt.courtId,
                    priceType,
                    price: price.price,
                    status: parseInt(price.courtPriceStatus),
                    startTime: price.startTime,
                    endTime: price.endTime
                };
            }) || [];

            return {
                id: backendCourt.courtId,
                name: backendCourt.courtName,
                status: backendCourt.courtStatus === '1' ? 'active' : 'inactive',
                facilityId: backendCourt.facilityId,
                images: images.length > 0 ? images : ['/src/assets/court1.jpg'], // Fallback image
                pricing
            };
        });
    } catch (error) {
        console.error('Error fetching courts:', error);
        throw error;
    }
};

export const createCourt = async (courtData: CreateCourtRequest): Promise<CreateCourtResponse> => {
    try {
        // API expects an array with single court object
        const requestData = [courtData];

        const response = await axiosInstance.post('/Court/CreateCourt', requestData);
        console.log('CreateCourt response:', response);

        // Handle different response formats
        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                message: 'Court created successfully',
                courtId: response.data?.courtId || response.data?.id
            };
        }

        return response.data || { success: false, message: 'Unknown error' };
    } catch (error: any) {
        console.error('Error creating court:', error);

        // Handle error response
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.title ||
            error.message ||
            'Failed to create court';

        return {
            success: false,
            message: errorMessage
        };
    }
}; 

export const getCourtReports = async (): Promise<CourtReportListResponse> => {
  try {
    const response = await axiosInstance.get('/CourtReport/GetCourtReportsByOwner');
    
    // Transform backend response to match our frontend interface
    const reports = response.data.$values.map((item: any) => ({
      courtReportId: item.courtReportId.toString(),
      createdBy: item.creatorName || `User ${item.createdBy}`,
      createdDate: item.createdDate,
      description: item.description,
      courtReportStatus: mapReportStatus(item.courtReportStatus),
      courtId: item.courtId.toString(),
      courtName: item.courtName,
      facilityId: item.facilityId.toString(),
      facilityName: item.facilityName,
      estimateTime: item.estimateTime || 'Not specified',
      maintainDate: item.maintainDate || null
    }));
    
    return {
      reports,
      totalCount: reports.length
    };
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
}; 

// Helper function to map backend status to frontend enum
const mapReportStatus = (status: string): CourtReportStatus => {
  switch (status) {
    case "0":
      return CourtReportStatus.PENDING;
    case "1":
      return CourtReportStatus.IN_PROGRESS;
    case "2":
      return CourtReportStatus.COMPLETED;
    case "3":
      return CourtReportStatus.CANCELLED;
    default:
      return CourtReportStatus.PENDING;
  }
}; 

// Interface for approve court report request
export interface ApproveCourtReportRequest {
  courtReportId: number;
  maintainDate: string;
  estimatedTime: number;
}

// Function to approve court report
export const approveCourtReport = async (data: ApproveCourtReportRequest): Promise<any> => {
  try {
    const response = await axiosInstance.post('/CourtReport/ApproveCourtReport', data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
}; 