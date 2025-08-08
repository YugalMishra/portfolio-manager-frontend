import axios from 'axios';

const API_BASE = "https://portfolio-manager-backend-production-d307.up.railway.app" || 'http://localhost:5000'; // Update if deployed

// ➕ Add a new asset to portfolio
export const addPortfolioItem = async (item) => {
  const response = await axios.post(`${API_BASE}/api/assets/add`, item);
  return response.data;
};

// 📊 Get live enriched performance data
export const getPerformanceData = async () => {
  const response = await axios.get(`${API_BASE}/api/assets/portfolio`);
  return response.data.portfolio; // access `portfolio` array
};

// 📈 Get summary statistics (adjust if you implement this)
export const getPortfolioSummary = async () => {
  const response = await axios.get(`${API_BASE}/api/portfolio/summary`);
  return response.data;
};

// 📥 Get raw portfolio (for Portfolio.js display)
export const getPortfolio = async () => {
  const response = await axios.get(`${API_BASE}/api/assets/portfolio`);
  return response.data.portfolio;
};

// 💸 Sell or remove asset quantity
export const removeAsset = async ({ symbol, quantity }) => {
  const response = await axios.post(`${API_BASE}/api/assets/remove`, {
    symbol,
    quantity
  });
  return response.data;
};

export const getAnalysisData = async () => {
  const res = await axios.get(`${API_BASE}/portfolio/analysis`);
  return res.data;
};

export const getChartData = async (symbol) => {
  const res = await axios.get(`${API_BASE}/chart/${symbol}`);
  return res.data.chart;
};