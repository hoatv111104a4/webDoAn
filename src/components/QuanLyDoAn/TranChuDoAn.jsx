import React, { useState } from "react"; // Import React và hook useState để quản lý trạng thái
import { useQuery } from "@tanstack/react-query"; // Import hook useQuery từ react-query để lấy dữ liệu từ API
import { getAllDoAn2 } from "../../api/DoAnApi"; // Import hàm API để lấy danh sách món ăn
import AddCartModal from "./AddCartModal"; // Import component AddCartModal để hiển thị chi tiết món ăn
import "../../styles/SanPham/TranChuDoAn.css"; // Import file CSS để định kiểu cho trang

// Định nghĩa component PageTranChuDoAn, nhận prop searchTerm để tìm kiếm món ăn
const PageTranChuDoAn = ({ searchTerm }) => {
  // State để kiểm soát việc mở/đóng modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State để lưu món ăn được chọn khi mở modal
  const [selectedDoAn, setSelectedDoAn] = useState(null);
  // State để theo dõi trang hiện tại trong phân trang
  const [page, setPage] = useState(0);
  // State để xác định số lượng món ăn mỗi trang, không thay đổi nên dùng const
  const [size] = useState(12);

  // Sử dụng useQuery để lấy danh sách món ăn từ API
  const {
    data: doAn, // Dữ liệu trả về từ API
    error, // Lỗi nếu có
    isLoading, // Trạng thái đang tải lần đầu
    isFetching, // Trạng thái đang tải (bao gồm cả khi refetch)
  } = useQuery({
    queryKey: ["doAn", page, searchTerm], // Key để cache dữ liệu, thay đổi khi page hoặc searchTerm thay đổi
    queryFn: () => getAllDoAn2(page, size, searchTerm), // Hàm gọi API để lấy dữ liệu
    keepPreviousData: true, // Giữ dữ liệu cũ khi đang tải dữ liệu mới (tránh nhấp nháy giao diện)
    staleTime: 5000, // Dữ liệu được coi là "tươi" trong 5 giây trước khi refetch
  });

  // Hàm xử lý khi nhấn nút "Xem chi tiết" để mở modal
  const handleShowDetails = (doAn) => {
    setSelectedDoAn(doAn); // Lưu món ăn được chọn
    setIsModalOpen(true); // Mở modal
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
    setSelectedDoAn(null); // Xóa món ăn được chọn
  };

  // Nếu đang tải lần đầu, hiển thị thông báo "Đang tải..."
  if (isLoading) return <p>Đang tải...</p>;
  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) return <p>Lỗi: {error.message}</p>;

  // Lấy danh sách món ăn từ dữ liệu API, mặc định là mảng rỗng nếu không có
  const danhSachDoAn = doAn?.content || [];
  // Lấy tổng số trang từ dữ liệu API, mặc định là 0 nếu không có
  const totalPages = doAn?.totalPages || 0;

  // Giao diện của trang
  return (
    <div className="tran-chu-do-an"> {/* Container chính của trang */}
      <h1 className="page-title">Danh sách món ăn</h1> {/* Tiêu đề trang */}
      <div className="do-an-list"> {/* Phần hiển thị danh sách món ăn */}
        {/* Hiển thị "Đang tải..." khi đang fetch dữ liệu (kể cả khi chuyển trang) */}
        {isFetching && <div className="search-loading">Đang tải...</div>}
        
        {/* Kiểm tra nếu có món ăn trong danh sách */}
        {danhSachDoAn.length > 0 ? (
          <div className="do-an-grid"> {/* Lưới hiển thị các món ăn */}
            {danhSachDoAn.map((da) => ( // Duyệt qua từng món ăn
              <div key={da.id} className="card"> {/* Thẻ hiển thị thông tin mỗi món */}
                <img
                  src={
                    da.hinhAnh // Kiểm tra nếu món ăn có hình ảnh
                      ? `http://localhost:8080/uploads/${da.hinhAnh}` // Dùng URL từ server
                      : "/placeholder-image.png" // Nếu không có, dùng ảnh placeholder
                  }
                  alt={da.ten} // Tên món ăn làm alt text
                  className="card-img-top do-an-img" // Class CSS cho ảnh
                />
                <div className="card-body do-an-info"> {/* Phần thông tin món ăn */}
                  <h3 className="do-an-name">{da.ten}</h3> {/* Tên món ăn */}
                  <p className="do-an-price">
                    {Number(da.giaTien).toLocaleString()} đ {/* Giá tiền, định dạng số */}
                  </p>
                  <button
                    className="do-an-order-btn" // Nút xem chi tiết
                    onClick={() => handleShowDetails(da)} // Gọi hàm mở modal với món ăn được chọn
                  >
                    <i className="fas fa-shopping-cart"></i> Xem chi tiết {/* Icon và text */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không tìm thấy món ăn nào.</p> // Thông báo nếu không có món ăn
        )}
      </div>

      {/* Phần phân trang */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))} // Chuyển về trang trước, không nhỏ hơn 0
          disabled={page === 0 || isFetching} // Vô hiệu hóa nếu đang ở trang đầu hoặc đang tải
        >
          Trang trước
        </button>
        <span>
          Trang {page + 1} / {totalPages} {/* Hiển thị trang hiện tại và tổng số trang */}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} // Chuyển sang trang sau, không vượt quá totalPages
          disabled={page + 1 >= totalPages || isFetching} // Vô hiệu hóa nếu ở trang cuối hoặc đang tải
        >
          Trang sau
        </button>
      </div>

      {/* Component modal để hiển thị chi tiết món ăn */}
      <AddCartModal
        isOpen={isModalOpen} // Trạng thái mở/đóng modal
        onClose={handleCloseModal} // Hàm đóng modal
        doAn={selectedDoAn} // Món ăn được chọn
      />
    </div>
  );
};

// Xuất component để sử dụng ở nơi khác
export default PageTranChuDoAn;