import React, { useState } from "react"; // Import React và hook useState để quản lý trạng thái
import { toast, ToastContainer } from "react-toastify"; // Import thư viện toast để hiển thị thông báo
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import axios from "axios"; // Import axios để gửi request HTTP
import "../../styles/SanPham/FormDangKi.css"; // Import file CSS để định kiểu cho form

// Định nghĩa component RegisterForm, nhận prop setUserInfo để cập nhật thông tin người dùng
const RegisterForm = ({ setUserInfo }) => {
  // State để lưu dữ liệu form đăng ký
  const [formData, setFormData] = useState({
    fullName: "", // Họ và tên
    email: "", // Email
    password: "", // Mật khẩu
    confirmPassword: "", // Xác nhận mật khẩu
    phone: "", // Số điện thoại
    gender: "", // Giới tính
    termsAccepted: false, // Đồng ý với điều khoản
  });

  // Hàm xử lý khi thay đổi giá trị trong form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Lấy tên, giá trị, loại input và trạng thái checked
    setFormData({ 
      ...formData, // Giữ các giá trị cũ
      [name]: type === "checkbox" ? checked : value // Cập nhật giá trị mới, checkbox dùng checked, các input khác dùng value
    });
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn hành vi submit mặc định của form
    
    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!"); // Hiển thị thông báo lỗi
      return; // Dừng xử lý nếu không khớp
    }

    try {
      // Gửi request POST tới API đăng ký
      const response = await axios.post(
        "http://localhost:8080/api/nguoi-dung/dang-ki", // URL API
        null, // Không gửi body, dùng params thay thế
        {
          params: { // Các tham số gửi qua query string
            ten: formData.fullName, // Tên người dùng
            email: formData.email, // Email
            matKhau: formData.password, // Mật khẩu
            soDienThoai: formData.phone, // Số điện thoại
            gioiTinh: formData.gender === "male", // Giới tính: true nếu là nam, false nếu là nữ
          },
        }
      );

      toast.success("Đăng ký thành công!"); // Hiển thị thông báo thành công
      
      // Tạo object chứa thông tin người dùng từ response
      const userInfo = {
        id: response.data.id, // ID người dùng
        name: response.data.tenNguoiDung, // Tên người dùng từ server
      };
      
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // Cập nhật thông tin người dùng qua prop setUserInfo
      setUserInfo(userInfo);

      // Reset form về trạng thái ban đầu sau khi đăng ký thành công
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
        termsAccepted: false,
      });
    } catch (error) {
      // Xử lý lỗi nếu request thất bại
      const errorMessage = error.response?.data || "Có lỗi xảy ra khi đăng ký tài khoản.";
      toast.error(errorMessage); // Hiển thị thông báo lỗi
    }
  };

  // Giao diện của form đăng ký
  return (
    <div className="register-form-container"> {/* Container chính của form */}
      <h2 className="form-title">Đăng Ký Tài Khoản</h2> {/* Tiêu đề form */}
      <form onSubmit={handleSubmit} className="register-form"> {/* Form đăng ký */}
        {/* Nhóm input cho họ và tên */}
        <div className="form-group">
          <label>Họ và tên:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName} // Giá trị từ state
            onChange={handleChange} // Gọi hàm khi thay đổi
            placeholder="Nhập họ và tên"
            required // Bắt buộc nhập
          />
        </div>
        
        {/* Nhóm input cho email */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
          />
        </div>
        
        {/* Nhóm input cho mật khẩu */}
        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        
        {/* Nhóm input cho xác nhận mật khẩu */}
        <div className="form-group">
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu"
            required
          />
        </div>
        
        {/* Nhóm input cho số điện thoại */}
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>
        
        {/* Nhóm select cho giới tính */}
        <div className="form-group">
          <label>Giới tính:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
        
        {/* Nhóm checkbox cho điều khoản */}
        <div className="form-group terms">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted} // Trạng thái checked từ state
              onChange={handleChange}
              required // Bắt buộc đồng ý
            />
            Tôi đồng ý với điều khoản và chính sách.
          </label>
        </div>
        
        {/* Nút submit form */}
        <button type="submit" className="submit-button">Đăng Ký</button>
      </form>
      <ToastContainer /> {/* Container cho thông báo toast */}
    </div>
  );
};

// Xuất component để sử dụng ở nơi khác
export default RegisterForm;