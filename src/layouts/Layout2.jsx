import React, { useState,useEffect } from "react";
import "../styles/App2.css";
import Header2 from "./Header2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Content2 from "./Content2";
import Footer from "./Footer";
import PageTranChuDoAn from "../components/QuanLyDoAn/TranChuDoAn";
import Banner from "./Banner";
import PageDoAnMan from "../components/QuanLyDoAn/DoAnMan";
import RegisterForm from "../components/QuanLyDoAn/FormDangKi";
import LoginForm from "../components/QuanLyDoAn/FormDangNhap";
function Layout2() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState(null); // State để lưu thông tin người dùng
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
    <div className="app2">
      <Header2 onSearch={handleSearch} userInfo={userInfo} />
      <Banner />
      <div className="website-content">
      <Routes>
      <Route path="/" element={<Content2 />}>
        <Route index path="trang-chu" element={<PageTranChuDoAn searchTerm={searchTerm} />} />
        <Route path="mon-man" element={<PageDoAnMan searchTerm={searchTerm} />} />
        <Route path="mon-chay" element={<h2>Món chay</h2>} />
        <Route path="mon-trang-mieng" element={<h2>Món tráng miệng</h2>} />
        <Route path="mon-an-vat" element={<h2>Món ăn vặt</h2>} />
        <Route path="nuoc-uong" element={<h2>Nước uống</h2>} />
        <Route path="login" element={<LoginForm setUserInfo={setUserInfo}/>} />
        <Route path="register" element={<RegisterForm setUserInfo={setUserInfo}/>} />
      </Route>
    </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Layout2;
