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
        // Send API request to /api/getGraphData-prompt
        const response = await axios.post('/api/getGraphData-prompt', {
          message: inputValue.trim(),
        });

        const jsonData = response.data; // Directly use the JSON data from the server

        updateGraphData(jsonData); // Update graphData with JSON data

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'system', content: 'Processing complete. Please check the results.' },
        ]);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'system', content: 'An error occurred. Please try again.' },
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
          placeholder="Enter your question"
          className={classes.inputField}
        />
        <button type="submit" className={classes.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}
