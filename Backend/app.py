from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import yfinance as yf
import pandas_ta as ta
import pandas as pd
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
import time
import os
import asyncio
import aiohttp
from functools import lru_cache

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Read Nifty 50 stocks from CSV file
def get_nifty_50_stocks():
    try:
        # Get the directory of the current script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(current_dir, 'top_50_indian_stocks.csv')
        
        # Read the CSV file
        df = pd.read_csv(csv_path)
        
        # Extract the ticker symbols
        stocks = df['Ticker'].tolist()
        
        # Log the number of stocks loaded
        logging.info(f"Loaded {len(stocks)} stocks from CSV")
        
        return stocks
    except Exception as e:
        logging.error(f"Error reading Nifty 50 stocks from CSV: {e}")
        # Return a default list if CSV reading fails
        return [
            'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
            'HINDUNILVR.NS', 'SBIN.NS', 'BAJFINANCE.NS', 'BHARTIARTL.NS', 'ITC.NS'
        ]

# Initialize MAJOR_STOCKS with stocks from CSV
MAJOR_STOCKS = get_nifty_50_stocks()

def get_trading_activity(symbol):
    try:
        # Get today's data and previous day's data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=2)  # Get 2 days to ensure we have previous day's data
        
        df = yf.download(symbol, start=start_date, end=end_date, interval="1d")
        
        if df.empty:
            return None

        # Get the last two days of data
        df = df.tail(2)
        
        if len(df) < 2:
            return None

        # Calculate metrics
        current_price = df['Close'].iloc[-1]
        prev_close = df['Close'].iloc[-2]
        volume = df['Volume'].iloc[-1]
        price_change = ((current_price - prev_close) / prev_close) * 100
        
        # Calculate trading activity score
        # Considers both volume and price movement
        volume_ratio = volume / df['Volume'].iloc[-2]  # Volume compared to previous day
        activity_score = volume_ratio * (1 + abs(price_change/100))  # Higher score for higher volume and price movement

        return {
            "symbol": symbol,
            "current_price": current_price,
            "price_change": price_change,
            "volume": volume,
            "activity_score": activity_score
        }
    except Exception as e:
        logging.error(f"Error calculating trading activity for {symbol}: {e}")
        return None

@app.route('/most-traded', methods=['GET'])
def get_most_traded():
    try:
        # Get trading activity for all major stocks
        activities = []
        for symbol in MAJOR_STOCKS:
            activity = get_trading_activity(symbol)
            if activity:
                # Get additional info for the stock
                stock = yf.Ticker(symbol)
                info = stock.info
                activity["name"] = info.get("longName") or info.get("shortName", "")
                activities.append(activity)

        # Sort by activity score
        activities.sort(key=lambda x: x["activity_score"], reverse=True)
        
        # Take top 10 most active stocks
        top_stocks = activities[:10]

        return jsonify({
            "stocks": top_stocks
        })

    except Exception as e:
        logging.exception("Error in most-traded endpoint:")
        return jsonify({"error": "Failed to fetch most traded stocks"}), 500

# Helper: Tries common suffixes used in Yahoo Finance for Indian stocks
def try_stock_symbols(symbol):
    base_symbol = symbol.split('.')[0].upper()
    suffixes = ['.NS', '.BO', '']  # NSE, BSE, fallback

    for suffix in suffixes:
        full_symbol = f"{base_symbol}{suffix}"
        try:
            data = yf.download(full_symbol, period="1d", interval="1d")
            if not data.empty:
                logging.info(f"Resolved {symbol} → {full_symbol}")
                return full_symbol
        except Exception as e:
            logging.warning(f"Failed for {full_symbol}: {e}")
    raise ValueError(f"Stock data not found for symbol: {symbol}")

# Helper: Fetch general stock info
def get_stock_info(symbol):
    try:
        stock = yf.Ticker(symbol)
        info = stock.info

        return {
            "name": info.get("longName") or info.get("shortName", ""),
            "currentPrice": info.get("regularMarketPrice", 0),
            "dayHigh": info.get("dayHigh", 0),
            "dayLow": info.get("dayLow", 0),
            "volume": info.get("volume", 0),
            "averageVolume": info.get("averageVolume", 0),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", 0),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", 0),
            "marketCap": info.get("marketCap", 0),
            "beta": info.get("beta", 0),
            "peRatio": info.get("forwardPE", 0),
            "eps": info.get("trailingEPS", 0)
        }
    except Exception as e:
        logging.error(f"Error fetching stock info: {e}")
        return {}

# Helper: Fetch technical indicators using pandas_ta
def get_technical_indicators(symbol):
    try:
        # Get 6 months of daily data
        df = yf.download(symbol, period="6mo", interval="1d", auto_adjust=False)

        if df.empty:
            logging.warning(f"No data for {symbol}")
            return {}

        # Flatten columns in case of multi-index
        df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]
        logging.info(f"Flattened columns for {symbol}: {df.columns.tolist()}")

        required_cols = {"Open", "High", "Low", "Close", "Volume"}
        if not required_cols.issubset(df.columns):
            logging.error(f"Missing columns: {required_cols - set(df.columns)}")
            return {}

        df = df.dropna(subset=list(required_cols))

        # Calculate technical indicators
        # RSI
        df.ta.rsi(length=14, append=True)
        
        # MACD
        df.ta.macd(append=True)
        
        # Moving Averages
        df.ta.ema(length=20, append=True)
        df.ta.sma(length=50, append=True)
        
        # Bollinger Bands
        df.ta.bbands(length=20, append=True)
        
        # Volume indicators
        df.ta.obv(append=True)  # On Balance Volume
        df.ta.vwap(append=True)  # Volume Weighted Average Price
        
        # Additional momentum indicators
        df.ta.stoch(append=True)  # Stochastic Oscillator
        df.ta.adx(append=True)  # Average Directional Index
        
        # Fill any remaining NaN values
        df.fillna(method='bfill', inplace=True)

        # Extract latest values
        rsi = float(df['RSI_14'].iloc[-1]) if 'RSI_14' in df.columns and pd.notnull(df['RSI_14'].iloc[-1]) else None
        macd = float(df['MACD_12_26_9'].iloc[-1]) if 'MACD_12_26_9' in df.columns and pd.notnull(df['MACD_12_26_9'].iloc[-1]) else None
        macd_signal = float(df['MACDs_12_26_9'].iloc[-1]) if 'MACDs_12_26_9' in df.columns and pd.notnull(df['MACDs_12_26_9'].iloc[-1]) else None
        macd_hist = float(df['MACDh_12_26_9'].iloc[-1]) if 'MACDh_12_26_9' in df.columns and pd.notnull(df['MACDh_12_26_9'].iloc[-1]) else None
        
        # Volume analysis
        current_volume = float(df['Volume'].iloc[-1])
        avg_volume = float(df['Volume'].rolling(20).mean().iloc[-1])
        volume_ratio = current_volume / avg_volume if avg_volume > 0 else 1.0
        
        # Enhanced recommendation logic
        recommendation = "Hold"
        confidence_score = 0
        
        if rsi is not None and macd is not None and macd_signal is not None:
            # RSI-based signals
            if rsi < 30:
                recommendation = "Strong Buy"
                confidence_score += 2
            elif rsi < 40:
                recommendation = "Buy"
                confidence_score += 1
            elif rsi > 70:
                recommendation = "Strong Sell"
                confidence_score += 2
            elif rsi > 60:
                recommendation = "Sell"
                confidence_score += 1
            
            # MACD-based signals
            if macd_hist > 0:
                if recommendation in ["Strong Buy", "Buy"]:
                    confidence_score += 1
                elif recommendation == "Hold":
                    recommendation = "Buy"
                    confidence_score += 1
            elif macd_hist < 0:
                if recommendation in ["Strong Sell", "Sell"]:
                    confidence_score += 1
                elif recommendation == "Hold":
                    recommendation = "Sell"
                    confidence_score += 1
            
            # Volume confirmation
            if volume_ratio > 1.5:
                if recommendation in ["Strong Buy", "Buy"]:
                    confidence_score += 1
                elif recommendation in ["Strong Sell", "Sell"]:
                    confidence_score += 1
            
            # Final recommendation adjustment based on confidence
            if confidence_score >= 3:
                if recommendation == "Buy":
                    recommendation = "Strong Buy"
                elif recommendation == "Sell":
                    recommendation = "Strong Sell"

        return {
            "rsi": rsi,
            "macd": macd,
            "macd_signal": macd_signal,
            "macd_hist": macd_hist,
            "ema_20": float(df['EMA_20'].iloc[-1]) if 'EMA_20' in df.columns else None,
            "sma_50": float(df['SMA_50'].iloc[-1]) if 'SMA_50' in df.columns else None,
            "bollinger_upper": float(df['BBU_20_2.0'].iloc[-1]) if 'BBU_20_2.0' in df.columns else None,
            "bollinger_middle": float(df['BBM_20_2.0'].iloc[-1]) if 'BBM_20_2.0' in df.columns else None,
            "bollinger_lower": float(df['BBL_20_2.0'].iloc[-1]) if 'BBL_20_2.0' in df.columns else None,
            "obv": float(df['OBV'].iloc[-1]) if 'OBV' in df.columns else None,
            "vwap": float(df['VWAP'].iloc[-1]) if 'VWAP' in df.columns else None,
            "stoch_k": float(df['STOCHk_14_3_3'].iloc[-1]) if 'STOCHk_14_3_3' in df.columns else None,
            "stoch_d": float(df['STOCHd_14_3_3'].iloc[-1]) if 'STOCHd_14_3_3' in df.columns else None,
            "adx": float(df['ADX_14'].iloc[-1]) if 'ADX_14' in df.columns else None,
            "di_plus": float(df['DMP_14'].iloc[-1]) if 'DMP_14' in df.columns else None,
            "di_minus": float(df['DMN_14'].iloc[-1]) if 'DMN_14' in df.columns else None,
            "volume_ratio": volume_ratio,
            "current_volume": current_volume,
            "avg_volume": avg_volume,
            "recommendation": recommendation,
            "confidence_score": confidence_score
        }

    except Exception as e:
        logging.error(f"Indicator error for {symbol}: {e}")
        return {}

# Route: Predict endpoint
@app.route('/predict', methods=['GET'])
def predict_stock():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({"error": "Please provide a stock symbol."}), 400

    try:
        correct_symbol = try_stock_symbols(symbol)
        stock_info = get_stock_info(correct_symbol)
        technical_indicators = get_technical_indicators(correct_symbol)

        return jsonify({
            "stock": correct_symbol,
            "stock_info": stock_info,
            "technical_indicators": technical_indicators
        })

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logging.exception("Unhandled error:")
        return jsonify({"error": "An error occurred"}), 500

# Cache for market data with 5-minute expiration
market_data_cache = {
    'data': None,
    'timestamp': None
}

def is_cache_valid():
    if not market_data_cache['data'] or not market_data_cache['timestamp']:
        return False
    return (datetime.now() - market_data_cache['timestamp']).total_seconds() < 300  # 5 minutes

async def fetch_stock_data(session, symbol):
    try:
        # Add a small delay between requests to avoid rate limiting
        await asyncio.sleep(0.1)
        
        data = yf.download(symbol, period="2d", interval="1d", progress=False, auto_adjust=True)
        if data.empty or len(data) < 2:
            return None

        prev_close = float(data['Close'].iloc[-2].iloc[0])
        current_price = float(data['Close'].iloc[-1].iloc[0])
        volume = float(data['Volume'].iloc[-1].iloc[0])
        price_change = ((current_price - prev_close) / prev_close) * 100

        info = yf.Ticker(symbol).info
        if not info:
            return None

        return {
            "symbol": symbol,
            "name": info.get("longName") or info.get("shortName", "") or symbol,
            "current_price": current_price,
            "formatted_price": f"₹{round(current_price, 2):,.2f}",
            "price_change": round(price_change, 2),
            "volume": int(volume) if not pd.isna(volume) else 0
        }
    except Exception as e:
        logging.error(f"Error fetching {symbol}: {str(e)}")
        return None

async def fetch_market_movers_yf():
    # Check cache first
    if is_cache_valid():
        logging.info("Returning cached market data")
        return market_data_cache['data']

    stocks = get_nifty_50_stocks()
    stocks_data = []
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_stock_data(session, symbol) for symbol in stocks]
        results = await asyncio.gather(*tasks)
        
        # Filter out None results
        stocks_data = [result for result in results if result is not None]

    if not stocks_data:
        logging.error("No stock data was successfully fetched")
        return [], [], []

    # Sort and get top 10 for each category
    gainers = sorted(stocks_data, key=lambda x: x["price_change"], reverse=True)[:10]
    losers = sorted(stocks_data, key=lambda x: x["price_change"])[:10]
    most_active = sorted(stocks_data, key=lambda x: x["volume"], reverse=True)[:10]

    # Update cache
    market_data_cache['data'] = (gainers, losers, most_active)
    market_data_cache['timestamp'] = datetime.now()

    return gainers, losers, most_active

@app.route('/market-movers', methods=['GET'])
def get_market_movers():
    try:
        # Run the async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        gainers, losers, most_active = loop.run_until_complete(fetch_market_movers_yf())
        loop.close()

        if not gainers and not losers and not most_active:
            return jsonify({
                "error": "No market data available at the moment",
                "market_status": "closed"
            }), 200

        return jsonify({
            "gainers": gainers,
            "losers": losers,
            "most_active": most_active,
            "market_status": "open"
        })

    except Exception as e:
        logging.exception("Error in market-movers endpoint:")
        return jsonify({
            "error": "Failed to fetch market movers",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)