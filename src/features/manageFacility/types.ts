export interface CreateFacilityOwnerForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface Facility {
    id: string;
    name: string;
    contactPhone: string;
    contactEmail: string;
    totalCourt: number;
}


