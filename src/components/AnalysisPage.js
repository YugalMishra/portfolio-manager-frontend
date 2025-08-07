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
  Cell
} from 'recharts';
import { addPortfolioItem, getPortfolioSummary, getPerformanceData } from '../services/mockData';
import { toast } from 'react-hot-toast';

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

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
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

const PreviewCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const PreviewTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const PreviewItem = styled.div`
  text-align: center;
`;

const PreviewLabel = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;

const PreviewValue = styled.p`
  color: white;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
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
  height: 300px;
  width: 100%;
  margin-top: 1rem;
  
  .recharts-tooltip-content {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(10px);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
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

const AnalysisPage = () => {
  // AddItem state
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    type: 'stock',
    quantity: '',
    purchase_price: '',
    current_price: '',
    purchase_date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Performance state
  const [performanceData, setPerformanceData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({});
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetchPerformanceData();
    fetchSummaryStats();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const data = await getPerformanceData();
      setPerformanceData(data);
      
      // Create pie chart data
      const assetTypes = {};
      data.forEach(item => {
        if (assetTypes[item.type]) {
          assetTypes[item.type] += item.current_value;
        } else {
          assetTypes[item.type] = item.current_value;
        }
      });
      
      const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
      const pieData = Object.entries(assetTypes).map(([type, value], index) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value,
        color: colors[index % colors.length]
      }));
      
      setPieChartData(pieData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const fetchSummaryStats = async () => {
    try {
      const stats = await getPortfolioSummary();
      setSummaryStats(stats);
    } catch (error) {
      console.error('Error fetching summary stats:', error);
    }
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Asset symbol is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Asset name is required';
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.purchase_price || parseFloat(formData.purchase_price) <= 0) {
      newErrors.purchase_price = 'Purchase price must be greater than 0';
    }
    
    if (!formData.current_price || parseFloat(formData.current_price) <= 0) {
      newErrors.current_price = 'Current price must be greater than 0';
    }
    
    if (!formData.purchase_date) {
      newErrors.purchase_date = 'Purchase date is required';
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
      const portfolioItem = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        purchase_price: parseFloat(formData.purchase_price),
        current_price: parseFloat(formData.current_price),
        id: Date.now()
      };
      
      await addPortfolioItem(portfolioItem);
      
      setSuccess(true);
      toast.success('Asset added to portfolio successfully!');
      
      // Reset form
      setFormData({
        symbol: '',
        name: '',
        type: 'stock',
        quantity: '',
        purchase_price: '',
        current_price: '',
        purchase_date: ''
      });
      
      // Refresh performance data
      fetchPerformanceData();
      fetchSummaryStats();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      toast.error('Failed to add asset to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    if (!formData.quantity || !formData.current_price) return 0;
    return parseFloat(formData.quantity) * parseFloat(formData.current_price);
  };

  const calculateGainLoss = () => {
    if (!formData.quantity || !formData.purchase_price || !formData.current_price) return 0;
    const purchaseValue = parseFloat(formData.quantity) * parseFloat(formData.purchase_price);
    const currentValue = parseFloat(formData.quantity) * parseFloat(formData.current_price);
    return currentValue - purchaseValue;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnalysisContainer>
        <Header variants={itemVariants}>
          <Title>Portfolio Analysis</Title>
          
        </Header>

        <MainGrid>
          {/* Add Item Section */}
          <Section variants={itemVariants}>
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
              <FormGroup variants={itemVariants}>
                <Label>Asset Symbol</Label>
                <Input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="e.g., AAPL"
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

              <FormGroup variants={itemVariants}>
                <Label>Asset Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Apple Inc."
                  required
                />
                {errors.name && (
                  <ErrorMessage
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.name}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormRow columns="1fr 1fr">
                <FormGroup variants={itemVariants}>
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

                <FormGroup variants={itemVariants}>
                  <Label>
                    <Activity size={14} />
                    Quantity
                  </Label>
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
                <FormGroup variants={itemVariants}>
                  <Label>
                    <DollarSign size={14} />
                    Purchase Price
                  </Label>
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

                <FormGroup variants={itemVariants}>
                  <Label>
                    <DollarSign size={14} />
                    Current Price
                  </Label>
                  <Input
                    type="number"
                    name="current_price"
                    value={formData.current_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                  {errors.current_price && (
                    <ErrorMessage
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.current_price}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormGroup variants={itemVariants}>
                <Label>
                  <Calendar size={14} />
                  Purchase Date
                </Label>
                <Input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
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

              {formData.quantity && formData.current_price && (
                <PreviewCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PreviewTitle>
                    <TrendingUp size={16} />
                    Investment Preview
                  </PreviewTitle>
                  <PreviewGrid>
                    <PreviewItem>
                      <PreviewLabel>Total Value</PreviewLabel>
                      <PreviewValue>${calculateTotalValue().toLocaleString()}</PreviewValue>
                    </PreviewItem>
                    <PreviewItem>
                      <PreviewLabel>Gain/Loss</PreviewLabel>
                      <PreviewValue style={{ 
                        color: calculateGainLoss() >= 0 ? '#10B981' : '#EF4444' 
                      }}>
                        ${calculateGainLoss().toLocaleString()}
                      </PreviewValue>
                    </PreviewItem>
                    <PreviewItem>
                      <PreviewLabel>Asset Type</PreviewLabel>
                      <PreviewValue>{formData.type.toUpperCase()}</PreviewValue>
                    </PreviewItem>
                  </PreviewGrid>
                </PreviewCard>
              )}

              <Button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%' }}
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

          {/* Performance Section */}
          <Section variants={itemVariants}>
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                <BarChart3 size={20} />
              </SectionIcon>
              Performance Overview
            </SectionTitle>

            <MetricsRow>
              <MetricCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <MetricIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                  <DollarSign size={16} />
                </MetricIcon>
                <MetricValue>${summaryStats.totalValue?.toLocaleString() || '0'}</MetricValue>
                <MetricLabel>Total Value</MetricLabel>
              </MetricCard>

              <MetricCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <MetricIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                  <TrendingUp size={16} />
                </MetricIcon>
                <MetricValue style={{ 
                  color: (summaryStats.totalGainLoss || 0) >= 0 ? '#10B981' : '#EF4444' 
                }}>
                  ${summaryStats.totalGainLoss?.toLocaleString() || '0'}
                </MetricValue>
                <MetricLabel>Gain/Loss</MetricLabel>
              </MetricCard>

              <MetricCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <MetricIcon gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)">
                  <Activity size={16} />
                </MetricIcon>
                <MetricValue>{summaryStats.totalAssets || 0}</MetricValue>
                <MetricLabel>Total Assets</MetricLabel>
              </MetricCard>
            </MetricsRow>

            <ChartsGrid>
              <ChartCard
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <ChartTitle>
                  <ChartIcon gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    <BarChart3 size={16} />
                  </ChartIcon>
                  Portfolio Performance
                </ChartTitle>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={10}
                        tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="current_value" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </ChartCard>

              <ChartCard
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <ChartTitle>
                  <ChartIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                    <PieChartIcon size={16} />
                  </ChartIcon>
                  Asset Allocation
                </ChartTitle>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        fontSize={10}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                        contentStyle={{
                          background: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(10px)',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </ChartCard>
            </ChartsGrid>
          </Section>
        </MainGrid>
      </AnalysisContainer>
    </motion.div>
  );
};

export default AnalysisPage;
