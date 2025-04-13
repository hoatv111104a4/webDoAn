import React, { useState } from "react";
import { getDoAnById } from "../../api/DoAnApi";
import { useNavigate } from "react-router-dom";
import "../../styles/SanPham/AddCartModal.css"
const AddCartModal = ({ monAn, onClose }) => {
  const navigate = useNavigate();
  if (!monAn) {
    return null;
  }
  const [quantity, setQuantity] = useState(1);

  const handleOrderNow = () => {
    const cartItem = {
      id: monAn.id,
      ten: monAn.ten,
      giaTien: monAn.giaTien,
      hinhAnh: monAn.hinhAnh,
      soLuong: quantity,
    };
    navigate("/website/checkout", { state: { cartItems: [cartItem] } });
    onClose();
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(value < 1 ? 1 : value);
  };

  const handleShowCart =async (id)=>{      
        const data = await getDoAnById(id);
        setSelectedMonAn(data);
        setShowCart(true);      
        
  }

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chi tiết món ăn</h5>
            <button type="button" className="btn-close" onClick={onClose} ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => e.preventDefault()}>
            {
                monAn.hinhAnh && (
                  <div className="mb-3">
                    <label className="form-label">Hình ảnh</label>
                    <img src={`http://localhost:8080/uploads/${monAn.hinhAnh}`} alt={monAn.ten} style={{ width: "460px", height: "200px",objectFit: "cover", }}/>
                  </div>
                )
              }
              <div className="mb-3" hidden>                
                <p className="form-control-static">{monAn.id}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Tên món ăn</label>
                <p className="form-control-static">{monAn.ten}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Giá tiền</label>
                <p className="form-control-static" style={{color:"red"}}>{monAn.giaTien} VND</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input type="number" className="form-control" min={1}  value={quantity} onChange={handleQuantityChange} />
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleOrderNow}> Đặt hàng ngay </button>
                <button type="button" className="btn btn-secondary" onClick={onClose} >  Đóng </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCartModal;