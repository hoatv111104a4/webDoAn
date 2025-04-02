import React from "react";
import "../styles/Sidebar.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo-copy.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo}alt="Logo" />
      </div>

      <nav>
        <Link className="btn" to="/">
          <i className="fas fa-home"></i>
          Trang tổng quan
        </Link>
        <Link className="btn" to="/san-pham">
          <i className="fas fa-box"></i>
          Sản phẩm
        </Link>
        <Link className="btn" to="/hoa-don">
          <i className="fas fa-file-invoice"></i>
          Đơn hàng
        </Link>
        <Link className="btn" to="/tai-khoan">
          <i className="fas fa-user"></i>
          Tài khoản
        </Link>
        <Link className="btn" to="/dang-xuat">
          <i className="fas fa-sign-out-alt"></i>
          Đăng xuất
        </Link>
        <Link className="btn" to="/website/trang-chu">
          <i className="fas fa-sign-out-alt"></i>
          Trang chủ
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;