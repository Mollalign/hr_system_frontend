import api from "@/config/api";
import type {
  DeductionType,
  DeductionTypeRequest,
  DeductionApiRequest,
  ApiResponse,
} from "@/types/deduction";

class DeductionService {
  async getAll(): Promise<DeductionType[]> {
    const response = await api.get<ApiResponse<DeductionType[]>>("/deduction/");
    // console.log("deductions response", response)
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch deductions");
    }
    return response.data.data;
  }

  async create(data: DeductionTypeRequest): Promise<DeductionType> {
    console.log("🚀 Sending data to backend:", JSON.stringify(data, null, 2));
    const response = await api.post<ApiResponse<DeductionType>>(
      "/deduction/",
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create deduction");
    }

    return response.data.data;
  }

  async update(id: string, data: DeductionApiRequest): Promise<DeductionType> {
    console.log("✏️ Updating deduction:", id, data);
    const response = await api.put<ApiResponse<DeductionType[]>>(
      `/deduction/update/${id}`,
      data
    );
    console.log("📥 Backend response:", response.data);

    if (!response.data.success) {
      console.error("❌ Backend error:", response.data);
      throw new Error(response.data.message || "Failed to update deduction");
    }
    // Return the first item from the data array as per API response structure
    return response.data.data[0];
  }

  async delete(category: string, id: string): Promise<{ message: string }> {
    console.log("🗑️ Deleting deduction:", category, id);
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/deduction/${category}/${id}`
    );
    console.log("📥 Backend response:", response.data);

    if (!response.data.success) {
      console.error("❌ Backend error:", response.data);
      throw new Error(response.data.message || "Failed to delete deduction");
    }
    
    return {
      message: response.data.message || "Deduction deleted successfully",
    };
  }
}

export default new DeductionService();
