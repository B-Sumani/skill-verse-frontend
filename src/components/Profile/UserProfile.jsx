import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Skeleton,
  Alert,
  Badge,
  Tabs,
  Tab,
  Snackbar,
  Fade,
  Zoom,
  Grow,
  Slide,
  Fab,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  LinkedIn as LinkedInIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as EmojiEventsIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../api/api';
import useSocket from '../../hooks/useSocket';
import EditProfile from './EditProfile';
import CredentialList from '../Credentials/CredentialList';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('online');
  const [lastSeen, setLastSeen] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [isProfileViewed, setIsProfileViewed] = useState(false);

  // Real-time features
  const { socket, isConnected } = useSocket();
  const refreshIntervalRef = useRef(null);
  const lastUpdateRef = useRef(null);

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === currentUser?.id || userId === currentUser?.username;
  const targetUserId = isOwnProfile ? currentUser?.id : userId;

  // Real-time data fetching
  const fetchProfile = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      let response;
      if (isOwnProfile) {
        response = await userAPI.getProfile();
      } else {
        response = await userAPI.getOtherUserProfile(targetUserId);
      }
      
      const updatedProfile = response.data.user;
      setProfile(updatedProfile);
      lastUpdateRef.current = new Date();

      // Track profile view if viewing another user's profile
      if (!isOwnProfile && !isProfileViewed) {
        trackProfileView(targetUserId);
        setIsProfileViewed(true);
      }

      // Update view count in real-time
      if (updatedProfile.viewCount !== undefined) {
        setViewCount(updatedProfile.viewCount);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  // Track profile view
  const trackProfileView = async (viewedUserId) => {
    try {
      await userAPI.trackProfileView(viewedUserId);
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  };

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for profile updates
    socket.on('profile:updated', (data) => {
      if (data.userId === targetUserId) {
        setProfile(prev => ({ ...prev, ...data.updates }));
        showNotificationMessage('Profile updated in real-time!', 'info');
      }
    });

    // Listen for new messages
    socket.on('message:new', (data) => {
      if (data.recipientId === currentUser?.id) {
        showNotificationMessage(`New message from ${data.senderName}`, 'info');
        setNotifications(prev => [...prev, data]);
      }
    });

    // Listen for session requests
    socket.on('session:request', (data) => {
      if (data.recipientId === currentUser?.id) {
        showNotificationMessage(`Session request from ${data.senderName}`, 'warning');
        setNotifications(prev => [...prev, data]);
      }
    });

    // Listen for credential updates
    socket.on('credential:new', (data) => {
      if (data.userId === targetUserId) {
        showNotificationMessage('New credential earned!', 'success');
      }
    });

    // Listen for online status changes
    socket.on('user:status', (data) => {
      if (data.userId === targetUserId) {
        setOnlineStatus(data.status);
        setLastSeen(data.lastSeen);
      }
    });

    // Join user's room for real-time updates
    socket.emit('join:user', { userId: targetUserId });

    return () => {
      socket.off('profile:updated');
      socket.off('message:new');
      socket.off('session:request');
      socket.off('credential:new');
      socket.off('user:status');
      socket.emit('leave:user', { userId: targetUserId });
    };
  }, [socket, isConnected, targetUserId, currentUser?.id]);

  // Auto-refresh profile data
  useEffect(() => {
    if (isOwnProfile) {
      // Refresh own profile every 30 seconds
      refreshIntervalRef.current = setInterval(() => {
        fetchProfile(false);
      }, 30000);
    } else {
      // Refresh other user's profile every 60 seconds
      refreshIntervalRef.current = setInterval(() => {
        fetchProfile(false);
      }, 60000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isOwnProfile, targetUserId]);

  // Initial profile fetch
  useEffect(() => {
    if (currentUser || !isOwnProfile) {
      fetchProfile();
    }
  }, [targetUserId, isOwnProfile, currentUser]);

  // Manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile(false);
  };

  // Show notification message
  const showNotificationMessage = (message, severity = 'info') => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  // Handle edit profile
  const handleEditProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    updateUser(updatedProfile);
    setEditDialogOpen(false);
    showNotificationMessage('Profile updated successfully!', 'success');
  };

  // Handle contact user
  const handleContactUser = () => {
    navigate(`/chat?user=${profile?.id}`);
  };

  // Handle start session
  const handleStartSession = () => {
    navigate(`/video/new?user=${profile?.id}`);
  };

  // Handle block user
  const handleBlockUser = () => {
    // TODO: Implement block user functionality
    console.log('Block user:', profile?.id);
    showNotificationMessage('User blocked successfully', 'info');
  };

  // Get online status color
  const getOnlineStatusColor = () => {
    switch (onlineStatus) {
      case 'online': return 'success';
      case 'away': return 'warning';
      case 'busy': return 'error';
      default: return 'default';
    }
  };

  // Format last seen
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const now = new Date();
    const lastSeenDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderProfileHeader = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={3}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box sx={{ position: 'relative' }}>
                  {profile?.verified && (
                    <VerifiedIcon sx={{ fontSize: 20, color: 'success.main' }} />
                  )}
                  {!isOwnProfile && (
                    <Chip
                      label={onlineStatus}
                      size="small"
                      color={getOnlineStatusColor()}
                      sx={{ 
                        position: 'absolute', 
                        top: -30, 
                        right: -30,
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                  )}
                </Box>
              }
            >
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: '3rem',
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                }}
                src={profile?.profile?.avatar}
              >
                {profile?.profile?.firstName?.charAt(0) || profile?.username?.charAt(0)}
              </Avatar>
            </Badge>
            
            <Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {profile?.profile?.firstName} {profile?.profile?.lastName}
                </Typography>
                {!isOwnProfile && (
                  <Chip
                    icon={<VisibilityIcon />}
                    label={`${viewCount} views`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Typography variant="h6" color="text.secondary" gutterBottom>
                @{profile?.username}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Member since {new Date(profile?.createdAt).toLocaleDateString()}
              </Typography>

              {!isOwnProfile && lastSeen && (
                <Typography variant="body2" color="text.secondary">
                  Last seen {formatLastSeen(lastSeen)}
                </Typography>
              )}
              
              {profile?.profile?.bio && (
                <Typography variant="body1" sx={{ mt: 2, maxWidth: 600 }}>
                  {profile.profile.bio}
                </Typography>
              )}

              {profile?.rating && (
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <StarIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    {profile.rating} rating • {profile.sessionsCompleted || 0} sessions
                  </Typography>
                </Box>
              )}

              {/* Real-time connection status */}
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: isConnected ? 'success.main' : 'error.main',
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {isConnected ? 'Live updates enabled' : 'Offline mode'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            {isOwnProfile ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                  },
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<MessageIcon />}
                  onClick={handleContactUser}
                >
                  Message
                </Button>
                <Button
                  variant="contained"
                  startIcon={<VideoCallIcon />}
                  onClick={handleStartSession}
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                    },
                  }}
                >
                  Start Session
                </Button>
                <IconButton
                  color="error"
                  onClick={handleBlockUser}
                  title="Block User"
                >
                  <BlockIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSkillsSection = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
            <SchoolIcon color="primary" />
            Skills I Can Teach
          </Typography>
          <Box sx={{ mt: 2 }}>
            {profile?.profile?.skills?.length > 0 ? (
              profile.profile.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No skills listed yet
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
            <WorkIcon color="secondary" />
            Skills I Want to Learn
          </Typography>
          <Box sx={{ mt: 2 }}>
            {profile?.profile?.interests?.length > 0 ? (
              profile.profile.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  color="secondary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No learning interests listed yet
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderContactInfo = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contact Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1">
            {profile?.email}
          </Typography>
        </Grid>
        {profile?.profile?.linkedin && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              LinkedIn
            </Typography>
            <Button
              startIcon={<LinkedInIcon />}
              href={profile.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none' }}
            >
              View Profile
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );

  const renderBlockchainInfo = () => (
    profile?.algorandAddress && (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Blockchain Wallet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Algorand Address
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'monospace', 
            wordBreak: 'break-all',
            background: '#f5f5f5',
            p: 1,
            borderRadius: 1,
          }}
        >
          {profile.algorandAddress}
        </Typography>
      </Paper>
    )
  );

  const renderCredentials = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Digital Credentials (NFTs)
      </Typography>
      <CredentialList userId={profile?.id} />
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Profile not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {renderProfileHeader()}

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Credentials" />
      </Tabs>

      {activeTab === 0 && (
        <>
          {renderSkillsSection()}
          {renderContactInfo()}
          {renderBlockchainInfo()}
        </>
      )}

      {activeTab === 1 && (
        renderCredentials()
      )}

      {/* Refresh FAB */}
      <Tooltip title="Refresh Profile">
        <Fab
          color="primary"
          size="small"
          onClick={handleRefresh}
          disabled={refreshing}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
            },
          }}
        >
          {refreshing ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <RefreshIcon />
          )}
        </Fab>
      </Tooltip>

      {/* Real-time Notification */}
      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={() => setShowNotification(false)} 
          severity="info"
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <EditProfile
            profile={profile}
            onSave={handleEditProfile}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserProfile; 