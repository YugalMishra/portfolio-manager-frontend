import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Home, 
  Briefcase, 
  Plus, 
  TrendingUp, 
  Menu, 
  X,
  DollarSign,
  User,
  Settings,
  LogOut
} from 'lucide-react';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  gap: 0.5rem;
  
  &:hover {
    color: white;
  }
`;

const LogoIcon = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &.active {
    color: white;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  color: white;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  &.active {
    background: rgba(102, 126, 234, 0.15);
    color: #667eea;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserInfo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const UserAvatar = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
`;

const UserRole = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 500;
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1rem;
  min-width: 200px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DropdownItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-weight: 500;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10B981;
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userDropdownRef = useRef(null);
  
  // User data (since it's a single user system)
  const userData = {
    name: 'Portfolio Manager',
    role: 'Investment Analyst',
    avatar: 'PM',
    email: 'manager@portfolio.pro'
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/add', label: 'Add Item', icon: Plus },
    { path: '/performance', label: 'Performance', icon: TrendingUp },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <NavContainer
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <NavContent>
          <Logo to="/">
            <LogoIcon
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <DollarSign size={24} color="#667eea" />
            </LogoIcon>
            Portfolio Pro
          </Logo>

          <NavLinks>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <NavLink
                    to={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                </motion.div>
              );
            })}
          </NavLinks>

          <UserSection ref={userDropdownRef}>
            <UserInfo
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserAvatar
                whileHover={{ rotate: 5 }}
              >
                {userData.avatar}
                <OnlineIndicator />
              </UserAvatar>
              <UserDetails>
                <UserName>{userData.name}</UserName>
                <UserRole>{userData.role}</UserRole>
              </UserDetails>
            </UserInfo>

            {userDropdownOpen && (
              <UserDropdown
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownItem
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    navigate('/profile');
                    setUserDropdownOpen(false);
                  }}
                >
                  <User size={16} />
                  Profile
                </DropdownItem>
                <DropdownItem
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    navigate('/settings');
                    setUserDropdownOpen(false);
                  }}
                >
                  <Settings size={16} />
                  Settings
                </DropdownItem>
                <DropdownItem
                  whileHover={{ x: 5 }}
                  onClick={() => setUserDropdownOpen(false)}
                  style={{ borderTop: '1px solid rgba(0,0,0,0.1)', marginTop: '0.5rem', paddingTop: '0.75rem' }}
                >
                  <LogOut size={16} />
                  Sign Out
                </DropdownItem>
              </UserDropdown>
            )}
          </UserSection>

          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </MobileMenuButton>
        </NavContent>
      </NavContainer>

      {mobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <MobileNavLink
                key={item.path}
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                {item.label}
              </MobileNavLink>
            );
          })}
        </MobileMenu>
      )}
    </>
  );
};

export default Navbar;
