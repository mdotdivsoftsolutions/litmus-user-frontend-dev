export interface LabAvailability {
  workingDays?: string[];
  startTime?: string;
  endTime?: string;
  blockedDates?: { date: string; name: string }[];
}

export interface LabItem {
  _id: string;
  id?: string;
  labName: string;
  name?: string;
  city: string;
  state?: string;
  address?: string;
  pincode?: string;
  isNablAccredited?: boolean;
  isFssaiApproved?: boolean;
  nabl?: boolean;
  fssai?: boolean;
  rating?: number;
  reviewCount?: number;
  priceFrom?: number;
  testsCount?: number;
  expertiseArea?: string[];
  availability?: LabAvailability;
  imageUrl?: string;
  accreditationCertificateUrl?: string;
}
