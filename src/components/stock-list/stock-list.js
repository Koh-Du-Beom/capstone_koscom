'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockList() {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/stockList');
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
        setError('Failed to fetch stock data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Stock List</h1>
      <ul>
        {stocks.map((stock, index) => (
          <li key={index}>
            {stock.code}: {stock.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
