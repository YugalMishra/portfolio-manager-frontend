import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Save,
  ArrowLeft
} from 'lucide-react';
import { addPortfolioItem } from '../services/mockData';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddItemContainer = styled.div`
  max-width: 800px;
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

const FormCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 3rem;
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
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled(motion.div)`
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
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
  
  &:invalid {
    border-color: #EF4444;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #EF4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: #10B981;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PreviewCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
`;

const PreviewTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const PreviewItem = styled.div`
  text-align: center;
`;

const PreviewLabel = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
`;

const PreviewValue = styled.p`
  color: white;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
`;

const AddItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    type: 'stock',
    quantity: '',
    purchase_price: '',
    current_price: '',
    purchase_date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
      newErrors.symbol = 'Symbol is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.purchase_price || formData.purchase_price <= 0) {
      newErrors.purchase_price = 'Purchase price must be greater than 0';
    }
    
    if (!formData.current_price || formData.current_price <= 0) {
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
      toast.error('Please fix the form errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        purchase_price: parseFloat(formData.purchase_price),
        current_price: parseFloat(formData.current_price)
      };
      
      await addPortfolioItem(submitData);
      
      setSuccess(true);
      toast.success(`${formData.symbol} added to portfolio successfully!`);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          symbol: '',
          name: '',
          type: 'stock',
          quantity: '',
          purchase_price: '',
          current_price: '',
          purchase_date: new Date().toISOString().split('T')[0]
        });
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const currentPrice = parseFloat(formData.current_price) || 0;
    return quantity * currentPrice;
  };

  const calculateGainLoss = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const purchasePrice = parseFloat(formData.purchase_price) || 0;
    const currentPrice = parseFloat(formData.current_price) || 0;
    return (quantity * currentPrice) - (quantity * purchasePrice);
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AddItemContainer>
        <Header variants={itemVariants}>
          <Title>Add New Investment</Title>
      
        </Header>

        <FormCard
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          {success && (
            <SuccessMessage
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TrendingUp size={20} />
              Investment added successfully!
            </SuccessMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <FormRow columns="1fr 1fr">
              <FormGroup variants={itemVariants}>
                <Label>
                  <DollarSign size={16} />
                  Symbol
                </Label>
                <Input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="e.g., AAPL, BTC, GOOGL"
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
                <Label>Investment Type</Label>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="stock">Stock</option>
                  <option value="bond">Bond</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="etf">ETF</option>
                  <option value="cash">Cash</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup variants={itemVariants}>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Apple Inc., Bitcoin, Alphabet Inc."
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

            <FormRow columns="1fr 1fr 1fr">
              <FormGroup variants={itemVariants}>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.0001"
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

              <FormGroup variants={itemVariants}>
                <Label>
                  <DollarSign size={16} />
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
                  <DollarSign size={16} />
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
                <Calendar size={16} />
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
                  <TrendingUp size={20} />
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

            <ButtonGroup>
              <SecondaryButton
                type="button"
                onClick={() => navigate('/portfolio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={16} />
                Back to Portfolio
              </SecondaryButton>
              
              <PrimaryButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%' }}
                  />
                ) : (
                  <>
                    <Save size={16} />
                    Add to Portfolio
                  </>
                )}
              </PrimaryButton>
            </ButtonGroup>
          </Form>
        </FormCard>
      </AddItemContainer>
    </motion.div>
  );
};

export default AddItem;
