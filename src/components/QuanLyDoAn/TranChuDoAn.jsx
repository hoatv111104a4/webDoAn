import React,{useEffect,useState} from "react";
import { toast } from "react-toastify";
import { getAllTrangChu, getDoAnById } from "../../api/DoAnApi";
import "../../styles/SanPham/TranChuDoAn.css"; 
import AddCartModal from "./AddCartModal";


const PageTrangChuDoAn = () => {
  const [trangChuPage,setTrangChuPage] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [currentPage,setCurrentPage] = useState(0);
  const [totalPages,setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm,setShowForm] = useState(false);
  const [showDetailForm,setShowDetailForm] = useState(false);
  const [selectedMonAn,setSelectedMonAn] = useState(null);
  const pageSize = 12;

  const handlePreviosPage = ()=>{
    if (currentPage>0) {
      setCurrentPage(currentPage-1);
    }
  }

  const handleNextPage = ()=>{
    if(currentPage<totalPages-1){
      setCurrentPage(currentPage+1);
    }
  }
  const handleFirtPage =()=>{
    setCurrentPage(0)
  }
  const handleLastPage=()=>{
    setCurrentPage(totalPages-1)
  }

  const handlePageClick =(page)=>{
    setCurrentPage(page);
  }
  const handleOpenForm =()=>{
    setShowForm(true);
  }
  const handleCloseForm =()=>{
    setShowForm(false);
  }
  
  const handleShowDetail = async(id)=>{    
    try {      
      const data = await getDoAnById(id);
      setSelectedMonAn(data);
      setShowDetailForm(true);      
    } catch (error) {
      setError(`Khong tim thay mon an voi id ${id}`);      
    }
  }

  const handleCloseDetailForm=()=>{
    setShowDetailForm(false);
    setSelectedMonAn(null);
  }


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearchKeyword(searchTerm); // trigger useEffect để gọi API
  };
  const pageNumbers = Array.from({length:totalPages},(_,index)=>index);


  const fetchTrangChuDoAn = async (page,search) => {
    try {
      setLoading(true);
      const data = await getAllTrangChu(page, pageSize,search);
      console.log("Dữ liệu từ back end", data);
      setTrangChuPage(data.content || []);
      setTotalPages(data.totalPages || 0);
      setLoading(false);
    } catch (error) {
      setError("Không thể tải danh sách nhân viên");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTrangChuDoAn(currentPage, searchKeyword);
  }, [currentPage, searchKeyword]);

  if (loading) {
    return <div>Đang tải dữ liệu .... </div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleReset = () => {
    setSearchTerm("");
    setSearchKeyword("");
    setCurrentPage(0);
  };

  return (
    <div className="tran-chu-do-an">
      <h1 className="page-title">Danh sách món ăn</h1>
      <form className="form-search" onSubmit={handleSearchSubmit}>
        <div className="search input-group">
            <input type="text" className="form-control" placeholder="Mời bạn nhập tên món ăn .... "value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="btn btn-outline-secondary" type="submit" disabled={loading}>Tìm kiếm</button>
            <button className="btn btn-outline-secondary" type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
      
      <div className="do-an-list">          
        {trangChuPage.length > 0 ? (
          <div className="do-an-grid">
            {trangChuPage.map((da) => (
              <div key={da.id} className="card">
                <img src={ da.hinhAnh ? `http://localhost:8080/uploads/${da.hinhAnh}` : "/placeholder-image.png" } alt={da.ten} className="card-img-top do-an-img" />
                <div className="card-body do-an-info">
                  <h3 className="do-an-name">{da.ten}</h3>
                  <p className="do-an-price">{da.giaTien} đ </p>
                  <button className="do-an-order-btn" type="button" onClick={()=>handleShowDetail(da.id)}>
                    <i className="fas fa-shopping-cart"></i> Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có món ăn nào</p>
        )}          
      </div>
      <div className="pagination">
        <button onClick={handleFirtPage} disabled={currentPage==0} >Trang đầu</button>
        <button onClick={handlePreviosPage} disabled={currentPage<=0}>Trang trước</button>
        <span>
          {
            pageNumbers.map((pn)=>(
              <button key={pn} onClick={()=>handlePageClick(pn)} disabled={currentPage === pn}>{pn+1}</button>
            ))
          }
        </span>
        <button onClick={handleNextPage} disabled={currentPage>=totalPages-1}>Trang sau</button>
        <button onClick={handleLastPage} disabled={currentPage==totalPages-1} >Trang cuối</button>
      </div>
      {showDetailForm&&<AddCartModal monAn={selectedMonAn} onClose={handleCloseDetailForm} />}
    </div>
  );

};


// Xuất component để sử dụng ở nơi khác
export default PageTrangChuDoAn;