import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as AcceptIcon,
  Cancel as DeclineIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Message as MessageIcon,
  Star as StarIcon,
  PriorityHigh as PriorityIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { videoRequestAPI } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

const VideoRequestManager = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseType, setResponseType] = useState(''); // 'accept', 'decline', 'schedule'
  const [responseMessage, setResponseMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await videoRequestAPI.getRequests({ type: 'received' });
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      setError('Failed to load video requests');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async () => {
    if (!selectedRequest) return;

    try {
      setResponding(true);
      let response;

      switch (responseType) {
        case 'accept':
          response = await videoRequestAPI.acceptRequest(selectedRequest.requestId, {
            message: responseMessage
          });
          
          // Immediately redirect to the video call
          if (response.success && response.data.videoSession) {
            setResponseDialogOpen(false);
            window.location.href = `/video/session/${response.data.videoSession.sessionId}`;
            return;
          }
          break;
        case 'decline':
          response = await videoRequestAPI.declineRequest(selectedRequest.requestId, {
            message: responseMessage
          });
          break;
        case 'schedule':
          if (!scheduledTime) {
            setError('Please select a scheduled time');
            return;
          }
          response = await videoRequestAPI.scheduleRequest(selectedRequest.requestId, {
            scheduledTime: new Date(scheduledTime).toISOString(),
            message: responseMessage
          });
          break;
        default:
          return;
      }

      if (response.success) {
        setResponseDialogOpen(false);
        setSelectedRequest(null);
        setResponseMessage('');
        setScheduledTime('');
        loadRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      setError(error.response?.data?.message || 'Failed to respond to request');
    } finally {
      setResponding(false);
    }
  };

  const openResponseDialog = (request, type) => {
    setSelectedRequest(request);
    setResponseType(type);
    setResponseDialogOpen(true);
    setResponseMessage('');
    setScheduledTime('');
    setError(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'declined': return 'error';
      case 'scheduled': return 'info';
      case 'expired': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Video Session Requests
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage incoming video session requests from other users
      </Typography>

      {requests.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <VideoCallIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Video Requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You don't have any pending video session requests at the moment.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {requests.map((request) => (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={request.requestId}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {request.topic}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.description}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Chip 
                        label={request.status} 
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                      <Chip 
                        label={request.priority} 
                        color={getPriorityColor(request.priority)}
                        size="small"
                        icon={request.priority === 'high' || request.priority === 'urgent' ? <PriorityIcon /> : undefined}
                      />
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>From:</strong> {request.requester?.profile?.firstName} {request.requester?.profile?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Requested:</strong> {formatDate(request.createdAt)}
                    </Typography>
                  </Box>

                  {request.skillTaught && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <SchoolIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        <strong>Teaching:</strong> {request.skillTaught}
                      </Typography>
                    </Box>
                  )}

                  {request.skillLearned && (
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <WorkIcon fontSize="small" color="secondary" />
                      <Typography variant="body2">
                        <strong>Learning:</strong> {request.skillLearned}
                      </Typography>
                    </Box>
                  )}

                  {request.preferredTime && (
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Preferred:</strong> {formatDate(request.preferredTime)}
                      </Typography>
                    </Box>
                  )}

                  {request.message && (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Message:</strong> {request.message}
                      </Typography>
                    </Box>
                  )}

                  {request.status === 'pending' && (
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<AcceptIcon />}
                        onClick={() => openResponseDialog(request, 'accept')}
                        color="success"
                        sx={{ 
                          bgcolor: 'success.main',
                          '&:hover': { bgcolor: 'success.dark' },
                          fontWeight: 'bold'
                        }}
                      >
                        🎥 Accept & Start 15min Call
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        onClick={() => openResponseDialog(request, 'schedule')}
                        color="info"
                      >
                        Schedule
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeclineIcon />}
                        onClick={() => openResponseDialog(request, 'decline')}
                        color="error"
                      >
                        Decline
                      </Button>
                    </Box>
                  )}

                  {request.status === 'scheduled' && request.scheduledTime && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="info.main">
                        <strong>Scheduled for:</strong> {formatDate(request.scheduledTime)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onClose={() => setResponseDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {responseType === 'accept' && 'Accept Video Request'}
          {responseType === 'decline' && 'Decline Video Request'}
          {responseType === 'schedule' && 'Schedule Video Request'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {selectedRequest && (
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Request from: {selectedRequest.requester?.profile?.firstName} {selectedRequest.requester?.profile?.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Topic:</strong> {selectedRequest.topic}
              </Typography>
              {selectedRequest.description && (
                <Typography variant="body2" color="text.secondary">
                  {selectedRequest.description}
                </Typography>
              )}
            </Box>
          )}

          {responseType === 'schedule' && (
            <TextField
              fullWidth
              type="datetime-local"
              label="Scheduled Time *"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              margin="normal"
              required
              inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              helperText="When would you like to have this session?"
            />
          )}

          <TextField
            fullWidth
            label="Response Message (Optional)"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            multiline
            rows={3}
            margin="normal"
            helperText={
              responseType === 'accept' ? "Add a message to the requester" :
              responseType === 'decline' ? "Let them know why you're declining" :
              "Add a note about the scheduled time"
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)} disabled={responding}>
            Cancel
          </Button>
          <Button
            onClick={handleResponse}
            variant="contained"
            disabled={responding || (responseType === 'schedule' && !scheduledTime)}
            color={
              responseType === 'accept' ? 'success' :
              responseType === 'decline' ? 'error' :
              'info'
            }
          >
            {responding ? 'Processing...' : 
              responseType === 'accept' ? 'Accept Request' :
              responseType === 'decline' ? 'Decline Request' :
              'Schedule Session'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoRequestManager; 