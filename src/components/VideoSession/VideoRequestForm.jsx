import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Chip,
  Grid,
  FormHelperText,
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';
import { videoRequestAPI } from '../../api/api';

const VideoRequestForm = ({ open, onClose, recipient, onSuccess }) => {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    skillTaught: '',
    skillLearned: '',
    preferredDate: '',
    preferredTime: '',
    priority: 'medium',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      setError('Topic is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Combine date and time if both are provided
      let preferredTime = null;
      if (formData.preferredDate && formData.preferredTime) {
        const dateTimeString = `${formData.preferredDate}T${formData.preferredTime}`;
        preferredTime = new Date(dateTimeString).toISOString();
      }

      // Check for either _id or id field (different data sources use different formats)
      const recipientId = recipient?._id || recipient?.id;
      
      if (!recipient || !recipientId) {
        setError('Recipient information is missing. Please try again.');
        return;
      }

      const requestData = {
        recipientId: recipientId,
        topic: formData.topic,
        description: formData.description,
        skillTaught: formData.skillTaught,
        skillLearned: formData.skillLearned,
        preferredTime: preferredTime,
        priority: formData.priority,
        message: formData.message
      };

      const response = await videoRequestAPI.sendRequest(requestData);

      if (response.success) {
        onSuccess?.(response.data.videoRequest);
        handleClose();
      }
    } catch (error) {
      console.error('Error sending video request:', error);
      setError(error.response?.data?.message || 'Failed to send video request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      topic: '',
      description: '',
      skillTaught: '',
      skillLearned: '',
      preferredDate: '',
      preferredTime: '',
      priority: 'medium',
      message: ''
    });
    setError(null);
    onClose();
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

  const getPriorityIcon = (priority) => {
    if (priority === 'urgent' || priority === 'high') {
      return <PriorityHighIcon fontSize="small" />;
    }
    return null;
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <VideoCallIcon color="primary" />
          <Typography variant="h6">
            Send Video Session Request
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Request a 10-minute video session with {recipient?.profile?.firstName || recipient?.username}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Recipient Info */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recipient
                </Typography>
                <Typography variant="body1">
                  {recipient?.profile?.firstName} {recipient?.profile?.lastName} (@{recipient?.username})
                </Typography>
                <Chip 
                  label={recipient?.isOnline ? 'Online' : 'Offline'} 
                  color={recipient?.isOnline ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>

            {/* Topic */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Session Topic *"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                helperText="What would you like to discuss or learn?"
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                helperText="Provide more details about the session"
              />
            </Grid>

            {/* Skills */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Skill You're Teaching"
                value={formData.skillTaught}
                onChange={(e) => setFormData({ ...formData, skillTaught: e.target.value })}
                helperText="What skill can you share?"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Skill You're Learning"
                value={formData.skillLearned}
                onChange={(e) => setFormData({ ...formData, skillLearned: e.target.value })}
                helperText="What skill do you want to learn?"
              />
            </Grid>

            {/* Priority */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="low">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label="Low" color="success" size="small" />
                      <Typography>Low Priority</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label="Medium" color="info" size="small" />
                      <Typography>Medium Priority</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label="High" color="warning" size="small" />
                      <Typography>High Priority</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="urgent">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip label="Urgent" color="error" size="small" />
                      <Typography>Urgent</Typography>
                    </Box>
                  </MenuItem>
                </Select>
                <FormHelperText>
                  Higher priority requests get faster responses
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Preferred Date */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Preferred Date (Optional)"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                inputProps={{ min: getMinDate() }}
                helperText="When would you prefer to have the session?"
              />
            </Grid>

            {/* Preferred Time */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="time"
                label="Preferred Time (Optional)"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                helperText="What time works best for you?"
              />
            </Grid>

            {/* Message */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Personal Message (Optional)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                multiline
                rows={2}
                helperText="Add a personal note to your request"
              />
            </Grid>

            {/* Info Box */}
            <Grid size={{ xs: 12 }}>
              <Alert severity="info" icon={<ScheduleIcon />}>
                <Typography variant="body2">
                  <strong>How it works:</strong> Your request will be sent to {recipient?.profile?.firstName || recipient?.username}. 
                  They'll receive a notification and can accept, decline, or schedule the session for later. 
                  Sessions are limited to 10 minutes.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<VideoCallIcon />}
            disabled={loading || !formData.topic.trim()}
          >
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VideoRequestForm; 