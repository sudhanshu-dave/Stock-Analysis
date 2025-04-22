import React from 'react';
import './StockInfoTable.css';

const StockInfoTable = ({ stockInfo, technicalIndicators }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      if (value >= 1000000000) {
        return `₹${(value / 1000000000).toFixed(2)}B`;
      }
      if (value >= 1000000) {
        return `₹${(value / 1000000).toFixed(2)}M`;
      }
      return value.toFixed(2);
    }
    return value;
  };

  const getIndicatorClass = (indicator, value) => {
    if (value === null || value === undefined) return '';
    
    switch (indicator) {
      case 'rsi':
        if (value > 70) return 'overbought';
        if (value < 30) return 'oversold';
        break;
      case 'macd':
        if (value > 0) return 'bullish';
        if (value < 0) return 'bearish';
        break;
      case 'recommendation':
        if (value === 'Strong Buy') return 'strong-bullish';
        if (value === 'Buy') return 'bullish';
        if (value === 'Sell') return 'bearish';
        if (value === 'Strong Sell') return 'strong-bearish';
        break;
      default:
        return '';
    }
    return '';
  };

  const getIndicatorTooltip = (indicator) => {
    switch (indicator) {
      case 'rsi':
        return 'Relative Strength Index (14): Measures momentum. >70 overbought, <30 oversold';
      case 'macd':
        return 'Moving Average Convergence Divergence: Positive values indicate bullish momentum';
      case 'macd_signal':
        return 'MACD Signal Line: Used to generate trading signals';
      case 'macd_hist':
        return 'MACD Histogram: Shows strength of momentum. Positive = bullish, Negative = bearish';
      case 'ema_20':
        return '20-day Exponential Moving Average: Short-term trend indicator';
      case 'sma_50':
        return '50-day Simple Moving Average: Medium-term trend indicator';
      case 'bollinger_upper':
        return 'Upper Bollinger Band: Price is considered overbought when touching this line';
      case 'bollinger_middle':
        return 'Middle Bollinger Band: 20-day Simple Moving Average';
      case 'bollinger_lower':
        return 'Lower Bollinger Band: Price is considered oversold when touching this line';
      case 'obv':
        return 'On-Balance Volume: Measures volume flow with price movement';
      case 'vwap':
        return 'Volume Weighted Average Price: Average price weighted by volume';
      case 'stoch_k':
        return 'Stochastic %K: Compares closing price to price range';
      case 'stoch_d':
        return 'Stochastic %D: Signal line for Stochastic Oscillator';
      case 'adx':
        return 'Average Directional Index: Measures trend strength (not direction)';
      case 'di_plus':
        return '+DI: Positive Directional Indicator';
      case 'di_minus':
        return '-DI: Negative Directional Indicator';
      case 'volume_ratio':
        return 'Volume Ratio: Current volume / 20-day average volume';
      case 'recommendation':
        return 'Trading recommendation based on multiple technical indicators';
      default:
        return '';
    }
  };

  const stockData = [
    { label: 'Current Price', value: formatValue(stockInfo.currentPrice) },
    { label: "Day's High", value: formatValue(stockInfo.dayHigh) },
    { label: "Day's Low", value: formatValue(stockInfo.dayLow) },
    { label: 'Volume', value: formatValue(stockInfo.volume) },
    { label: 'Avg. Volume', value: formatValue(stockInfo.averageVolume) },
    { label: '52 Week High', value: formatValue(stockInfo.fiftyTwoWeekHigh) },
    { label: '52 Week Low', value: formatValue(stockInfo.fiftyTwoWeekLow) },
    { label: 'Market Cap', value: formatValue(stockInfo.marketCap) },
    { label: 'Beta', value: stockInfo.beta?.toFixed(2) || 'N/A' },
    { label: 'PE Ratio', value: stockInfo.peRatio?.toFixed(2) || 'N/A' },
    { label: 'EPS', value: stockInfo.eps?.toFixed(2) || 'N/A' }
  ];

  const technicalData = [
    { 
      label: 'RSI (14)', 
      value: formatValue(technicalIndicators.rsi),
      indicator: 'rsi'
    },
    { 
      label: 'MACD', 
      value: formatValue(technicalIndicators.macd),
      indicator: 'macd'
    },
    { 
      label: 'MACD Signal', 
      value: formatValue(technicalIndicators.macd_signal),
      indicator: 'macd_signal'
    },
    { 
      label: 'MACD Histogram', 
      value: formatValue(technicalIndicators.macd_hist),
      indicator: 'macd_hist'
    },
    { 
      label: 'EMA (20)', 
      value: formatValue(technicalIndicators.ema_20),
      indicator: 'ema_20'
    },
    { 
      label: 'SMA (50)', 
      value: formatValue(technicalIndicators.sma_50),
      indicator: 'sma_50'
    },
    { 
      label: 'BB Upper', 
      value: formatValue(technicalIndicators.bollinger_upper),
      indicator: 'bollinger_upper'
    },
    { 
      label: 'BB Middle', 
      value: formatValue(technicalIndicators.bollinger_middle),
      indicator: 'bollinger_middle'
    },
    { 
      label: 'BB Lower', 
      value: formatValue(technicalIndicators.bollinger_lower),
      indicator: 'bollinger_lower'
    },
    { 
      label: 'OBV', 
      value: formatValue(technicalIndicators.obv),
      indicator: 'obv'
    },
    { 
      label: 'VWAP', 
      value: formatValue(technicalIndicators.vwap),
      indicator: 'vwap'
    },
    { 
      label: 'Stoch %K', 
      value: formatValue(technicalIndicators.stoch_k),
      indicator: 'stoch_k'
    },
    { 
      label: 'Stoch %D', 
      value: formatValue(technicalIndicators.stoch_d),
      indicator: 'stoch_d'
    },
    { 
      label: 'ADX', 
      value: formatValue(technicalIndicators.adx),
      indicator: 'adx'
    },
    { 
      label: '+DI', 
      value: formatValue(technicalIndicators.di_plus),
      indicator: 'di_plus'
    },
    { 
      label: '-DI', 
      value: formatValue(technicalIndicators.di_minus),
      indicator: 'di_minus'
    },
    { 
      label: 'Volume Ratio', 
      value: formatValue(technicalIndicators.volume_ratio),
      indicator: 'volume_ratio'
    },
    { 
      label: 'Recommendation', 
      value: technicalIndicators.recommendation || 'N/A',
      indicator: 'recommendation'
    }
  ];

  return (
    <div className="stock-info-container">
      <h2 className="section-title">Stock Information</h2>
      <div className="tables-container">
        <div className="table-section">
          <table className="stock-info-table">
            <tbody>
              {stockData.slice(0, Math.ceil(stockData.length / 2)).map((item, index) => (
                <tr key={index}>
                  <td className="label">{item.label}</td>
                  <td className="value">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-section">
          <table className="stock-info-table">
            <tbody>
              {stockData.slice(Math.ceil(stockData.length / 2)).map((item, index) => (
                <tr key={index}>
                  <td className="label">{item.label}</td>
                  <td className="value">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="section-title">Technical Indicators</h2>
      <div className="tables-container">
        <div className="table-section">
          <table className="technical-indicators-table">
            <tbody>
              {technicalData.slice(0, Math.ceil(technicalData.length / 2)).map((item, index) => (
                <tr key={index}>
                  <td className="label" title={getIndicatorTooltip(item.indicator)}>
                    {item.label}
                  </td>
                  <td className={`value ${getIndicatorClass(item.indicator, item.value)}`}>
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-section">
          <table className="technical-indicators-table">
            <tbody>
              {technicalData.slice(Math.ceil(technicalData.length / 2)).map((item, index) => (
                <tr key={index}>
                  <td className="label" title={getIndicatorTooltip(item.indicator)}>
                    {item.label}
                  </td>
                  <td className={`value ${getIndicatorClass(item.indicator, item.value)}`}>
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockInfoTable; 