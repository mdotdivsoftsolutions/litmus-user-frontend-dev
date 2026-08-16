import { labApi } from "@/lib/api/lab";

export const labService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; location?: string; lat?: number; lng?: number; isTrusted?: boolean }) => 
    labApi.getLabsPublic(params),
  
  getById: (id: string) => 
    labApi.getLabByIdPublic(id),
  
  getAvailability: (id: string, date: string) => 
    labApi.getLabAvailability(id, date),
  
  getSlots: (id: string, date: string) => 
    labApi.getLabAvailability(id, date),
};
