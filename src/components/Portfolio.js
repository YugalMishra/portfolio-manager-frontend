import React, { useState, useEffect } from 'react';
import { DollarSign, Search } from 'lucide-react';
import { getPortfolio, deletePortfolioItem, updatePortfolioItem } from '../services/mockData';
import { toast } from 'react-hot-toast';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sellModal, setSellModal] = useState({ isOpen: false, item: null, quantity: '' });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio();
        setPortfolioItems(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        toast.error('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleDelete = async (id, symbol) => {
    if (window.confirm(`Are you sure you want to delete ${symbol}?`)) {
      try {
        await deletePortfolioItem(id);
        setPortfolioItems(prev => prev.filter(item => item.id !== id));
        toast.success(`${symbol} removed from portfolio`);
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const openSellModal = (item) => {
    setSellModal({ isOpen: true, item, quantity: '' });
  };

  const closeSellModal = () => {
    setSellModal({ isOpen: false, item: null, quantity: '' });
  };

  const handleSell = async () => {
    const { item, quantity } = sellModal;
    const sellQuantity = parseInt(quantity);

    // Validation
    if (!sellQuantity || sellQuantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (sellQuantity > item.quantity) {
      toast.error('Cannot sell more than you own');
      return;
    }

    try {
      if (sellQuantity === item.quantity) {
        // Sell all shares - remove item completely
        await deletePortfolioItem(item.id);
        setPortfolioItems(prev => prev.filter(i => i.id !== item.id));
        toast.success(`Sold all ${item.quantity} shares of ${item.symbol}`);
      } else {
        // Partial sale - update quantity
        const updatedItem = { ...item, quantity: item.quantity - sellQuantity };
        await updatePortfolioItem(item.id, updatedItem);
        setPortfolioItems(prev => prev.map(i => 
          i.id === item.id ? updatedItem : i
        ));
        toast.success(`Sold ${sellQuantity} shares of ${item.symbol}`);
      }
      closeSellModal();
    } catch (error) {
      console.error('Error selling item:', error);
      toast.error('Failed to sell shares');
    }
  };

  const calculateGainLoss = (item) => {
    return (item.current_price - item.purchase_price) * item.quantity;
  };

  const calculatePercentageChange = (item) => {
    return ((item.current_price - item.purchase_price) / item.purchase_price) * 100;
  };

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading portfolio...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          color: 'white', 
          marginBottom: '1rem' 
        }}>
          Portfolio
        </h1>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap' 
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'rgba(255, 255, 255, 0.6)' 
            }} 
          />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid #ddd',
              borderRadius: '8px',
              color: '#333',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '1rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #ddd',
            borderRadius: '8px',
            color: '#333',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Types</option>
          <option value="stock">Stocks</option>
          <option value="crypto">Crypto</option>
          <option value="etf">ETF</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          color: 'rgba(255, 255, 255, 0.7)',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          border: '2px solid #ddd'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>
            {searchTerm || filterType !== 'all' 
              ? 'No assets match your search criteria' 
              : 'Start building your portfolio by adding your first investment'
            }
          </p>
        </div>
      ) : (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          overflow: 'hidden',
          border: '2px solid #ddd',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            color: '#333'
          }}>
            <thead>
              <tr style={{ 
                background: '#f8f9fa',
                borderBottom: '2px solid #dee2e6'
              }}>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  borderRight: '1px solid #dee2e6',
                  color: '#495057'
                }}>Asset</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  borderRight: '1px solid #dee2e6',
                  color: '#495057'
                }}>Quantity</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  borderRight: '1px solid #dee2e6',
                  color: '#495057'
                }}>Purchase Price</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  borderRight: '1px solid #dee2e6',
                  color: '#495057'
                }}>Purchase Date</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  borderRight: '1px solid #dee2e6',
                  color: '#495057'
                }}>Current Value</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  borderRight: '1px solid #dee2e6',
                  color: '#495057'
                }}>Performance</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  color: '#495057'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const gainLoss = calculateGainLoss(item);
                const percentageChange = calculatePercentageChange(item);
                const isPositive = gainLoss >= 0;
                const currentValue = item.quantity * item.current_price;

                return (
                  <tr 
                    key={item.id}
                    style={{ 
                      borderBottom: '1px solid #dee2e6',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}
                  >
                    <td style={{ 
                      padding: '1rem',
                      borderRight: '1px solid #dee2e6'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '1.1rem', 
                          fontWeight: '700', 
                          marginBottom: '0.25rem',
                          color: '#212529'
                        }}>
                          {item.symbol}
                        </div>
                        <div style={{ 
                          color: '#6c757d', 
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem'
                        }}>
                          {item.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background: '#e9ecef',
                          color: '#495057',
                          display: 'inline-block',
                          border: '1px solid #ced4da'
                        }}>
                          {item.type}
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      borderRight: '1px solid #dee2e6',
                      fontWeight: '600',
                      color: '#212529'
                    }}>{item.quantity}</td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      borderRight: '1px solid #dee2e6',
                      fontWeight: '600',
                      color: '#212529'
                    }}>${item.purchase_price}</td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      borderRight: '1px solid #dee2e6',
                      color: '#495057'
                    }}>
                      {new Date(item.purchase_date).toLocaleDateString()}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      borderRight: '1px solid #dee2e6',
                      fontWeight: '600',
                      color: '#212529'
                    }}>
                      ${currentValue.toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: '1rem', 
                      textAlign: 'center',
                      borderRight: '1px solid #dee2e6'
                    }}>
                      <div style={{ 
                        color: isPositive ? '#28a745' : '#dc3545',
                        fontWeight: '700'
                      }}>
                        <div>${Math.abs(gainLoss).toLocaleString()}</div>
                        <div style={{ fontSize: '0.9rem' }}>
                          {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => openSellModal(item)}
                          style={{
                            background: '#28a745',
                            border: '1px solid #1e7e34',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#1e7e34'}
                          onMouseLeave={(e) => e.target.style.background = '#28a745'}
                        >
                          <DollarSign size={14} style={{ marginRight: '0.25rem' }} />
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Sell Modal */}
      {sellModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              margin: '0 0 1.5rem 0',
              color: '#333',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Sell {sellModal.item?.symbol}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ 
                color: '#666', 
                margin: '0 0 0.5rem 0',
                fontSize: '0.9rem'
              }}>
                Available: {sellModal.item?.quantity} shares
              </p>
              <p style={{ 
                color: '#666', 
                margin: '0 0 1rem 0',
                fontSize: '0.9rem'
              }}>
                Current Price: ${sellModal.item?.current_price}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: '500'
              }}>
                Quantity to Sell
              </label>
              <input
                type="number"
                min="1"
                max={sellModal.item?.quantity}
                value={sellModal.quantity}
                onChange={(e) => setSellModal(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            {sellModal.quantity && (
              <div style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid #e9ecef'
              }}>
                <p style={{ 
                  margin: '0',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  Estimated Sale Value: ${(parseFloat(sellModal.quantity) * sellModal.item?.current_price).toLocaleString()}
                </p>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeSellModal}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #6c757d',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#6c757d',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6c757d';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#6c757d';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSell}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  background: '#28a745',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#1e7e34'}
                onMouseLeave={(e) => e.target.style.background = '#28a745'}
              >
                <DollarSign size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Sell Shares
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
