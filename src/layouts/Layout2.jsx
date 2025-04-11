import React, { useState, useEffect } from "react";
import "../styles/App2.css";
import Header2 from "./Header2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Content2 from "./Content2";
import Footer from "./Footer";
import PageTranChuDoAn from "../components/QuanLyDoAn/TranChuDoAn";
import Banner from "./Banner";
import PageDoAnMan from "../components/QuanLyDoAn/DoAnMan";
import PageDoChay from "../components/QuanLyDoAn/DoChay";
import PageDoAnVat from "../components/QuanLyDoAn/DoAnVat";
import PageDoAnTrangMieng from "../components/QuanLyDoAn/DoAnTrangMieng";
import PageNuocuong from "../components/QuanLyDoAn/NuocUong";
import RegisterForm from "../components/QuanLyDoAn/FormDangKi";
import LoginForm from "../components/QuanLyDoAn/FormDangNhap";

import { CartProvider } from "../components/QuanLyDoAn/CartContext";

function Layout2() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Tải thông tin người dùng từ localStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <CartProvider> {/* Bọc toàn bộ nội dung trong CartProvider */}
      <div className="app2">
        <Header2 onSearch={handleSearch} userInfo={userInfo} />
        <Banner />
        <div className="website-content">
          <Routes>
            <Route path="/" element={<Content2 />}>
              <Route index path="trang-chu" element={<PageTranChuDoAn searchTerm={searchTerm} />} />
              <Route path="mon-man" element={<PageDoAnMan searchTerm={searchTerm} />} />
              <Route path="mon-chay" element={<PageDoChay />} />
              <Route path="mon-trang-mieng" element={<PageDoAnTrangMieng />} />
              <Route path="mon-an-vat" element={<PageDoAnVat />} />
              <Route path="nuoc-uong" element={<PageNuocuong />} />
              <Route path="login" element={<LoginForm setUserInfo={setUserInfo} />} />
              <Route path="register" element={<RegisterForm setUserInfo={setUserInfo} />} />
              
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default Layout2;