import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { getPortfolio, deletePortfolioItem } from '../services/mockData';
import { toast } from 'react-hot-toast';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

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
                }}>Current Value</th>
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
                      fontWeight: '600',
                      color: '#212529'
                    }}>${item.current_price}</td>
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
                          style={{
                            background: '#007bff',
                            border: '1px solid #0056b3',
                            borderRadius: '6px',
                            padding: '0.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#0056b3'}
                          onMouseLeave={(e) => e.target.style.background = '#007bff'}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.symbol)}
                          style={{
                            background: '#dc3545',
                            border: '1px solid #c82333',
                            borderRadius: '6px',
                            padding: '0.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#c82333'}
                          onMouseLeave={(e) => e.target.style.background = '#dc3545'}
                        >
                          <Trash2 size={14} />
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
    </div>
  );
};

export default Portfolio;
