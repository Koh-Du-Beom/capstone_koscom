'use client';
import React, { useState } from 'react';
import Loading from '@/app/loading'; // 로딩 컴포넌트를 import
import classes from './financial-prompt.module.css'; // 스타일링 파일을 별도로 만듭니다.
import axios from 'axios'; // API 요청을 위한 axios import
import Papa from 'papaparse'; // CSV 파싱을 위한 라이브러리 (선택사항)

export default function FinancialPrompt() {
  const [messages, setMessages] = useState([]); // 채팅 메시지 상태
  const [inputValue, setInputValue] = useState(''); // 입력값 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputValue.trim()) {
      const userMessage = {
        type: 'user',
        content: inputValue.trim(),
      };

      // 유저의 입력 메시지를 추가
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue(''); // 입력 필드 초기화

      // 로딩 상태를 true로 설정해서 로딩바를 표시
      setIsLoading(true);

      try {
        // 백엔드에 POST 요청
        const response = await axios.post('/api/financial-data', {
          message: inputValue.trim(),
        });

        // CSV 데이터를 파싱
        const csvData = response.data; // 서버로부터 받은 CSV 데이터
        const parsedData = Papa.parse(csvData, { header: true }); // CSV 파싱 (헤더 포함)
        
        const systemMessage = {
          type: 'system',
          content: '처리 완료. 결과를 확인하세요.',
        };

        // 응답 메시지를 추가하고 로딩을 종료
        setMessages((prevMessages) => [...prevMessages, systemMessage, { type: 'system', content: JSON.stringify(parsedData.data) }]);
      } catch (error) {
        // 에러 처리
        console.error("Error fetching financial data:", error);
        const errorMessage = {
          type: 'system',
          content: '오류가 발생했습니다. 다시 시도해주세요.',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false); // 로딩 끝
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.chatBox}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${classes.message} ${
              message.type === 'user' ? classes.userMessage : classes.systemMessage
            }`}
          >
            {message.content}
          </div>
        ))}

        {/* 로딩 중일 때는 로딩 컴포넌트를 표시 */}
        {isLoading && (
          <div className={classes.systemMessage}>
            <Loading /> {/* 로딩 컴포넌트가 여기에 표시됩니다 */}
          </div>
        )}
      </div>

      <form className={classes.inputSection} onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="질문을 입력하세요"
          className={classes.inputField}
        />
        <button type="submit" className={classes.sendButton}>
          전송
        </button>
      </form>
    </div>
  );
}
