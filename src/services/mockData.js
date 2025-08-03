// Mock Data Service - Replaces backend API calls
import { v4 as uuidv4 } from 'uuid';

// Mock portfolio data
let mockPortfolioData = [
  {
    id: uuidv4(),
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    quantity: 50,
    purchase_price: 150.00,
    current_price: 175.50,
    purchase_date: '2023-01-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    quantity: 25,
    purchase_price: 2800.00,
    current_price: 2950.75,
    purchase_date: '2023-02-20',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    quantity: 2.5,
    purchase_price: 45000.00,
    current_price: 52000.00,
    purchase_date: '2023-03-10',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    symbol: 'US10Y',
    name: 'US Treasury 10 Year Bond',
    type: 'bond',
    quantity: 100,
    purchase_price: 98.50,
    current_price: 97.25,
    purchase_date: '2023-04-05',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    type: 'etf',
    quantity: 75,
    purchase_price: 420.00,
    current_price: 445.30,
    purchase_date: '2023-05-12',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock API functions
export const mockApi = {
  // Get all portfolio items
  getPortfolio: () => {
    return Promise.resolve(mockPortfolioData);
  },

  // Add new portfolio item
  addPortfolioItem: (item) => {
    const newItem = {
      ...item,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockPortfolioData.push(newItem);
    return Promise.resolve(newItem);
  },

  // Update portfolio item
  updatePortfolioItem: (id, updates) => {
    const index = mockPortfolioData.findIndex(item => item.id === id);
    if (index !== -1) {
      mockPortfolioData[index] = {
        ...mockPortfolioData[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      return Promise.resolve(mockPortfolioData[index]);
    }
    return Promise.reject(new Error('Item not found'));
  },

  // Delete portfolio item
  deletePortfolioItem: (id) => {
    const index = mockPortfolioData.findIndex(item => item.id === id);
    if (index !== -1) {
      const deletedItem = mockPortfolioData.splice(index, 1)[0];
      return Promise.resolve(deletedItem);
    }
    return Promise.reject(new Error('Item not found'));
  },

  // Get portfolio summary statistics
  getPortfolioSummary: () => {
    const totalValue = mockPortfolioData.reduce((sum, item) => {
      return sum + (item.quantity * item.current_price);
    }, 0);

    const totalCost = mockPortfolioData.reduce((sum, item) => {
      return sum + (item.quantity * item.purchase_price);
    }, 0);

    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    // Asset breakdown
    const assetBreakdown = mockPortfolioData.reduce((breakdown, item) => {
      const value = item.quantity * item.current_price;
      const cost = item.quantity * item.purchase_price;
      const gainLoss = value - cost;
      
      if (breakdown[item.type]) {
        breakdown[item.type].current_value += value;
        breakdown[item.type].cost += cost;
        breakdown[item.type].gain_loss += gainLoss;
        breakdown[item.type].count += 1;
      } else {
        breakdown[item.type] = {
          type: item.type,
          current_value: value,
          cost: cost,
          gain_loss: gainLoss,
          count: 1
        };
      }
      return breakdown;
    }, {});

    // Convert to array format expected by Dashboard
    const byTypeArray = Object.values(assetBreakdown);

    return Promise.resolve({
      total_value: totalValue,
      total_cost: totalCost,
      total_gain_loss: totalGainLoss,
      total_gain_loss_percentage: totalGainLossPercentage,
      total_items: mockPortfolioData.length,
      asset_breakdown: assetBreakdown,
      by_type: byTypeArray
    });
  },

  // Get performance data for charts
  getPerformanceData: () => {
    // Generate mock performance data
    const performanceData = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date();
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    for (let i = 0; i <= daysDiff; i += 7) { // Weekly data points
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Calculate portfolio value for this date (mock calculation)
      const baseValue = 500000; // Starting portfolio value
      const growth = (i / daysDiff) * 0.15; // 15% growth over time
      const volatility = (Math.sin(i / 10) * 0.05); // Some volatility
      const value = baseValue * (1 + growth + volatility);

      performanceData.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100
      });
    }

    return Promise.resolve(performanceData);
  }
};

// Export individual functions for easier importing
export const {
  getPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getPortfolioSummary,
  getPerformanceData
} = mockApi;
