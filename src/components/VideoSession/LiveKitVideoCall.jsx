import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import * as LiveKit from 'livekit-client';
import { useAuth } from '../../contexts/AuthContext';
import { livekitAPI, videoAPI } from '../../api/api';

const LiveKitVideoCall = ({ sessionId, onCallEnd }) => {
  const { user } = useAuth();
  
  // State management
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  
  // Media controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes default
  const [timerActive, setTimerActive] = useState(false);
  
  // Feedback dialog
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    feedback: ''
  });
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const localTracksRef = useRef([]);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleCallEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, timeRemaining]);

  // Connect to LiveKit room
  const connectToRoom = useCallback(async () => {
    try {
      setConnecting(true);
      setError(null);

      // Get token from backend
      const tokenResponse = await livekitAPI.generateToken(sessionId);
      const { token, roomName, wsUrl, callDuration } = tokenResponse.data;

      // Set timer based on call duration
      const durationInSeconds = callDuration * 60;
      setTimeRemaining(durationInSeconds);

      // Create local tracks
      const localTracks = await LiveKit.createLocalTracks({
        audio: true,
        video: { width: 640, height: 480 }
      });
      localTracksRef.current = localTracks;

      // Connect to room
      const roomInstance = new LiveKit.Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event listeners
      roomInstance.on('participantConnected', (participant) => {
        console.log('Participant connected:', participant.identity);
        setParticipants(prev => [...prev, participant]);
        
        // Subscribe to their tracks
        participant.tracks.forEach((trackPublication) => {
          if (trackPublication.track) {
            handleTrackSubscribed(trackPublication.track, participant);
          }
        });
      });

      roomInstance.on('participantDisconnected', (participant) => {
        console.log('Participant disconnected:', participant.identity);
        setParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      });

      roomInstance.on('trackSubscribed', (track, publication, participant) => {
        handleTrackSubscribed(track, participant);
      });

      roomInstance.on('trackUnsubscribed', (track, publication, participant) => {
        handleTrackUnsubscribed(track);
      });

      roomInstance.on('disconnected', () => {
        console.log('Disconnected from room');
        setConnected(false);
        setTimerActive(false);
      });

      // Connect to room
      await roomInstance.connect(wsUrl, token);
      console.log('Connected to room:', roomName);

      // Publish local tracks
      await roomInstance.localParticipant.publishTracks(localTracks);

      // Attach local video
      const videoTrack = localTracks.find(track => track.kind === 'video');
      if (videoTrack && localVideoRef.current) {
        videoTrack.attach(localVideoRef.current);
      }

      setRoom(roomInstance);
      setConnected(true);
      setTimerActive(true);

    } catch (err) {
      console.error('Failed to connect to room:', err);
      setError(err.message || 'Failed to connect to video call');
    } finally {
      setConnecting(false);
    }
  }, [sessionId]);

  // Handle track subscribed
  const handleTrackSubscribed = (track, participant) => {
    if (track.kind === 'video') {
      // For now, attach to remote video ref (can be enhanced for multiple participants)
      if (remoteVideoRef.current) {
        track.attach(remoteVideoRef.current);
      }
    } else if (track.kind === 'audio') {
      track.attach();
    }
  };

  // Handle track unsubscribed
  const handleTrackUnsubscribed = (track) => {
    track.detach();
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (room) {
      const audioTrack = room.localParticipant.getTrack('microphone');
      if (audioTrack) {
        await room.localParticipant.setMicrophoneEnabled(!isMuted);
        setIsMuted(!isMuted);
      }
    }
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (room) {
      const videoTrack = room.localParticipant.getTrack('camera');
      if (videoTrack) {
        await room.localParticipant.setCameraEnabled(!isVideoOff);
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  // Toggle screen share
  const toggleScreenShare = async () => {
    if (room) {
      try {
        if (isScreenSharing) {
          // Stop screen sharing
          await room.localParticipant.setScreenShareEnabled(false);
          setIsScreenSharing(false);
        } else {
          // Start screen sharing
          await room.localParticipant.setScreenShareEnabled(true);
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.error('Error toggling screen share:', err);
        setError('Failed to toggle screen sharing');
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle call end
  const handleCallEnd = async () => {
    try {
      setTimerActive(false);

      // Disconnect from room
      if (room) {
        await room.disconnect();
      }

      // Stop local tracks
      localTracksRef.current.forEach(track => {
        track.stop();
      });

      // Call backend to end the session
      await livekitAPI.endCall(sessionId);

      // Show feedback dialog
      setFeedbackOpen(true);

    } catch (err) {
      console.error('Error ending call:', err);
      setError('Failed to end call properly');
    }
  };

  // Submit feedback
  const handleFeedbackSubmit = async () => {
    try {
      await videoAPI.submitFeedback(sessionId, feedbackForm);
      setFeedbackOpen(false);
      
      // Call parent callback
      if (onCallEnd) {
        onCallEnd();
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback');
    }
  };

  // Connect on component mount
  useEffect(() => {
    connectToRoom();

    // Cleanup on unmount
    return () => {
      setTimerActive(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (room) {
        room.disconnect();
      }
      localTracksRef.current.forEach(track => {
        track.stop();
      });
    };
  }, [connectToRoom]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (connecting) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Connecting to video call...</Typography>
      </Paper>
    );
  }

  if (error && !connected) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={connectToRoom}>
          Retry Connection
        </Button>
      </Paper>
    );
  }

  return (
    <Box ref={containerRef}>
      {/* Header with timer and participant count */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                icon={<TimerIcon />}
                label={formatTime(timeRemaining)}
                color={timeRemaining < 300 ? "error" : "primary"}
                variant="outlined"
              />
              <Chip
                icon={<PersonIcon />}
                label={`${participants.length + 1} participants`}
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid>
            <Typography variant="h6" color="primary">
              Video Session
            </Typography>
          </Grid>
        </Grid>
        
        {/* Timer progress bar */}
        <LinearProgress
          variant="determinate"
          value={(timeRemaining / (15 * 60)) * 100}
          sx={{ mt: 1, height: 4, borderRadius: 2 }}
          color={timeRemaining < 300 ? "error" : "primary"}
        />
      </Paper>

      {/* Video area */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Remote video (main) */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card sx={{ position: 'relative', aspectRatio: '16/9' }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#000'
              }}
            />
            {participants.length === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                <PersonIcon sx={{ fontSize: 64, mb: 1 }} />
                <Typography>Waiting for other participants...</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Local video (picture-in-picture) */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ position: 'relative', aspectRatio: '4/3' }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#000'
              }}
            />
            <Chip
              label="You"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white'
              }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Box display="flex" justifyContent="center" gap={1}>
          {/* Microphone */}
          <Tooltip title={isMuted ? "Unmute" : "Mute"}>
            <IconButton
              onClick={toggleMicrophone}
              color={isMuted ? "error" : "primary"}
              size="large"
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>

          {/* Camera */}
          <Tooltip title={isVideoOff ? "Turn on camera" : "Turn off camera"}>
            <IconButton
              onClick={toggleCamera}
              color={isVideoOff ? "error" : "primary"}
              size="large"
            >
              {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>
          </Tooltip>

          {/* Screen Share */}
          <Tooltip title={isScreenSharing ? "Stop sharing" : "Share screen"}>
            <IconButton
              onClick={toggleScreenShare}
              color={isScreenSharing ? "secondary" : "default"}
              size="large"
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>
          </Tooltip>

          {/* Fullscreen */}
          <Tooltip title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            <IconButton
              onClick={toggleFullscreen}
              color="default"
              size="large"
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>

          {/* End Call */}
          <Tooltip title="End call">
            <IconButton
              onClick={handleCallEnd}
              color="error"
              size="large"
              sx={{ ml: 2 }}
            >
              <CallEndIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Session</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              How was your video session?
            </Typography>
            <Rating
              value={feedbackForm.rating}
              onChange={(_, value) => setFeedbackForm(prev => ({ ...prev, rating: value }))}
              size="large"
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional feedback (optional)"
              value={feedbackForm.feedback}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback: e.target.value }))}
              placeholder="Tell us about your experience..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackOpen(false)}>Skip</Button>
          <Button onClick={handleFeedbackSubmit} variant="contained">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveKitVideoCall;