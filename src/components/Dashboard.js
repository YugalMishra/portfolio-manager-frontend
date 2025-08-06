import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Activity, Plus, Minus, History, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getPortfolioSummary } from '../services/mockData';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit'); // 'deposit' or 'withdrawal'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [settlementBalance, setSettlementBalance] = useState(25000); // Mock initial balance
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'deposit', amount: 25000, description: 'Initial deposit', date: '2024-01-15', balance: 25000 },
    { id: 2, type: 'withdrawal', amount: 5000, description: 'Stock purchase - AAPL', date: '2024-01-20', balance: 20000 },
    { id: 3, type: 'deposit', amount: 10000, description: 'Monthly savings', date: '2024-02-01', balance: 30000 },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getPortfolioSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const transactionAmount = parseFloat(amount);
    const newBalance = transactionType === 'deposit' 
      ? settlementBalance + transactionAmount 
      : settlementBalance - transactionAmount;

    if (transactionType === 'withdrawal' && transactionAmount > settlementBalance) {
      toast.error('Insufficient balance');
      return;
    }

    const newTransaction = {
      id: transactions.length + 1,
      type: transactionType,
      amount: transactionAmount,
      description: description || `${transactionType === 'deposit' ? 'Cash deposit' : 'Cash withdrawal'}`,
      date: new Date().toISOString().split('T')[0],
      balance: newBalance
    };

    setTransactions([newTransaction, ...transactions]);
    setSettlementBalance(newBalance);
    setAmount('');
    setDescription('');
    setShowSettlementModal(false);
    
    toast.success(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
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

  const totalValue = summary?.total_value || 0;
  const totalGainLoss = summary?.total_gain_loss || 0;
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
                {summary?.total_items || 0}
              </div>
              <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>
                Total Holdings
              </div>
              <div style={{ 
                marginTop: '1rem',
                color: '#6b7280',
                fontSize: '0.9rem'
              }}>
                Across {summary?.by_type?.length || 0} asset types
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
              {summary?.by_type?.filter(type => type && type.type)?.map((type, index) => (
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
              {transactions.slice(0, 5).map((transaction) => (
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
                ${settlementBalance.toLocaleString()}
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

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ color: '#374151', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
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
              >
                Cancel
              </button>
              <button
                onClick={handleTransaction}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: transactionType === 'deposit' ? '#10b981' : '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {transactionType === 'deposit' ? 'Deposit' : 'Withdraw'} ${amount || '0'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
