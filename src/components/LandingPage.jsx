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
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #4c1d95 0%, #1e40af 100%)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Skill-Verse
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Home
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563eb, #1e40af)',
                },
              }}
              onClick={() => navigate('/signup')}
            >
              Register
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
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#1f2937',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Welcome to{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Skill-Verse
          </Box>
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            color: '#374151',
            mb: 4,
            maxWidth: '600px',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
          }}
        >
          A professional platform to exchange skills and grow together.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            startIcon={<RocketIcon />}
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              color: 'white',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            Get Started
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={handleLearnMore}
            startIcon={<InfoIcon />}
            sx={{
              borderColor: '#1f2937',
              color: '#1f2937',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#1f2937',
                backgroundColor: 'rgba(31, 41, 55, 0.05)',
                borderWidth: '2px',
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
          py: 8,
          px: 2,
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {/* Find Experts Card */}
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