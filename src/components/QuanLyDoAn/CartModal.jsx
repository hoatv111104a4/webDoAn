import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SanPham/CartModal.css"; // Đường dẫn đến file CSS của modal

const CartModal = ({ isOpen, onClose, cartItems }) => {
  const navigate = useNavigate();

  if (!isOpen) return null; // Không hiển thị modal nếu isOpen là false

  const handleCheckout = () => {
    onClose(); // Đóng modal trước
    // Truyền cartItems qua state khi điều hướng
    navigate("/website/checkout", { state: { cartItems } });
  };

  return (
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
        <button
          onClick={onClose}
          className="close-modal-button btn btn-primary"
          style={{ marginRight: "10px" }}
        >
          Đóng
        </button>
        {cartItems.length > 0 && (
          <button
            className="checkout-button btn btn-primary"
            onClick={handleCheckout}
          >
            Thanh toán ngay
          </button>
        )}
      </div>
    </div>
  );
};

export default CartModal;