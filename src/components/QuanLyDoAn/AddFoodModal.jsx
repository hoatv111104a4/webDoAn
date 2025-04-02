import React, { useState, useEffect } from "react";
import "../../styles/SanPham/AddFoodModal.css";
import { getAllLoaiDoAn } from "../../api/LoaiDoAnApi";
import axios from "axios";
import { toast } from "react-toastify"; // Thư viện để hiển thị thông báo

const AddFoodModal = ({ isOpen, onClose, queryClient }) => {
  // State lưu danh sách loại đồ ăn
  const [loaiDoAnList, setLoaiDoAnList] = useState([]);
  // State để theo dõi trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState(false);
  // State để lưu lỗi nếu xảy ra
  const [error, setError] = useState(null);
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    ten: "",
    giaTien: "",
    loaiDoAnId: "",
    moTa: "",
  });
  // State lưu file hình ảnh được chọn
  const [imageFile, setImageFile] = useState(null);
  // State lưu URL xem trước hình ảnh
  const [imagePreview, setImagePreview] = useState("/placeholder-image.png");

  // useEffect để lấy danh sách loại đồ ăn khi modal được mở
  useEffect(() => {
    if (isOpen) {
      const fetchLoaiDoAn = async () => {
        setIsLoading(true); // Bắt đầu tải dữ liệu
        setError(null); // Xóa lỗi trước đó
        try {
          const data = await getAllLoaiDoAn(); // Gọi API lấy danh sách loại đồ ăn
          setLoaiDoAnList(data || []); // Lưu danh sách vào state
        } catch (err) {
          console.error("Lỗi khi lấy danh sách loại đồ ăn:", err);
          setError("Không thể tải danh sách loại đồ ăn. Vui lòng thử lại."); // Lưu lỗi vào state
        } finally {
          setIsLoading(false); // Kết thúc tải dữ liệu
        }
      };
      fetchLoaiDoAn();
    }
  }, [isOpen]); // Chỉ chạy khi `isOpen` thay đổi

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Cập nhật state formData
  };

  // Hàm xử lý khi người dùng chọn hình ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy file được chọn
    if (file) {
      setImageFile(file); // Lưu file vào state
      setImagePreview(URL.createObjectURL(file)); // Tạo URL xem trước hình ảnh
    }
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setError(null); // Xóa lỗi trước đó

    // Tạo FormData để gửi dữ liệu
    const data = new FormData();
    data.append("ten", formData.ten);
    data.append("giaTien", formData.giaTien);
    data.append("loaiDoAnId", formData.loaiDoAnId);
    data.append("moTa", formData.moTa);
    if (imageFile) {
      data.append("hinhAnh", imageFile); // Thêm hình ảnh nếu có
    }

    try {
      // Gửi yêu cầu POST để thêm món ăn
      const response = await axios.post("http://localhost:8080/api/do-an/them-do-an", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Thêm món thành công:", response.data);
      toast.success("Thêm món ăn thành công!"); // Hiển thị thông báo thành công
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["doAn"] }); // Làm mới danh sách món ăn
      }
      onClose(); // Đóng modal
    } catch (err) {
      const errorMessage = err.response?.data || err.message || "Có lỗi xảy ra khi thêm món ăn.";
      console.error("Lỗi khi thêm món:", errorMessage);
      toast.error(errorMessage); // Hiển thị thông báo lỗi
    }
  };

  // Nếu modal không mở, không hiển thị gì
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Nút đóng modal */}
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Thêm Món Ăn</h2>
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Phần bên trái: Hình ảnh */}
            <div className="modal-left">
              <div className="image-placeholder">
                <img src={imagePreview} alt="Ảnh món ăn" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="btn-upload">
                Chọn hình ảnh
              </label>
            </div>

            {/* Phần bên phải: Form nhập liệu */}
            <div className="modal-right">
              <label>Tên món</label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                placeholder="Nhập tên món"
                required
              />
              <label>Loại đồ ăn</label>
              {isLoading ? (
                <p>Đang tải...</p> // Hiển thị khi đang tải danh sách loại đồ ăn
              ) : (
                <select
                  name="loaiDoAnId"
                  value={formData.loaiDoAnId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn loại đồ ăn</option>
                  {loaiDoAnList.map((loaida) => (
                    <option key={loaida.id} value={loaida.id}>
                      {loaida.ten}
                    </option>
                  ))}
                </select>
              )}

              <label>Giá tiền</label>
              <input
                type="text"
                name="giaTien"
                value={formData.giaTien}
                onChange={handleChange}
                placeholder="Nhập giá tiền"
                required
              />
              <label>Mô tả</label>
              <textarea
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                placeholder="Nhập mô tả món ăn..."
              />

              {/* Nút submit */}
              <button type="submit" className="btn-submit">
                Thêm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;