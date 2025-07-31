import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Chip,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import MessageInput from './MessageInput';
import { messageAPI } from '../../api/api';
import useSocket from '../../hooks/useSocket';

const ChatWindow = ({ selectedChat, onSendMessage }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    if (!socket || !selectedChat) return;
    
    const handleIncomingMessage = (data) => {
      console.log('📨 Received message via Socket.IO:', data);
      
      const messageSenderId = data.message.sender?._id || data.message.sender;
      const selectedChatId = selectedChat?._id || selectedChat?.id;
      
      // Only add message if it's from the current chat partner
      if (messageSenderId === selectedChatId) {
        setMessages(prevMessages => [...prevMessages, data.message]);
        scrollToBottom();
      }
    };
    
    socket.on('message:received', handleIncomingMessage);
    
    return () => {
      socket.off('message:received', handleIncomingMessage);
    };
  }, [socket, selectedChat]);

  // Mock messages - replace with actual API calls
  const mockMessages = [
    {
      id: 1,
      senderId: 'other_user',
      senderName: 'John Doe',
      content: 'Hi! I saw you can teach React. Are you available for a session?',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
    },
    {
      id: 2,
      senderId: user?.id || 'current_user',
      senderName: user?.profile?.firstName || 'You',
      content: 'Hello! Yes, I\'d be happy to help you with React. What specific topics would you like to cover?',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
    },
    {
      id: 3,
      senderId: 'other_user',
      senderName: 'John Doe',
      content: 'I\'m working on state management and hooks. Could we schedule a 1-hour session?',
      timestamp: new Date(Date.now() - 2400000),
      type: 'text',
    },
    {
      id: 4,
      senderId: user?.id || 'current_user',
      senderName: user?.profile?.firstName || 'You',
      content: 'Perfect! I can help you with that. How about tomorrow at 2 PM?',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
    },
  ];

  useEffect(() => {
    if (selectedChat) {
      setLoading(true);
      // Fetch real messages from API
      const fetchMessages = async () => {
        try {
          const response = await messageAPI.getMessages(selectedChat._id || selectedChat.id);
          setMessages(response.messages || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
          // If no messages exist yet, start with empty array
          setMessages([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageContent) => {
    if (!messageContent || !messageContent.trim()) return;

    try {
      // Send message to backend
      const response = await messageAPI.sendMessage({
        receiverId: selectedChat?._id || selectedChat?.id,
        content: messageContent,
        type: 'text'
      });

      // Add message to local state - use the same structure as backend
      const newMessage = {
        _id: response.message._id,
        sender: {
          _id: user?._id || user?.id,
          username: user?.username,
          profile: user?.profile
        },
        recipient: {
          _id: selectedChat?._id || selectedChat?.id
        },
        content: messageContent,
        createdAt: new Date(),
        messageType: 'text',
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle content filtering errors
      if (error.response?.data?.code === 'CONTENT_FILTERED') {
        alert(`🔒 Message blocked: ${error.response.data.details?.[0] || error.response.data.message}`);
      } else {
        alert('Failed to send message. Please try again.');
      }
    }
    
    if (onSendMessage) {
      onSendMessage(selectedChat?.id, messageContent);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const today = new Date();
      const messageDate = new Date(timestamp);
      
      if (isNaN(messageDate.getTime())) return '';
      
      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (messageDate.toDateString() === new Date(today.getTime() - 86400000).toDateString()) {
        return 'Yesterday';
      } else {
        return messageDate.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  if (!selectedChat) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        minHeight="400px"
      >
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    border: '2px solid white',
                  }}
                />
              }
            >
              <Avatar>
                {selectedChat.profile?.firstName?.charAt(0) || selectedChat.username?.charAt(0)}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6">
                {selectedChat.profile?.firstName} {selectedChat.profile?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{selectedChat.username}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={1}>
            <IconButton size="small">
              <PhoneIcon />
            </IconButton>
            <IconButton size="small">
              <VideoCallIcon />
            </IconButton>
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <Typography>Loading messages...</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {console.log('Rendering messages:', messages)}
            {messages.map((message, index) => {
              console.log('Message:', message, 'Current user ID:', user?.id || user?._id);
              // Fix sender identification - backend returns message.sender._id, not message.senderId
              const messageSenderId = message.sender?._id || message.senderId || message.sender;
              const currentUserId = user?._id || user?.id;
              const isOwnMessage = messageSenderId === currentUserId;
              console.log('Message sender:', messageSenderId, 'Is own message:', isOwnMessage);
              const showDate = index === 0 || 
                formatDate(message.createdAt || message.timestamp) !== formatDate(messages[index - 1]?.createdAt || messages[index - 1]?.timestamp);

                              return (
                <React.Fragment key={message._id || message.id}>
                  {showDate && (
                    <Box textAlign="center" my={2}>
                      <Chip
                        label={formatDate(message.createdAt || message.timestamp)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  )}
                  
                  <ListItem
                    sx={{
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                      p: 0,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        backgroundColor: isOwnMessage ? 'primary.main' : 'white',
                        color: isOwnMessage ? 'white' : 'text.primary',
                        borderRadius: 2,
                        p: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="body1">
                        {message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                        }}
                      >
                        {formatTime(message.createdAt || message.timestamp)}
                      </Typography>
                    </Box>
                  </ListItem>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Message Input */}
      <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <MessageInput onSendMessage={handleSendMessage} />
      </Paper>
    </Box>
  );
};

export default ChatWindow; 