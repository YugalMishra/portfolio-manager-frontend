import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon, 
  BarChart3,
  Activity,
  DollarSign
} from 'lucide-react';
import { getPortfolioSummary, getPerformanceData } from '../services/mockData';
import { toast } from 'react-hot-toast';

const PerformanceContainer = styled.div`
  max-width: 1200px;
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

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartIcon = styled.div`
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const MetricIcon = styled.div`
  background: ${props => props.gradient};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
  
  .recharts-tooltip-content {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(10px);
  }
  
  .recharts-tooltip-label {
    color: white !important;
    font-weight: 600;
  }
  
  .recharts-tooltip-item {
    color: white !important;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
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

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
    fetchSummaryStats();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const performanceData = await getPerformanceData();
      setPerformanceData(performanceData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast.error('Failed to load performance data');
    }
  };

  const fetchSummaryStats = async () => {
    try {
      const summaryData = await getPortfolioSummary();
      setSummaryStats(summaryData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      toast.error('Failed to load summary statistics');
      setLoading(false);
    }
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <PerformanceContainer>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Loading performance data...</p>
        </div>
      </PerformanceContainer>
    );
  }

  // Prepare data for charts
  const barChartData = performanceData.map(item => ({
    name: item.symbol,
    invested: item.invested_amount,
    current: item.current_amount,
    gain_loss: item.gain_loss
  }));

  const pieChartData = summaryStats?.by_type?.map((item, index) => ({
    name: item.type.toUpperCase(),
    value: item.current_value,
    color: [
      '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'
    ][index % 5]
  })) || [];

  const topPerformers = [...performanceData]
    .sort((a, b) => b.percentage_change - a.percentage_change)
    .slice(0, 5);

  const worstPerformers = [...performanceData]
    .sort((a, b) => a.percentage_change - b.percentage_change)
    .slice(0, 5);

  const summary = summaryStats?.summary || {};
  const totalReturn = summary.percentage_return || 0;
  const isPositive = totalReturn >= 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PerformanceContainer>
        <Header variants={itemVariants}>
          <Title>Performance Analytics</Title>
          <Subtitle>Detailed insights into your portfolio performance</Subtitle>
        </Header>

        <MetricsRow>
          <MetricCard
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <MetricIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
              <DollarSign size={24} />
            </MetricIcon>
            <MetricValue>${(summary.current_value || 0).toLocaleString()}</MetricValue>
            <MetricLabel>Total Value</MetricLabel>
          </MetricCard>

          <MetricCard
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <MetricIcon gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)">
              <TrendingUp size={24} />
            </MetricIcon>
            <MetricValue>${(summary.total_invested || 0).toLocaleString()}</MetricValue>
            <MetricLabel>Total Invested</MetricLabel>
          </MetricCard>

          <MetricCard
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <MetricIcon gradient={isPositive ? 
              "linear-gradient(135deg, #10B981 0%, #059669 100%)" : 
              "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            }>
              {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </MetricIcon>
            <MetricValue style={{ color: isPositive ? '#10B981' : '#EF4444' }}>
              {isPositive ? '+' : ''}${Math.abs(summary.total_gain_loss || 0).toLocaleString()}
            </MetricValue>
            <MetricLabel>Total Gain/Loss</MetricLabel>
          </MetricCard>

          <MetricCard
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <MetricIcon gradient={isPositive ? 
              "linear-gradient(135deg, #10B981 0%, #059669 100%)" : 
              "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            }>
              <Activity size={24} />
            </MetricIcon>
            <MetricValue style={{ color: isPositive ? '#10B981' : '#EF4444' }}>
              {isPositive ? '+' : ''}{Math.abs(totalReturn).toFixed(2)}%
            </MetricValue>
            <MetricLabel>Total Return</MetricLabel>
          </MetricCard>
        </MetricsRow>

        <ChartsGrid>
          <ChartCard
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <ChartHeader>
              <ChartTitle>
                <ChartIcon gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)">
                  <BarChart3 size={20} />
                </ChartIcon>
                Investment vs Current Value
              </ChartTitle>
            </ChartHeader>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.7)"
                    fontSize={12}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="invested" fill="#8B5CF6" name="Invested" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="current" fill="#10B981" name="Current Value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>

          <TwoColumnGrid>
            <ChartCard
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <ChartHeader>
                <ChartTitle>
                  <ChartIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                    <PieChartIcon size={20} />
                  </ChartIcon>
                  Asset Allocation
                </ChartTitle>
              </ChartHeader>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
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
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartCard>

            <ChartCard
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <ChartHeader>
                <ChartTitle>
                  <ChartIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                    <TrendingUp size={20} />
                  </ChartIcon>
                  Performance Overview
                </ChartTitle>
              </ChartHeader>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="gain_loss" 
                      stroke="#10B981" 
                      fill="url(#gainGradient)"
                      name="Gain/Loss"
                    />
                    <defs>
                      <linearGradient id="gainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartCard>
          </TwoColumnGrid>
        </ChartsGrid>
      </PerformanceContainer>
    </motion.div>
  );
};

export default Performance;
