import { formatNumber } from "./formatNumber";

export const getCacheChartOptions = (chartName, aggregatedData, data) => {
  let chartOptions = {};

  switch (chartName) {
    case 'cacheHits':
      chartOptions = {
        series: data.series.map((s, i) => ({
          name: s.name,
          type: 'bar',
          stack: 'total',
          data: aggregatedData.data.map(d => d[s.name] || 0),
          itemStyle: {
            color: i === 0 ? '#22c55e' : '#a3e635',
          },
        })),
        tooltip: {
          trigger: 'axis',
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

            let tooltipHtml = `<div style="text-align: left;">`;
            const simpleHitParam = params.find(p => p.seriesName === 'Simple Hit');
            const semanticHitParam = params.find(p => p.seriesName === 'Semantic Hit');
            const simpleHit = simpleHitParam ? simpleHitParam.value : 0;
            const semanticHit = semanticHitParam ? semanticHitParam.value : 0;

            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">Simple Hit</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 8px;">${formatNumber(simpleHit)}</div>`;
            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">Semantic Hit</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 8px;">${formatNumber(semanticHit)}</div>`;
            tooltipHtml += `<div style="font-size: 12px; color: #71717a;">${dateTimeString}</div>`;
            tooltipHtml += `</div>`;
            return tooltipHtml;
          }
        }
      };
      break;
    case 'cacheSpeedup':
      chartOptions = {
        tooltip: {
          show: true
        },
        series: [{
          type: 'gauge',
          detail: { show: false },
          data: [{ value: data.avgLatency }],
          pointer: {
            show: true,
            itemStyle: {
              color: '#F59E0B'
            }
          },
          axisLine: {
            lineStyle: {
              width: 30,
              color: [[0.3, '#6EE7B7'], [0.7, '#34D399'], [1, '#10B981']]
            }
          }
        }]
      };
      break;
    case 'cacheHitRate':
      chartOptions = {
        series: [{
          type: 'line',
          data: aggregatedData.data,
          smooth: true,
          itemStyle: { color: '#F59E0B' }
        }],
        tooltip: {
          trigger: 'axis',
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
            return `<strong>Hit Rate</strong><br/>${params[0].data.toFixed(1)}%<br/>${dateTimeString}`;
          }
        }
      };
      break;
    case 'cacheSavings':
      chartOptions = {
        series: data.series.map((s, i) => ({
          name: s.name,
          type: 'bar',
          stack: 'total',
          data: aggregatedData.data.map(d => d[s.name] || 0),
          itemStyle: {
            color: i === 0 ? '#22c55e' : '#a3e635',
          },
        })),
        tooltip: {
          trigger: 'axis',
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

            let tooltipHtml = `<div style="text-align: left;">`;
            const simpleHitParam = params.find(p => p.seriesName === 'Simple Hit Savings');
            const semanticHitParam = params.find(p => p.seriesName === 'Semantic Hit Savings');
            const simpleHit = simpleHitParam ? simpleHitParam.value : 0;
            const semanticHit = semanticHitParam ? semanticHitParam.value : 0;

            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">Simple Hit Savings</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 8px;">$${simpleHit.toFixed(2)}</div>`;
            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">Semantic Hit Savings</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 8px;">$${semanticHit.toFixed(2)}</div>`;
            tooltipHtml += `<div style="font-size: 12px; color: #71717a;">${dateTimeString}</div>`;
            tooltipHtml += `</div>`;
            return tooltipHtml;
          }
        }
      };
      break;
    default:
      chartOptions = {};
  }

  return {
    ...chartOptions,
    xAxis: {
      type: 'category',
      data: aggregatedData.labels
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: "#444",
        },
      },
    },
    grid: { top: '10%', bottom: '15%', left: '10%', right: '5%' }
  };
};
