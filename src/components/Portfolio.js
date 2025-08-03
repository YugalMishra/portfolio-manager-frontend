import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getPortfolio, deletePortfolioItem } from '../services/mockData';
import { toast } from 'react-hot-toast';

const PortfolioContainer = styled.div`
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

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const FilterButton = styled(motion.button)`
  padding: 1rem 1.5rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const PortfolioCard = styled(motion.div)`
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const AssetInfo = styled.div`
  flex: 1;
`;

const AssetSymbol = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
`;

const AssetName = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const AssetType = styled.span`
  background: ${props => 
    props.type === 'stock' ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' :
    props.type === 'bond' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
    props.type === 'crypto' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' :
    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  };
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'danger'
})`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.danger ? 
    'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricItem = styled.div`
  text-align: center;
`;

const MetricLabel = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  font-weight: 500;
`;

const MetricValue = styled.p`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
`;

const PerformanceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const CurrentValue = styled.div`
  text-align: left;
`;

const ValueLabel = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
`;

const ValueAmount = styled.p`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
`;

const PerformanceIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.positive ? '#10B981' : '#EF4444'};
  font-weight: 600;
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.7);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, searchTerm, activeFilter]);

  const fetchPortfolioItems = async () => {
    try {
      const portfolioData = await getPortfolio();
      setPortfolioItems(portfolioData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio');
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = portfolioItems;

    // Filter by type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id, symbol) => {
    if (window.confirm(`Are you sure you want to delete ${symbol}?`)) {
      try {
        await deletePortfolioItem(id);
        toast.success(`${symbol} deleted successfully`);
        fetchPortfolioItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const calculateGainLoss = (item) => {
    const invested = item.quantity * item.purchase_price;
    const current = item.quantity * item.current_price;
    return current - invested;
  };

  const calculatePercentageChange = (item) => {
    return ((item.current_price - item.purchase_price) / item.purchase_price) * 100;
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
      <PortfolioContainer>
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
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Loading portfolio...</p>
        </div>
      </PortfolioContainer>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PortfolioContainer>
        <Header variants={itemVariants}>
          <Title>My Portfolio</Title>
        </Header>

        <Controls>
          <SearchBox>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by symbol or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>

          <FilterButton
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
            All
          </FilterButton>

          <FilterButton
            active={activeFilter === 'stock'}
            onClick={() => setActiveFilter('stock')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Stocks
          </FilterButton>

          <FilterButton
            active={activeFilter === 'bond'}
            onClick={() => setActiveFilter('bond')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bonds
          </FilterButton>

          <FilterButton
            active={activeFilter === 'crypto'}
            onClick={() => setActiveFilter('crypto')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Crypto
          </FilterButton>
        </Controls>

        {filteredItems.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyIcon>📊</EmptyIcon>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>
              {searchTerm || activeFilter !== 'all' ? 'No matching items found' : 'No portfolio items yet'}
            </h3>
            <p>
              {searchTerm || activeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start building your portfolio by adding your first investment'
              }
            </p>
          </EmptyState>
        ) : (
          <PortfolioGrid>
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const gainLoss = calculateGainLoss(item);
                const percentageChange = calculatePercentageChange(item);
                const isPositive = gainLoss >= 0;

                return (
                  <PortfolioCard
                    key={item.id}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <CardHeader>
                      <AssetInfo>
                        <AssetSymbol>{item.symbol}</AssetSymbol>
                        <AssetName>{item.name}</AssetName>
                        <AssetType type={item.type}>{item.type}</AssetType>
                      </AssetInfo>
                      <Actions>
                        <ActionButton
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={16} />
                        </ActionButton>
                        <ActionButton
                          danger
                          onClick={() => handleDelete(item.id, item.symbol)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </Actions>
                    </CardHeader>

                    <CardBody>
                      <MetricItem>
                        <MetricLabel>Quantity</MetricLabel>
                        <MetricValue>{item.quantity}</MetricValue>
                      </MetricItem>
                      <MetricItem>
                        <MetricLabel>Purchase Price</MetricLabel>
                        <MetricValue>${item.purchase_price}</MetricValue>
                      </MetricItem>
                      <MetricItem>
                        <MetricLabel>Current Price</MetricLabel>
                        <MetricValue>${item.current_price}</MetricValue>
                      </MetricItem>
                      <MetricItem>
                        <MetricLabel>Purchase Date</MetricLabel>
                        <MetricValue>{new Date(item.purchase_date).toLocaleDateString()}</MetricValue>
                      </MetricItem>
                    </CardBody>

                    <PerformanceSection>
                      <CurrentValue>
                        <ValueLabel>Current Value</ValueLabel>
                        <ValueAmount>${(item.quantity * item.current_price).toLocaleString()}</ValueAmount>
                      </CurrentValue>
                      <PerformanceIndicator positive={isPositive}>
                        {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        <div>
                          <div>${Math.abs(gainLoss).toLocaleString()}</div>
                          <div style={{ fontSize: '0.9rem' }}>
                            {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                          </div>
                        </div>
                      </PerformanceIndicator>
                    </PerformanceSection>
                  </PortfolioCard>
                );
              })}
            </AnimatePresence>
          </PortfolioGrid>
        )}
      </PortfolioContainer>
    </motion.div>
  );
};

export default Portfolio;
