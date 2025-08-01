"use client";
import { useState, useEffect } from "react";
import Header from "../components/platform/header";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import CacheChart from "../components/CacheChart";
import { formatNumber } from "../utils/formatNumber";
import { getStartDate, getBucketSize, formatLabel } from "../utils/dateHelpers";
import { fetchApi } from "../utils/api";
import "../styles/datepicker.css";

export default function Dashboard({ backListingLink = "./" }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [latencyMetric, setLatencyMetric] = useState("average");

  const fetchData = async () => {
    try {
      const data = await fetchApi("http://127.0.0.1:9014/api/chartdata", "GET");
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const pageTabs = [
    {
      ItemId: "overview",
      ItemName: "Overview",
      Svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 16 16"
          className="w-4 h-4"
        >
          <path
            fill="currentColor"
            d="M6.5 7.997a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0"
          ></path>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M1.334 7.997c0 1.093.283 1.461.85 2.198C3.313 11.665 5.211 13.33 8 13.33s4.685-1.667 5.817-3.136c.566-.737.85-1.105.85-2.198s-.284-1.46-.85-2.197C12.685 4.33 10.788 2.664 8 2.664S3.315 4.33 2.183 5.8c-.566.736-.85 1.104-.85 2.197M8 5.497a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      ItemId: "tools",
      ItemName: "Tools",
      Svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L8 7.48l-4.73.38c-1.63.13-2.29 2.2-1.08 3.32l3.47 3.36-.82 4.72c-.28 1.6.95 2.88 2.4 2.14L10 15.48l4.24 2.53c1.45.74 2.68-.54 2.4-2.14l-.82-4.72 3.47-3.36c1.2-1.12.55-3.19-1.08-3.32L12 7.48l-.51-4.31z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      ItemId: "cache",
      ItemName: "Cache",
      Svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 16 16"
          className="w-4 h-4"
        >
          <path
            fill="currentColor"
            d="M5.083 2.967c1.251-.5 1.998-.799 2.917-.799.92 0 1.666.299 2.917.8l1.98.791c.636.255 1.152.46 1.505.646.18.094.353.2.487.329a.83.83 0 0 1 .278.6.83.83 0 0 1-.278.601 2.1 2.1 0 0 1-.486.329c-.354.185-.87.392-1.506.646l-1.98.792c-1.251.5-1.997.8-2.917.8s-1.666-.3-2.917-.8l-1.98-.792c-.636-.254-1.151-.46-1.505-.646a2.1 2.1 0 0 1-.487-.329.83.83 0 0 1-.278-.6c0-.27.141-.47.278-.601a2.1 2.1 0 0 1 .487-.329c.354-.185.87-.391 1.505-.646z"
          ></path>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m1.667 7.629.002.001a1 1 0 0 0 .094.077c.073.056.186.139.339.238a8 8 0 0 0 1.403.715l1.872.75c1.35.54 1.916.758 2.623.758s1.273-.219 2.623-.759l1.872-.749a8 8 0 0 0 1.403-.715 5 5 0 0 0 .417-.301l.017-.014.001-.001.001-.001a.5.5 0 0 1 .667.745l-.334-.372.334.372-.001.001-.001.001-.004.003-.009.008a3 3 0 0 1-.138.112c-.093.072-.228.17-.406.286-.355.23-.88.527-1.575.805l-1.873.749-.077.03c-1.251.501-1.997.8-2.917.8s-1.666-.299-2.917-.8l-.077-.03-1.872-.75a9 9 0 0 1-1.576-.804 6 6 0 0 1-.544-.398l-.01-.008-.002-.003H1L1 8.373 1.333 8 1 8.374a.5.5 0 0 1 .666-.746m.001 2.667a.5.5 0 0 0-.706.04zm0 0 .002.002.016.014.078.062c.073.056.186.14.339.239.307.198.774.464 1.403.715l1.872.749c1.35.54 1.916.759 2.623.759s1.273-.219 2.623-.759l1.872-.749a8 8 0 0 0 1.403-.715 5 5 0 0 0 .417-.301l.017-.014.001-.001.001-.001a.5.5 0 0 1 .667.745l-.323-.36.323.36-.001.001-.001.001-.004.003-.009.008a2 2 0 0 1-.138.112c-.093.072-.228.17-.406.286-.355.23-.88.526-1.575.805l-1.873.749-.077.03c-1.251.501-1.997.8-2.917.8s-1.666-.299-2.917-.8l-.077-.03-1.872-.75a9 9 0 0 1-1.576-.804 6 6 0 0 1-.544-.398l-.01-.008-.002-.003L1 11.041H1l.333-.373L1 11.04a.5.5 0 0 1-.039-.706"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      ItemId: "behaviour",
      ItemName: "Behaviour",
      Svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const calculateSummary = (chartData, timeRange, latencyMetric) => {
    if (!chartData) {
      return { cost: 0, tokensUsed: 0, latency: 0, requests: 0 };
    }

    const startDate = getStartDate(timeRange);
    let totalCost = 0;
    let totalTokens = 0;
    const latencyValues = [];
    let totalRequests = 0;

    chartData.cost.labels.forEach((label, index) => {
      const date = new Date(label);
      if (date >= startDate) {
        totalCost += chartData.cost.data[index];
      }
    });

    chartData.tokensUsed.labels.forEach((label, index) => {
      const date = new Date(label);
      if (date >= startDate) {
        totalTokens += chartData.tokensUsed.series[2].data[index];
      }
    });

    chartData.latency.labels.forEach((label, index) => {
      const date = new Date(label);
      if (date >= startDate) {
        latencyValues.push(chartData.latency.data[index]);
      }
    });

    chartData.requests.labels.forEach((label, index) => {
      const date = new Date(label);
      if (date >= startDate) {
        totalRequests += chartData.requests.series[0].data[index] + chartData.requests.series[1].data[index];
      }
    });

    let latencyStat = 0;
    if (latencyValues.length > 0) {
      if (latencyMetric === 'average') {
        latencyStat = (latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length).toFixed(2);
      } else if (latencyMetric === 'max') {
        latencyStat = Math.max(...latencyValues).toFixed(2);
      } else if (latencyMetric === 'count') {
        latencyStat = latencyValues.length;
      } else if (latencyMetric === 'p95') {
        latencyValues.sort((a, b) => a - b);
        const index = Math.ceil(0.95 * latencyValues.length) - 1;
        latencyStat = latencyValues[index].toFixed(2);
      }
    }

    return {
      cost: totalCost.toFixed(2),
      tokensUsed: formatNumber(totalTokens),
      latency: latencyStat,
      requests: formatNumber(totalRequests),
    };
  };

  const summary = calculateSummary(chartData, timeRange, latencyMetric);

  const calculateCacheSummary = (chartData, timeRange) => {
    if (!chartData) {
      return {
        cacheHits: 0,
        simpleCacheHits: 0,
        semanticCacheHits: 0,
        cacheSpeedup: 0,
        cacheHitRate: 0,
        cacheSavings: 0,
        simpleCacheSavings: 0,
        semanticCacheSavings: 0,
      };
    }

    const startDate = getStartDate(timeRange);
    let totalCacheHits = 0;
    let simpleCacheHits = 0;
    let semanticCacheHits = 0;
    let totalCacheSavings = 0;
    let simpleCacheSavings = 0;
    let semanticCacheSavings = 0;
    const cacheHitRateValues = [];

    if (chartData.cacheHits) {
      chartData.cacheHits.labels.forEach((label, index) => {
        const date = new Date(label);
        if (date >= startDate) {
          simpleCacheHits += chartData.cacheHits.series[0].data[index];
          semanticCacheHits += chartData.cacheHits.series[1].data[index];
          totalCacheHits += chartData.cacheHits.series[0].data[index] + chartData.cacheHits.series[1].data[index];
        }
      });
    }

    if (chartData.cacheSavings) {
      chartData.cacheSavings.labels.forEach((label, index) => {
        const date = new Date(label);
        if (date >= startDate) {
          simpleCacheSavings += chartData.cacheSavings.series[0].data[index];
          semanticCacheSavings += chartData.cacheSavings.series[1].data[index];
          totalCacheSavings += chartData.cacheSavings.series[0].data[index] + chartData.cacheSavings.series[1].data[index];
        }
      });
    }

    if (chartData.cacheHitRate) {
      chartData.cacheHitRate.labels.forEach((label, index) => {
        const date = new Date(label);
        if (date >= startDate) {
          cacheHitRateValues.push(chartData.cacheHitRate.data[index]);
        }
      });
    }

    const avgCacheHitRate = cacheHitRateValues.length > 0
      ? (cacheHitRateValues.reduce((a, b) => a + b, 0) / cacheHitRateValues.length).toFixed(1)
      : 0;

    return {
      cacheHits: formatNumber(totalCacheHits),
      simpleCacheHits: formatNumber(simpleCacheHits),
      semanticCacheHits: formatNumber(semanticCacheHits),
      cacheSpeedup: chartData.cacheSpeedup ? chartData.cacheSpeedup.avgLatency : 0,
      cacheHitRate: avgCacheHitRate,
      cacheSavings: totalCacheSavings.toFixed(2),
      simpleCacheSavings: simpleCacheSavings.toFixed(2),
      semanticCacheSavings: semanticCacheSavings.toFixed(2),
    };
  };

  const cacheSummary = calculateCacheSummary(chartData, timeRange);

  const getChartOptions = (chartName) => {
    if (!chartData) return {};

    const data = chartData[chartName];
    if (!data) return {};

    const startDate = getStartDate(timeRange);
    const bucketSize = getBucketSize(timeRange);

    const aggregateData = (data, bucketSize, startDate) => {
      const aggregated = {};
      const labels = [];
      const values = [];
      const originalDates = [];

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
        if (chartName === 'latency') {
          if (latencyMetric === 'average') {
            const sum = aggregated[key].values.reduce((a, b) => a + b, 0);
            values.push(sum / aggregated[key].values.length);
          } else if (latencyMetric === 'max') {
            values.push(Math.max(...aggregated[key].values));
          } else if (latencyMetric === 'count') {
            values.push(aggregated[key].values.length);
          } else if (latencyMetric === 'p95') {
            const sorted = [...aggregated[key].values].sort((a, b) => a - b);
            const index = Math.ceil(0.95 * sorted.length) - 1;
            values.push(sorted[index]);
          }
        } else if (data.data) {
          values.push(aggregated[key].values.reduce((a, b) => a + b, 0));
        }
        
        if (data.series) {
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
    
    const baseChartOptions = {
      tooltip: {
        trigger: "axis",
        backgroundColor: 'rgba(39, 39, 42, 0.9)',
        borderColor: '#52525b',
        textStyle: {
          color: '#fff'
        },
        formatter: function (params) {
          if (!params || params.length === 0) {
            return '';
          }

          const date = aggregatedData.originalDates[params[0].dataIndex];
          const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
          const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          const dateTimeString = `${formattedDate}, ${formattedTime}`;

          if (chartName === 'cost') {
            return `<strong>Cost</strong><br/>$${params[0].data.toFixed(4)}<br/>${dateTimeString}`;
          }
          
          if (chartName === 'tokensUsed') {
            const requestTokens = params.find(p => p.seriesName === 'Request')?.data || 0;
            const responseTokens = params.find(p => p.seriesName === 'Response')?.data || 0;
            const totalTokens = requestTokens + responseTokens;
            
            let tooltipHtml = `<div style="text-align: left;">`;
            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">Request Tokens Used</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 8px;">${formatNumber(requestTokens)}</div>`;
            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">Response Tokens Used</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 8px;">${formatNumber(responseTokens)}</div>`;
            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">Total Tokens Used</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 12px;">${formatNumber(totalTokens)}</div>`;
            tooltipHtml += `<div style="font-size: 12px; color: #71717a;">${dateTimeString}</div>`;
            tooltipHtml += `</div>`;
            return tooltipHtml;
          }
          
          if (chartName === 'requests') {
            let success = params.find(p => p.seriesName === 'Success')?.data || 0;
            let error = params.find(p => p.seriesName === 'Error')?.data || 0;
            let total = success + error;
            return `&nbsp;&nbsp;<br/>Total Request: ${formatNumber(total)}<br/>Error: ${formatNumber(error)}<br/>${dateTimeString}`;
          }

          if (chartName === 'latency') {
            return `<strong>Latency</strong><br/>${params[0].data.toFixed(2)}ms<br/>${dateTimeString}`;
          }

          return `${params[0].seriesName}: ${params[0].data}<br/>${dateTimeString}`;
        },
      },
      xAxis: {
        type: "category",
        data: aggregatedData.labels,
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            color: "#444",
          },
        },
      },
      grid: {
        top: "40",
        bottom: "40",
        left: "40",
        right: "40",
      },
    };

    if (chartName === "cost" || chartName === "latency") {
      return {
        ...baseChartOptions,
        series: [
          {
            name: chartName.charAt(0).toUpperCase() + chartName.slice(1),
            data: aggregatedData.data,
            type: chartName === 'latency' ? 'line' : 'bar',
            smooth: true,
            itemStyle: {
              color: chartName === 'latency' ? '#F59E0B' : '#10B981',
            },
          },
        ],
      };
    }

    if (chartName === "tokensUsed" || chartName === "requests") {
      const series = chartName === "tokensUsed" ? data.series.filter(s => s.name !== 'Total') : data.series;
      return {
        ...baseChartOptions,
        series: series.map((s, i) => ({
          name: s.name,
          data: aggregatedData.data.map(d => d[s.name] || 0),
          type: "bar",
          stack: "total",
          itemStyle: {
            color: i === 0 ? '#10B981' : (i === 1 ? '#3B82F6' : '#EF4444'),
          },
        })),
      };
    }

    return {};
  };

  return (
    <div className="bg-zinc-800 flex h-screen">
      <div className="overflow-y-auto scrollbar h-screen w-full text-gray-100">
        <Header
          sectionHeader="Dashboard"
          hideBackListingLink={true}
          backListingLink={backListingLink}
        />

        <div className="flex-grow p-4 overflow-y-auto scrollbar">
          <div className="container mx-auto p-2 space-y-6">
            <div className="flex justify-start mb-6">
              <nav
                role="navigation"
                aria-label="Sub Page Navigation"
                className="nav-container relative mt-2"
              >
                <div className="flex flex-wrap justify-start">
                  {pageTabs.map((tab) => (
                    <a
                      key={tab.ItemId}
                      href={tab.Url}
                      data-page={tab.ItemId}
                      className={`nav-button px-4 py-2 text-sm font-medium text-gray-400 text-center flex items-center gap-2 cursor-pointer ${
                        activeTab === tab.ItemId
                          ? "border-b-2 border-orange-500 text-white"
                          : ""
                      }`}
                      aria-label={`Navigate to ${tab.ItemName} page`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(tab.ItemId);
                      }}
                    >
                      {tab.Svg && <span className="nav-icon">{tab.Svg}</span>}
                      <span className="relative z-8 ">{tab.ItemName}</span>
                    </a>
                  ))}
                </div>
              </nav>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center flex-grow mr-4">
                <button
                  className="p-2 rounded-md hover:bg-zinc-700"
                  onClick={fetchData}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="relative ml-2 flex-grow">
                  <input
                    type="text"
                    placeholder="Search Filter"
                    className="bg-zinc-700 border border-zinc-600 rounded-md py-2 px-2 w-full"
                  />
                </div>
              </div>
              <div className="relative ml-2">
                <select
                  className="bg-zinc-700 border border-zinc-600 rounded-md py-2 px-2"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="1m">Less than 1 min</option>
                  <option value="1h">Less than 1 hour</option>
                  <option value="24h">Less than 24 hours</option>
                  <option value="7d">Less than 7 days</option>
                  <option value="15d">Less than 15 days</option>
                  <option value="30d">Less than 30 days</option>
                  <option value="1y">Less than 1 year</option>
                </select>
              </div>
            </div>
            {activeTab === "overview" && chartData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-1 md:col-span-1 rounded-lg shadow-lg p-4 border border-zinc-500">
                  <h3 className="text-lg font-semibold mb-2">Cost</h3>
                  <p className="text-3xl font-bold">${summary.cost}</p>
                  <div className="h-80 mt-4">
                    <Chart
                      option={getChartOptions("cost")}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1 md:col-span-1 rounded-lg shadow-lg p-4 border border-zinc-500">
                  <h3 className="text-lg font-semibold mb-2">Tokens Used</h3>
                  <p className="text-3xl font-bold">{summary.tokensUsed}</p>
                  <div className="h-80 mt-4">
                    <Chart
                      option={getChartOptions("tokensUsed")}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1 md:col-span-1 rounded-lg shadow-lg p-4 border border-zinc-500">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold mb-2">Latency</h3>
                    <select
                      className="bg-zinc-700 border border-zinc-600 rounded-md py-1 px-2 text-sm"
                      value={latencyMetric}
                      onChange={(e) => setLatencyMetric(e.target.value)}
                    >
                      <option value="average">Average</option>
                      <option value="max">Max</option>
                      <option value="count">Count</option>
                      <option value="p95">P95</option>
                    </select>
                  </div>
                  <p className="text-3xl font-bold">{summary.latency}ms</p>
                  <div className="h-80 mt-4">
                    <Chart
                      option={getChartOptions("latency")}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1 md:col-span-1 rounded-lg shadow-lg p-4 border border-zinc-500">
                  <h3 className="text-lg font-semibold mb-2">Requests</h3>
                  <p className="text-3xl font-bold">{summary.requests}</p>
                  <div className="h-80 mt-4">
                    <Chart
                      option={getChartOptions("requests")}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "tools" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-1 md:col-span-1 rounded-lg shadow-lg p-4 border border-zinc-500">
                  <div className="h-80 mt-4">
                    <PieChart
                      chartData={chartData?.toolUsage?.data}
                      name="Tool Usage"
                      labels={chartData?.toolUsage?.labels}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "cache" && chartData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg shadow-lg p-4 border border-zinc-500">
                  <h3 className="text-lg font-semibold">Cache Hits</h3>
                  <p className="text-3xl font-bold">{cacheSummary.cacheHits}</p>
                  <div className="text-sm text-gray-400">
                    Simple: {cacheSummary.simpleCacheHits} | Semantic: {cacheSummary.semanticCacheHits}
                  </div>
                  <div className="h-80 mt-4">
                    <CacheChart chartData={chartData} chartName="cacheHits" timeRange={timeRange} />
                  </div>
                </div>
                <div className="rounded-lg shadow-lg p-4 border border-zinc-500">
                  <h3 className="text-lg font-semibold">Cache Speedup</h3>
                  <p className="text-3xl font-bold">{cacheSummary.cacheSpeedup}ms</p>
                  <div className="h-80 mt-4">
                    <CacheChart chartData={chartData} chartName="cacheSpeedup" timeRange={timeRange} />
                  </div>
                </div>
                <div className="rounded-lg shadow-lg p-4 border border-zinc-500">
                  <h3 className="text-lg font-semibold">Cache Hit Rate</h3>
                  <p className="text-3xl font-bold">{cacheSummary.cacheHitRate}%</p>
                  <div className="h-80 mt-4">
                    <CacheChart chartData={chartData} chartName="cacheHitRate" timeRange={timeRange} />
                  </div>
                </div>
                <div className="rounded-lg shadow-lg p-4 border border-zinc-500">
                  <h3 className="text-lg font-semibold">Cache Savings</h3>
                  <p className="text-3xl font-bold">${cacheSummary.cacheSavings}</p>
                   <div className="text-sm text-gray-400">
                    Simple: ${cacheSummary.simpleCacheSavings} | Semantic: ${cacheSummary.semanticCacheSavings}
                  </div>
                  <div className="h-80 mt-4">
                    <CacheChart chartData={chartData} chartName="cacheSavings" timeRange={timeRange} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
