import React, { useState } from 'react';
import Loading from '@/app/loading';
import classes from './financial-prompt.module.css';
import axios from 'axios';

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
        // /api/getGraphData-prompt에 요청을 보냅니다.
        const response = await axios.post('/api/getGraphData-prompt', {
          message: inputValue.trim(),
        });

        const jsonData = response.data;

        // updateGraphData 함수를 사용하여 그래프 데이터를 업데이트
        updateGraphData(jsonData);

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'system', content: '요청사항을 바탕으로 그래프를 생성했습니다.' },
        ]);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'system', content: '오류가 발생했습니다. 다시 입력해주세요.' },
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
          <div className={`${classes.message} ${classes.loadingMessage}`}>
            <Loading />
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
