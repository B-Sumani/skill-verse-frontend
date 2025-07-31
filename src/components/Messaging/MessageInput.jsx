import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Mic as MicIcon,
  Warning as WarningIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { messageAPI } from '../../api/api';

// Content filtering utility (matches backend logic)
const contentFilter = {
  phonePatterns: [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    /\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/g,
    /\b\+?1?[-.\s]?\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  ],
  
  emailPatterns: [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ],
  
  numberWords: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'double', 'triple'],
  
  hasPhoneInWords: (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const numberWordCount = words.filter(word => 
      contentFilter.numberWords.includes(word) || 
      word.includes('double') || 
      word.includes('triple')
    ).length;
    return numberWordCount >= 6;
  },
  
  creditCardPatterns: [
    /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
    /\b\d{13,19}\b/g,
  ],
  
  ssnPatterns: [
    /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
  ],
  
  addressPatterns: [
    /\b\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)\b/gi,
  ],
  
  checkContent: (content) => {
    const violations = [];
    
    // Check phone patterns
    for (const pattern of contentFilter.phonePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          type: 'phone_number',
          message: 'Phone numbers are not allowed for privacy protection',
          matches: matches
        });
        break;
      }
    }
    
    // Check phone in words
    if (contentFilter.hasPhoneInWords(content)) {
      violations.push({
        type: 'phone_number',
        message: 'Phone numbers in words (e.g., "nine nine six...") are not allowed',
        matches: ['Written phone number detected']
      });
    }
    
    // Check email patterns
    for (const pattern of contentFilter.emailPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          type: 'email_address',
          message: 'Email addresses are not allowed for privacy protection',
          matches: matches
        });
        break;
      }
    }
    
    // Check credit card patterns
    for (const pattern of contentFilter.creditCardPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          type: 'credit_card',
          message: 'Credit card numbers are not allowed',
          matches: matches
        });
        break;
      }
    }
    
    // Check SSN patterns
    for (const pattern of contentFilter.ssnPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          type: 'ssn',
          message: 'Social security numbers are not allowed',
          matches: matches
        });
        break;
      }
    }
    
    // Check address patterns
    for (const pattern of contentFilter.addressPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          type: 'address',
          message: 'Street addresses are not allowed for privacy protection',
          matches: matches
        });
        break;
      }
    }
    
    return {
      hasViolations: violations.length > 0,
      violations: violations,
      sanitizedContent: violations.length > 0 ? '[Message contained restricted content]' : content
    };
  }
};

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [contentCheckDialog, setContentCheckDialog] = useState(false);
  const [violations, setViolations] = useState([]);
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [hasViolations, setHasViolations] = useState(false);

  const handleSend = () => {
    if (message && message.trim() && !disabled) {
      // Check content for violations
      const contentCheck = contentFilter.checkContent(message.trim());
      
      if (contentCheck.hasViolations) {
        setViolations(contentCheck.violations);
        setSanitizedContent(contentCheck.sanitizedContent);
        setContentCheckDialog(true);
      } else {
        // No violations, send message normally
        onSendMessage(message.trim());
        setMessage('');
        setHasViolations(false);
      }
    }
  };

  const handleSendSanitized = () => {
    if (sanitizedContent) {
      onSendMessage(sanitizedContent);
      setMessage('');
      setContentCheckDialog(false);
      setNotification({
        open: true,
        message: 'Message sent with restricted content removed',
        severity: 'warning'
      });
    }
  };

  const handleSendOriginal = () => {
    if (message && message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setContentCheckDialog(false);
      setNotification({
        open: true,
        message: 'Message sent (you may need to remove restricted content)',
        severity: 'info'
      });
    }
  };

  const getViolationIcon = (type) => {
    switch (type) {
      case 'phone_number':
        return <PhoneIcon color="error" />;
      case 'email_address':
        return <EmailIcon color="error" />;
      case 'credit_card':
        return <WarningIcon color="error" />;
      case 'ssn':
        return <WarningIcon color="error" />;
      case 'address':
        return <LanguageIcon color="error" />;
      case 'social_media':
        return <PersonIcon color="error" />;
      case 'personal_website':
        return <LanguageIcon color="error" />;
      default:
        return <WarningIcon color="error" />;
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = () => {
    // TODO: Implement file attachment functionality
    console.log('File attachment clicked');
  };

  const handleEmoji = () => {
    // TODO: Implement emoji picker
    console.log('Emoji picker clicked');
  };

  const handleVoiceMessage = () => {
    // TODO: Implement voice message functionality
    console.log('Voice message clicked');
  };

  return (
    <>
      <Paper
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ flex: 1 }}>
                  <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message... (Personal contact info will be filtered)"
          value={message}
          onChange={(e) => {
            const newMessage = e.target.value;
            setMessage(newMessage);
            
            // Real-time content checking
            if (newMessage.trim()) {
              const contentCheck = contentFilter.checkContent(newMessage.trim());
              setHasViolations(contentCheck.hasViolations);
            } else {
              setHasViolations(false);
            }
          }}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                <Tooltip title={hasViolations ? "Restricted content detected" : "Content filtering is active"}>
                  <WarningIcon fontSize="small" color={hasViolations ? "error" : "action"} />
                </Tooltip>
              </Box>
            ),
          }}
        />
        </Box>

        <Box display="flex" gap={0.5}>
          <Tooltip title="Attach file">
            <IconButton
              onClick={handleFileAttach}
              disabled={disabled}
              size="small"
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add emoji">
            <IconButton
              onClick={handleEmoji}
              disabled={disabled}
              size="small"
            >
              <EmojiIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Voice message">
            <IconButton
              onClick={handleVoiceMessage}
              disabled={disabled}
              size="small"
            >
              <MicIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send message">
            <IconButton
              onClick={handleSend}
              disabled={!message || !message.trim() || disabled || hasViolations}
              color="primary"
              size="small"
              sx={{
                backgroundColor: message.trim() && !hasViolations ? 'primary.main' : 'action.disabledBackground',
                color: message.trim() && !hasViolations ? 'white' : 'action.disabled',
                '&:hover': {
                  backgroundColor: message.trim() && !hasViolations ? 'primary.dark' : 'action.disabledBackground',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Content Violation Dialog */}
      <Dialog 
        open={contentCheckDialog} 
        onClose={() => setContentCheckDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="warning" />
            <Typography variant="h6">Restricted Content Detected</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Your message contains personal contact information that is not allowed in Skill Verse messages.
          </Alert>
          
          <Typography variant="h6" gutterBottom>Detected Issues:</Typography>
          <List dense>
            {violations.map((violation, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {getViolationIcon(violation.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={violation.message}
                  secondary={`Found: ${violation.matches.join(', ')}`}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Original Message:</Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2">{message}</Typography>
            </Paper>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Sanitized Message:</Typography>
            <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
              <Typography variant="body2">{sanitizedContent}</Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContentCheckDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendOriginal}
            variant="outlined"
            color="warning"
          >
            Send Original
          </Button>
          <Button 
            onClick={handleSendSanitized}
            variant="contained"
            color="primary"
          >
            Send Sanitized
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
    </>
  );
};

export default MessageInput; 