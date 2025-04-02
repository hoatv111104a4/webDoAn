import React from "react";
import "../styles/Header2.css";
import logo from "../assets/logo-copy.png";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/Search/SearchBar";


const Header2 = ({ onSearch, userInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload(); // Làm mới trang để xóa state
  };

  return (
    <header className="header2">
      <div className="header2-container">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="search">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="cart">
          
          Giỏ hàng
        </div>
        <div className="user">
          {!userInfo ? (
            // Khi chưa đăng nhập hoặc đăng ký
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
            // Khi đã đăng nhập hoặc đăng ký
            <div className="account-logged-in">
              <span className="user-name">Xin chào: {userInfo.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Đăng xuất
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
