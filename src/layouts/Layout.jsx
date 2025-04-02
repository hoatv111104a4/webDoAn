import React from "react";
import Header from "./Header";
import Sidebar from "./Aside";
import Content from "./Content";
import Footer from "./Footer";
import PageDoAn from "../components/QuanLyDoAn/TableDoAn";
import { BrowserRouter as Router , Routes,Route } from "react-router-dom";
import Layout2 from "./Layout2";
import "../styles/Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content">
          
            <Routes>
              <Route path="/" element={<Content/>} />
              <Route index element = {<h2>Trang tổng quan</h2>}/>
              <Route path="san-pham" element={<PageDoAn />} />
              <Route path="hoa-don" element={<h2>Hoá đơn</h2>} />
              <Route path="tai-khoan" element={<h2>Tài khoản</h2>} />
              <Route path="dang-xuat" element={<h2>Đăng xuất</h2>} />              
            </Routes>          
          
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
