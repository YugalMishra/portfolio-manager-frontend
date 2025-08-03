import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { getPortfolioSummary } from '../services/mockData';
import { toast } from 'react-hot-toast';

const DashboardContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
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

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.positive ? '#10B981' : '#EF4444'};
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ActionIcon = styled.div`
  background: ${props => props.gradient};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const ActionTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ActionDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const RecentActivity = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ActivityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ActivityText = styled.div`
  color: white;
  font-weight: 500;
`;

const ActivityValue = styled.div`
  color: ${props => props.positive ? '#10B981' : '#EF4444'};
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const summaryData = await getPortfolioSummary();
      // Transform mock data to match expected format
      const transformedStats = {
        summary: {
          current_value: summaryData.total_value,
          total_invested: summaryData.total_cost,
          total_gain_loss: summaryData.total_gain_loss,
          percentage_return: summaryData.total_gain_loss_percentage,
          total_items: summaryData.total_items
        },
        by_type: summaryData.by_type || []
      };
      setStats(transformedStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
      <DashboardContainer>
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
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Loading dashboard...</p>
        </div>
      </DashboardContainer>
    );
  }

  const summary = stats?.summary || {};
  const totalReturn = summary.percentage_return || 0;
  const isPositive = totalReturn >= 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardContainer>
        <Header variants={itemVariants}>
          <Title>Portfolio Dashboard</Title>
          <Subtitle>Monitor your investments and track performance</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <StatHeader>
              <StatIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                <DollarSign size={24} />
              </StatIcon>
              <StatChange positive={isPositive}>
                {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {Math.abs(totalReturn).toFixed(2)}%
              </StatChange>
            </StatHeader>
            <StatValue>${(summary.current_value || 0).toLocaleString()}</StatValue>
            <StatLabel>Total Portfolio Value</StatLabel>
          </StatCard>

          <StatCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <StatHeader>
              <StatIcon gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)">
                <TrendingUp size={24} />
              </StatIcon>
              <StatChange positive={summary.total_gain_loss >= 0}>
                {summary.total_gain_loss >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                ${Math.abs(summary.total_gain_loss || 0).toLocaleString()}
              </StatChange>
            </StatHeader>
            <StatValue>${(summary.total_invested || 0).toLocaleString()}</StatValue>
            <StatLabel>Total Invested</StatLabel>
          </StatCard>

          <StatCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <StatHeader>
              <StatIcon gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)">
                <PieChart size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{summary.total_items || 0}</StatValue>
            <StatLabel>Total Holdings</StatLabel>
          </StatCard>

          <StatCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <StatHeader>
              <StatIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                <Activity size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats?.by_type?.length || 0}</StatValue>
            <StatLabel>Asset Types</StatLabel>
          </StatCard>
        </StatsGrid>

        <QuickActions>
          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/portfolio'}
          >
            <ActionIcon gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <PieChart size={24} />
            </ActionIcon>
            <ActionTitle>View Portfolio</ActionTitle>
            <ActionDescription>Browse all your investments</ActionDescription>
          </ActionCard>

          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/add'}
          >
            <ActionIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
              <TrendingUp size={24} />
            </ActionIcon>
            <ActionTitle>Add Investment</ActionTitle>
            <ActionDescription>Add new stocks, bonds, or crypto</ActionDescription>
          </ActionCard>

          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/performance'}
          >
            <ActionIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
              <Activity size={24} />
            </ActionIcon>
            <ActionTitle>Performance</ActionTitle>
            <ActionDescription>View charts and analytics</ActionDescription>
          </ActionCard>
        </QuickActions>

        <RecentActivity variants={itemVariants}>
          <SectionTitle>
            <Activity size={20} />
            Asset Breakdown
          </SectionTitle>
          
          {stats?.by_type?.filter(type => type && type.type)?.map((type, index) => (
            <ActivityItem
              key={type.type}
              variants={itemVariants}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ActivityInfo>
                <ActivityIcon 
                  gradient={
                    type.type === 'stock' ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' :
                    type.type === 'bond' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
                    type.type === 'crypto' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' :
                    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                  }
                >
                  {type.type === 'stock' ? '📈' : 
                   type.type === 'bond' ? '🏛️' : 
                   type.type === 'crypto' ? '₿' : '💰'}
                </ActivityIcon>
                <ActivityText>
                  {type.count} {type.type?.toUpperCase() || 'UNKNOWN'} holdings
                </ActivityText>
              </ActivityInfo>
              <ActivityValue positive={type.gain_loss >= 0}>
                ${type.current_value?.toLocaleString() || '0'}
              </ActivityValue>
            </ActivityItem>
          ))}
        </RecentActivity>
      </DashboardContainer>
    </motion.div>
  );
};

export default Dashboard;
