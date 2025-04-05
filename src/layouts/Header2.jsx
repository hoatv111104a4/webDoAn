import React, { useState } from "react";
import "../styles/Header2.css";
import logo from "../assets/logo2.jpg";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/Search/SearchBar";
import { useCart } from "../components/QuanLyDoAn/CartContext";

const Header2 = ({ onSearch, userInfo }) => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Lấy danh sách sản phẩm từ context
  const [isCartModalOpen, setCartModalOpen] = useState(false); // Trạng thái hiển thị modal

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  const handleViewCart = () => {
    setCartModalOpen(true); // Mở modal khi nhấn vào giỏ hàng
  };

  const closeCartModal = () => {
    setCartModalOpen(false); // Đóng modal
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
        <div className="cart" onClick={handleViewCart}>
          <i className="fas fa-shopping-cart"></i> Giỏ hàng ({cartItems.length})
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

      {isCartModalOpen && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <h2>Giỏ hàng của bạn</h2>
            {cartItems.length > 0 ? (
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>
                    <span>
                      <strong>{item.ten}</strong>
                    </span>{" "}
                    -<span> Số lượng: {item.quantity}</span> -
                    <span> Giá: {item.giaTien.toLocaleString()}₫</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Giỏ hàng của bạn đang trống.</p>
            )}
            <button onClick={closeCartModal} className="close-modal-button">
              Đóng
            </button>
            {cartItems.length > 0 && (
              <button
                className="checkout-button"
                onClick={() => navigate("/website/checkout")}
              >
                Thanh toán ngay
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header2;
