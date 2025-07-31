import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { messageAPI } from '../../api/api';

const MessageDebug = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testHealth = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setResult({ type: 'health', data });
    } catch (err) {
      setError(`Health check failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConversations = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await messageAPI.getConversations();
      setResult({ type: 'conversations', data: response });
    } catch (err) {
      setError(`Conversations failed: ${err.message}`);
      console.error('Full error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setResult({ type: 'auth', data });
    } catch (err) {
      setError(`Auth check failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Message API Debug
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Current State</Typography>
        <Typography>User: {user ? user.username : 'Not logged in'}</Typography>
        <Typography>Token: {token ? 'Present' : 'Missing'}</Typography>
        <Typography>LocalStorage Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testHealth}
          disabled={loading}
        >
          Test Health
        </Button>
        <Button 
          variant="contained" 
          onClick={testAuth}
          disabled={loading}
        >
          Test Auth
        </Button>
        <Button 
          variant="contained" 
          onClick={testConversations}
          disabled={loading}
        >
          Test Conversations
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Result: {result.type}
          </Typography>
          <pre style={{ overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default MessageDebug; 