import React, { createContext, useState, useContext, useEffect } from 'react';

const MarketDataContext = createContext();

export const MarketDataProvider = ({ children }) => {
  const [marketData, setMarketData] = useState({
    gainers: [],
    losers: [],
    most_active: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 100 + minutes;

    if (day === 0 || day === 6) {
      return false;
    }

    return currentTime >= 915 && currentTime <= 1530;
  };

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/market-movers');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMarketData(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Error fetching market data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if data is empty or market is open
    if (marketData.gainers.length === 0 || isMarketOpen()) {
      fetchMarketData();
    }

    // Refresh data every 5 minutes if market is open
    const interval = setInterval(() => {
      if (isMarketOpen()) {
        fetchMarketData();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <MarketDataContext.Provider value={{
      marketData,
      isLoading,
      error,
      lastUpdated,
      isMarketOpen,
      fetchMarketData
    }}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}; 