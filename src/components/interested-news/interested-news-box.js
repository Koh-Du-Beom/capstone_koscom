'use client';
import InterestedNews from "./interested-news";
import classes from './interested-news-box.module.css';
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import useAuthStore from '@/store/authStore';
import ComponentLoading from "../loading/component-loading";

export default function InterestedNewsBox() {
  const { interestedItems } = useAuthStore(); // zustand에서 관심종목 가져오기
  const itemsPerPage = 5; // 한 페이지에 보여줄 뉴스 아이템 수
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1); // 페이지 그룹 상태 추가
  const [newsItems, setNewsItems] = useState([]); // 뉴스 데이터 상태
  const [isLoading, setIsLoading] = useState(false);

  // 관심종목 기반으로 뉴스 데이터를 가져오는 함수
  const fetchNews = useCallback(async () => {
    if (interestedItems.length === 0) {
      setNewsItems([]);
      setCurrentPage(1);
      setPageGroup(1);
      return;
    }

    try {
      setIsLoading(true);
      const newsPromises = interestedItems.map(async (item) =>
        axios.get(`/api/news?code=${item.code}`).then((res) => ({
          stockName: item.name,
          news: res.data,
        }))
      );

      const newsResponses = await Promise.all(newsPromises);

      // 뉴스 데이터 병합 및 상태 업데이트
      const fetchedNewsItems = newsResponses.flatMap((response) =>
        response.news.map((newsItem) => ({
          ...newsItem,
          stockName: response.stockName,
        }))
      );

      setNewsItems(fetchedNewsItems);
    } catch (error) {
      console.error("뉴스 데이터를 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [interestedItems]);

  // 관심종목 데이터가 변경될 때 뉴스 데이터 다시 가져오기
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // 페이지네이션에 맞는 기사들을 계산하는 함수
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  const pagesPerGroup = 5;
  const totalPageGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(pageGroup * pagesPerGroup, totalPages);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGroupChange = (direction) => {
    if (direction === "prev" && pageGroup > 1) {
      setPageGroup(pageGroup - 1);
    } else if (direction === "next" && pageGroup < totalPageGroups) {
      setPageGroup(pageGroup + 1);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>나만의 뉴스</h2>

      <div className={classes.news_wrapper}>
        {isLoading ? (
          <div className={classes.loading_container}>
            <ComponentLoading />
          </div>
        ) : interestedItems.length === 0 ? (
          <h1 className={classes.no_items_message}>관심 종목을 등록하세요!</h1>
        ) : (
          currentItems.map((news, index) => (
            <InterestedNews key={index} news={news} />
          ))
        )}
      </div>

      {newsItems.length > 0 && (
        <div className={classes.pagination}>
          <button
            onClick={() => handleGroupChange("prev")}
            disabled={pageGroup === 1}
          >
            {"<"}
          </button>

          {[...Array(endPage - startPage + 1)].map((_, index) => {
            const pageNumber = startPage + index;
            return (
              <button
                key={pageNumber}
                className={currentPage === pageNumber ? classes.activePage : ''}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => handleGroupChange("next")}
            disabled={pageGroup === totalPageGroups}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}
