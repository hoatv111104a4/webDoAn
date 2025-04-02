
export const getAllLoaiDoAn = async () => {
    const response = await fetch("http://localhost:8080/api/do-an/show-form-them-do-an");
    if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
    }
    const data = await response.json();
    console.log("Dữ liệu API nhận được:", data);
    return data;
};
