import React, { useState, useEffect } from "react"; // Import React và các hook useState, useEffect
import "../../styles/SanPham/AddFoodModal.css"; // Import file CSS để định kiểu cho modal
import { getAllLoaiDoAn } from "../../api/LoaiDoAnApi"; // Import hàm API để lấy danh sách loại đồ ăn
import axios from "axios"; // Import axios để gửi request HTTP
import { toast } from "react-toastify"; // Import thư viện toast để hiển thị thông báo

// Định nghĩa component AddFoodModal, nhận 3 props: isOpen, onClose, queryClient
const AddFoodModal = ({ isOpen, onClose, queryClient }) => {
  // State để lưu danh sách loại đồ ăn từ API
  const [loaiDoAnList, setLoaiDoAnList] = useState([]);
  // State để theo dõi trạng thái đang tải dữ liệu
  const [isLoading, setIsLoading] = useState(false);
  // State để lưu thông báo lỗi nếu có
  const [error, setError] = useState(null);
  // State để lưu dữ liệu form (tên, giá, loại, mô tả)
  const [formData, setFormData] = useState({ ten: "", giaTien: "", loaiDoAnId: "", moTa: "" });
  // State để lưu file ảnh được chọn
  const [imageFile, setImageFile] = useState(null);
  // State để lưu URL xem trước của ảnh, mặc định là placeholder
  const [imagePreview, setImagePreview] = useState("/placeholder-image.png");

  // Hook useEffect để lấy danh sách loại đồ ăn khi modal mở
  useEffect(() => {
    if (isOpen) { // Chỉ chạy khi modal được mở
      const fetchLoaiDoAn = async () => {
        setIsLoading(true); // Bật trạng thái đang tải
        setError(null); // Xóa lỗi cũ (nếu có)
        try {
          const data = await getAllLoaiDoAn(); // Gọi API để lấy danh sách loại đồ ăn
          setLoaiDoAnList(data || []); // Cập nhật danh sách, nếu không có dữ liệu thì dùng mảng rỗng
        } catch (err) {
          console.error("Lỗi khi lấy danh sách loại đồ ăn:", err); // In lỗi ra console để debug
          setError("Không thể tải danh sách loại đồ ăn. Vui lòng thử lại."); // Cập nhật thông báo lỗi
        } finally {
          setIsLoading(false); // Tắt trạng thái đang tải dù thành công hay thất bại
        }
      };
      fetchLoaiDoAn(); // Gọi hàm lấy dữ liệu
    }
  }, [isOpen]); // Chạy lại khi isOpen thay đổi

  // Hàm xử lý khi người dùng thay đổi giá trị trong form
  const handleChange = (e) => {
    const { name, value } = e.target; // Lấy tên và giá trị từ input/select/textarea
    setFormData((prev) => ({ ...prev, [name]: value })); // Cập nhật formData với giá trị mới
  };

  // Hàm xử lý khi người dùng chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên từ input file
    if (file) { // Nếu có file được chọn
      setImageFile(file); // Lưu file vào state
      setImagePreview(URL.createObjectURL(file)); // Tạo URL tạm để xem trước ảnh
    }
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn hành vi submit mặc định của form
    setError(null); // Xóa lỗi cũ (nếu có)
    
    // Tạo FormData để gửi dữ liệu dạng multipart (bao gồm file ảnh)
    const data = new FormData();
    data.append("ten", formData.ten); // Thêm tên món ăn
    data.append("giaTien", formData.giaTien); // Thêm giá tiền
    data.append("loaiDoAnId", formData.loaiDoAnId); // Thêm ID loại đồ ăn
    data.append("moTa", formData.moTa); // Thêm mô tả
    if (imageFile) { // Nếu có file ảnh
      data.append("hinhAnh", imageFile); // Thêm file ảnh vào FormData
    }

    try {
      // Gửi request POST tới API để thêm món ăn
      const response = await axios.post("http://localhost:8080/api/do-an/them-do-an", data, {
        headers: { "Content-Type": "multipart/form-data" }, // Định dạng multipart cho file
      });
      console.log("Thêm món thành công:", response.data); // In dữ liệu trả về để debug
      toast.success("Thêm món ăn thành công!"); // Hiển thị thông báo thành công
      if (queryClient) { // Nếu có queryClient (từ react-query)
        queryClient.invalidateQueries({ queryKey: ["doAn"] }); // Làm mới danh sách đồ ăn
      }
      onClose(); // Đóng modal sau khi thêm thành công
    } catch (err) {
      // Xử lý lỗi nếu request thất bại
      const errorMessage = err.response?.data || err.message || "Có lỗi xảy ra khi thêm món ăn.";
      console.error("Lỗi khi thêm món:", errorMessage); // In lỗi để debug
      toast.error(errorMessage); // Hiển thị thông báo lỗi
    }
  };

  // Nếu modal không mở, không hiển thị gì
  if (!isOpen) return null;

  // Giao diện của modal
  return (
    <div className="modal-overlay"> {/* Lớp phủ mờ bao quanh modal */}
      <div className="modal-content"> {/* Nội dung chính của modal */}
        <button className="modal-close" onClick={onClose}>×</button> {/* Nút đóng modal */}
        <h2>Thêm Món Ăn</h2> {/* Tiêu đề modal */}
        {error && <div className="error-message"><p>{error}</p></div>} {/* Hiển thị lỗi nếu có */}
        <form onSubmit={handleSubmit}> {/* Form để nhập thông tin */}
          <div className="modal-body"> {/* Phần thân modal */}
            {/* Phần bên trái: Hình ảnh */}
            <div className="modal-left">
              <div className="image-placeholder">
                <img src={imagePreview} alt="Ảnh món ăn" /> {/* Hiển thị ảnh xem trước */}
              </div>
              <input
                type="file" // Input để chọn file ảnh
                accept="image/*" // Chỉ chấp nhận file ảnh
                onChange={handleImageChange} // Gọi hàm khi chọn ảnh
                style={{ display: "none" }} // Ẩn input, dùng label để kích hoạt
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="btn-upload">Chọn hình ảnh</label> {/* Nút chọn ảnh */}
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
                required // Bắt buộc nhập
              />
              <label>Loại đồ ăn</label>
              {isLoading ? ( // Nếu đang tải dữ liệu
                <p>Đang tải...</p>
              ) : (
                <select
                  name="loaiDoAnId"
                  value={formData.loaiDoAnId}
                  onChange={handleChange}
                  required // Bắt buộc chọn
                >
                  <option value="">Chọn loại đồ ăn</option> {/* Lựa chọn mặc định */}
                  {loaiDoAnList.map((loaida) => ( // Duyệt danh sách loại đồ ăn
                    <option key={loaida.id} value={loaida.id}>{loaida.ten}</option>
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
                required // Bắt buộc nhập
              />
              <label>Mô tả</label>
              <textarea
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                placeholder="Nhập mô tả món ăn..."
              />
              <button type="submit" className="btn-submit">Thêm</button> {/* Nút submit form */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Xuất component để sử dụng ở nơi khác
export default AddFoodModal;