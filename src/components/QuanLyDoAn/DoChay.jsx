import React, { useEffect,useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllDoChay } from "../../api/DoAnApi";
import "../../styles/SanPham/TranChuDoAn.css";

const PageDoChay = ()=>{
    const [monChayPage,setMonChayPage] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [currentPage,setCurrentPage] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const pageSize = 12;

    const handleFirtPage =()=>{
      if (currentPage>0) {
        setCurrentPage(0);
      }
    }
    const handleLastPage =()=>{
      if (currentPage<totalPages-1) {
        setCurrentPage(totalPages-1)
      }
    }
    const handlePreviosPage =()=>{
      if (currentPage>0) {
        setCurrentPage(currentPage-1);
      }
    }
    const handleNextPage=()=>{
      if (currentPage<totalPages-1) {
        setCurrentPage(currentPage+1);
      }
    }

    const handlePageClick =(page)=>{
      setCurrentPage(page);
    }

    const pageNumbers = Array.from({length:totalPages},(_,index)=>index);

    const fetchMonChay =async(page)=>{
      try {
        setLoading(true);
        const data = await getAllDoChay(page,pageSize);
        console.log("Dữ liệu từ back end",data);
        setMonChayPage(data.content||[]);
        setTotalPages(data.totalPages||0);
        setLoading(false);
      } catch (error) {
        setError("Không thể tải danh sách nhân viên");
        setLoading(false);
      }
    }

    useEffect(()=>{
      fetchMonChay(currentPage);
    },[currentPage]);

    
    if (loading) {
      return <div>Đang tải dữ liệu .... </div>
    }
    if (error) {
      return <div>{error}</div>
    }

     return(
        <div className="tran-chu-do-an">
        <h1 className="page-title">Món ăn chay</h1>
        <div className="do-an-list">          
          {monChayPage.length > 0 ? (
            <div className="do-an-grid">
              {monChayPage.map((da) => (
                <div key={da.id} className="card">
                  <img src={ da.hinhAnh ? `http://localhost:8080/uploads/${da.hinhAnh}` : "/placeholder-image.png" } alt={da.ten}  className="card-img-top do-an-img" />
                  <div className="card-body do-an-info">
                    <h3 className="do-an-name">{da.ten}</h3>
                    <p className="do-an-price"> {da.giaTien} đ</p>
                    <button className="do-an-order-btn">
                      <i className="fas fa-shopping-cart"></i> Đặt món
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
          <button onClick={handleFirtPage} disabled={currentPage==0}>Trang đầu</button>
          <button onClick={handlePreviosPage} disabled={currentPage==0}>Trang trước</button>
          {
            pageNumbers.map((pn)=>(
              <button key={pn} onClick={()=>handlePageClick(pn)} disabled ={currentPage === pn}>{pn+1}</button>
            ))
          }
          <button onClick={handleNextPage} disabled={currentPage>= totalPages-1}></button>
          <button onClick={handleLastPage} disabled={currentPage== totalPages-1}>Trang cuối</button>
        </div>
        
      </div>
     );
};

export default PageDoChay;