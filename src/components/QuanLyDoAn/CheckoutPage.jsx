import React, { useState } from "react";
import "../../styles/SanPham/CheckoutPage.css";
const CheckoutPage = () => {
    return (
      <div className="checkout-page">
        <h1>Trang Thanh Toán</h1>
        <div className="checkout-content">
          <div className="checkout-form">
            <h2>Thông tin người nhận</h2>
            <label>
              Tên người nhận:
              <input type="text" placeholder="Nhập tên người nhận" />
            </label>
            <label>
              Số điện thoại:
              <input type="text" placeholder="Nhập số điện thoại" />
            </label>
            <label>
              Địa chỉ nhận hàng:
              <textarea placeholder="Nhập địa chỉ nhận hàng"></textarea>
            </label>
          </div>
          <div className="checkout-summary">
            <h2>Giỏ hàng của bạn</h2>
            <p>Hiện tại chưa có thông tin sản phẩm.</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default CheckoutPage;