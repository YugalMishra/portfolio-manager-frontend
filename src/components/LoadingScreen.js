import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`;

const LoadingContent = styled(motion.div)`
  text-align: center;
  z-index: 2;
`;

const Logo = styled(motion.div)`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingText = styled(motion.p)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 3rem;
  font-weight: 500;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const Spinner = styled(motion.div)`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  
  &:nth-child(1) {
    border-top: 3px solid #ffffff;
  }
  
  &:nth-child(2) {
    border-right: 3px solid #ffffff;
    width: 60px;
    height: 60px;
    top: 10px;
    left: 10px;
  }
  
  &:nth-child(3) {
    border-bottom: 3px solid #ffffff;
    width: 40px;
    height: 40px;
    top: 20px;
    left: 20px;
  }
`;

const BackgroundOrbs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Orb = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  border-radius: 2px;
`;

const LoadingScreen = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
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
    <LoadingContainer>
      <BackgroundOrbs>
        <Orb
          style={{ width: '300px', height: '300px', top: '10%', left: '10%' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <Orb
          style={{ width: '200px', height: '200px', top: '60%', right: '15%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <Orb
          style={{ width: '150px', height: '150px', bottom: '20%', left: '20%' }}
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </BackgroundOrbs>

      <LoadingContent
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Logo variants={itemVariants}>
          WEALTHFOLIO
        </Logo>
        
        <LoadingText variants={itemVariants}>
          Initializing your financial dashboard...
        </LoadingText>
        
        <motion.div variants={itemVariants}>
          <SpinnerContainer>
            <Spinner
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <Spinner
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <Spinner
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </SpinnerContainer>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </ProgressBar>
        </motion.div>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default LoadingScreen;
