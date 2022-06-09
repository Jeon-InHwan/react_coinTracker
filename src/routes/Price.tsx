import { useQuery } from "react-query";
import { fetchCoinHistory, fetchCoinTickers } from "../api";
import styled from "styled-components";

interface ChartProps {
  coinId: string;
}

interface IHistorical {
  close: number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const PriceWapper = styled.div`
  display: flex;
  color: ${(props) => props.theme.bgColor};
  justify-content: space-between;
  background-color: ${(props) => props.theme.textColor};
  padding: 10px 20px;
  border-radius: 10px;
  width: 100%;
  margin-top: 25px;
  margin-bottom: 15px;
`;

const PriceWapper2 = styled(PriceWapper)`
  margin-top: 0px;
  justify-content: center;
`;

const PriceWapper3 = styled(PriceWapper2)`
  margin-bottom: 50px;
`;

const LatestInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  span:first-child {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
  }
`;

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );

  const { isLoading: tickers2Loading, data: tickers2Data } =
    useQuery<PriceData>(["tickers2", coinId], () => fetchCoinTickers(coinId), {
      refetchInterval: 5000,
    });

  console.log(data);

  const highValues = data?.map((oneDay) => {
    return oneDay.high;
  });

  const lowValues = data?.map((oneDay) => {
    return oneDay.low;
  });

  let highestValue;
  let lowestValue;
  let gapBtw1;
  let gapBtw2;

  const nowValue = tickers2Data?.quotes.USD.price;

  if (highValues != undefined && nowValue != undefined) {
    highestValue = Math.max.apply(null, highValues);
    gapBtw1 = nowValue - highestValue;
  }

  if (lowValues != undefined && nowValue != undefined) {
    lowestValue = Math.min.apply(null, lowValues);
    gapBtw2 = nowValue - lowestValue;
  }

  console.log(highestValue);
  console.log(lowestValue);

  return (
    <div>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <>
          <PriceWapper>
            <LatestInfo>
              <span>Highest Price In Last 7 Days</span>
              <span>{`$${highestValue?.toFixed(3)}`}</span>
            </LatestInfo>
            <LatestInfo>
              <span>Lowest Price In Last 7 Days</span>
              <span>{`$${lowestValue?.toFixed(3)}`}</span>
            </LatestInfo>
          </PriceWapper>
          <PriceWapper2>
            <LatestInfo>
              <span>
                The Gap between Highest Price In Last 7 Days And Now Price
              </span>
              <span>{`$${gapBtw1?.toFixed(3)}`}</span>
            </LatestInfo>
          </PriceWapper2>
          <PriceWapper3>
            <LatestInfo>
              <span>
                The Gap between Lowest Price In Last 7 Days And Now Price
              </span>
              <span>{`$${gapBtw2?.toFixed(3)}`}</span>
            </LatestInfo>
          </PriceWapper3>
        </>
      )}
    </div>
  );
}

export default Chart;
