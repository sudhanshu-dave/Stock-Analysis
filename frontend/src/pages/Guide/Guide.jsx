import React from "react";
import "./Guide.css";

const Guide = () => {
  return (
    <div className="guide-container">
      <div className="guide-header">
        <h1>Technical Analysis Guide</h1>
        <p>Learn how to interpret technical indicators and make informed trading decisions</p>
      </div>

      <div className="guide-section">
        <h2>Market Movers</h2>
        
        <div className="indicator-card">
          <h3>Top Gainers</h3>
          <p className="indicator-description">
            Stocks with the highest percentage price increase in the current trading session.
            Calculated by comparing the current price with the previous day's closing price.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Price Change = ((Current Price - Previous Close) / Previous Close) × 100
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Updated every 5 minutes during market hours
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Based on Nifty 50 stocks
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>Top Losers</h3>
          <p className="indicator-description">
            Stocks with the highest percentage price decrease in the current trading session.
            Calculated using the same formula as gainers but for negative price changes.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Price Change = ((Current Price - Previous Close) / Previous Close) × 100
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Updated every 5 minutes during market hours
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Based on Nifty 50 stocks
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>Most Active</h3>
          <p className="indicator-description">
            Stocks with the highest trading volume in the current session.
            Volume represents the total number of shares traded.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Sorted by total trading volume
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Updated every 5 minutes during market hours
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Based on Nifty 50 stocks
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>Data Source and Updates</h3>
          <p className="indicator-description">
            Market movers data is fetched from Yahoo Finance and updated every 5 minutes.
            The data is cached to improve performance and reduce API calls.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Data source: Yahoo Finance API
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Cache duration: 5 minutes
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Stocks covered: Nifty 50 constituents
            </li>
          </ul>
        </div>
      </div>

      <div className="guide-section">
        <h2>Momentum Indicators</h2>
        
        <div className="indicator-card">
          <h3>RSI (Relative Strength Index)</h3>
          <p className="indicator-description">
            Measures momentum of price changes. Range: 0 to 100. Used to identify overbought or oversold conditions.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              RSI &lt; 30: Stock is oversold (Buy signal)
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              RSI 30-70: Neutral zone (Hold)
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              RSI &gt; 70: Stock is overbought (Sell signal)
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>MACD (Moving Average Convergence Divergence)</h3>
          <p className="indicator-description">
            Momentum indicator showing the relationship between two EMAs (12 & 26-period). Includes MACD line, Signal line (9-period EMA), and Histogram.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              MACD crosses above Signal → Buy signal
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              MACD crosses below Signal → Sell signal
            </li>
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Histogram &gt; 0 → Bullish momentum
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Histogram &lt; 0 → Bearish momentum
            </li>
          </ul>
        </div>
      </div>

      <div className="guide-section">
        <h2>Trend Indicators</h2>
        
        <div className="indicator-card">
          <h3>EMA (Exponential Moving Average)</h3>
          <p className="indicator-description">
            Weighted moving average giving more importance to recent prices. Used as a trend indicator.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Price &gt; EMA20 → Uptrend
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Price &lt; EMA20 → Downtrend
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>SMA (Simple Moving Average)</h3>
          <p className="indicator-description">
            Basic average of closing prices over n periods. SMA 50 is used as a medium-term trend indicator.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Price &gt; SMA50 → Bullish trend
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Price &lt; SMA50 → Bearish trend
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>Bollinger Bands</h3>
          <p className="indicator-description">
            Volatility indicator with 3 lines: Middle Band (SMA20), Upper Band (SMA + 2×Std Dev), Lower Band (SMA - 2×Std Dev)
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Price touches Lower Band → Potential buy signal
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Price touches Upper Band → Potential sell signal
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Bands widen → High volatility
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              Bands tighten → Low volatility
            </li>
          </ul>
        </div>
      </div>

      <div className="guide-section">
        <h2>Volume Indicators</h2>
        
        <div className="indicator-card">
          <h3>OBV (On-Balance Volume)</h3>
          <p className="indicator-description">
            Measures volume flow with price movement. Used to confirm price trends and predict reversals.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Rising OBV confirms uptrend
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Falling OBV confirms downtrend
            </li>
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              OBV divergence from price may signal reversal
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>VWAP (Volume Weighted Average Price)</h3>
          <p className="indicator-description">
            The average price a stock has traded at throughout the day, weighted by volume. Used by institutions and intraday traders.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Price &gt; VWAP → Bullish signal
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Price &lt; VWAP → Bearish signal
            </li>
        </ul>
        </div>
      </div>

      <div className="guide-section">
        <h2>Additional Indicators</h2>
        
        <div className="indicator-card">
          <h3>Stochastic Oscillator (%K and %D)</h3>
          <p className="indicator-description">
            Compares a stock's closing price to its price range over a period. Used to identify overbought and oversold conditions.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              %K crossing above %D → Buy signal
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              %K crossing below %D → Sell signal
            </li>
            <li className="interpretation-item bearish">
              <div className="signal-icon bearish"></div>
              Values &gt; 80 → Overbought
            </li>
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Values &lt; 20 → Oversold
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>ADX (Average Directional Index)</h3>
          <p className="indicator-description">
            Measures trend strength, not direction. Range: 0 to 100. Used with +DI and -DI to determine trend direction.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item neutral">
              <div className="signal-icon neutral"></div>
              ADX &lt; 20 → Weak trend
            </li>
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              ADX &gt; 20 → Strong trend
            </li>
          </ul>
        </div>

        <div className="indicator-card">
          <h3>Volume Ratio</h3>
          <p className="indicator-description">
            Compares current volume to 20-day average volume. Used to identify unusual trading activity.
          </p>
          <ul className="interpretation-list">
            <li className="interpretation-item bullish">
              <div className="signal-icon bullish"></div>
              Ratio &gt; 1.5 → Unusual activity, adds confidence to signals
            </li>
          </ul>
        </div>

        <div className="recommendation-section">
          <h3>Recommendation Engine</h3>
          <p className="indicator-description">
            Our recommendation engine combines multiple technical indicators (RSI, MACD, Volume) to generate trading signals.
            The confidence score is calculated based on indicator convergence.
          </p>
          <div className="recommendation-grid">
            <div className="recommendation-card strong-buy">Strong Buy</div>
            <div className="recommendation-card buy">Buy</div>
            <div className="recommendation-card hold">Hold</div>
            <div className="recommendation-card sell">Sell</div>
            <div className="recommendation-card strong-sell">Strong Sell</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
