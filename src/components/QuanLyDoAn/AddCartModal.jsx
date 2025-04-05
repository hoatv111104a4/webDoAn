import React, { useState } from "react";
import "../../styles/SanPham/AddCartModal.css";
import { useCart } from "./CartContext";

const AddCartModal = ({ isOpen, onClose, doAn }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); // Lấy hàm addToCart từ context

  if (!isOpen || !doAn) return null;

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart({ ...doAn, quantity }); // Thêm sản phẩm vào giỏ hàng
    onClose(); // Đóng modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{doAn.ten}</h2>
        <img
          src={
            doAn.hinhAnh
              ? `http://localhost:8080/uploads/${doAn.hinhAnh}`
              : "/placeholder-image.png"
          }
          alt={doAn.ten}
          className="modal-img"
        />
        <p>Giá: {Number(doAn.giaTien).toLocaleString()} đ</p>
        <p>Mô tả: {doAn.moTa || "Không có mô tả."}</p>
        <div className="quantity-input">
          <label htmlFor="quantity">Số lượng:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
          />
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default AddCartModal;