import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/SanPham/CheckoutPage.css";

const CheckoutPage = () => {
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];

  // Tính tổng tiền
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.giaTien * item.soLuong,
    0
  );

  return (
    <div className="checkout-page">
      <h1>Thanh toán</h1>
      <div className="checkout-content">
        <div className="checkout-form">
          <h2>Thông tin người nhận</h2>
          <div className="form-group">
            <label htmlFor="name">Tên người nhận</label>
            <input id="name" type="text" placeholder="Nhập tên người nhận" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" type="text" placeholder="Nhập số điện thoại" />
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ nhận hàng</label>
            <textarea id="address" placeholder="Nhập địa chỉ nhận hàng" />
          </div>
        </div>
        <div className="checkout-summary">
          <h2>Giỏ hàng</h2>
          {cartItems.length > 0 ? (
            <>
              <table className="checkout-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.hinhAnh ? (
                          <img
                            src={`http://localhost:8080/uploads/${item.hinhAnh}`}
                            alt={item.ten}
                            className="cart-item-image"
                          />
                        ) : (
                          <span>Không có ảnh</span>
                        )}
                      </td>
                      <td>{item.ten}</td>
                      <td>{item.soLuong}</td>
                      <td>{parseInt(item.giaTien).toLocaleString()}₫</td>
                      <td>
                        {(item.giaTien * item.soLuong).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-price">
                <strong>Tổng tiền: {totalPrice.toLocaleString()}₫</strong>
              </div>
            </>
          ) : (
            <p>Giỏ hàng hiện đang trống.</p>
          )}
          <button className="btn btn-primary checkout-button">Xác nhận đơn hàng</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;