import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Badge,
  Container,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as EmojiEventsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import theme from './styles/theme';
import './utils/debug'; // Import debug utilities
import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import LandingPage from './components/LandingPage';
import UserProfile from './components/Profile/UserProfile';
import SkillSearch from './components/Matchmaking/SkillSearch';
import MatchesList from './components/Matchmaking/MatchesList';
import MessagingInterface from './components/Messaging/MessagingInterface';
import MessageDebug from './components/Messaging/MessageDebug';
import VideoCall from './components/VideoSession/VideoCall';
import CredentialList from './components/Credentials/CredentialList';
import AdminDashboard from './components/Admin/AdminDashboard';
import WalletConnection from './components/Wallet/WalletConnection';
import ErrorBoundary from './components/common/ErrorBoundary';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Navigation Component
const Navigation = ({ drawerOpen, setDrawerOpen }) => {
  const { user, logout } = useAuth();
  const { showWalletConnection, hideWalletConnection, handleWalletConnect, handleWalletSkip, isConnected, walletAddress, showWalletDialog } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const menuOpen = Boolean(anchorEl);

  const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Find Partners', icon: <SearchIcon />, path: '/search' },
    { text: 'Messages', icon: <MessageIcon />, path: '/chat' },
    { text: 'Video Sessions', icon: <VideoCallIcon />, path: '/video' },
    { text: 'My Credentials', icon: <EmojiEventsIcon />, path: '/credentials' },
    { text: 'My Sessions', icon: <ScheduleIcon />, path: '/matches' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    // Admin navigation item (only show for admin users)
    ...(user?.role === 'admin' ? [{ text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' }] : []),
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={user?.profile?.avatar}
          sx={{ 
            width: 40, 
            height: 40,
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          }}
        >
          {user?.profile?.firstName?.charAt(0) || user?.username?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {user?.profile?.firstName} {user?.profile?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{user?.username}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            key={item.text} 
            sx={{ 
              py: 1,
              bgcolor: isActiveRoute(item.path) ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              cursor: 'pointer',
            }}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Skill Verse
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Wallet Connection Button */}
            <Tooltip title={isConnected ? `Wallet: ${walletAddress?.slice(0, 6)}...` : "Connect Wallet"}>
              <Button
                variant={isConnected ? "contained" : "outlined"}
                size="small"
                onClick={showWalletConnection}
                startIcon={<WalletIcon />}
                sx={{
                  color: isConnected ? 'white' : 'inherit',
                  borderColor: isConnected ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: isConnected ? 'success.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: isConnected ? 'success.dark' : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {isConnected ? 'Connected' : 'Connect Wallet'}
              </Button>
            </Tooltip>
            
            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  src={user?.profile?.avatar}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  }}
                >
                  {user?.profile?.firstName?.charAt(0) || user?.username?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 250, boxSizing: 'border-box' },
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/search" element={<SkillSearch />} />
          <Route path="/matches" element={<MatchesList />} />
          <Route path="/chat" element={<MessagingInterface />} />
          <Route path="/debug" element={<MessageDebug />} />
          <Route path="/video" element={<VideoCall />} />
          <Route path="/video/session/:sessionId" element={<VideoCall />} />
          <Route path="/credentials" element={<CredentialList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={
            user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />
          } />
        </Routes>
      </Box>

      {/* Wallet Connection Dialog */}
      <WalletConnection
        open={showWalletDialog}
        onClose={hideWalletConnection}
        onConnect={handleWalletConnect}
        onSkip={handleWalletSkip}
      />
    </Box>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for dashboard
  const stats = {
    sessionsCompleted: 12,
    skillsTaught: 5,
    skillsLearned: 3,
    rating: 4.8,
    totalHours: 24,
  };

  const recentSessions = [
    { id: 1, title: 'React Fundamentals', partner: 'John Doe', date: '2024-01-15', duration: '2h', type: 'teaching' },
    { id: 2, title: 'Python Data Science', partner: 'Jane Smith', date: '2024-01-14', duration: '1.5h', type: 'learning' },
    { id: 3, title: 'Node.js Backend', partner: 'Mike Johnson', date: '2024-01-12', duration: '3h', type: 'teaching' },
  ];

  const upcomingSessions = [
    { id: 1, title: 'Advanced JavaScript', partner: 'Alice Brown', date: '2024-01-18', time: '14:00' },
    { id: 2, title: 'Machine Learning Basics', partner: 'Bob Wilson', date: '2024-01-20', time: '10:00' },
  ];

  const quickActions = [
    { title: 'Find Learning Partner', icon: <SearchIcon />, color: 'primary', path: '/search' },
    { title: 'Start Video Session', icon: <VideoCallIcon />, color: 'secondary', path: '/video/new' },
    { title: 'View Messages', icon: <MessageIcon />, color: 'info', path: '/chat' },
    { title: 'My Credentials', icon: <EmojiEventsIcon />, color: 'success', path: '/credentials' },
  ];

  return (
    <Container maxWidth="xl">
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {user?.profile?.firstName || user?.username}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ready to learn and teach? Here's what's happening with your skills.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.sessionsCompleted}
                  </Typography>
                  <Typography variant="body2">Sessions Completed</Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalHours}h
                  </Typography>
                  <Typography variant="body2">Total Hours</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.rating}
                  </Typography>
                  <Typography variant="body2">Average Rating</Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.skillsTaught}
                  </Typography>
                  <Typography variant="body2">Skills Taught</Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
        </Grid>
        {quickActions.map((action) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={action.title}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: `${action.color}.main`, mb: 2 }}>
                  {React.cloneElement(action.icon, { sx: { fontSize: 40 } })}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {action.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity & Upcoming Sessions */}
      <Grid container spacing={3}>
        {/* Recent Sessions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Sessions
              </Typography>
              {recentSessions.map((session) => (
                <Box key={session.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {session.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        with {session.partner} • {session.duration}
                      </Typography>
                    </Box>
                    <Chip 
                      label={session.type === 'teaching' ? 'Teaching' : 'Learning'}
                      color={session.type === 'teaching' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Upcoming Sessions
              </Typography>
              {upcomingSessions.map((session) => (
                <Box key={session.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {session.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        with {session.partner} • {session.date} at {session.time}
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate(`/video/session/${session.id}`)}
                    >
                      Join
                    </Button>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

// Settings Component (placeholder)
const Settings = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        Settings
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Manage your account settings and preferences
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Settings coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This page will include account settings, privacy controls, and notification preferences.
        </Typography>
      </Paper>
    </Container>
  );
};

// Main App Component
function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <WalletProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <Navigation drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Router>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 