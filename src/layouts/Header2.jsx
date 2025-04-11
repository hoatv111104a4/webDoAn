import React, { useState } from "react";
import "../styles/Header2.css";
import logo from "../assets/logo2.jpg";
import { Link, useNavigate } from "react-router-dom";

const Header2 = ({  userInfo }) => {
  const navigate = useNavigate();  

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  }; 

  return (
    <header className="header2">
      <div className="header2-container">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        
        <div className="cart" >
          <i className="fas fa-shopping-cart"></i> Giỏ hàng 
        </div>
        <div className="user">
          {!userInfo ? (
            <div className="account-options">
              <button
                className="account-button"
                onClick={() => navigate("/website/login")}
              >
                Đăng nhập
              </button>
              <button
                className="account-button"
                onClick={() => navigate("/website/register")}
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <div className="account-logged-in">
              <span className="user-name">Xin chào: {userInfo.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Đăng xuất
              </button>
              <button onClick={() => navigate("/")} className="logout-button">
                Cửa hàng của tôi
              </button>
            </div>
          )}
        </div>
      </div>
      <nav className="menu">
        <div className="menu-container">
          <Link className="menu-item" to="/website/trang-chu">
            Trang chủ
          </Link>
          <Link className="menu-item" to="/website/mon-man">
            Món mặn
          </Link>
          <Link className="menu-item" to="/website/mon-chay">
            Món chay
          </Link>
          <Link className="menu-item" to="/website/mon-an-vat">
            Món ăn vặt
          </Link>
          <Link className="menu-item" to="/website/mon-trang-mieng">
            Món tráng miệng
          </Link>
          <Link className="menu-item" to="/website/nuoc-uong">
            Nước uống
          </Link>
        </div>
      </nav>      
    </header>
  );
};

export default Header2;