"use client";
import Chart from "./Chart";
import { formatNumber } from "../utils/formatNumber";

const PieChart = ({ chartData, name, labels }) => {
    const getChartOptions = () => {
      if (!chartData || !labels) return {};
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(39, 39, 42, 0.9)',
          borderColor: '#52525b',
          textStyle: {
            color: '#fff'
          },
          formatter: function (params) {
            if (!params) {
              return '';
            }
            const { name, value, percent } = params;
            let tooltipHtml = `<div style="text-align: left;">`;
            tooltipHtml += `<div style="font-size: 12px; color: #a1a1aa; margin-bottom: 4px;">${name}</div>`;
            tooltipHtml += `<div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 8px;">${formatNumber(value)} (${percent}%)</div>`;
            tooltipHtml += `</div>`;
            return tooltipHtml;
          }
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: labels,
          itemGap: 15,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: name,
            type: 'pie',
            radius: '75%',
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}'
            },
            labelLine: {
              show: true
            },
            data: labels.map((label, index) => ({
              name: label,
              value: chartData[index],
              label: {
                show: true,
                position: 'inside',
                formatter: '{c} ({d}%)',
                color: '#fff',
                fontSize: 14
              }
            }))
          }
        ]
      };
    };
  
    return <Chart option={getChartOptions()} style={{ height: "100%", width: "100%" }} />;
  };

  export default PieChart;
