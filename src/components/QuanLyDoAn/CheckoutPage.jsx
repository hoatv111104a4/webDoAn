import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/SanPham/CheckoutPage.css";
import { toast } from "react-toastify";
import { addDonHang } from "../../api/DonHangApi";

// Hàm chuyển đổi định dạng ngày từ dd/MM/yyyy hoặc dd-MM-yyyy sang yyyy-MM-dd
const convertDateFormat = (dateString) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString; // Giữ nguyên nếu đã đúng định dạng yyyy-MM-dd
  }
  const separator = dateString.includes("/") ? "/" : "-";
  const [day, month, year] = dateString.split(separator);
  return `${year}-${month}-${day}`;
};

const CheckoutPage = () => {
  const { state } = useLocation();
  const [cartItems, setCartItems] = useState(state?.cartItems || []); // Chuyển cartItems thành state để có thể cập nhật

  // Tổng tiền giỏ hàng
  const totalPrice = cartItems.reduce((sum, item) => sum + item.giaTien * item.soLuong, 0);

  // State cho thông tin đơn hàng
  const [formDataDonHang, setFormDataDonHang] = useState({
    nguoiDatHang: "",
    nguoiNhanHang: "",
    tongTien: totalPrice,
    phiShip: 20000.0,
    thueDonHang: 10000.0,
    diaChiNhanHang: "",
    khungGioNhanHang: "",
    ngayMuonNhanHang: "",
  });

  // State cho chi tiết đơn hàng
  const [formDataDonHangCT, setFormDataDonHangCT] = useState({
    tenMonAn: cartItems[0]?.ten || "",
    giaTien: cartItems[0]?.giaTien || 0,
    soLuong: cartItems[0]?.soLuong || 1,
    tongTien: (cartItems[0]?.giaTien || 0) * (cartItems[0]?.soLuong || 1),
    doAn: { id: cartItems[0]?.id || 0 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataDonHang((prev) => ({
      ...prev,
      [name]: value,
      tongTien: totalPrice, // Đồng bộ tổng tiền
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        donHang: {
          ...formDataDonHang,
          ngayMuonNhanHang: convertDateFormat(formDataDonHang.ngayMuonNhanHang),
        },
        donHangChiTiet: formDataDonHangCT,
      };

      console.log("Payload gửi lên:", payload); // Kiểm tra payload

      await addDonHang(payload);
      toast.success("Đặt hàng thành công");

      // Reset form và làm trống giỏ hàng
      setFormDataDonHang({
        nguoiDatHang: "",
        nguoiNhanHang: "",
        tongTien: 0.0,
        phiShip: 20000.0,
        thueDonHang: 10000.0,
        diaChiNhanHang: "",
        khungGioNhanHang: "",
        ngayMuonNhanHang: "",
      });

      // Làm trống chi tiết đơn hàng và giỏ hàng
      setFormDataDonHangCT({
        tenMonAn: "",
        giaTien: 0,
        soLuong: 1,
        tongTien: 0,
        doAn: { id: 0 },
      });
      setCartItems([]); // Làm trống danh sách món ăn trên giao diện
    } catch (error) {
      toast.error(`Lỗi khi đặt hàng: ${error.message}`);
      console.error("Lỗi khi đặt hàng:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Thanh toán</h1>
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Thông tin người nhận</h2>

          <div className="form-group">
            <label htmlFor="name">Tên người nhận</label>
            <input
              id="name"
              type="text"
              name="nguoiDatHang"
              value={formDataDonHang.nguoiDatHang}
              onChange={handleChange}
              placeholder="Nhập tên người nhận"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="text"
              name="nguoiNhanHang"
              value={formDataDonHang.nguoiNhanHang}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ nhận hàng</label>
            <textarea
              id="address"
              name="diaChiNhanHang"
              value={formDataDonHang.diaChiNhanHang}
              onChange={handleChange}
              placeholder="Nhập địa chỉ nhận hàng"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ngayNhan">Ngày muốn nhận đơn hàng</label>
            <input
              id="ngayNhan"
              type="date"
              name="ngayMuonNhanHang"
              value={formDataDonHang.ngayMuonNhanHang}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="khungGio">Khung giờ nhận hàng</label>
            <select
              name="khungGioNhanHang"
              value={formDataDonHang.khungGioNhanHang}
              onChange={handleChange}
              required
            >
              <option value="">Chọn khung giờ</option>
              <option value="7:00 - 8:00">7:00 - 8:00</option>
              <option value="10:00 - 12:00">10:00 - 12:00</option>
              <option value="16:00 - 17:00">16:00 - 17:00</option>
              <option value="19:00 - 20:00">19:00 - 20:00</option>
              <option value="22:00 - 23:00">22:00 - 23:00</option>
            </select>
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
                        <td>{parseInt(item.giaTien).toLocaleString()} VND</td>
                        <td>{(item.giaTien * item.soLuong).toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="total-price">
                  <strong>Tổng tiền: {totalPrice.toLocaleString()} VND</strong>
                </div>
              </>
            ) : (
              <p>Giỏ hàng hiện đang trống.</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary checkout-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đơn hàng"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;