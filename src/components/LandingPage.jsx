import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Lightbulb as LightbulbIcon,
  RocketLaunch as RocketIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite',
        },
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 800,
              color: 'white',
              background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.025em',
            }}
          >
            Skill Verse
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              sx={{
                color: 'white',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                },
              }}
            >
              Home
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: '1.5px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '1.5px',
                },
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #ffffff, #f1f5f9)',
                color: '#1e293b',
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f8fafc, #e2e8f0)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-1px)',
                },
              }}
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 800,
            color: 'white',
            mb: 3,
            fontSize: { xs: '2.5rem', md: '4rem' },
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          Welcome to{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Skill Verse
          </Box>
        </Typography>
        
        <Typography
          variant="h4"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 6,
            maxWidth: '700px',
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 400,
            lineHeight: 1.4,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Connect with professionals, exchange skills, and accelerate your learning journey in our vibrant community.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            startIcon={<RocketIcon />}
            sx={{
              background: 'linear-gradient(45deg, #ffffff, #f1f5f9)',
              color: '#1e293b',
              borderRadius: 3,
              px: 6,
              py: 2,
              fontSize: '1.125rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f8fafc, #e2e8f0)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Get Started Free
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={handleLearnMore}
            startIcon={<InfoIcon />}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              borderRadius: 3,
              px: 6,
              py: 2,
              fontSize: '1.125rem',
              fontWeight: 600,
              textTransform: 'none',
              borderWidth: '2px',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: '2px',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box
        id="features"
        sx={{
          py: 12,
          px: 2,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: 'white',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              Why Choose Skill Verse?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Discover the features that make Skill Verse the perfect platform for your learning journey
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {/* Find Experts Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                hover
                gradient
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1f2937',
                      mb: 2,
                    }}
                  >
                    Find Experts
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6b7280',
                      lineHeight: 1.6,
                    }}
                  >
                    Connect with professionals in various fields.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Exchange Skills Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'white',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <LightbulbIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1f2937',
                      mb: 2,
                    }}
                  >
                    Exchange Skills
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6b7280',
                      lineHeight: 1.6,
                    }}
                  >
                    Learn and grow through meaningful collaborations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Grow Together Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'white',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <RocketIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1f2937',
                      mb: 2,
                    }}
                  >
                    Grow Together
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6b7280',
                      lineHeight: 1.6,
                    }}
                  >
                    Elevate your career by expanding your knowledge.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 