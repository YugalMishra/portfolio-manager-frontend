import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import AddItem from './components/AddItem';
import Performance from './components/Performance';
import Profile from './components/Profile';

import LoadingScreen from './components/LoadingScreen';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
`;

const BackgroundPattern = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
  animation: float 20s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(1deg); }
  }
`;

const MainContent = styled(motion.main)`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-top: 80px;
`;

const FloatingOrbs = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const Orb = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  backdrop-filter: blur(10px);
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AppContainer>
        <BackgroundPattern />
        
        {/* Floating Orbs Animation */}
        <FloatingOrbs>
          <Orb
            style={{ width: '300px', height: '300px', top: '10%', left: '10%' }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <Orb
            style={{ width: '200px', height: '200px', top: '60%', right: '10%' }}
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <Orb
            style={{ width: '150px', height: '150px', bottom: '20%', left: '20%' }}
            animate={{
              x: [0, 60, 0],
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </FloatingOrbs>

        <Navbar />
        
        <MainContent>
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    key="dashboard"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Dashboard />
                  </motion.div>
                } 
              />
              <Route 
                path="/portfolio" 
                element={
                  <motion.div
                    key="portfolio"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Portfolio />
                  </motion.div>
                } 
              />
              <Route 
                path="/add" 
                element={
                  <motion.div
                    key="add"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <AddItem />
                  </motion.div>
                } 
              />
              <Route 
                path="/performance" 
                element={
                  <motion.div
                    key="performance"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Performance />
                  </motion.div>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <motion.div
                    key="profile"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Profile />
                  </motion.div>
                } 
              />
              
              
            </Routes>
          </AnimatePresence>
        </MainContent>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#333',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </AppContainer>
    </Router>
  );
}

export default App;
