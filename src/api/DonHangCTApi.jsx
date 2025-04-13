import axios from "axios";

const apiClient =axios.create({
    baseURL:"http://localhost:8080/api/don-hang",
    timeout:5000,
});

export const addDonHangCt = async(donHangCtData)=>{
    try {
        const response = await apiClient.post("/dat-don-hang",donHangCtData,{
            headers:{
                "Content-Type":"application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm đơn hàng  chi tiết:", error);
        throw error; // Ném lỗi để xử lý ở frontend
    }
}