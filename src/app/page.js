'use client'
import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [news, setNews] = useState([]);

  const handleSearch = async () => {
    try {
      // 검색어 공백 제거
      const trimmedSearchTerm = searchTerm.trim();
      if (!trimmedSearchTerm) {
        console.error("검색어를 입력해주세요.");
        return;
      }

      const response = await fetch(`/api/news?search=${encodeURIComponent(trimmedSearchTerm)}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // 가져온 데이터를 콘솔에 출력
      console.log("Fetched data:", data);

      setNews(data.headlines || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <main>
      <h1>홈페이지입니다.</h1>
      <h2>어떤 내용할지 같이 고민해보죠</h2>

      <textarea
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요."
      />
      <button onClick={handleSearch}>뉴스 검색</button>

      <h3>검색 결과:</h3>
      <ul>
        {news.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </main>
  );
}
