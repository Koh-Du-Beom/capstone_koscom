'use client'
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import { useState } from 'react';
import classes from './page.module.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [news, setNews] = useState([]);

  const handleSearch = async () => {
    try {
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
      setNews(data.headlines || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <main className={classes.container}>
      <div className={classes.leftSection}>
        <InterestedItemsBox />
      </div>
      
      <div className={classes.divider}></div>

      <div className={classes.rightSection}>
        <h3>나만의 뉴스</h3>
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
      </div>
    </main>
  );
}
