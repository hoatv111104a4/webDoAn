import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Thêm axios để gọi API
import "../../styles/SanPham/FormDangKi.css";

const LoginForm = ({ setUserInfo }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng nhập đến API
      const response = await axios.post("http://localhost:8080/api/nguoi-dung/dang-nhap", null, {
        params: {
          tenDangNhap: formData.email,
          matKhau: formData.password,
        },
      });

      // Hiển thị thông báo thành công
      toast.success("Đăng nhập thành công!");
      console.log("Người dùng đã đăng nhập:", response.data);

      const userInfo = {
        id: response.data.id,
        name: response.data.tenDangNhap,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Lưu thông tin người dùng vào state chung
      setUserInfo(userInfo);

      // Reset form
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      // Hiển thị thông báo lỗi
      const errorMessage =
        error.response?.data || "Email hoặc mật khẩu không chính xác.";
      toast.error(errorMessage);
      console.error("Lỗi khi đăng nhập:", errorMessage);
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="form-title">Đăng Nhập</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit" className="submit-button">
          Đăng Nhập
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;