'use client'
import React, { useEffect } from 'react';

export default function PortfolioPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        ["Apple", "NASDAQ:AAPL"]
      ],
      "chartOnly": false,
      "width": 600,
      "height": 400,
      "locale": "kr",
      "colorTheme": "light",
      "autosize": false,
      "showVolume": true,
      "showMA": true,
    });
    
    document.getElementById('tradingview-widget').appendChild(script);
  }, []);

  return (
    <div>
      <h1>Portfolio 페이지</h1>
      <div id="tradingview-widget"></div>
    </div>
  );
}
