import React, { useState } from "react"; // Import React và hook useState để quản lý trạng thái
import "../../styles/SanPham/AddCartModal.css"; // Import file CSS để định kiểu cho modal
import { useCart } from "./CartContext"; // Import hook useCart từ CartContext để tương tác với giỏ hàng

// Định nghĩa component AddCartModal, nhận 3 props: isOpen, onClose, doAn
const AddCartModal = ({ isOpen, onClose, doAn }) => {
  // Khai báo state quantity để lưu số lượng sản phẩm, mặc định là 1
  const [quantity, setQuantity] = useState(1);
  // Lấy hàm addToCart từ CartContext để thêm sản phẩm vào giỏ hàng
  const { addToCart } = useCart();

  // Nếu modal không được mở (isOpen = false) hoặc không có dữ liệu sản phẩm (doAn = null), không hiển thị gì
  if (!isOpen || !doAn) return null;

  // Hàm xử lý khi người dùng thay đổi số lượng
  const handleQuantityChange = (e) => {
    // Lấy giá trị từ input, đảm bảo là số nguyên và không nhỏ hơn 1
    const value = Math.max(1, parseInt(e.target.value) || 1); // Nếu không parse được thì mặc định là 1
    setQuantity(value); // Cập nhật state quantity
  };

  // Hàm xử lý khi nhấn nút "Thêm vào giỏ hàng"
  const handleAddToCart = () => {
    // Tạo một object mới chứa thông tin sản phẩm (doAn) và số lượng (quantity)
    addToCart({ ...doAn, quantity }); // Gọi hàm addToCart để thêm vào giỏ hàng
    onClose(); // Đóng modal sau khi thêm sản phẩm
  };

  // Giao diện của modal
  return (
    <div className="modal-overlay"> {/* Lớp phủ mờ bao quanh modal */}
      <div className="modal-content"> {/* Nội dung chính của modal */}
        {/* Nút đóng modal */}
        <button className="close-btn" onClick={onClose}>
          × {/* Ký hiệu "×" để đóng */}
        </button>
        
        {/* Tiêu đề modal: tên sản phẩm */}
        <h2>{doAn.ten}</h2>
        
        {/* Hình ảnh sản phẩm */}
        <img
          src={
            doAn.hinhAnh // Kiểm tra xem sản phẩm có hình ảnh không
              ? `http://localhost:8080/uploads/${doAn.hinhAnh}` // Nếu có, dùng URL từ server
              : "/placeholder-image.png" // Nếu không, dùng ảnh placeholder
          }
          alt={doAn.ten} // Tên sản phẩm làm alt text cho ảnh
          className="modal-img" // Class để định kiểu ảnh
        />
        
        {/* Giá sản phẩm, định dạng số với dấu phân cách */}
        <p>Giá: {Number(doAn.giaTien).toLocaleString()} đ</p>
        
        {/* Mô tả sản phẩm, nếu không có thì hiển thị mặc định */}
        <p>Mô tả: {doAn.moTa || "Không có mô tả."}</p>
        
        {/* Phần nhập số lượng */}
        <div className="quantity-input">
          <label htmlFor="quantity">Số lượng:</label> {/* Nhãn cho input */}
          <input
            type="number" // Input kiểu số
            id="quantity" // ID để liên kết với label
            value={quantity} // Giá trị hiện tại của quantity
            onChange={handleQuantityChange} // Gọi hàm khi thay đổi giá trị
            min="1" // Giá trị tối thiểu là 1
          />
        </div>
        
        {/* Nút thêm vào giỏ hàng */}
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <i className="fas fa-shopping-cart"></i> {/* Icon giỏ hàng (giả sử dùng FontAwesome) */}
          Thêm vào giỏ hàng {/* Văn bản nút */}
        </button>
      </div>
    </div>
  );
};

// Xuất component để sử dụng ở nơi khác
export default AddCartModal;