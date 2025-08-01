"use client";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const Chart = ({ option, style }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);
      chartInstance.setOption(option);
    }

    const handleResize = () => {
      chartInstance?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chartInstance?.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [option]);

  return <div ref={chartRef} style={style} />;
};

export default Chart;
