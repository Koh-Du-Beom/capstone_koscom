'use client';
import React, { useState } from 'react';
import classes from './financial-prompt.module.css'; // 스타일링 파일을 별도로 만듭니다.

export default function FinancialPrompt() {
  const [messages, setMessages] = useState([]); // 채팅 메시지 상태
  const [inputValue, setInputValue] = useState(''); // 입력값 상태

  const handleSubmit = (event) => {
    event.preventDefault();

    if (inputValue.trim()) {
      const userMessage = {
        type: 'user',
        content: inputValue.trim(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue(''); // 입력 필드 초기화

      // 여기서 GPT-API와의 통신 로직을 구현하여 시스템 응답 생성 (간단한 예시)
      const systemMessage = {
        type: 'system',
        content: `처리중...`, // 실제로는 API에서 응답을 받아옵니다.
      };

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, systemMessage]);
      }, 1000);
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
      </div>

      <form className={classes.inputSection} onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="질문을 입력하세요..."
          className={classes.inputField}
        />
        <button type="submit" className={classes.sendButton}>
          전송
        </button>
      </form>
    </div>
  );
}
