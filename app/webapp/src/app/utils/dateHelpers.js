export const getStartDate = (timeRange) => {
    const now = new Date();
    if (timeRange === "1m") return new Date(now.getTime() - 60 * 1000);
    if (timeRange === "1h") return new Date(now.getTime() - 60 * 60 * 1000);
    if (timeRange === "24h") return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (timeRange === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (timeRange === "15d") return new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    if (timeRange === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (timeRange === "1y") return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  };
  
  export const getBucketSize = (timeRange) => {
    if (timeRange === "1m") return "second";
    if (timeRange === "1h") return "minute";
    if (timeRange === "24h" || timeRange === "7d" || timeRange === "15d") return "hour";
    if (timeRange === "30d") return "day";
    if (timeRange === "1y") return "month";
    return "hour";
  };

export const formatLabel = (date, bucketSize) => {
    if (bucketSize === "second") return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (bucketSize === "minute") return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (bucketSize === "hour") return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (bucketSize === "day") return date.toLocaleDateString();
    if (bucketSize === "month") return `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (bucketSize === "year") return date.getFullYear();
    return date.toLocaleDateString();
};
