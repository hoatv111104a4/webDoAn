import axios from "axios";

// Tạo một instance của axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/do-an", // URL cơ sở cho tất cả các request
  timeout: 5000, // Thời gian chờ tối đa là 5 giây, nếu quá thời gian sẽ báo lỗi timeout
});

// Hàm lấy tất cả đồ ăn với phân trang
export const getAllDoAn = async (page = 0, size = 10) => {
  try {
    // Gửi request GET tới endpoint "/hien-thi" với các tham số page và size
    const response = await apiClient.get("/hien-thi", {
      params: { page, size }, // Truyền tham số phân trang: số trang (page) và số lượng mỗi trang (size)
    });
    console.log("Dữ liệu API nhận được:", response.data); // In dữ liệu trả về từ API để debug
    // Trả về dữ liệu từ response, nếu không có thì trả về object mặc định với content rỗng và totalPages = 0
    return response.data || { content: [], totalPages: 0 };
  } catch (error) {
    // Nếu có lỗi, ném ra một Error với thông báo từ server (nếu có) hoặc thông báo mặc định
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

// Hàm tìm kiếm đồ ăn theo tên với phân trang và hỗ trợ hủy request
export const searchDoAn = async (ten, page, size, cancelToken) => {
  try {
    // Gửi request GET tới endpoint "/tim-kiem" với các tham số: tên, page, size
    const response = await apiClient.get("/tim-kiem", {
      params: { ten, page, size }, // Tham số: tên đồ ăn cần tìm, số trang, số lượng mỗi trang
      cancelToken, // Token để hủy request nếu có request mới (dùng với axios CancelToken)
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    // Kiểm tra nếu lỗi là do request bị hủy
    if (axios.isCancel(error)) {
      console.log("Request bị hủy:", error.message); // In thông báo khi request bị hủy
      return { content: [], totalPages: 0 }; // Trả về dữ liệu rỗng nếu bị hủy
    }
    // Nếu lỗi khác, ném ra Error với thông báo từ server hoặc mặc định
    throw new Error(error.response?.data || "Lỗi khi tìm kiếm đồ ăn");
  }
};

// Hàm lấy tất cả đồ ăn (kết hợp hiển thị và tìm kiếm) với phân trang
export const getAllDoAn2 = async (page = 0, size = 12, searchTerm = "") => {
  try {
    // Kiểm tra xem có từ khóa tìm kiếm hay không (loại bỏ khoảng trắng)
    const isSearch = searchTerm.trim() !== "";
    // Gửi request GET tới endpoint tương ứng: "/tim-kiem" nếu có searchTerm, ngược lại là "/hien-thi"
    const response = await apiClient.get(
      isSearch ? "/tim-kiem" : "/hien-thi",
      {
        params: isSearch
          ? { ten: searchTerm, page: page + 1, size } // Nếu tìm kiếm, page bắt đầu từ 1 (cộng 1)
          : { page, size }, // Nếu hiển thị, page bắt đầu từ 0
      }
    );
    console.log("Dữ liệu API nhận được:", response.data); // In dữ liệu để debug
    // Trả về dữ liệu từ API hoặc object mặc định nếu không có dữ liệu
    return response.data || { content: [], totalPages: 0 };
  } catch (error) {
    // Ném lỗi với thông báo từ server hoặc mặc định
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

// Hàm lấy danh sách đồ ăn mặn với phân trang
export const getAllDoAnMan = async (page = 0, size = 12) => {
  try {
    // Gửi request GET tới endpoint "/hien-thi-do-an-man" với tham số page và size
    const response = await apiClient.get("/hien-thi-do-an-man", {
      params: { page, size },
    });
    console.log("Dữ liệu API nhận được:", response.data); // In dữ liệu để debug
    return response.data || { content: [], totalPages: 0 }; // Trả về dữ liệu hoặc mặc định
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

// Hàm lấy danh sách đồ chay với phân trang
export const getAllDoChay = async (page = 0, size = 12) => {
  try {
    // Gửi request GET tới endpoint "/hien-thi-do-chay" với tham số page và size
    const response = await apiClient.get("/hien-thi-do-chay", {
      params: { page, size },
    });
    console.log("Dữ liệu API nhận được", response.data); // In dữ liệu để debug
    return response.data || { content: [], totalPages: 0 }; // Trả về dữ liệu hoặc mặc định
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

// Hàm lấy danh sách đồ ăn vặt với phân trang
export const getAllDoAnVat = async (page = 0, size = 12) => {
  try {
    // Gửi request GET tới endpoint "/hien-thi-do-an-vat" với tham số page và size
    const response = await apiClient.get("/hien-thi-do-an-vat", {
      params: { page, size },
    });
    console.log("Dữ liệu API nhận được ", response.data); // In dữ liệu để debug
    return response.data || { content: [], totalPages: 0 }; // Trả về dữ liệu hoặc mặc định
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

// Hàm lấy danh sách món tráng miệng với phân trang
export const getAllMonTrangMieng = async (page = 0, size = 12) => {
  try {
    // Gửi request GET tới endpoint "/hien-thi-do-trang-mieng" với tham số page và size
    const response = await apiClient.get("/hien-thi-do-trang-mieng", {
      params: { page, size },
    });
    console.log("Dữ liệu API nhận được", response.data); // In dữ liệu để debug
    return response.data || { content: [], totalPages: 0 }; // Trả về dữ liệu hoặc mặc định
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};

// Hàm lấy danh sách nước uống với phân trang
export const getAllNuocUong = async (page = 0, size = 12) => {
  try {
    // Gửi request GET tới endpoint "/hien-thi-nuoc-uong" với tham số page và size
    const response = await apiClient.get("/hien-thi-nuoc-uong", {
      params: { page, size },
    });
    console.log("Dữ liệu API nhận được", response.data); // In dữ liệu để debug
    return response.data || { content: [], totalPages: 0 }; // Trả về dữ liệu hoặc mặc định
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách đồ ăn");
  }
};