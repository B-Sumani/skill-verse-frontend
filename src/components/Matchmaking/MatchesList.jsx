import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Grid,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
  Badge,
  Skeleton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  IconButton,
  Tooltip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
  Videocam as VideocamIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { sessionAPI, userAPI } from '../../api/api';
import useSocket from '../../hooks/useSocket';

const MatchesList = () => {
  const { user: currentUser } = useAuth();
  const { socket, isConnected, acceptSession, declineSession } = useSocket();
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responding, setResponding] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Mock data for demonstration
  const mockSessions = [
    {
      id: 1,
      type: 'skill_exchange',
      status: 'scheduled',
      title: 'React Fundamentals Exchange',
      partner: {
        id: 'user1',
        name: 'John Doe',
        avatar: null,
        rating: 4.8,
        skills: ['React', 'JavaScript', 'Node.js'],
      },
      skillsOffered: ['Python', 'Data Science'],
      skillsWanted: ['React', 'JavaScript'],
      scheduledDate: '2024-01-20T14:00:00Z',
      duration: 120,
      message: 'I\'d love to learn React from you while teaching you Python!',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      type: 'skill_exchange',
      status: 'completed',
      title: 'Python Data Science Session',
      partner: {
        id: 'user2',
        name: 'Jane Smith',
        avatar: null,
        rating: 4.9,
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
      },
      skillsOffered: ['JavaScript', 'Web Development'],
      skillsWanted: ['Python', 'Data Science'],
      scheduledDate: '2024-01-18T10:00:00Z',
      duration: 90,
      message: 'Great session! Learned a lot about data visualization.',
      createdAt: '2024-01-10T09:15:00Z',
      completedAt: '2024-01-18T11:30:00Z',
      rating: 5,
      feedback: 'Excellent teacher, very patient and knowledgeable.',
    },
  ];

  const mockRequests = [
    {
      id: 3,
      type: 'skill_exchange',
      status: 'pending',
      title: 'JavaScript Advanced Concepts',
      partner: {
        id: 'user3',
        name: 'Mike Johnson',
        avatar: null,
        rating: 4.7,
        skills: ['JavaScript', 'TypeScript', 'React'],
      },
      skillsOffered: ['Python', 'Backend Development'],
      skillsWanted: ['JavaScript', 'Frontend Development'],
      message: 'I\'m looking to improve my JavaScript skills. Can you help?',
      createdAt: '2024-01-19T16:45:00Z',
    },
  ];

  const mockInvitations = [
    {
      id: 4,
      type: 'skill_exchange',
      status: 'pending',
      title: 'Machine Learning Basics',
      partner: {
        id: 'user4',
        name: 'Alice Brown',
        avatar: null,
        rating: 4.6,
        skills: ['Machine Learning', 'Python', 'Statistics'],
      },
      skillsOffered: ['Web Development', 'React'],
      skillsWanted: ['Machine Learning', 'Data Science'],
      message: 'Would you be interested in a skill exchange session?',
      createdAt: '2024-01-19T14:20:00Z',
    },
  ];

  // Fetch sessions and requests
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API calls
      // const response = await sessionAPI.getSessions();
      // setSessions(response.data.sessions);
      
      // Using mock data for now
      setSessions(mockSessions);
      setRequests(mockRequests);
      setInvitations(mockInvitations);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  // Accept session request
  const handleAcceptRequest = async (requestId) => {
    try {
      setResponding(true);
      
      // Send via WebSocket if connected
      if (isConnected) {
        acceptSession(requestId);
      }

      // Also send via API
      await sessionAPI.acceptSession(requestId);

      setNotification({
        open: true,
        message: 'Session request accepted!',
        severity: 'success'
      });
      
      // Refresh data
      fetchSessions();
    } catch (error) {
      console.error('Error accepting request:', error);
      setNotification({
        open: true,
        message: 'Failed to accept request. Please try again.',
        severity: 'error'
      });
    } finally {
      setResponding(false);
      setResponseDialogOpen(false);
    }
  };

  // Decline session request
  const handleDeclineRequest = async (requestId) => {
    try {
      setResponding(true);
      
      // Send via WebSocket if connected
      if (isConnected) {
        declineSession(requestId);
      }

      // Also send via API
      await sessionAPI.declineSession(requestId);

      setNotification({
        open: true,
        message: 'Session request declined.',
        severity: 'info'
      });
      
      // Refresh data
      fetchSessions();
    } catch (error) {
      console.error('Error declining request:', error);
      setNotification({
        open: true,
        message: 'Failed to decline request. Please try again.',
        severity: 'error'
      });
    } finally {
      setResponding(false);
      setResponseDialogOpen(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <ScheduleIcon />;
      case 'completed': return <CheckCircleIcon />;
      case 'pending': return <PendingIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate time until session
  const getTimeUntilSession = (dateString) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffInMinutes = Math.floor((sessionDate - now) / (1000 * 60));
    
    if (diffInMinutes < 0) return 'Past';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Render session card
  const renderSessionCard = (session) => {
    const isUpcoming = session.status === 'scheduled' && new Date(session.scheduledDate) > new Date();
    const timeUntil = getTimeUntilSession(session.scheduledDate);
    
    return (
      <Card key={session.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={session.partner.avatar}
                sx={{ 
                  width: 50, 
                  height: 50,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                }}
              >
                {session.partner.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {session.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  with {session.partner.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={session.partner.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({session.partner.rating})
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Chip
                icon={getStatusIcon(session.status)}
                label={session.status}
                color={getStatusColor(session.status)}
                size="small"
              />
              {isUpcoming && (
                <Chip
                  icon={<TimerIcon />}
                  label={`${timeUntil} away`}
                  variant="outlined"
                  size="small"
                  color="primary"
                />
              )}
            </Box>
          </Box>

          {/* Skills Exchange */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  You'll Learn
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {session.skillsWanted.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
                              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  You'll Teach
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {session.skillsOffered.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Session Details */}
          <Box display="flex" alignItems="center" gap={3} mb={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(session.scheduledDate)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <TimerIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {session.duration} minutes
              </Typography>
            </Box>
          </Box>

          {/* Message */}
          {session.message && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              "{session.message}"
            </Typography>
          )}

          {/* Rating and Feedback for completed sessions */}
          {session.status === 'completed' && session.rating && (
            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Your rating:
                </Typography>
                <Rating value={session.rating} readOnly size="small" />
              </Box>
              {session.feedback && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  "{session.feedback}"
                </Typography>
              )}
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MessageIcon />}
            onClick={() => window.location.href = `/chat?user=${session.partner.id}`}
          >
            Message
          </Button>
          
          {session.status === 'scheduled' && isUpcoming && (
            <Button
              variant="contained"
              size="small"
              startIcon={<VideocamIcon />}
              onClick={() => window.location.href = `/video/session/${session.id}`}
              sx={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                },
              }}
            >
              Join Session
            </Button>
          )}
          
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setSelectedSession(session);
              setSessionDetailsOpen(true);
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    );
  };

  // Render request/invitation card
  const renderRequestCard = (request) => {
    return (
      <Card key={request.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={request.partner.avatar}
                sx={{ 
                  width: 50, 
                  height: 50,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                }}
              >
                {request.partner.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {request.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  from {request.partner.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={request.partner.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({request.partner.rating})
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Chip
              icon={getStatusIcon(request.status)}
              label={request.status}
              color={getStatusColor(request.status)}
              size="small"
            />
          </Box>

          {/* Skills Exchange */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  They want to learn
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {request.skillsWanted.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
                              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  They can teach you
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {request.skillsOffered.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Message */}
          {request.message && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              "{request.message}"
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary">
            Received {formatDate(request.createdAt)}
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MessageIcon />}
            onClick={() => window.location.href = `/chat?user=${request.partner.id}`}
          >
            Message
          </Button>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleAcceptRequest(request.id)}
            disabled={responding}
            sx={{
              background: 'linear-gradient(45deg, #4caf50, #45a049)',
              '&:hover': {
                background: 'linear-gradient(45deg, #45a049, #3d8b40)',
              },
            }}
          >
            Accept
          </Button>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<CancelIcon />}
            onClick={() => handleDeclineRequest(request.id)}
            disabled={responding}
            color="error"
          >
            Decline
          </Button>
        </CardActions>
      </Card>
    );
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Sessions & Requests
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your skill exchange sessions, requests, and invitations
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Badge badgeContent={sessions.filter(s => s.status === 'scheduled').length} color="primary">
                Scheduled Sessions
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={requests.length} color="warning">
                Pending Requests
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={invitations.length} color="info">
                Invitations
              </Badge>
            } 
          />
          <Tab label="Completed Sessions" />
        </Tabs>
      </Paper>

      {/* Content */}
      <Box>
        {loading ? (
          <Box>
            {[...Array(3)].map((_, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Skeleton variant="rectangular" height={200} />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Scheduled Sessions ({sessions.filter(s => s.status === 'scheduled').length})
                </Typography>
                {sessions.filter(s => s.status === 'scheduled').length > 0 ? (
                  sessions.filter(s => s.status === 'scheduled').map(renderSessionCard)
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No scheduled sessions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Start by searching for skill partners or accepting session requests
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => window.location.href = '/search'}
                      sx={{ mt: 2 }}
                    >
                      Find Partners
                    </Button>
                  </Paper>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Pending Requests ({requests.length})
                </Typography>
                {requests.length > 0 ? (
                  requests.map(renderRequestCard)
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No pending requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When you send skill exchange requests, they'll appear here
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Session Invitations ({invitations.length})
                </Typography>
                {invitations.length > 0 ? (
                  invitations.map(renderRequestCard)
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No invitations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When other users send you session invitations, they'll appear here
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Completed Sessions ({sessions.filter(s => s.status === 'completed').length})
                </Typography>
                {sessions.filter(s => s.status === 'completed').length > 0 ? (
                  sessions.filter(s => s.status === 'completed').map(renderSessionCard)
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No completed sessions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your completed skill exchange sessions will appear here
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Session Details Dialog */}
      <Dialog
        open={sessionDetailsOpen}
        onClose={() => setSessionDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Session Details
          {selectedSession && (
            <Typography variant="body2" color="text.secondary">
              {selectedSession.title}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedSession && (
            <Timeline>
              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedSession.createdAt)}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6">Session Requested</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Skill exchange request was sent
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              
              {selectedSession.status === 'scheduled' && (
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(selectedSession.scheduledDate)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="success" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">Session Scheduled</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Session scheduled for {formatDate(selectedSession.scheduledDate)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
              
              {selectedSession.status === 'completed' && (
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(selectedSession.completedAt)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="success" />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">Session Completed</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Session completed successfully
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
            </Timeline>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MatchesList; 