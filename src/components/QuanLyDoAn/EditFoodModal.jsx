import React, { useState, useEffect } from "react";
import "../../styles/SanPham/AddFoodModal.css";
import { getAllLoaiDoAn } from "../../api/LoaiDoAnApi";
import axios from "axios";
import { toast } from "react-toastify"; // Thêm import toast

const EditFoodModal = ({ isOpen, onClose, queryClient, doAn }) => {
  const [loaiDoAnList, setLoaiDoAnList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    ten: "",
    giaTien: "",
    loaiDoAnId: "",
    moTa: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    if (isOpen && doAn) {
      console.log("doAn:", doAn);
      setFormData({
        ten: doAn.ten || "",
        giaTien: doAn.giaTien || "",
        loaiDoAnId: doAn.loaiDoAn?.id || "",
        moTa: doAn.moTa || "",
      });
      const imagePath = doAn.hinhAnh
        ? `${baseUrl}${doAn.hinhAnh.startsWith("/") ? "" : "/"}${doAn.hinhAnh}`
        : "/placeholder-image.png";
      setImagePreview(imagePath);
    }
  }, [isOpen, doAn]);

  useEffect(() => {
    if (isOpen) {
      const fetchLoaiDoAn = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getAllLoaiDoAn();
          setLoaiDoAnList(data || []);
        } catch (err) {
          console.error("Lỗi khi lấy danh sách loại đồ ăn:", err);
          setError("Không thể tải danh sách loại đồ ăn. Vui lòng thử lại.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLoaiDoAn();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append("ten", formData.ten);
    data.append("giaTien", formData.giaTien);
    data.append("loaiDoAnId", formData.loaiDoAnId);
    data.append("moTa", formData.moTa);
    if (imageFile) {
      data.append("hinhAnh", imageFile);
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/do-an/sua-do-an/${doAn.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Cập nhật món thành công:", response.data);
      toast.success("Cập nhật món ăn thành công!"); // Thay alert bằng toast
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["doAn"] });
      }
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data || err.message || "Có lỗi xảy ra khi cập nhật món ăn.";
      console.error("Lỗi khi cập nhật món:", errorMessage);
      toast.error(errorMessage); // Thêm thông báo lỗi
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Chỉnh Sửa Món Ăn</h2>
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-left">
              <div className="image-placeholder">
                <img src={imagePreview} alt="Ảnh món ăn" onError={(e) => (e.target.src = "/placeholder-image.png")}/>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="imageUpload"/>
              <label htmlFor="imageUpload" className="btn-upload">
                Chọn hình ảnh
              </label>
            </div>

            <div className="modal-right">
              <label>Tên món</label>
                <input type="text" name="ten" value={formData.ten} onChange={handleChange}  required/>
              <label>Loại đồ ăn</label>
              {isLoading ? (
                <p>Đang tải...</p>
              ) : (
                <select name="loaiDoAnId" value={formData.loaiDoAnId} onChange={handleChange} required>
                  {loaiDoAnList.length > 0 ? (
                    loaiDoAnList.map((loaida) => (
                      <option key={loaida.id} value={loaida.id}>
                        {loaida.ten}
                      </option>
                    ))
                  ) : (
                    <option value="">Không có loại đồ ăn nào</option>
                  )}
                </select>
              )}

              <label>Giá tiền</label>
              <input type="text" name="giaTien" value={formData.giaTien} onChange={handleChange} placeholder="Nhập giá tiền" required/>
              <label>Mô tả</label>
              <textarea name="moTa" value={formData.moTa} onChange={handleChange} placeholder="Nhập mô tả món ăn..."/>
              <button type="submit" className="btn-submit">Lưu</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodModal;