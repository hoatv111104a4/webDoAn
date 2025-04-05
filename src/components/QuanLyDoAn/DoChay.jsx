import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllDoChay } from "../../api/DoAnApi";
import "../../styles/SanPham/TranChuDoAn.css";

const PageDoChay = ()=>{
    const [page,setPage] = useState(0);
    const [size] = useState(12);
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");

    const{data:doAnChay,error,isLoading,isFetching} = useQuery({queryKey:["doAnChay",page,selectedSearchTerm],
        queryFn:()=>selectedSearchTerm.trim()? getAllDoChay(page,size,selectedSearchTerm):getAllDoChay(page,size),
        keepPreviousData:true,
        staleTime:5000,
    });

     // Trạng thái tải dữ liệu
     if (isLoading) return <p>Đang tải...</p>;
     if (error) return <p>Lỗi: {error.message}</p>;
    
    const danhSachDoAnChay = doAnChay?.content ?? [];
    const totalPages = doAnChay?.totalPages ?? 0;

     return(
        <div className="tran-chu-do-an">
        <h1 className="page-title">Món ăn chay</h1>
        <div className="do-an-list">
          {isFetching && <div className="search-loading">Đang tải ... </div>}
          {danhSachDoAnChay.length > 0 ? (
            <div className="do-an-grid">
              {danhSachDoAnChay.map((da) => (
                <div key={da.id} className="card">
                  <img
                    src={
                      da.hinhAnh
                        ? `http://localhost:8080/uploads/${da.hinhAnh}`
                        : "/placeholder-image.png"
                    }
                    alt={da.ten}
                    className="card-img-top do-an-img"
                  />
                  <div className="card-body do-an-info">
                    <h3 className="do-an-name">{da.ten}</h3>
                    <p className="do-an-price">
                      {da.giaTien.toLocaleString()} đ
                    </p>
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
          ;
        </div>
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || isFetching}
          >
            Trang trước
          </button>
          <span>
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={page === totalPages - 1 || isFetching}
          >
            Trang sau
          </button>
        </div>
      </div>
     );
};

export default PageDoChay;