import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  Key,
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SettingsContainer = styled.div`
  max-width: 1000px;
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

const SettingsGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const SettingsCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
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

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const SettingItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.h4`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SettingDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Toggle = styled(motion.div)`
  width: 60px;
  height: 32px;
  border-radius: 16px;
  background: ${props => props.active ? 
    'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 
    'rgba(255, 255, 255, 0.2)'
  };
  border: 1px solid ${props => props.active ? 
    'rgba(16, 185, 129, 0.3)' : 
    'rgba(255, 255, 255, 0.3)'
  };
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ToggleThumb = styled(motion.div)`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'danger' ? 
    'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' :
    props.variant === 'secondary' ?
    'rgba(255, 255, 255, 0.1)' :
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  border: ${props => props.variant === 'secondary' ? 
    '1px solid rgba(255, 255, 255, 0.2)' : 'none'
  };
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DangerZone = styled.div`
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  padding: 2rem;
  background: rgba(239, 68, 68, 0.05);
  margin-top: 2rem;
`;

const DangerTitle = styled.h4`
  color: #EF4444;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Settings = () => {
  const [settings, setSettings] = useState({
    // Appearance
    darkMode: true,
    theme: 'gradient',
    animations: true,
    compactMode: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    portfolioAlerts: true,
    priceAlerts: true,
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    dataSharing: false,
    analyticsTracking: true,
    
    // Data & Storage
    autoBackup: true,
    dataRetention: '365',
    exportFormat: 'json',
    
    // Regional
    language: 'en',
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${settings[key] ? 'disabled' : 'enabled'}`);
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Setting updated successfully');
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast.success('All settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default settings
      toast.success('Settings reset to default');
    }
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion initiated. Please check your email for confirmation.');
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <SettingsContainer>
        <Header variants={itemVariants}>
          <Title>Settings</Title>
          <Subtitle>Customize your portfolio management experience</Subtitle>
        </Header>

        <SettingsGrid>
          {/* Appearance Settings */}
          <SettingsCard
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)">
                <Palette size={20} />
              </SectionIcon>
              Appearance
            </SectionTitle>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Dark Mode</SettingLabel>
                <SettingDescription>Use dark theme for better viewing in low light</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.darkMode}
                  onClick={() => handleToggle('darkMode')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.darkMode ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Animations</SettingLabel>
                <SettingDescription>Enable smooth animations and transitions</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.animations}
                  onClick={() => handleToggle('animations')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.animations ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Theme</SettingLabel>
                <SettingDescription>Choose your preferred color theme</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Select
                  value={settings.theme}
                  onChange={(e) => handleSelectChange('theme', e.target.value)}
                >
                  <option value="gradient">Gradient</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                </Select>
              </SettingControl>
            </SettingItem>
          </SettingsCard>

          {/* Notifications Settings */}
          <SettingsCard
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                <Bell size={20} />
              </SectionIcon>
              Notifications
            </SectionTitle>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Email Notifications</SettingLabel>
                <SettingDescription>Receive portfolio updates via email</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.emailNotifications}
                  onClick={() => handleToggle('emailNotifications')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.emailNotifications ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Push Notifications</SettingLabel>
                <SettingDescription>Get instant alerts on your device</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.pushNotifications}
                  onClick={() => handleToggle('pushNotifications')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.pushNotifications ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Sound Effects</SettingLabel>
                <SettingDescription>Play sounds for notifications and alerts</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.soundEnabled}
                  onClick={() => handleToggle('soundEnabled')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.soundEnabled ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Price Alerts</SettingLabel>
                <SettingDescription>Get notified when prices reach your targets</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.priceAlerts}
                  onClick={() => handleToggle('priceAlerts')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.priceAlerts ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>
          </SettingsCard>

          {/* Privacy & Security */}
          <SettingsCard
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)">
                <Shield size={20} />
              </SectionIcon>
              Privacy & Security
            </SectionTitle>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Two-Factor Authentication</SettingLabel>
                <SettingDescription>Add an extra layer of security to your account</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.twoFactorAuth}
                  onClick={() => handleToggle('twoFactorAuth')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.twoFactorAuth ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Session Timeout</SettingLabel>
                <SettingDescription>Automatically log out after inactivity</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSelectChange('sessionTimeout', e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                </Select>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Analytics Tracking</SettingLabel>
                <SettingDescription>Help improve the app by sharing usage data</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.analyticsTracking}
                  onClick={() => handleToggle('analyticsTracking')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.analyticsTracking ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>
          </SettingsCard>

          {/* Regional Settings */}
          <SettingsCard
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                <Globe size={20} />
              </SectionIcon>
              Regional Settings
            </SectionTitle>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Language</SettingLabel>
                <SettingDescription>Choose your preferred language</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Select
                  value={settings.language}
                  onChange={(e) => handleSelectChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </Select>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Currency</SettingLabel>
                <SettingDescription>Default currency for portfolio display</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Select
                  value={settings.currency}
                  onChange={(e) => handleSelectChange('currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </Select>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Date Format</SettingLabel>
                <SettingDescription>How dates are displayed throughout the app</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Select
                  value={settings.dateFormat}
                  onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </SettingControl>
            </SettingItem>
          </SettingsCard>

          {/* Data Management */}
          <SettingsCard
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <SectionTitle>
              <SectionIcon gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)">
                <Database size={20} />
              </SectionIcon>
              Data Management
            </SectionTitle>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Auto Backup</SettingLabel>
                <SettingDescription>Automatically backup your portfolio data</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <Toggle
                  active={settings.autoBackup}
                  onClick={() => handleToggle('autoBackup')}
                  whileTap={{ scale: 0.95 }}
                >
                  <ToggleThumb
                    animate={{ x: settings.autoBackup ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </Toggle>
              </SettingControl>
            </SettingItem>

            <SettingItem whileHover={{ x: 5 }}>
              <SettingInfo>
                <SettingLabel>Export Data</SettingLabel>
                <SettingDescription>Download your portfolio data</SettingDescription>
              </SettingInfo>
              <SettingControl>
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    onClick={handleExportData}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={16} />
                    Export
                  </Button>
                </ButtonGroup>
              </SettingControl>
            </SettingItem>

            {/* Save Settings Button */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Button
                onClick={handleSaveSettings}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save size={16} />
                Save All Settings
              </Button>
            </div>

            {/* Danger Zone */}
            <DangerZone>
              <DangerTitle>
                <AlertTriangle size={20} />
                Danger Zone
              </DangerTitle>
              <SettingItem whileHover={{ x: 5 }}>
                <SettingInfo>
                  <SettingLabel style={{ color: '#EF4444' }}>Reset Settings</SettingLabel>
                  <SettingDescription>Reset all settings to their default values</SettingDescription>
                </SettingInfo>
                <SettingControl>
                  <Button
                    variant="danger"
                    onClick={handleResetSettings}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw size={16} />
                    Reset
                  </Button>
                </SettingControl>
              </SettingItem>

              <SettingItem whileHover={{ x: 5 }}>
                <SettingInfo>
                  <SettingLabel style={{ color: '#EF4444' }}>Delete Account</SettingLabel>
                  <SettingDescription>Permanently delete your account and all data</SettingDescription>
                </SettingInfo>
                <SettingControl>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </SettingControl>
              </SettingItem>
            </DangerZone>
          </SettingsCard>
        </SettingsGrid>
      </SettingsContainer>
    </motion.div>
  );
};

export default Settings;
