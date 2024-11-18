import React, { useState } from 'react';
import ComponentLoading from '@/components/loading/component-loading';
import classes from './financial-prompt.module.css';
import axios from 'axios';

export default function FinancialPrompt({ updateGraphData }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', content: inputValue.trim() },
      ]);
      setInputValue('');
      setIsLoading(true);

      try {
        // API 요청
        const response = await axios.post('/api/getGraphData-prompt', {
          message: inputValue.trim(),
        });

        const responseData = response.data;

        // 응답 데이터 유형에 따라 처리
        if (Array.isArray(responseData)) {
          // 그래프 데이터 응답
          updateGraphData((prev) => [...prev, ...responseData]);
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'system', content: '요청사항을 바탕으로 그래프를 생성했습니다.' },
          ]);
        } else if (typeof responseData === 'object' && responseData.message) {
          // 단순 메시지 응답
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'system', content: responseData.message },
          ]);
        } else {
          // 예상치 못한 데이터 형식
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'system', content: '알 수 없는 데이터 형식이 반환되었습니다.' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
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
            className={`${classes.message} ${
              message.type === 'user' ? classes.userMessage : classes.systemMessage
            }`}
          >
            {message.content}
          </div>
        ))}

        {isLoading && (
          <div className={`${classes.message} ${classes.loadingMessage}`}>
            <ComponentLoading />
          </div>
        )}
      </div>

      <form className={classes.inputSection} onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="질문을 입력해주세요."
          className={classes.inputField}
        />
        <button type="submit" className={classes.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}
