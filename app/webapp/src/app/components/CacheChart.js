"use client";
import Chart from "./Chart";
import { getStartDate, getBucketSize } from "../utils/dateHelpers";
import { getCacheChartOptions } from "../utils/chartOptions";

const CacheChart = ({ chartData, chartName, timeRange }) => {
  const data = chartData ? chartData[chartName] : null;
  const startDate = getStartDate(timeRange);
  const bucketSize = getBucketSize(timeRange);

  const aggregateData = (data, bucketSize, startDate) => {
    if (!data) return { labels: [], data: [], originalDates: [] };

    const aggregated = {};
    const labels = [];
    const values = [];
    const originalDates = [];

    const formatLabel = (date, bucketSize) => {
      if (bucketSize === "second") return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (bucketSize === "minute") return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (bucketSize === "hour") return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (bucketSize === "day") return date.toLocaleDateString();
      if (bucketSize === "month") return `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (bucketSize === "year") return date.getFullYear();
      return date.toLocaleDateString();
    };

    const filteredData = {
      labels: [],
      data: data.data ? [] : undefined,
      series: data.series ? data.series.map(s => ({ ...s, data: [] })) : undefined,
    };

    data.labels.forEach((label, index) => {
      const date = new Date(label);
      if (date >= startDate) {
        filteredData.labels.push(label);
        if (filteredData.data) {
          filteredData.data.push(data.data[index]);
        }
        if (filteredData.series) {
          filteredData.series.forEach((s, i) => {
            s.data.push(data.series[i].data[index]);
          });
        }
      }
    });

    if (filteredData.labels.length === 0) {
      return { labels: [], data: [], originalDates: [] };
    }

    filteredData.labels.forEach((label, index) => {
      const date = new Date(label);
      let bucketKey;

      if (bucketSize === "second") bucketKey = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()).toISOString();
      else if (bucketSize === "minute") bucketKey = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).toISOString();
      else if (bucketSize === "hour") bucketKey = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).toISOString();
      else if (bucketSize === "day") bucketKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      else if (bucketSize === "month") bucketKey = new Date(date.getFullYear(), date.getMonth()).toISOString();
      else if (bucketSize === "year") bucketKey = new Date(date.getFullYear(), 0).toISOString();

      if (!aggregated[bucketKey]) {
        aggregated[bucketKey] = {
          label: formatLabel(date, bucketSize),
          date: date,
          values: [],
          series: {},
        };
      }
      
      if (filteredData.data) {
        aggregated[bucketKey].values.push(filteredData.data[index]);
      }
      if (filteredData.series) {
        filteredData.series.forEach((s, i) => {
          if (!aggregated[bucketKey].series[s.name]) {
            aggregated[bucketKey].series[s.name] = [];
          }
          aggregated[bucketKey].series[s.name].push(s.data[index]);
        });
      }
    });

    const sortedKeys = Object.keys(aggregated).sort();

    sortedKeys.forEach(key => {
      labels.push(aggregated[key].label);
      originalDates.push(aggregated[key].date);
      if (chartName === 'cacheHitRate') {
          const sum = aggregated[key].values.reduce((a, b) => a + b, 0);
          values.push(sum / aggregated[key].values.length);
      } else if (data.data) {
        values.push(aggregated[key].values.reduce((a, b) => a + b, 0));
      } else if (data.series) {
        const seriesValues = {};
        for (const seriesName in aggregated[key].series) {
          seriesValues[seriesName] = aggregated[key].series[seriesName].reduce((a, b) => a + b, 0);
        }
        values.push(seriesValues);
      }
    });

    return { labels, data: values, originalDates };
  };
  
  const aggregatedData = aggregateData(data, bucketSize, startDate);
  const chartOptions = getCacheChartOptions(chartName, aggregatedData, data);

  return <Chart option={chartOptions} style={{ height: "100%", width: "100%" }} />;
};

export default CacheChart;
