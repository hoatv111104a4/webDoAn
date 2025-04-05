import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchDoAn } from "../../api/DoAnApi";
import "../../styles/Search/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Fetch gợi ý tìm kiếm
  const { data: suggestions, isFetching: isFetchingSuggestions } = useQuery({
    queryKey: ["suggestions", searchTerm],
    queryFn: () => searchDoAn(searchTerm, 1, 5),
    enabled: !!searchTerm.trim(),
    staleTime: 5000,
  });

  // Xử lý khi thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  // Xử lý khi chọn một gợi ý tìm kiếm
  const handleSuggestionClick = (doAn) => {
    setSearchTerm(doAn.ten);
    setShowSuggestions(false);
    if (onSearch) onSearch(doAn.ten); // Gửi từ khóa tìm kiếm lên component cha
  };

  // Ẩn gợi ý khi input mất focus
  const handleInputBlur = () => setTimeout(() => setShowSuggestions(false), 200);

  // Reset tìm kiếm
  const handleReset = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    if (onSearch) onSearch(""); // Reset tìm kiếm
  };

  return (
    <div className="search-bar input-group">
      <input
        ref={inputRef}
        type="text"
        className="search-input "
        placeholder="Mời bạn nhập món ăn muốn tìm"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleInputBlur}
        aria-label="Recipient's username" aria-describedby="button-addon2"
      />
      <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleReset}>Reset</button>
      {showSuggestions && searchTerm.trim() && (
        <ul className="suggestions-list">
          {isFetchingSuggestions ? (
            <li className="suggestion-item">Đang tải gợi ý...</li>
          ) : suggestions?.content?.length > 0 ? (
            suggestions.content.map((da) => (
              <li
                key={da.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(da)}
              >
                {da.ten}
              </li>
            ))
          ) : (
            <li className="suggestion-item">Không tìm thấy gợi ý</li>
          )}
        </ul>
      )}
      
    </div>
  );
};

export default SearchBar;