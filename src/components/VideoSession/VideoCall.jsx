import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Timer as TimerIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { videoAPI, videoRequestAPI, livekitAPI } from '../../api/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoRequestManager from './VideoRequestManager';
import LiveKitVideoCall from './LiveKitVideoCall';

const VideoCall = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams(); // Get sessionId from URL
  
  // State management
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = Sessions, 1 = Requests
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  
  // Video call state
  const [isInCall, setIsInCall] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  
  // Form states
  const [sessionForm, setSessionForm] = useState({
    participantId: '',
    topic: '',
    description: '',
    skillTaught: '',
    skillLearned: ''
  });
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    feedback: ''
  });
  
  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const timerRef = useRef(null);

  // Load sessions on component mount
  useEffect(() => {
    loadSessions();
    loadPendingRequestsCount();
    
    // If sessionId is provided in URL, automatically start the video call
    if (sessionId) {
      handleDirectVideoCall(sessionId);
    }
  }, [sessionId]);

  const loadPendingRequestsCount = async () => {
    try {
      const response = await videoRequestAPI.getPendingCount();
      setPendingRequestsCount(response.data.count || 0);
    } catch (error) {
      console.error('Error loading pending requests count:', error);
    }
  };

  // Handle URL parameters for joining sessions
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session');
    const createUserId = urlParams.get('create');
    
    if (sessionId) {
      joinSession(sessionId);
      navigate('/video', { replace: true });
    } else if (createUserId) {
      setSessionForm(prev => ({ ...prev, participantId: createUserId }));
      setCreateDialogOpen(true);
      navigate('/video', { replace: true });
    }
  }, [location.search, navigate]);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, timeRemaining]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await videoAPI.getSessions();
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Failed to load video sessions');
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (sessionId) => {
    try {
      const response = await videoAPI.getSession(sessionId);
      setCurrentSession(response.data.session);
      
      if (response.data.session.status === 'pending') {
        setInviteDialogOpen(true);
      } else if (response.data.session.status === 'active') {
        startCall(response.data.session);
      }
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Failed to join session');
    }
  };

  const createSession = async () => {
    try {
      const response = await videoAPI.createSession(sessionForm);
      setCurrentSession(response.data.session);
      setCreateDialogOpen(false);
      setSessionForm({
        participantId: '',
        topic: '',
        description: '',
        skillTaught: '',
        skillLearned: ''
      });
      
      // Navigate to the session
      navigate(`/video?session=${response.data.session.sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create session');
    }
  };

  const startCall = async (session) => {
    try {
      await videoAPI.startSession(session.sessionId);
      setIsInCall(true);
      setActiveSessionId(session.sessionId);
      setCurrentSession(session);
      
      // LiveKit will handle video initialization
    } catch (error) {
      console.error('Error starting call:', error);
      setError('Failed to start call');
    }
  };

  const endCall = async () => {
    try {
      if (activeSessionId) {
        await videoAPI.endSession(activeSessionId);
      }
      
      setIsInCall(false);
      setActiveSessionId(null);
      setCurrentSession(null);
      
      // If we came from a direct session link, go back to video page
      if (sessionId) {
        navigate('/video');
      }
      
      // LiveKit will handle cleanup
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  // Handle direct video call from URL
  const handleDirectVideoCall = async (sessionId) => {
    try {
      setLoading(true);
      
      // Get session details
      const session = await videoAPI.getSession(sessionId);
      if (session.success && session.data.session) {
        setIsInCall(true);
        setActiveSessionId(sessionId);
        setCurrentSession(session.data.session);
        setActiveTab(0); // Switch to sessions tab
      } else {
        setError('Video session not found or expired');
      }
    } catch (error) {
      console.error('Error joining video session:', error);
      setError('Failed to join video session');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    try {
      await videoAPI.acceptSession(currentSession.sessionId);
      setInviteDialogOpen(false);
      startCall(currentSession);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Failed to accept invitation');
    }
  };

  const declineInvitation = async () => {
    try {
      await videoAPI.declineSession(currentSession.sessionId);
      setInviteDialogOpen(false);
      setCurrentSession(null);
      navigate('/video');
    } catch (error) {
      console.error('Error declining invitation:', error);
      setError('Failed to decline invitation');
    }
  };

  const submitFeedback = async () => {
    try {
      await videoAPI.submitFeedback(currentSession.sessionId, feedbackForm);
      setFeedbackDialogOpen(false);
      setFeedbackForm({ rating: 5, feedback: '' });
      loadSessions(); // Refresh sessions
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback');
    }
  };

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setError('Failed to access camera/microphone');
    }
  };

  const stopVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual mute logic
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Implement actual video toggle logic
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Implement screen sharing logic
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Video Sessions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect with other users for 10-minute skill exchange sessions
        </Typography>
      </Box>

      {/* LiveKit Video Call */}
      {isInCall && activeSessionId && (
        <Box sx={{ mb: 3 }}>
          <LiveKitVideoCall
            sessionId={activeSessionId}
            onCallEnd={() => {
              setIsInCall(false);
              setActiveSessionId(null);
              setCurrentSession(null);
              loadSessions(); // Refresh sessions list
            }}
              />
            </Box>
      )}

      {/* Tabs */}
      {!isInCall && (
        <Box sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Video Sessions" />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  Video Requests
                  {pendingRequestsCount > 0 && (
                    <Badge badgeContent={pendingRequestsCount} color="error" />
                  )}
                </Box>
              } 
            />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<VideoCallIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ mr: 2 }}
              >
                Start New Session
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<SettingsIcon />}
                onClick={loadSessions}
              >
                Refresh Sessions
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Content based on active tab */}
      {activeTab === 0 ? (
        /* Sessions List */
        <Grid container spacing={2}>
          {sessions.map((session) => (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={session.sessionId}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {session.topic}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={session.status} 
                      color={getStatusColor(session.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Initiator:</strong> {session.initiator?.profile?.firstName} {session.initiator?.profile?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Participant:</strong> {session.participant?.profile?.firstName} {session.participant?.profile?.lastName}
                    </Typography>
                  </Box>
                  
                  {session.skillTaught && (
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <strong>Teaching:</strong> {session.skillTaught}
                    </Typography>
                  )}
                  
                  {session.skillLearned && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      <strong>Learning:</strong> {session.skillLearned}
                    </Typography>
                  )}
                  
                  <Box display="flex" gap={1}>
                    {session.status === 'pending' && session.participant?._id === user?.id && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => joinSession(session.sessionId)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => declineInvitation()}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    
                    {session.status === 'completed' && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<StarIcon />}
                        onClick={() => {
                          setCurrentSession(session);
                          setFeedbackDialogOpen(true);
                        }}
                      >
                        Rate Session
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Video Requests */
        <VideoRequestManager />
      )}

      {/* Create Session Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Video Session</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Participant ID"
            value={sessionForm.participantId}
            onChange={(e) => setSessionForm({ ...sessionForm, participantId: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Topic"
            value={sessionForm.topic}
            onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={sessionForm.description}
            onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Skill You're Teaching"
            value={sessionForm.skillTaught}
            onChange={(e) => setSessionForm({ ...sessionForm, skillTaught: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Skill You're Learning"
            value={sessionForm.skillLearned}
            onChange={(e) => setSessionForm({ ...sessionForm, skillLearned: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={createSession} variant="contained">Create Session</Button>
        </DialogActions>
      </Dialog>

      {/* Invitation Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
        <DialogTitle>Video Session Invitation</DialogTitle>
        <DialogContent>
          <Typography>
            {currentSession?.initiator?.profile?.firstName} {currentSession?.initiator?.profile?.lastName} 
            wants to start a 10-minute video session.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Topic: {currentSession?.topic}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={declineInvitation} color="error">Decline</Button>
          <Button onClick={acceptInvitation} variant="contained">Accept</Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Session</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Rating:</Typography>
            <Box display="flex" gap={1}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                  color={feedbackForm.rating >= star ? 'primary' : 'default'}
                >
                  <StarIcon />
                </IconButton>
              ))}
            </Box>
          </Box>
          <TextField
            fullWidth
            label="Feedback"
            value={feedbackForm.feedback}
            onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitFeedback} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoCall; 