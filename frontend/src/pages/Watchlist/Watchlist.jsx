import React, { useState, useEffect } from "react";
import StockInfoTable from "../Predict/components/StockInfoTable.jsx";
import "./Watchlist.css";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStocks, setExpandedStocks] = useState({});

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      if (watchlist.length === 0) return;

      setLoading(true);
      setError(null);
      const newStockData = {};

      try {
        for (const symbol of watchlist) {
          const response = await fetch(`http://127.0.0.1:5000/predict?symbol=${symbol}`);
          const data = await response.json();
          
          if (data.error) {
            setError(`Error fetching data for ${symbol}: ${data.error}`);
            continue;
          }

          newStockData[symbol] = {
            stock_info: {
              ...data.stock_info,
              symbol: data.stock
            },
            technical_indicators: data.technical_indicators || {}
          };
        }
        setStockData(newStockData);
      } catch (err) {
        setError("Failed to fetch stock data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistData();
  }, [watchlist]);

  const removeFromWatchlist = (symbol) => {
    const newWatchlist = watchlist.filter(s => s !== symbol);
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  };

  const toggleStockDetails = (symbol) => {
    setExpandedStocks(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p>Track your favorite stocks in one place</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading && <div className="loading-spinner"></div>}

      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <p>Your watchlist is empty. Add stocks from the Predict page to track them here.</p>
        </div>
      ) : (
        <div className="stocks-list">
          {watchlist.map(symbol => {
            const data = stockData[symbol];
            if (!data) return null;

            const isExpanded = expandedStocks[symbol];

            return (
              <div key={symbol} className="stock-item">
                <div 
                  className="stock-header"
                  onClick={() => toggleStockDetails(symbol)}
                >
                  <div className="stock-title">
                    <h2 className="stock-name">
                      {data.stock_info.name || 'Stock Information'} ({data.stock_info.symbol})
                    </h2>
                    <span className="current-price">
                      ₹{data.stock_info.currentPrice?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div className="stock-actions">
                    <button 
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(symbol);
                      }}
                    >
                      Remove
                    </button>
                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="stock-details">
                    <StockInfoTable 
                      stockInfo={data.stock_info} 
                      technicalIndicators={data.technical_indicators}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist; 