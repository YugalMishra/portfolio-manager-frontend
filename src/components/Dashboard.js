import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Activity, Plus, Minus, History, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

// API base URL - adjust according to your backend setup
const API_BASE_URL = "https://portfolio-manager-backend-production-d307.up.railway.app" || 'http://localhost:5000/api';

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [settlementBalance, setSettlementBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchSettlementData();
  }, []);

  // Fetch portfolio data from backend
  const fetchDashboardData = async () => {
    try {
      // Try portfolio analysis first
      const response = await fetch(`${API_BASE_URL}/portfolio/analysis`);
      if (!response.ok) {
        // If analysis fails, try the assets portfolio endpoint
        const portfolioResponse = await fetch(`${API_BASE_URL}/assets/portfolio`);
        if (!portfolioResponse.ok) throw new Error('Both portfolio endpoints failed');
        
        const portfolioData = await portfolioResponse.json();
        console.log('Portfolio data from assets endpoint:', portfolioData);
        
        // Transform assets portfolio data
        const assets = portfolioData.portfolio || [];
        const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.current_value || 0), 0);
        const totalGainLoss = assets.reduce((sum, asset) => sum + parseFloat(asset.unrealized_profit || 0), 0);
        
        // Group by type
        const typeGroups = {};
        assets.forEach(asset => {
          if (!typeGroups[asset.type]) {
            typeGroups[asset.type] = {
              count: 0,
              current_value: 0,
              gain_loss: 0
            };
          }
          typeGroups[asset.type].count += 1;
          typeGroups[asset.type].current_value += parseFloat(asset.current_value || 0);
          typeGroups[asset.type].gain_loss += parseFloat(asset.unrealized_profit || 0);
        });
        
        const transformedData = {
          total_value: totalValue,
          total_gain_loss: totalGainLoss,
          total_items: assets.length,
          by_type: Object.keys(typeGroups).map(type => ({
            type: type,
            count: typeGroups[type].count,
            current_value: typeGroups[type].current_value,
            gain_loss: typeGroups[type].gain_loss
          }))
        };
        
        setPortfolioData(transformedData);
        return;
      }
      
      const data = await response.json();
      console.log('Portfolio analysis data:', data);
      
      // Transform the analysis data to match the component's expected format
      const transformedData = {
        total_value: parseFloat(data.summary?.total_portfolio_value) || 0,
        total_gain_loss: (parseFloat(data.summary?.total_unrealized_profit) || 0) + (parseFloat(data.summary?.total_realized_profit) || 0),
        total_items: data.assets?.length || 0,
        by_type: Object.keys(data.asset_breakdown || {}).map(type => ({
          type: type,
          count: data.assets?.filter(asset => asset.type === type).length || 0,
          current_value: data.asset_breakdown[type] || 0,
          gain_loss: data.assets?.filter(asset => asset.type === type)
            .reduce((sum, asset) => sum + parseFloat(asset.unrealized_profit || 0), 0) || 0
        }))
      };
      
      setPortfolioData(transformedData);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      
      // Set default data if API fails
      setPortfolioData({
        total_value: 0,
        total_gain_loss: 0,
        total_items: 0,
        by_type: []
      });
      
      // Don't show error toast - just log it for now
      console.warn('Using fallback portfolio data');
    }
  };

  // Fetch settlement balance and transaction history from backend
  const fetchSettlementData = async () => {
    try {
      setLoading(true);
      let currentBalance = 0;
      
      // Fetch balance
      const balanceResponse = await fetch(`${API_BASE_URL}/settlement/balance`);
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        currentBalance = parseFloat(balanceData.balance) || 0;
        setSettlementBalance(currentBalance);
      } else {
        console.warn('Settlement balance API failed, using default');
        setSettlementBalance(0);
      }

      // Fetch transaction history
      const historyResponse = await fetch(`${API_BASE_URL}/settlement/history`);
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        
        // Transform backend data to match frontend format
        const formattedTransactions = (historyData.history || []).map(transaction => {
          // Determine the display type based on the transaction
          // If it's a withdrawal OR has negative amount, show as withdrawal
          // If it's a deposit, asset sale, or positive amount, show as deposit
          let displayType = 'deposit';
          let displayAmount = Math.abs(transaction.amount);
          
          // Check if this is an actual withdrawal (negative impact on balance)
          if (transaction.type === 'withdraw' || transaction.amount < 0) {
            displayType = 'withdrawal';
          }
          
          return {
            id: transaction.id,
            type: displayType,
            amount: displayAmount,
            description: transaction.note || 
              (displayType === 'withdrawal' ? 'Cash withdrawal' : 
               transaction.type === 'asset_sale' ? 'Asset sale proceeds' : 'Cash deposit'),
            date: new Date(transaction.date).toISOString().split('T')[0],
            balance: 0 // We'll calculate running balance if needed
          };
        });

        // Calculate running balance for display (from most recent backwards)
        let runningBalance = currentBalance;
        const transactionsWithBalance = formattedTransactions.map((transaction, index) => {
          const transactionWithBalance = { ...transaction, balance: runningBalance };
          if (index < formattedTransactions.length - 1) {
            // Adjust running balance for next transaction (going backwards in time)
            if (transaction.type === 'deposit') {
              runningBalance -= transaction.amount;
            } else {
              runningBalance += transaction.amount;
            }
          }
          return transactionWithBalance;
        });

        setTransactions(transactionsWithBalance);
      } else {
        console.warn('Settlement history API failed, using empty array');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching settlement data:', error);
      // Set defaults instead of showing error
      setSettlementBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const transactionAmount = parseFloat(amount);

    // Check for sufficient balance on withdrawal
    if (transactionType === 'withdrawal' && transactionAmount > settlementBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setTransactionLoading(true);

    try {
      const endpoint = transactionType === 'deposit' ? '/settlement/add' : '/settlement/withdraw';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: transactionAmount,
          note: description || `User ${transactionType}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transaction failed');
      }

      const result = await response.json();
      toast.success(result.message);

      // Reset form
      setAmount('');
      setDescription('');
      setShowSettlementModal(false);

      // Refresh settlement data
      await fetchSettlementData();

    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Transaction failed');
    } finally {
      setTransactionLoading(false);
    }
  };

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
        Loading dashboard...
      </div>
    );
  }

  const totalValue = portfolioData?.total_value || 0;
  const totalGainLoss = portfolioData?.total_gain_loss || 0;
  const isPositive = totalGainLoss >= 0;
  const percentageChange = totalValue > 0 ? ((totalGainLoss / (totalValue - totalGainLoss)) * 100) : 0;

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '2rem',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          color: 'white', 
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Portfolio Dashboard
        </h1>
        
      </div>

      {/* PARTITION 1: Portfolio Overview */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '3rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Portfolio Overview
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Left Side: Portfolio Value & Holdings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Portfolio Value Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PieChart size={24} color="white" />
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: isPositive ? '#10b981' : '#ef4444',
                  fontWeight: '600'
                }}>
                  {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {percentageChange.toFixed(2)}%
                </div>
              </div>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                color: '#1f2937', 
                marginBottom: '0.5rem',
                fontFamily: 'monospace'
              }}>
                ${totalValue.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>
                Total Portfolio Value
              </div>
              <div style={{ 
                marginTop: '1rem',
                color: isPositive ? '#10b981' : '#ef4444',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                {isPositive ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString()} P&L
              </div>
            </div>

            {/* Holdings Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Activity size={24} color="white" />
                </div>
              </div>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                color: '#1f2937', 
                marginBottom: '0.5rem',
                fontFamily: 'monospace'
              }}>
                {portfolioData?.total_items || 0}
              </div>
              <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>
                Total Holdings
              </div>
              <div style={{ 
                marginTop: '1rem',
                color: '#6b7280',
                fontSize: '0.9rem'
              }}>
                Across {portfolioData?.by_type?.length || 0} asset types
              </div>
            </div>
          </div>

          {/* Right Side: Asset Breakdown */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Activity size={20} />
              Asset Breakdown
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {portfolioData?.by_type?.filter(type => type && type.type)?.map((type, index) => (
                <div
                  key={type.type}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      background: type.type === 'stock' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' :
                                type.type === 'bond' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                type.type === 'crypto' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      {type.type === 'stock' ? '📈' : 
                       type.type === 'bond' ? '🏛️' : 
                       type.type === 'crypto' ? '₿' : '💰'}
                    </div>
                    <div>
                      <div style={{ color: '#1f2937', fontWeight: '600' }}>
                        {type.count} {type.type?.toUpperCase() || 'UNKNOWN'}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        holdings
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    color: type.gain_loss >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    ${type.current_value?.toLocaleString() || '0'}
                  </div>
                </div>
              ))}
              {(!portfolioData?.by_type || portfolioData.by_type.length === 0) && (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '2rem',
                  fontSize: '0.9rem'
                }}>
                  No assets in portfolio
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PARTITION 2: Financial Management */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Financial Management
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Left Side: Settlement Account */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Wallet size={24} color="white" />
              </div>
              <button
                onClick={() => setShowSettlementModal(true)}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                Manage Cash
              </button>
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              color: '#1f2937', 
              marginBottom: '0.5rem',
              fontFamily: 'monospace'
            }}>
              ${settlementBalance.toLocaleString()}
            </div>
            <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>
              Settlement Account
            </div>
            <div style={{ 
              marginTop: '1rem',
              color: '#6b7280',
              fontSize: '0.9rem'
            }}>
              Available for trading
            </div>
          </div>

          {/* Right Side: Transaction History */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <History size={20} />
              Recent Transactions
            </h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {transactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      background: transaction.type === 'deposit' ? '#10b981' : '#ef4444',
                      borderRadius: '50%',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {transaction.type === 'deposit' ? 
                        <Plus size={16} color="white" /> : 
                        <Minus size={16} color="white" />
                      }
                    </div>
                    <div>
                      <div style={{ color: '#1f2937', fontWeight: '600', fontSize: '0.9rem' }}>
                        {transaction.description}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: transaction.type === 'deposit' ? '#10b981' : '#ef4444',
                      fontWeight: '600',
                      fontFamily: 'monospace'
                    }}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      Balance: ${transaction.balance.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '2rem',
                  fontSize: '0.9rem'
                }}>
                  No transactions yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settlement Account Modal */}
      {showSettlementModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
              Settlement Account Management
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Current Balance</div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '800', 
                color: '#1f2937',
                fontFamily: 'monospace'
              }}>
                ₹{settlementBalance.toLocaleString()}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#374151', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                Transaction Type
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setTransactionType('deposit')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `2px solid ${transactionType === 'deposit' ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    background: transactionType === 'deposit' ? '#f0fdf4' : 'white',
                    color: transactionType === 'deposit' ? '#10b981' : '#6b7280',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setTransactionType('withdrawal')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `2px solid ${transactionType === 'withdrawal' ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    background: transactionType === 'withdrawal' ? '#fef2f2' : 'white',
                    color: transactionType === 'withdrawal' ? '#ef4444' : '#6b7280',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Withdrawal
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#374151', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowSettlementModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                disabled={transactionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleTransaction}
                disabled={transactionLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: transactionLoading ? '#9ca3af' : (transactionType === 'deposit' ? '#10b981' : '#ef4444'),
                  color: 'white',
                  cursor: transactionLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {transactionLoading ? 'Processing...' : `${transactionType === 'deposit' ? 'Deposit' : 'Withdraw'} ${amount || '0'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;