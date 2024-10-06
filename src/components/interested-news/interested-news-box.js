'use client';
import InterestedNews from "./interested-news"
import classes from './interested-news-box.module.css'
import newsItems from "./interested-news-items-mock"
import { useState } from "react";

export default function InterestedNewsBox() {

	const itemsPerPage = 4;
	const [currentPage, setCurrentPage] = useState(1);

	// 페이지네이션에 맞는 기사들을 계산하는 함수
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

	// 총 페이지 수 계산
	const totalPages = Math.ceil(newsItems.length / itemsPerPage);

	//페이지 변경 하기
	const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

	return (
    <div className={classes.container}>
      <h2 className={classes.title}>나만의 뉴스</h2>

      {/* 현재 페이지에 맞는 기사들을 렌더링 */}
      {currentItems.map((news, index) => (
        <InterestedNews key={index} news={news} />
      ))}

      {/* 페이지네이션 버튼 */}
      <div className={classes.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? classes.activePage : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
