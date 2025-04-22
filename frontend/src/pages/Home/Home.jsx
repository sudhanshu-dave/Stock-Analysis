import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useMarketData } from '../../context/MarketDataContext';

const Home = () => {
  const { marketData, isLoading, error, isMarketOpen } = useMarketData();

  const MarketStatus = () => {
    const marketOpen = isMarketOpen();
    return (
      <div className={`market-status ${marketOpen ? 'open' : 'closed'}`}>
        <div className="status-indicator"></div>
        <span>Market {marketOpen ? 'Open' : 'Closed'}</span>
      </div>
    );
  };

  const StockList = ({ stocks, title, description }) => (
    <section className="market-section">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          <p className="section-description">{description}</p>
        </div>
        <MarketStatus />
      </div>
      {stocks.length > 0 ? (
        <div className="stocks-grid">
          {stocks.map((stock) => (
            <Link to={`/predict?symbol=${stock.symbol}`} key={stock.symbol} className="stock-card">
              <div className="stock-info">
                <h3>{stock.name}</h3>
                <p className="stock-symbol">{stock.symbol}</p>
              </div>
              <div className="stock-metrics">
                <p className="stock-price">₹{stock.current_price.toFixed(2)}</p>
                <p className={`stock-change ${stock.price_change >= 0 ? 'positive' : 'negative'}`}>
                  {stock.price_change >= 0 ? '+' : ''}{stock.price_change.toFixed(2)}%
                </p>
                <p className="stock-volume">Vol: {stock.volume}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-data-message">
          {isMarketOpen() ? 
            "No data available at the moment" :
            "Market is currently closed. Data will be available during market hours (Mon-Fri, 9:15 AM - 3:30 PM IST)"
          }
        </div>
      )}
    </section>
  );

  return (
    <div className="home-container">
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="market-movers">
          <StockList
            stocks={marketData.gainers}
            title="Top Gainers"
            description="Stocks with the highest price increase today"
          />
          
          <StockList
            stocks={marketData.losers}
            title="Top Losers"
            description="Stocks with the largest price decrease today"
          />
          
          <StockList
            stocks={marketData.most_active}
            title="Most Active"
            description="Stocks with the highest trading volume today"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
