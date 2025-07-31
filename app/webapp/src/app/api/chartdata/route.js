import { NextResponse } from "next/server";

const generateChartData = () => {
  const now = new Date();
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getTime() - (11 - i) * 10 * 1000);
    return date.toISOString();
  });

  const generateData = (length, factor) => Array.from({ length }, () => Math.random() * factor);
  const generateIntData = (length, factor) => Array.from({ length }, () => Math.round(Math.random() * factor));

  return {
    cost: {
      labels,
      data: generateData(12, 0.05),
    },
    tokensUsed: {
      labels,
      series: [
        { name: "Request", data: generateData(12, 500) },
        { name: "Response", data: generateData(12, 300) },
        { name: "Total", data: generateData(12, 800) },
      ],
    },
    latency: {
      labels,
      data: generateData(12, 600),
    },
    requests: {
      labels,
      series: [
        { name: "Success", data: generateData(12, 70) },
        { name: "Error", data: generateData(12, 5) },
      ],
    },
    toolUsage: {
      labels: ["Search", "URL", "Function"],
      data: generateIntData(3, 400),
    },
    cacheHits: {
      labels,
      series: [
        { name: "Simple Hit", data: generateData(12, 1300) },
        { name: "Semantic Hit", data: generateData(12, 100) },
      ],
    },
    cacheSpeedup: {
      avgLatency: 613.3,
      labels: [],
      data: [],
    },
    cacheHitRate: {
      rate: 89.9,
      labels,
      data: generateData(12, 90),
    },
    cacheSavings: {
      total: 0.0122,
      labels,
      series: [
        { name: "Simple Hit Savings", data: generateData(12, 0.01) },
        { name: "Semantic Hit Savings", data: generateData(12, 0.001) },
      ],
    },
  };
};

export async function GET() {
  const chartData = generateChartData();
  return NextResponse.json(chartData);
}
