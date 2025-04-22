import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StockInfoTable from "./components/StockInfoTable.jsx";
import "./Predict.css";

const Predict = () => {
  const [searchParams] = useSearchParams();
  const [stockSymbol, setStockSymbol] = useState(searchParams.get('symbol') || "");
  const [stockInfo, setStockInfo] = useState({});
  const [technicalIndicators, setTechnicalIndicators] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchStockData = async (symbol) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/predict?symbol=${symbol}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setStockInfo({});
        setTechnicalIndicators({});
      } else {
        setError(null);
        setStockInfo({
          ...data.stock_info,
          symbol: data.stock
        });
        setTechnicalIndicators(data.technical_indicators || {});
      }
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
      setStockInfo({});
      setTechnicalIndicators({});
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stock data when component mounts with a symbol in URL
  useEffect(() => {
    const symbol = searchParams.get('symbol');
    if (symbol) {
      setStockSymbol(symbol);
      fetchStockData(symbol);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stockSymbol.trim()) {
      await fetchStockData(stockSymbol.toUpperCase());
    }
  };

  const toggleWatchlist = () => {
    if (!stockInfo.symbol) return;
    
    setWatchlist(prev => {
      const isInWatchlist = prev.includes(stockInfo.symbol);
      if (isInWatchlist) {
        return prev.filter(symbol => symbol !== stockInfo.symbol);
      } else {
        return [...prev, stockInfo.symbol];
      }
    });
  };

  const isInWatchlist = watchlist.includes(stockInfo.symbol);

  return (
    <div className="predict-container">
      <div className="predict-header">
        <h1>Stock Information</h1>
        <p>Enter a stock symbol to get detailed information (e.g., RELIANCE, TCS, INFY)</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <input
              type="text"
              className="search-input"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              placeholder="Enter stock symbol"
              required
            />
          </div>
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !stockSymbol.trim()}
          >
            {isLoading ? "Loading..." : "Get Info"}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {isLoading && <div className="loading-spinner"></div>}

      {!isLoading && Object.keys(stockInfo).length > 0 && (
        <div className="results-section">
          <div className="stock-header">
            <h2 className="stock-name">
              {stockInfo.name || 'Stock Information'} ({stockInfo.symbol})
            </h2>
            <button 
              className={`watchlist-button ${isInWatchlist ? 'in-watchlist' : ''}`}
              onClick={toggleWatchlist}
            >
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
          
          <StockInfoTable 
            stockInfo={stockInfo} 
            technicalIndicators={technicalIndicators}
          />
        </div>
      )}
    </div>
  );
};

export default Predict;
