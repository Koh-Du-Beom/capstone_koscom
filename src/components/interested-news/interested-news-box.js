'use client';
import InterestedNews from "./interested-news";
import classes from './interested-news-box.module.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useInterestedItems } from '@/contexts/InterestedItemsContext';
import ComponentLoading from "../loading/component-loading";

export default function InterestedNewsBox() {
  const itemsPerPage = 5; // 한 페이지에 보여줄 뉴스 아이템 수
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1); // 페이지 그룹 상태 추가
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { interestedItems } = useInterestedItems();
  const [clientItems, setClientItems] = useState([]); // 클라이언트 전용 상태

  // 관심 종목이 변경될 때마다 clientItems를 업데이트
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientItems(interestedItems);
    }
  }, [interestedItems]);

  // 종목에 해당하는 뉴스 가져오기
  const fetchNews = async (items) => {
    const stockCodes = items.map(item => item.code);
    const stockNames = items.map(item => item.name);

    try {
      setIsLoading(true);
      const newsPromises = stockCodes.map(code => 
        axios.get(`/api/news?code=${code}`)
      );
      const newsResponses = await Promise.all(newsPromises);

      const fetchedNewsItems = newsResponses.flatMap((response, index) => 
        response.data.map(newsItem => ({
          ...newsItem,
          stockName: stockNames[index],
        }))
      );
      setNewsItems(fetchedNewsItems);
    } catch (error) {
      console.error("뉴스 데이터를 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // clientItems가 업데이트될 때마다 fetchNews 호출
  useEffect(() => {
    if (clientItems.length > 0) {
      fetchNews(clientItems);
    } else {
      setNewsItems([]);
      setCurrentPage(1);
      setPageGroup(1);
    }
  }, [clientItems]);

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
        ) : clientItems.length === 0 ? (
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
