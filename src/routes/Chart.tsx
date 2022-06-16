import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import styled from "styled-components";
import { TailSpin } from "react-loader-spinner";
var randomColor = require("randomcolor");

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

const Loader = styled.span`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
`;

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  console.log(data);

  return (
    <div>
      {isLoading ? (
        <Loader>
          <TailSpin height="200" width="200" color={randomColor()}></TailSpin>
        </Loader>
      ) : (
        <ApexChart
          type="line"
          series={[
            { name: "price", data: data?.map((price) => price.close) ?? [] },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            grid: {
              show: false,
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent,",
            },
            stroke: {
              curve: "smooth",
              width: 5,
            },
            yaxis: {
              labels: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            xaxis: {
              type: "datetime",
              labels: {
                show: false,
              },
              categories: data?.map(
                (price) => (price.time_close as any) * 1000 ?? []
              ),
            },
            fill: {
              type: "gradient",
              gradient: {
                gradientToColors: ["#f90000"],
                stops: [0, 100],
                type: "vertical",
              },
            },
            colors: ["#4000ff"],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(3)}`,
              },
              x: {
                format: "yy/MM/dd",
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
