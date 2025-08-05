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

const PortfolioTable = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  overflow: hidden;
  margin-top: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  }
`;

const TableHeader = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
  gap: 1rem;
  align-items: center;
  font-weight: 700;
  color: white;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1fr;
    & > div:nth-child(4),
    & > div:nth-child(5) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1.5fr 1fr;
    padding: 1.5rem 1rem;
    & > div:nth-child(3),
    & > div:nth-child(4),
    & > div:nth-child(5),
    & > div:nth-child(6) {
      display: none;
    }
  }
`;

const TableBody = styled.div`
  max-height: 600px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%);
    border-radius: 5px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
    }
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
    transform: translateX(8px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1fr;
    & > div:nth-child(4),
    & > div:nth-child(5) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1.5fr 1fr;
    padding: 1.2rem 1rem;
    & > div:nth-child(3),
    & > div:nth-child(4),
    & > div:nth-child(5),
    & > div:nth-child(6) {
      display: none;
    }
  }
`;

const AssetCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const AssetSymbol = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AssetName = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 500;
`;

const AssetType = styled.span`
  background: ${props => 
    props.type === 'stock' ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' :
    props.type === 'bond' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' :
    props.type === 'crypto' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' :
    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  };
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
  margin-top: 0.3rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  letter-spacing: 0.5px;
`;

const CellValue = styled.div`
  color: white;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const PriceCell = styled.div`
  color: white;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const PerformanceCell = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #FFFFFF;
  font-weight: 900;
  font-family: 'JetBrains Mono', monospace;
  padding: 1rem 1.2rem;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  background: ${props => props.positive ? 
    'linear-gradient(135deg, #00FF88 0%, #00E676 25%, #00C853 50%, #00BFA5 100%)' :
    'linear-gradient(135deg, #FF4081 0%, #FF1744 25%, #E91E63 50%, #F50057 100%)'
  };
  
  border: 3px solid ${props => props.positive ? 
    '#00FF88' : 
    '#FF4081'
  };
  
  box-shadow: 
    0 0 30px ${props => props.positive ? 
      'rgba(0, 255, 136, 0.6)' : 
      'rgba(255, 64, 129, 0.6)'
    },
    0 0 60px ${props => props.positive ? 
      'rgba(0, 255, 136, 0.3)' : 
      'rgba(255, 64, 129, 0.3)'
    },
    inset 0 2px 0 rgba(255, 255, 255, 0.4),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.8s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.positive ? 
      'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)' :
      'radial-gradient(circle, rgba(255, 64, 129, 0.1) 0%, transparent 70%)'
    };
    animation: pulse 2s ease-in-out infinite;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
      0 0 40px ${props => props.positive ? 
        'rgba(0, 255, 136, 0.8)' : 
        'rgba(255, 64, 129, 0.8)'
      },
      0 0 80px ${props => props.positive ? 
        'rgba(0, 255, 136, 0.4)' : 
        'rgba(255, 64, 129, 0.4)'
      },
      0 15px 35px rgba(0, 0, 0, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.5);
    
    &::before {
      left: 100%;
    }
  }
  
  svg {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    animation: ${props => props.positive ? 'glow-bounce-up' : 'glow-bounce-down'} 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }
  
  @keyframes glow-bounce-up {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(0deg);
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    }
    40% {
      transform: translateY(-4px) rotate(8deg);
      filter: drop-shadow(0 0 15px rgba(0, 255, 136, 1));
    }
    60% {
      transform: translateY(-2px) rotate(-4deg);
      filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.9));
    }
  }
  
  @keyframes glow-bounce-down {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(0deg);
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    }
    40% {
      transform: translateY(4px) rotate(-8deg);
      filter: drop-shadow(0 0 15px rgba(255, 64, 129, 1));
    }
    60% {
      transform: translateY(2px) rotate(4deg);
      filter: drop-shadow(0 0 12px rgba(255, 64, 129, 0.9));
    }
  }
  
  .performance-value {
    font-size: 1.2rem;
    font-weight: 900;
    text-shadow: 
      0 0 10px rgba(255, 255, 255, 0.8),
      0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.8px;
    filter: brightness(1.2);
  }
  
  .performance-percentage {
    font-size: 1rem;
    font-weight: 800;
    text-shadow: 
      0 0 8px rgba(255, 255, 255, 0.6),
      0 1px 2px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    filter: brightness(1.1);
    
    &::before {
      content: ${props => props.positive ? '"🚀"' : '"⚡"'};
      font-size: 1rem;
      margin-right: 0.3rem;
      animation: spin 3s linear infinite;
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    gap: 0.6rem;
    
    .performance-value {
      font-size: 1rem;
    }
    
    .performance-percentage {
      font-size: 0.9rem;
    }
  }
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'danger'
})`
  width: 36px;
  height: 36px;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px ${props => props.danger ? 
    'rgba(239, 68, 68, 0.3)' : 
    'rgba(102, 126, 234, 0.3)'
  };
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: scale(1.15) translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.danger ? 
      'rgba(239, 68, 68, 0.4)' : 
      'rgba(102, 126, 234, 0.4)'
    };
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &:active {
    transform: scale(1.05);
  }
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
          <PortfolioTable>
            <TableHeader>
              <div>Asset</div>
              <div>Quantity</div>
              <div>Purchase Price</div>
              <div>Current Price</div>
              <div>Purchase Date</div>
              <div>Current Value</div>
              <div>Performance</div>
              <div>Actions</div>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredItems.map((item, index) => {
                  const gainLoss = calculateGainLoss(item);
                  const percentageChange = calculatePercentageChange(item);
                  const isPositive = gainLoss >= 0;
                  const currentValue = item.quantity * item.current_price;

                  return (
                    <TableRow
                      key={item.id}
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <AssetCell>
                        <AssetSymbol>{item.symbol}</AssetSymbol>
                        <AssetName>{item.name}</AssetName>
                        <AssetType type={item.type}>{item.type}</AssetType>
                      </AssetCell>
                      
                      <CellValue>{item.quantity}</CellValue>
                      
                      <PriceCell>${item.purchase_price}</PriceCell>
                      
                      <PriceCell>${item.current_price}</PriceCell>
                      
                      <CellValue>{new Date(item.purchase_date).toLocaleDateString()}</CellValue>
                      
                      <PriceCell>${currentValue.toLocaleString()}</PriceCell>
                      
                      <PerformanceCell 
                        positive={isPositive}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        <div>
                          <div className="performance-value">${Math.abs(gainLoss).toLocaleString()}</div>
                          <div className="performance-percentage">
                            {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                          </div>
                        </div>
                      </PerformanceCell>
                      
                      <ActionsCell>
                        <ActionButton
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={14} />
                        </ActionButton>
                        <ActionButton
                          danger
                          onClick={() => handleDelete(item.id, item.symbol)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      </ActionsCell>
                    </TableRow>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </PortfolioTable>
        )}
      </PortfolioContainer>
    </motion.div>
  );
};

export default Portfolio;
