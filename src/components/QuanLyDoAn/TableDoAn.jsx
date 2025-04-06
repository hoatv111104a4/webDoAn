import React, { useState, useRef } from "react"; // Import React, useState để quản lý trạng thái, useRef để tham chiếu DOM
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"; // Import các hook từ react-query để quản lý dữ liệu và mutation
import { getAllDoAn, searchDoAn } from "../../api/DoAnApi"; // Import hàm API để lấy và tìm kiếm món ăn
import "../../styles/SanPham/DoAn.css"; // Import file CSS để định kiểu cho trang
import AddFoodModal from "./AddFoodModal"; // Import modal để thêm món ăn mới
import EditFoodModal from "./EditFoodModal"; // Import modal để chỉnh sửa món ăn
import axios from "axios"; // Import axios để gửi request HTTP
import { toast, ToastContainer } from "react-toastify"; // Import thư viện toast để hiển thị thông báo
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

// Định nghĩa component PageDoAn
const PageDoAn = () => {
  const queryClient = useQueryClient(); // Lấy queryClient từ react-query để làm mới dữ liệu
  const [isModalOpen, setIsModalOpen] = useState(false); // State kiểm soát modal thêm món ăn
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State kiểm soát modal chỉnh sửa món ăn
  const [selectedDoAn, setSelectedDoAn] = useState(null); // State lưu món ăn được chọn để chỉnh sửa
  const [page, setPage] = useState(0); // State theo dõi trang hiện tại trong phân trang
  const [size] = useState(10); // Số lượng món ăn mỗi trang, cố định là 10
  const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm tạm thời (input)
  const [selectedSearchTerm, setSelectedSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm đã chọn
  const [showSuggestions, setShowSuggestions] = useState(false); // State kiểm soát hiển thị gợi ý tìm kiếm
  const inputRef = useRef(null); // Tham chiếu đến input tìm kiếm

  // Fetch danh sách món ăn chính bằng useQuery
  const { data: doAn, error, isLoading, isFetching } = useQuery({
    queryKey: ["doAn", page, selectedSearchTerm], // Key để cache, thay đổi khi page hoặc selectedSearchTerm thay đổi
    queryFn: () => selectedSearchTerm.trim() // Kiểm tra nếu có từ khóa tìm kiếm
      ? searchDoAn(selectedSearchTerm, page + 1, size) // Gọi API tìm kiếm với page bắt đầu từ 1
      : getAllDoAn(page, size), // Gọi API lấy tất cả món ăn với page bắt đầu từ 0
    keepPreviousData: true, // Giữ dữ liệu cũ khi đang tải dữ liệu mới
    staleTime: 5000, // Dữ liệu "tươi" trong 5 giây trước khi refetch
  });

  // Fetch gợi ý tìm kiếm bằng useQuery
  const { data: suggestions, isFetching: isFetchingSuggestions } = useQuery({
    queryKey: ["suggestions", searchTerm], // Key để cache gợi ý, thay đổi khi searchTerm thay đổi
    queryFn: () => searchDoAn(searchTerm, 1, 5), // Gọi API tìm kiếm với tối đa 5 gợi ý
    enabled: !!searchTerm.trim(), // Chỉ chạy khi searchTerm không rỗng
    staleTime: 5000, // Dữ liệu "tươi" trong 5 giây
  });

  // Mutation để xóa món ăn
  const deleteMutation = useMutation({
    mutationFn: async (id) => { // Hàm gửi request DELETE tới API
      const response = await axios.delete(`http://localhost:8080/api/do-an/xoa-do-an/${id}`);
      return response.data; // Trả về dữ liệu từ server
    },
    onSuccess: () => { // Khi xóa thành công
      queryClient.invalidateQueries({ queryKey: ["doAn"] }); // Làm mới danh sách món ăn
      toast.success("Xóa món ăn thành công!"); // Hiển thị thông báo thành công
    },
    onError: (err) => { // Khi xóa thất bại
      const errorMessage = err.response?.data || err.message || "Có lỗi xảy ra khi xóa món ăn.";
      console.error("Lỗi khi xóa món:", errorMessage); // In lỗi để debug
      toast.error(errorMessage); // Hiển thị thông báo lỗi
    },
  });

  // Hàm đóng modal thêm món ăn
  const handleCloseModal = () => setIsModalOpen(false);

  // Hàm đóng modal chỉnh sửa món ăn
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); // Đóng modal
    setSelectedDoAn(null); // Xóa món ăn được chọn
  };

  // Hàm hiển thị chi tiết món ăn trong modal chỉnh sửa
  const handleShowDetails = (doAn) => {
    setSelectedDoAn(doAn); // Lưu món ăn được chọn
    setIsEditModalOpen(true); // Mở modal chỉnh sửa
  };

  // Hàm xóa món ăn
  const handleDeleteDoAn = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) { // Hiển thị xác nhận trước khi xóa
      deleteMutation.mutate(id); // Gọi mutation để xóa món ăn
    }
  };

  // Hàm xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm tạm thời
    setShowSuggestions(true); // Hiển thị gợi ý tìm kiếm
  };

  // Hàm xử lý khi chọn một gợi ý
  const handleSuggestionClick = (doAn) => {
    setSearchTerm(doAn.ten); // Cập nhật từ khóa tìm kiếm bằng tên món ăn được chọn
    setSelectedSearchTerm(doAn.ten); // Xác nhận từ khóa tìm kiếm
    setShowSuggestions(false); // Ẩn gợi ý
    setPage(0); // Đặt lại về trang đầu tiên
  };

  // Hàm xử lý khi input mất focus
  const handleInputBlur = () => setTimeout(() => setShowSuggestions(false), 200); // Ẩn gợi ý sau 200ms để cho phép click gợi ý

  // Hàm reset tìm kiếm
  const handleReset = () => {
    setSearchTerm(""); // Xóa từ khóa tìm kiếm tạm thời
    setSelectedSearchTerm(""); // Xóa từ khóa tìm kiếm đã chọn
    setShowSuggestions(false); // Ẩn gợi ý
    setPage(0); // Đặt lại về trang đầu tiên
  };

  // Nếu đang tải lần đầu, hiển thị thông báo
  if (isLoading) return <p>Đang tải...</p>;
  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    toast.error(error.message); // Hiển thị thông báo lỗi qua toast
    return <p>Lỗi: {error.message}</p>;
  }

  // Lấy danh sách món ăn và tổng số trang từ dữ liệu API
  const danhSachDoAn = doAn?.content ?? []; // Mảng món ăn, mặc định rỗng nếu không có
  const totalPages = doAn?.totalPages ?? 0; // Tổng số trang, mặc định 0 nếu không có
  const baseUrl = "http://localhost:8080/uploads/"; // URL cơ sở cho hình ảnh

  // Giao diện của trang
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> {/* Container cho thông báo toast */}
      <div className="do-an-header"> {/* Phần tiêu đề và tìm kiếm */}
        <h2>Danh sách đồ ăn</h2> {/* Tiêu đề trang */}
        <div className="search-bar" style={{ position: "relative" }}> {/* Thanh tìm kiếm */}
          <input
            ref={inputRef} // Tham chiếu đến input
            type="text"
            placeholder="Tìm kiếm món ăn theo tên..."
            value={searchTerm} // Giá trị từ khóa tìm kiếm
            onChange={handleSearchChange} // Gọi hàm khi thay đổi
            onFocus={() => setShowSuggestions(true)} // Hiển thị gợi ý khi focus
            onBlur={handleInputBlur} // Ẩn gợi ý khi mất focus
            className="search-input"
          />
          {showSuggestions && searchTerm.trim() && ( // Hiển thị gợi ý nếu có từ khóa và showSuggestions = true
            <ul className="suggestions-list"> {/* Danh sách gợi ý */}
              {isFetchingSuggestions ? ( // Nếu đang tải gợi ý
                <li className="suggestion-item">Đang tải gợi ý...</li>
              ) : suggestions?.content?.length > 0 ? ( // Nếu có gợi ý
                suggestions.content.map((da) => (
                  <li
                    key={da.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(da)} // Chọn gợi ý khi click
                  >
                    {da.ten}
                  </li>
                ))
              ) : (
                <li className="suggestion-item">Không tìm thấy gợi ý</li> // Nếu không có gợi ý
              )}
            </ul>
          )}
        </div>
        <button className="btn-reset" onClick={handleReset}>Reset</button> {/* Nút reset tìm kiếm */}
        <button className="btn-add-food" onClick={() => setIsModalOpen(true)}>
          + Thêm món mới {/* Nút mở modal thêm món ăn */}
        </button>
      </div>

      {/* Modal thêm và chỉnh sửa món ăn */}
      <AddFoodModal isOpen={isModalOpen} onClose={handleCloseModal} queryClient={queryClient} />
      <EditFoodModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        queryClient={queryClient}
        doAn={selectedDoAn}
      />

      <div className="do-an-list"> {/* Danh sách món ăn */}
        {isFetching && <div className="search-loading">Đang tải...</div>} {/* Thông báo khi đang tải */}
        {danhSachDoAn.length > 0 ? ( // Nếu có món ăn
          danhSachDoAn.map((da) => ( // Duyệt qua từng món ăn
            <div key={da.id} className="do-an-item"> {/* Mỗi món ăn là một item */}
              <div className="do-an-left"> {/* Phần bên trái: hình ảnh */}
                <img
                  src={da.hinhAnh ? `${baseUrl}${da.hinhAnh}` : "/placeholder-image.png"} // Hình ảnh món ăn
                  alt={da.ten}
                  className="do-an-img"
                />
              </div>
              <div className="do-an-right"> {/* Phần bên phải: thông tin */}
                <div>
                  <h3>{da.ten}</h3> {/* Tên món ăn */}
                  <p>{da.moTa || "Không có mô tả"}</p> {/* Mô tả */}
                  <p style={{ color: "red", fontWeight: "bold" }}>{da.giaTien} VND</p> {/* Giá tiền */}
                  <p className="p-loai-do-an">{da.loaiDoAn?.ten || "Không có loại"}</p> {/* Loại đồ ăn */}
                </div>
                <div className="do-an-actions"> {/* Các nút hành động */}
                  <button className="btn-details" onClick={() => handleShowDetails(da)}>
                    Chi tiết {/* Nút mở modal chỉnh sửa */}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteDoAn(da.id)} // Nút xóa món ăn
                    disabled={deleteMutation.isLoading} // Vô hiệu hóa khi đang xóa
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy món ăn nào.</p> // Thông báo nếu không có món ăn
        )}
      </div>

      {/* Phần phân trang */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))} // Chuyển về trang trước
          disabled={page === 0 || isFetching} // Vô hiệu hóa nếu ở trang đầu hoặc đang tải
        >
          Trang trước
        </button>
        <span>Trang {page + 1} / {totalPages}</span> {/* Hiển thị trang hiện tại và tổng số trang */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} // Chuyển sang trang sau
          disabled={page === totalPages - 1 || isFetching} // Vô hiệu hóa nếu ở trang cuối hoặc đang tải
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

// Xuất component để sử dụng ở nơi khác
export default PageDoAn;