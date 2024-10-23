'use client';
import InterestedNews from "./interested-news";
import classes from './interested-news-box.module.css';
import { useState, useEffect } from "react";
import { getLocalStorageItems } from '@/utils/localStorage'; // 로컬스토리지 관련 함수 가져오기
import axios from 'axios';
import Loading from '@/app/loading';

const LOCAL_STORAGE_KEY = 'interestedItems'; // 로컬스토리지에 저장할 키

export default function InterestedNewsBox() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 종목에 해당하는 뉴스 가져오기
  const fetchNews = async () => {
    const savedItems = getLocalStorageItems(LOCAL_STORAGE_KEY); // 로컬스토리지에서 관심 종목 가져오기
    const stockCodes = savedItems.map(item => item.code);
    const stockNames = savedItems.map(item => item.name); // 종목명 추가

    try {
      setIsLoading(true); // 로딩 시작
      const newsPromises = stockCodes.map(code => 
        axios.get(`/api/news?code=${code}`)
      );
      const newsResponses = await Promise.all(newsPromises);

      // 가져온 데이터를 모두 합쳐서 배열에 저장 (종목명 포함)
      const fetchedNewsItems = newsResponses.flatMap((response, index) => 
        response.data.map(newsItem => ({
          ...newsItem,
          stockName: stockNames[index], // 종목명 추가
        }))
      );
      setNewsItems(fetchedNewsItems);
    } catch (error) {
      console.error("뉴스 데이터를 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  // 로컬스토리지의 아이템이 변경될 때마다 뉴스를 다시 가져오도록 설정
  useEffect(() => {
    const handleStorageChange = () => {
      fetchNews();
    };

    window.addEventListener('storage', handleStorageChange); // 로컬스토리지 변경 감지
    fetchNews(); // 초기 실행

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 페이지네이션에 맞는 기사들을 계산하는 함수
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  // 페이지 변경하기
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>나만의 뉴스</h2>

			<div className={classes.news_wrapper}>
				{isLoading ? 
					<div className={classes.loading_container}>
						<Loading />
					</div> : currentItems.map((news, index) => (
						<InterestedNews key={index} news={news} />
					))}	
			</div>
			
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
}
