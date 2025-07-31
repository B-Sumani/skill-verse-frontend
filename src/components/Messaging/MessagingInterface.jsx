import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { messageAPI, userAPI } from '../../api/api';
import ChatWindow from './ChatWindow';
import useSocket from '../../hooks/useSocket';

const MessagingInterface = () => {
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  // Listen for incoming messages to update conversation list
  useEffect(() => {
    if (!socket) return;
    
    const handleIncomingMessage = (data) => {
      console.log('📨 New message received, refreshing conversations:', data);
      loadConversations(); // Refresh conversation list when new messages arrive
    };
    
    socket.on('message:received', handleIncomingMessage);
    
    return () => {
      socket.off('message:received', handleIncomingMessage);
    };
  }, [socket]);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle URL parameters for starting new conversations
  useEffect(() => {
    const handleUrlParams = async () => {
      const urlParams = new URLSearchParams(location.search);
      const userId = urlParams.get('user');
      
      if (userId) {
        // Check if conversation already exists
        const existingConversation = conversations.find(conv => conv._id === userId);
        
        if (existingConversation) {
          setSelectedConversation(existingConversation);
        } else {
          // Create a new conversation object for the user
          // Fetch user details first
          try {
            const userResponse = await userAPI.getOtherUserProfile(userId);
            const newConversation = {
              _id: userId,
              user: userResponse.user || { _id: userId, username: 'Unknown User' },
              lastMessage: null,
              unreadCount: 0
            };
            setSelectedConversation(newConversation);
          } catch (error) {
            console.error('Error fetching user details:', error);
            // Fallback to placeholder
            const newConversation = {
              _id: userId,
              user: { _id: userId, username: 'Unknown User' },
              lastMessage: null,
              unreadCount: 0
            };
            setSelectedConversation(newConversation);
          }
        }
        
        // Clear the URL parameter
        navigate('/chat', { replace: true });
      }
    };

    handleUrlParams();
  }, [location.search, conversations, navigate]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('Fetching conversations...');
      console.log('Current user:', user);
      console.log('Token exists:', !!token);
      console.log('Token from localStorage:', !!localStorage.getItem('token'));
      
      const response = await messageAPI.getConversations();
      console.log('Conversations response:', response);
      console.log('API Response:', response);
      
      if (!response) {
        throw new Error('No response from API');
      }
      
      if (!response.conversations) {
        console.log('No conversations found, setting empty array');
        setConversations([]);
        return;
      }
      
      console.log('Loaded conversations:', response.conversations);
      setConversations(response.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      setError(`Failed to load conversations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    // Mark messages as read
    if (conversation.unreadCount > 0) {
      messageAPI.markAsRead(conversation._id);
    }
  };

  const handleSendMessage = async (messageContent) => {
    if (!selectedConversation || !messageContent || !messageContent.trim()) return;

    try {
      console.log('Sending message to:', selectedConversation._id);
      console.log('Message content:', messageContent);
      
      // Send message
      const response = await messageAPI.sendMessage({
        receiverId: selectedConversation._id,
        content: messageContent,
        type: 'text'
      });
      
      console.log('Message sent successfully:', response);
      
      // Reload conversations to update the list
      await loadConversations();
      
      console.log('Message sent successfully:', response);

      // Reload conversations to update last message
      console.log('Reloading conversations...');
      await loadConversations();
      console.log('Conversations reloaded');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const userName = conversation.user?.username || '';
    const firstName = conversation.user?.profile?.firstName || '';
    const lastName = conversation.user?.profile?.lastName || '';
    
    return userName.toLowerCase().includes(searchLower) ||
           firstName.toLowerCase().includes(searchLower) ||
           lastName.toLowerCase().includes(searchLower);
  });

  const formatLastMessage = (conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const content = conversation.lastMessage.content;
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  const formatLastMessageTime = (conversation) => {
    if (!conversation.lastMessage?.timestamp) return '';
    
    const messageTime = new Date(conversation.lastMessage.timestamp);
    const now = new Date();
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return messageTime.toLocaleDateString();
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
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex' }}>
      {/* Conversations List */}
      <Paper sx={{ width: 350, borderRight: 1, borderColor: 'divider' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">
              Messages
            </Typography>
            <IconButton 
              size="small" 
              onClick={loadConversations}
              title="Refresh conversations"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Conversations */}
        <Box sx={{ height: 'calc(100% - 100px)', overflow: 'auto' }}>
          {filteredConversations.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Start a conversation by messaging someone from Find Partners
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/search')}
                size="small"
                sx={{ mb: 2 }}
              >
                Find People to Chat With
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Debug: {conversations.length} total conversations loaded
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredConversations.map((conversation, index) => (
                <React.Fragment key={conversation._id}>
                  <ListItem
                    button
                    selected={selectedConversation?._id === conversation._id}
                    onClick={() => handleConversationSelect(conversation)}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      '&.Mui-selected': { bgcolor: 'action.selected' },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={conversation.unreadCount}
                        color="primary"
                        invisible={conversation.unreadCount === 0}
                      >
                        <Avatar>
                          {conversation.user?.profile?.firstName?.charAt(0) || 
                           conversation.user?.username?.charAt(0) || 
                           <PersonIcon />}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {conversation.user?.profile?.firstName} {conversation.user?.profile?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatLastMessageTime(conversation)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {formatLastMessage(conversation)}
                          </Typography>
                          <Box display="flex" gap={1} mt={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              @{conversation.user?.username}
                            </Typography>
                            {conversation.user?.isOnline && (
                              <Chip 
                                label="Online" 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredConversations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      {/* Chat Window */}
      <Box sx={{ flex: 1 }}>
        {selectedConversation ? (
          <ChatWindow 
            selectedChat={selectedConversation.user}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            sx={{ bgcolor: 'grey.50' }}
          >
            <Box textAlign="center">
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select a conversation to start messaging
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a conversation from the list or start a new one from Find Partners
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessagingInterface; 