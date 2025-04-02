import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/do-an",
  timeout: 5000, // Timeout sau 5 giây
});

export const getAllDoAn = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get("/hien-thi", {
      params: { page, size },
    });
    console.log("Dữ liệu API nhận được:", response.data);
    return response.data || { content: [], totalPages: 0 };
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

export const searchDoAn = async (ten, page, size, cancelToken) => {
  try {
    const response = await apiClient.get("/tim-kiem", {
      params: { ten, page, size },
      cancelToken, // Hủy request nếu có request mới
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request bị hủy:", error.message);
      return { content: [], totalPages: 0 }; // Trả về dữ liệu rỗng nếu request bị hủy
    }
    throw new Error(error.response?.data || "Lỗi khi tìm kiếm đồ ăn");
  }
};


export const getAllDoAn2 = async (page = 0, size = 12, searchTerm = "") => {
  try {
    const isSearch = searchTerm.trim() !== ""; // Kiểm tra có từ khóa tìm kiếm hay không
    const response = await apiClient.get(
      isSearch ? "/tim-kiem" : "/hien-thi",
      {
        params: isSearch
          ? { ten: searchTerm, page: page + 1, size } // Cộng 1 vào page khi tìm kiếm
          : { page, size }, // Không cộng 1 vào page khi hiển thị
      }
    );
    console.log("Dữ liệu API nhận được:", response.data);
    return response.data || { content: [], totalPages: 0 };
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

export const getAllDoAnMan = async (page = 0,size = 12)=>{
  try{
    const response = await apiClient.get("/hien-thi-do-an-man",{
      params:{page,size},
    });
    console.log("Dữ liệu API nhận được:", response.data);
    return response.data || {content:[],totalPages:0};
  }catch(error){
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

export const getAllDoChay = async (page = 0,size = 12)=>{
  try {
    const response = await apiClient.get("/hien-thi-do-chay",{
      params:{page,size},
    });
    console.log("Dữ liệu API nhận được",response.data);
    return response.data || {content:[],totalPages:0};
  } catch (error) {
    throw new Error(error.response?.data||"Lỗi khi lấy danh sách đồ ăn")
  }
};

