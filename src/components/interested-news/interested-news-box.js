'use client';
import InterestedNews from "./interested-news";
import classes from './interested-news-box.module.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import Loading from '@/app/loading';
import { useInterestedItems } from '@/contexts/InterestedItemsContext'; // Context API 사용

export default function InterestedNewsBox() {
  const itemsPerPage = 5; // 한 페이지에 보여줄 뉴스 아이템 수
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1); // 페이지 그룹 상태 추가
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const { interestedItems } = useInterestedItems(); // Context API로 관심 종목 상태 가져오기

  // 종목에 해당하는 뉴스 가져오기
  const fetchNews = async (items) => {
    const stockCodes = items.map(item => item.code);
    const stockNames = items.map(item => item.name); // 종목명 추가

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

  // 관심 종목이 변경될 때마다 fetchNews 호출
	useEffect(() => {
		if (interestedItems.length > 0) {
			fetchNews(interestedItems);
		} else {
			// 관심 종목이 없을 경우 뉴스 아이템과 페이지네이션 상태 초기화
			setNewsItems([]);
			setCurrentPage(1);
			setPageGroup(1);
		}
	}, [interestedItems]);


  // 페이지네이션에 맞는 기사들을 계산하는 함수
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsItems.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  
  // 한 번에 보여줄 페이지 버튼 수 (5개 단위)
  const pagesPerGroup = 5;
  const totalPageGroups = Math.ceil(totalPages / pagesPerGroup);
  const startPage = (pageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(pageGroup * pagesPerGroup, totalPages); // 현재 그룹에서 보여줄 마지막 페이지

  // 페이지 변경하기
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 그룹 변경하기 (화살표 버튼으로 이동)
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
						<Loading />
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
					{/* 이전 페이지 그룹으로 이동 */}
					<button
						onClick={() => handleGroupChange("prev")}
						disabled={pageGroup === 1}
					>
						{"<"}
					</button>
	
					{/* 현재 페이지 그룹의 페이지 번호 표시 */}
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
	
					{/* 다음 페이지 그룹으로 이동 */}
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
