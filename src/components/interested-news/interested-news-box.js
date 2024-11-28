'use client';
import InterestedNews from "./interested-news";
import classes from './interested-news-box.module.css';
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import useAuthStore from '@/store/authStore';
import ComponentLoading from "../loading/component-loading";

export default function InterestedNewsBox() {
  const { interestedItems } = useAuthStore(); // zustand에서 관심종목 가져오기
  const [newsItems, setNewsItems] = useState([]); // 뉴스 데이터 상태
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(""); // 선택된 종목 초기값을 빈 문자열로 설정
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림/닫힘 상태 관리

  // 관심종목 기반으로 뉴스 데이터를 가져오는 함수
  const fetchNews = useCallback(async () => {
    if (interestedItems.length === 0) {
      setNewsItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const newsPromises = interestedItems.map(async (item) =>
        axios.get(`/api/news?code=${item.code}&stockName=${encodeURIComponent(item.name)}`).then((res) => ({
          stockName: item.name,
          news: res.data,
        }))
      );

      const newsResponses = await Promise.all(newsPromises);
      
      setNewsItems(newsResponses);
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

  // selectedStock 초기값 동기화
  useEffect(() => {
    if (interestedItems.length > 0 && !selectedStock) {
      setSelectedStock(interestedItems[0].name); // 첫 번째 종목 설정
    }
  }, [interestedItems, selectedStock]);

  // 선택된 종목의 뉴스 필터링
  const filteredNewsItems = newsItems.flatMap((item) =>
    item.stockName === selectedStock
      ? item.news.newsItems.map((newsItem) => ({
          ...newsItem,
          stockName: item.stockName, // 뉴스 항목에 stockName 추가
        }))
      : []
  );

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>나만의 뉴스</h2>

      {/* 드롭다운 컨테이너 */}
      <div className={classes.dropdownContainer}>
        <div
          className={classes.dropdownHeader}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedStock || "종목을 선택하세요"}
          <span className={isDropdownOpen ? classes.arrowUp : classes.arrowDown}>▼</span>
        </div>
        {isDropdownOpen && (
          <div className={classes.dropdownMenu}>
            {interestedItems.map((item) => (
              <div
                key={item.code}
                className={classes.dropdownItem}
                onClick={() => {
                  setSelectedStock(item.name);
                  setIsDropdownOpen(false); // 드롭다운 닫기
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={classes.news_wrapper}>
        {isLoading ? (
          <div className={classes.loading_container}>
            <ComponentLoading />
          </div>
        ) : interestedItems.length === 0 ? (
          <h1 className={classes.no_items_message}>관심 종목을 등록하세요!</h1>
        ) : filteredNewsItems.length === 0 ? (
          <h1 className={classes.no_news_message}>선택한 종목에 뉴스가 없습니다.</h1>
        ) : (
          filteredNewsItems.map((news, index) => (
            <InterestedNews key={index} news={news} stockName={news.stockName} />
          ))
        )}
      </div>
    </div>
  );
}
