import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/SanPham/CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const { cartItems = [] } = location.state || {}; // Lấy cartItems từ state, mặc định là mảng rỗng nếu không có dữ liệu

  // Tính tổng tiền
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.giaTien * item.quantity,
    0
  );

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
          {cartItems.length > 0 ? (
            <>
              <table className="checkout-table">
                <thead>
                  <tr>
                    
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td hidden>{item.id || index + 1}</td> {/* Nếu không có id thì dùng index */}
                      <td>{item.ten}</td>
                      <td>{item.quantity}</td>
                      <td>{item.giaTien.toLocaleString()}₫</td>
                      <td>{(item.giaTien * item.quantity).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-price">
                <strong>Tổng tiền: {totalPrice.toLocaleString()}₫</strong>
              </div>
            </>
          ) : (
            <p>Hiện tại chưa có thông tin sản phẩm.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;