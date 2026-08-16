import { labApi } from "@/lib/api/lab";

export const labService = {
  getAll: (params?: { page?: number; limit?: number; search?: string; city?: string }) => 
    labApi.getLabs(params),
  
  getById: (id: string) => 
    labApi.getLabById(id),
  
  getAvailability: (id: string, date: string) => 
    labApi.getLabAvailability(id, date),
  
  getSlots: (id: string, date: string) => 
    labApi.getLabSlots(id, date),
};
