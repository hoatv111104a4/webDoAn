import React, { createContext, useState, useContext } from "react"; // Import React và các hook cần thiết

// Tạo một Context để quản lý giỏ hàng
const CartContext = createContext(); // Context này sẽ được dùng để chia sẻ trạng thái giỏ hàng giữa các component

// Định nghĩa CartProvider - component cung cấp Context cho các component con
export const CartProvider = ({ children }) => {
  // State để lưu danh sách các sản phẩm trong giỏ hàng, mặc định là mảng rỗng
  const [cartItems, setCartItems] = useState([]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (item) => {
    // Cập nhật cartItems bằng cách thêm item mới vào danh sách hiện tại
    setCartItems((prevItems) => [...prevItems, item]); // Sử dụng spread operator để giữ các item cũ và thêm item mới
  };

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]); // Đặt lại cartItems thành mảng rỗng
  };

  // Trả về Provider để bao bọc các component con
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, clearCart }} // Giá trị được chia sẻ qua Context: danh sách item, hàm thêm và xóa
    >
      {children} {/* Các component con sẽ được render bên trong Provider */}
    </CartContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng CartContext dễ dàng hơn
export const useCart = () => useContext(CartContext); // Trả về giá trị của CartContext tại component gọi hook này