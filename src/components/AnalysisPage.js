// ✂️ Imports (keep your current imports unchanged)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Save,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { toast } from 'react-hot-toast';

// API base URL - adjust according to your backend setup
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// All your existing styled components remain the same...
const AnalysisContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Section = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionIcon = styled.div`
  background: ${props => props.gradient};
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

// Form Components
const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled(motion.div)`
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #EF4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: #10B981;
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const MetricIcon = styled.div`
  background: ${props => props.gradient};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  color: white;
`;

const MetricValue = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const ChartContainer = styled.div`
  height: 350px;
  width: 100%;
  margin-top: 1rem;
  
  .recharts-tooltip-content {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(10px);
  }
  
  .recharts-legend-wrapper {
    .recharts-legend-item-text {
      color: white !important;
    }
  }
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
`;

const ChartTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartIcon = styled.div`
  background: ${props => props.gradient};
  border-radius: 8px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FullWidthSection = styled(motion.div)`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 2rem;
  margin-top: 2rem;
`;

const AnalysisPage = () => {
  // AddItem state
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'stock',
    quantity: '',
    purchase_price: '',
    purchase_date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Performance state
  const [portfolioAssets, setPortfolioAssets] = useState([]);
  const [summaryStats, setSummaryStats] = useState({});
  const [pieChartData, setPieChartData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // Get today's date in YYYY-MM-DD format for max date validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      // Fetch from portfolio analysis endpoint
      const response = await fetch(`${API_BASE_URL}/portfolio/analysis`);
      if (response.ok) {
        const data = await response.json();
        console.log('Portfolio analysis:', data);
        
        setSummaryStats({
          total_value: parseFloat(data.summary?.total_portfolio_value) || 0,
          total_gain_loss: (parseFloat(data.summary?.total_unrealized_profit) || 0) + (parseFloat(data.summary?.total_realized_profit) || 0),
          total_items: data.assets?.length || 0
        });

        setPortfolioAssets(data.assets || []);

        // Create pie chart data from asset breakdown
        const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];
        const pieData = Object.entries(data.asset_breakdown || {}).map(([type, value], index) => ({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: parseFloat(value),
          color: colors[index % colors.length],
          total: Object.values(data.asset_breakdown || {}).reduce((sum, v) => sum + parseFloat(v), 0)
        }));

        setPieChartData(pieData);

        // Generate performance data from assets with actual purchase dates
        generatePerformanceDataFromAssets(data.assets || []);
      } else {
        // Fallback to assets portfolio endpoint
        const portfolioResponse = await fetch(`${API_BASE_URL}/assets/portfolio`);
        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          const assets = portfolioData.portfolio || [];
          
          setPortfolioAssets(assets);
          
          const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.current_value || 0), 0);
          const totalGainLoss = assets.reduce((sum, asset) => sum + parseFloat(asset.unrealized_profit || 0), 0);
          
          setSummaryStats({
            total_value: totalValue,
            total_gain_loss: totalGainLoss,
            total_items: assets.length
          });

          // Group by type for pie chart
          const typeGroups = {};
          assets.forEach(asset => {
            if (typeGroups[asset.type]) {
              typeGroups[asset.type] += parseFloat(asset.current_value || 0);
            } else {
              typeGroups[asset.type] = parseFloat(asset.current_value || 0);
            }
          });

          const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];
          const pieData = Object.entries(typeGroups).map(([type, value], index) => ({
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value,
            color: colors[index % colors.length],
            total: Object.values(typeGroups).reduce((sum, v) => sum + v, 0)
          }));

          setPieChartData(pieData);
          
          // Generate performance data from assets
          generatePerformanceDataFromAssets(assets);
        }
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast.error('Failed to load portfolio data');
    }
  };

  // NEW FUNCTION: Generate performance data from actual asset purchase dates
  const generatePerformanceDataFromAssets = (assets) => {
    if (!assets || assets.length === 0) {
      setPerformanceData([]);
      return;
    }

    // Create a timeline of asset purchases using actual purchase dates
    const dateGroups = {};
    
    assets.forEach(asset => {
      // Use purchase_date if available, otherwise use a fallback date
      const purchaseDate = asset.purchase_date || asset.date || new Date().toISOString().split('T')[0];
      const date = new Date(purchaseDate).toISOString().split('T')[0];
      
      if (!dateGroups[date]) {
        dateGroups[date] = { 
          totalInvestment: 0, 
          assets: [],
          cumulativeValue: 0
        };
      }
      
      const investmentAmount = parseFloat(asset.quantity) * parseFloat(asset.purchase_price || asset.buy_price || 0);
      const currentValue = parseFloat(asset.current_value || investmentAmount);
      
      dateGroups[date].totalInvestment += investmentAmount;
      dateGroups[date].assets.push({
        symbol: asset.symbol,
        investment: investmentAmount,
        currentValue: currentValue
      });
    });

    // Sort dates and create cumulative performance data
    const sortedDates = Object.keys(dateGroups).sort((a, b) => new Date(a) - new Date(b));
    let cumulativeInvestment = 0;
    let cumulativeCurrentValue = 0;

    const performanceArray = sortedDates.map(date => {
      const dayData = dateGroups[date];
      cumulativeInvestment += dayData.totalInvestment;
      
      // Calculate current value for all assets up to this point
      cumulativeCurrentValue = 0;
      sortedDates.slice(0, sortedDates.indexOf(date) + 1).forEach(pastDate => {
        dateGroups[pastDate].assets.forEach(asset => {
          cumulativeCurrentValue += asset.currentValue;
        });
      });

      return {
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: new Date(date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        }),
        fullDate: date,
        value: cumulativeCurrentValue,
        investment: cumulativeInvestment,
        dailyInvestment: dayData.totalInvestment,
        assetsCount: dayData.assets.length,
        gainLoss: cumulativeCurrentValue - cumulativeInvestment
      };
    });

    // If we have multiple data points close together, thin them out for better visualization
    let finalPerformanceData = performanceArray;
    if (performanceArray.length > 20) {
      const step = Math.ceil(performanceArray.length / 15);
      finalPerformanceData = performanceArray.filter((_, index) => index % step === 0 || index === performanceArray.length - 1);
    }

    setPerformanceData(finalPerformanceData);
  };

  // AddItem functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // UPDATED VALIDATION: Includes future date check
  const validateForm = () => {
    const newErrors = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Asset symbol is required';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.purchase_price || parseFloat(formData.purchase_price) <= 0) {
      newErrors.purchase_price = 'Purchase price must be greater than 0';
    }

    if (!formData.purchase_date) {
      newErrors.purchase_date = 'Purchase date is required';
    } else {
      // Validate that the date is not in the future
      const selectedDate = new Date(formData.purchase_date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      
      if (selectedDate > today) {
        newErrors.purchase_date = 'Purchase date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/assets/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: formData.symbol.toUpperCase(),
          type: formData.type,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.purchase_price),
          purchase_date: formData.purchase_date // Include the purchase date
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add asset');
      }

      const result = await response.json();
      setSuccess(true);
      toast.success('Asset added to portfolio successfully!');

      setFormData({
        symbol: '',
        type: 'stock',
        quantity: '',
        purchase_price: '',
        purchase_date: ''
      });

      // Refresh data
      fetchPortfolioData();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      toast.error(error.message || 'Failed to add asset to portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltip components remain the same
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color, margin: '4px 0' }}>
            Value: ${payload[0].value?.toLocaleString()}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0' }}>
            Share: {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      initial="hidden"
      animate="visible"
    >
      <AnalysisContainer>
        <Header variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <Title>Portfolio Analysis</Title>
        </Header>

        <MainGrid>
          {/* Add Asset Form */}
          <Section variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <Plus size={20} />
              </SectionIcon>
              Add New Asset
            </SectionTitle>

            {success && (
              <SuccessMessage
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TrendingUp size={16} />
                Asset added successfully!
              </SuccessMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Asset Symbol (e.g., AAPL)</Label>
                <Input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="Enter stock/crypto symbol"
                  required
                />
                {errors.symbol && (
                  <ErrorMessage
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.symbol}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormRow columns="1fr 1fr">
                <FormGroup>
                  <Label>Asset Type</Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="stock">Stock</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="bond">Bond</option>
                    <option value="etf">ETF</option>
                    <option value="mutual_fund">Mutual Fund</option>
                    <option value="commodity">Commodity</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label><Activity size={14} /> Quantity</Label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    required
                  />
                  {errors.quantity && (
                    <ErrorMessage
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.quantity}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow columns="1fr 1fr">
                <FormGroup>
                  <Label><DollarSign size={14} /> Purchase Price</Label>
                  <Input
                    type="number"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                  {errors.purchase_price && (
                    <ErrorMessage
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.purchase_price}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label><Calendar size={14} /> Purchase Date</Label>
                  <Input
                    type="date"
                    name="purchase_date"
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                    max={getTodayDate()} // This prevents future dates
                    required
                  />
                  {errors.purchase_date && (
                    <ErrorMessage
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.purchase_date}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <>
                    <Save size={14} />
                    Add to Portfolio
                  </>
                )}
              </Button>
            </Form>
          </Section>

          {/* Portfolio Overview with Metrics */}
          <Section variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                <Activity size={20} />
              </SectionIcon>
              Portfolio Overview
            </SectionTitle>

            <MetricsRow>
              <MetricCard
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MetricIcon gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)">
                  <DollarSign size={16} />
                </MetricIcon>
                <MetricValue>${summaryStats.total_value?.toLocaleString() || '0'}</MetricValue>
                <MetricLabel>Total Value</MetricLabel>
              </MetricCard>

              <MetricCard
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MetricIcon gradient={summaryStats.total_gain_loss >= 0 
                  ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" 
                  : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"}>
                  <TrendingUp size={16} />
                </MetricIcon>
                <MetricValue>${summaryStats.total_gain_loss?.toLocaleString() || '0'}</MetricValue>
                <MetricLabel>Total P&L</MetricLabel>
              </MetricCard>

              <MetricCard
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MetricIcon gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)">
                  <BarChart3 size={16} />
                </MetricIcon>
                <MetricValue>{summaryStats.total_items || 0}</MetricValue>
                <MetricLabel>Assets</MetricLabel>
              </MetricCard>
            </MetricsRow>

            {/* Asset Allocation Pie Chart */}
            <ChartCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ChartTitle>
                <ChartIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                  <PieChartIcon size={16} />
                </ChartIcon>
                Asset Allocation
              </ChartTitle>
              <ChartContainer>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.9rem'
                  }}>
                    No assets in portfolio yet
                  </div>
                )}
              </ChartContainer>
            </ChartCard>
          </Section>
        </MainGrid>

        {/* Performance Chart - Full Width */}
        <FullWidthSection
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
        >
          <SectionTitle>
            <SectionIcon gradient="linear-gradient(135deg, #EC4899 0%, #BE185D 100%)">
              <TrendingUp size={20} />
            </SectionIcon>
            Portfolio Performance Over Time
          </SectionTitle>

          <ChartContainer style={{ height: '400px' }}>
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255, 255, 255, 0.6)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.6)"
                    fontSize={12}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Portfolio Value"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="investment" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Total Investment"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '1rem',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <TrendingUp size={48} opacity={0.3} />
                <div>No assets in portfolio yet</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  Add some assets to see performance data over time
                </div>
              </div>
            )}
          </ChartContainer>
        </FullWidthSection>

        {/* Asset Details Table */}
        {portfolioAssets.length > 0 && (
          <FullWidthSection
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          >
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)">
                <BarChart3 size={20} />
              </SectionIcon>
              Asset Details
            </SectionTitle>

            <div style={{ 
              overflowX: 'auto',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                      Symbol
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                      Type
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'white', fontWeight: '600' }}>
                      Quantity
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'white', fontWeight: '600' }}>
                      Avg Price
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'white', fontWeight: '600' }}>
                      Current Value
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'white', fontWeight: '600' }}>
                      P&L
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'white', fontWeight: '600' }}>
                      Change %
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                      Purchase Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioAssets.map((asset, index) => (
                    <motion.tr 
                      key={`${asset.symbol}-${index}`}
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background-color 0.2s'
                      }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <td style={{ 
                        padding: '1rem', 
                        color: 'white', 
                        fontWeight: '600',
                        fontFamily: 'monospace'
                      }}>
                        {asset.symbol}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255, 255, 255, 0.8)',
                        textTransform: 'capitalize'
                      }}>
                        {asset.type}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right', 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}>
                        {parseFloat(asset.quantity || 0).toLocaleString()}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right', 
                        color: 'white',
                        fontFamily: 'monospace'
                      }}>
                        ${parseFloat(asset.purchase_price || asset.buy_price || 0).toFixed(2)}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right', 
                        color: 'white',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}>
                        ${parseFloat(asset.current_value || 0).toLocaleString()}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right',
                        color: parseFloat(asset.unrealized_profit || 0) >= 0 ? '#10B981' : '#EF4444',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}>
                        {parseFloat(asset.unrealized_profit || 0) >= 0 ? '+' : ''}
                        ${parseFloat(asset.unrealized_profit || 0).toLocaleString()}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right',
                        color: parseFloat(asset.percent_change || 0) >= 0 ? '#10B981' : '#EF4444',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                      }}>
                        {parseFloat(asset.percent_change || 0) >= 0 ? '+' : ''}
                        {parseFloat(asset.percent_change || 0).toFixed(2)}%
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem'
                      }}>
                        {asset.purchase_date 
                          ? new Date(asset.purchase_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A'
                        }
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FullWidthSection>
        )}
      </AnalysisContainer>
    </motion.div>
  );
};

export default AnalysisPage;