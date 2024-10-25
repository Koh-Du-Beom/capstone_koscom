import React, { useState } from 'react';
import Loading from '@/app/loading';
import classes from './financial-prompt.module.css';
import axios from 'axios';
import { parseCSV } from '@/utils/parseCSV'; // parseCSV 함수를 import

export default function FinancialPrompt({ updateGraphData }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputValue.trim()) {
      setMessages((prevMessages) => [...prevMessages, { type: 'user', content: inputValue.trim() }]);
      setInputValue('');
      setIsLoading(true);

      try {
        // API 요청을 /api/getGraphData-prompt로 보냄
        const response = await axios.post('/api/getGraphData-prompt', {
          message: inputValue.trim(),
        });

        const csvData = response.data; // 서버로부터 받은 CSV 데이터
        const parsedData = await parseCSV(csvData); // parseCSV를 사용해 JSON으로 파싱

        updateGraphData(parsedData); // 파싱된 데이터를 graphData로 설정

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'system', content: '처리 완료. 결과를 확인하세요.' },
        ]);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'system', content: '오류가 발생했습니다. 다시 시도해주세요.' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.chatBox}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${classes.message} ${message.type === 'user' ? classes.userMessage : classes.systemMessage}`}
          >
            {message.content}
          </div>
        ))}

        {isLoading && (
          <div className={classes.systemMessage}>
            <Loading />
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
