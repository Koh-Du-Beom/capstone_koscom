import argparse
import json
from pykrx import stock
import datetime

def fetch_stock_data(stock_code):
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=1000)

    df = stock.get_market_ohlcv_by_date(start_date.strftime('%Y%m%d'), end_date.strftime('%Y%m%d'), stock_code)

    # lightweight-charts 형식으로 변환
    data = []
    for index, row in df.iterrows():
        date_str = index.strftime('%Y-%m-%d')
        data.append({
            "time": date_str,
            "open": row["시가"],
            "high": row["고가"],
            "low": row["저가"],
            "close": row["종가"]
        })
    return data

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch stock data for lightweight-charts")
    parser.add_argument('--stockCode', type=str, required=True, help="Stock code to fetch data for")
    args = parser.parse_args()

    try:
        stock_data = fetch_stock_data(args.stockCode)
        print(json.dumps(stock_data))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        exit(1)
