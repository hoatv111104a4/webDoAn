import React, { useState, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAllDoAn, searchDoAn } from "../../api/DoAnApi";
import "../../styles/SanPham/DoAn.css";
import AddFoodModal from "./AddFoodModal";
import EditFoodModal from "./EditFoodModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PageDoAn = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoAn, setSelectedDoAn] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Fetch danh sách món ăn chính
  const { data: doAn, error, isLoading, isFetching } = useQuery({
    queryKey: ["doAn", page, selectedSearchTerm],
    queryFn: () => selectedSearchTerm.trim()
      ? searchDoAn(selectedSearchTerm, page + 1, size)
      : getAllDoAn(page, size),
    keepPreviousData: true,
    staleTime: 5000,
  });

  // Fetch gợi ý tìm kiếm
  const { data: suggestions, isFetching: isFetchingSuggestions } = useQuery({
    queryKey: ["suggestions", searchTerm],
    queryFn: () => searchDoAn(searchTerm, 1, 5),
    enabled: !!searchTerm.trim(),
    staleTime: 5000,
  });

  // Mutation xóa món ăn
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`http://localhost:8080/api/do-an/xoa-do-an/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doAn"] });
      toast.success("Xóa món ăn thành công!");
    },
    onError: (err) => {
      const errorMessage = err.response?.data || err.message || "Có lỗi xảy ra khi xóa món ăn.";
      console.error("Lỗi khi xóa món:", errorMessage);
      toast.error(errorMessage);
    },
  });

  // Xử lý đóng/mở modal
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDoAn(null);
  };

  // Xử lý hiển thị chi tiết món ăn
  const handleShowDetails = (doAn) => {
    setSelectedDoAn(doAn);
    setIsEditModalOpen(true);
  };

  // Xử lý xóa món ăn
  const handleDeleteDoAn = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      deleteMutation.mutate(id);
    }
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (doAn) => {
    setSearchTerm(doAn.ten);
    setSelectedSearchTerm(doAn.ten);
    setShowSuggestions(false);
    setPage(0);
  };

  const handleInputBlur = () => setTimeout(() => setShowSuggestions(false), 200);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedSearchTerm("");
    setShowSuggestions(false);
    setPage(0);
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (error) {
    toast.error(error.message);
    return <p>Lỗi: {error.message}</p>;
  }

  const danhSachDoAn = doAn?.content ?? [];
  const totalPages = doAn?.totalPages ?? 0;
  const baseUrl = "http://localhost:8080/uploads/";

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="do-an-header">
        <h2>Danh sách đồ ăn</h2>
        <div className="search-bar" style={{ position: "relative" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm món ăn theo tên..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleInputBlur}
            className="search-input"
          />
          {showSuggestions && searchTerm.trim() && (
            <ul className="suggestions-list">
              {isFetchingSuggestions ? (
                <li className="suggestion-item">Đang tải gợi ý...</li>
              ) : suggestions?.content?.length > 0 ? (
                suggestions.content.map((da) => (
                  <li key={da.id} className="suggestion-item" onClick={() => handleSuggestionClick(da)}>
                    {da.ten}
                  </li>
                ))
              ) : (
                <li className="suggestion-item">Không tìm thấy gợi ý</li>
              )}
            </ul>
          )}
        </div>
        <button className="btn-reset" onClick={handleReset}>Reset</button>
        <button className="btn-add-food" onClick={() => setIsModalOpen(true)}>+ Thêm món mới</button>
      </div>

      <AddFoodModal isOpen={isModalOpen} onClose={handleCloseModal} queryClient={queryClient} />
      <EditFoodModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} queryClient={queryClient} doAn={selectedDoAn} />

      <div className="do-an-list">
        {isFetching && <div className="search-loading">Đang tải...</div>}
        {danhSachDoAn.length > 0 ? (
          danhSachDoAn.map((da) => (
            <div key={da.id} className="do-an-item">
              <div className="do-an-left">
                <img
                  src={da.hinhAnh ? `${baseUrl}${da.hinhAnh}` : "/placeholder-image.png"}
                  alt={da.ten}
                  className="do-an-img"
                />
              </div>
              <div className="do-an-right">
                <div>
                  <h3>{da.ten}</h3>
                  <p>{da.moTa || "Không có mô tả"}</p>
                  <p style={{ color: "red", fontWeight: "bold" }}>{da.giaTien} VND</p>
                  <p className="p-loai-do-an">{da.loaiDoAn?.ten || "Không có loại"}</p>
                </div>
                <div className="do-an-actions">
                  <button className="btn-details" onClick={() => handleShowDetails(da)}>Chi tiết</button>
                  <button className="btn-delete" onClick={() => handleDeleteDoAn(da.id)} disabled={deleteMutation.isLoading}>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy món ăn nào.</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0 || isFetching}>
          Trang trước
        </button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={page === totalPages - 1 || isFetching}>
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default PageDoAn;