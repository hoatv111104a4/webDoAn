import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Thêm axios để gọi API
import "../../styles/SanPham/FormDangKi.css";

const RegisterForm = ({ setUserInfo }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      // Gửi dữ liệu đến API
      const response = await axios.post("http://localhost:8080/api/nguoi-dung/dang-ki", null, {
        params: {
          ten: formData.fullName,
          email: formData.email,
          matKhau: formData.password,
          soDienThoai: formData.phone,
          gioiTinh: formData.gender === "male", // Chuyển đổi giới tính thành boolean
        },
      });

      // Hiển thị thông báo thành công
      toast.success("Đăng ký thành công!");
      console.log("Người dùng đã được thêm:", response.data);

      const userInfo = {
        id: response.data.id,
        name: response.data.tenNguoiDung,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Lưu thông tin người dùng vào state chung
      setUserInfo({
        id: response.data.id,
        name: response.data.tenNguoiDung,
      });

      // Reset form
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
      // Hiển thị thông báo lỗi
      const errorMessage =
        error.response?.data || "Có lỗi xảy ra khi đăng ký tài khoản.";
      toast.error(errorMessage);
      console.error("Lỗi khi đăng ký:", errorMessage);
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="form-title">Đăng Ký Tài Khoản</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Họ và tên:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            required
          />
        </div>
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
        <div className="form-group">
          <label>Giới tính:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>            
          </select>
        </div>
        <div className="form-group terms">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            Tôi đồng ý với điều khoản và chính sách.
          </label>
        </div>
        <button type="submit" className="submit-button">
          Đăng Ký
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;