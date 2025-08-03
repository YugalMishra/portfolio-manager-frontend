import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  Edit3,
  Save,
  X,
  Camera,
  Award,
  TrendingUp,
  DollarSign,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfileContainer = styled.div`
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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(motion.div)`
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

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
`;

const Avatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 800;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.2);
  
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

const EditAvatarButton = styled(motion.button)`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
  }
`;

const UserName = styled.h2`
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const UserRole = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #10B981;
  font-size: 0.9rem;
  font-weight: 600;
`;

const OnlineIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  font-weight: 500;
`;

const InfoValue = styled.p`
  color: white;
  font-size: 1rem;
  font-weight: 600;
`;

const EditButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
  }
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Portfolio Manager',
    role: 'Investment Analyst',
    email: 'manager@portfolio.pro',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2023-01-15',
    department: 'Financial Services',
    experience: '5+ Years',
    specialization: 'Portfolio Optimization',
    bio: 'Experienced investment analyst specializing in portfolio management and risk assessment. Passionate about helping clients achieve their financial goals through strategic investment planning.'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
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
      <ProfileContainer>
        <Header variants={itemVariants}>
          <Title>User Profile</Title>
          <Subtitle>Manage your personal information and preferences</Subtitle>
        </Header>

        <ProfileGrid>
          <ProfileCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <AvatarSection>
              <AvatarContainer>
                <Avatar
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  PM
                </Avatar>
                <EditAvatarButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera size={16} />
                </EditAvatarButton>
              </AvatarContainer>
              <UserName>{userProfile.name}</UserName>
              <UserRole>{userProfile.role}</UserRole>
              <StatusBadge>
                <OnlineIndicator />
                Online
              </StatusBadge>
            </AvatarSection>

            <StatsGrid>
              <StatCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <StatIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                  <TrendingUp size={20} />
                </StatIcon>
                <StatValue>5+</StatValue>
                <StatLabel>Years Exp</StatLabel>
              </StatCard>

              <StatCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <StatIcon gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)">
                  <Target size={20} />
                </StatIcon>
                <StatValue>98%</StatValue>
                <StatLabel>Success Rate</StatLabel>
              </StatCard>

              <StatCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <StatIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                  <Award size={20} />
                </StatIcon>
                <StatValue>12</StatValue>
                <StatLabel>Certifications</StatLabel>
              </StatCard>

              <StatCard
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <StatIcon gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)">
                  <DollarSign size={20} />
                </StatIcon>
                <StatValue>$2.5M</StatValue>
                <StatLabel>Managed</StatLabel>
              </StatCard>
            </StatsGrid>
          </ProfileCard>

          <ProfileCard
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <SectionTitle>
                <User size={20} />
                Personal Information
              </SectionTitle>
              <EditButton
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                {isEditing ? 'Save' : 'Edit'}
              </EditButton>
            </div>

            <InfoGrid>
              <InfoItem
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <InfoIcon gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                  <Mail size={18} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email Address</InfoLabel>
                  <InfoValue>{userProfile.email}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <InfoIcon gradient="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)">
                  <Phone size={18} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Phone Number</InfoLabel>
                  <InfoValue>{userProfile.phone}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <InfoIcon gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)">
                  <MapPin size={18} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Location</InfoLabel>
                  <InfoValue>{userProfile.location}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <InfoIcon gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)">
                  <Calendar size={18} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Join Date</InfoLabel>
                  <InfoValue>{new Date(userProfile.joinDate).toLocaleDateString()}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <InfoIcon gradient="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)">
                  <Briefcase size={18} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Department</InfoLabel>
                  <InfoValue>{userProfile.department}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <InfoIcon gradient="linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)">
                  <Award size={18} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Specialization</InfoLabel>
                  <InfoValue>{userProfile.specialization}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoGrid>

            <InfoSection style={{ marginTop: '2rem' }}>
              <SectionTitle>
                <User size={20} />
                About Me
              </SectionTitle>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6'
              }}>
                {userProfile.bio}
              </div>
            </InfoSection>
          </ProfileCard>
        </ProfileGrid>
      </ProfileContainer>
    </motion.div>
  );
};

export default Profile;
