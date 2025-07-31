import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const useSocket = () => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
      return;
    }

    // Create socket connection
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'https://skill-verse-backend.onrender.com', {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0;
      
      // Join user's personal room
      newSocket.emit('join-user', user._id || user.id);
      
      // Update user's online status
      newSocket.emit('user:status', { status: 'online' });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus('error');
      setIsConnected(false);
      
      // Increment reconnect attempts
      reconnectAttempts.current += 1;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        setConnectionStatus('failed');
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0;
      
      // Re-join user's room after reconnection
      newSocket.emit('join-user', user._id || user.id);
      newSocket.emit('user:status', { status: 'online' });
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnection attempt:', attemptNumber);
      setConnectionStatus('reconnecting');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      setConnectionStatus('error');
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      setConnectionStatus('failed');
    });

    // Real-time events
    newSocket.on('profile:updated', (data) => {
      console.log('Profile updated:', data);
      // This will be handled by the component using the hook
    });

    newSocket.on('message:new', (data) => {
      console.log('New message received:', data);
      // This will be handled by the component using the hook
    });

    newSocket.on('session:request', (data) => {
      console.log('Session request received:', data);
      // This will be handled by the component using the hook
    });

    newSocket.on('credential:new', (data) => {
      console.log('New credential:', data);
      // This will be handled by the component using the hook
    });

    newSocket.on('user:status', (data) => {
      console.log('User status update:', data);
      // This will be handled by the component using the hook
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user, token]);

  // Manual reconnection
  const reconnect = () => {
    if (socket && !isConnected) {
      reconnectAttempts.current = 0;
      socket.connect();
    }
  };

  // Send message
  const sendMessage = (data) => {
    if (socket && isConnected) {
      socket.emit('message:send', data);
    }
  };

  // Join room
  const joinRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('join:room', { roomId });
    }
  };

  // Leave room
  const leaveRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('leave:room', { roomId });
    }
  };

  // Update user status
  const updateStatus = (status) => {
    if (socket && isConnected) {
      socket.emit('user:status', { status });
    }
  };

  // Request session
  const requestSession = (data) => {
    if (socket && isConnected) {
      socket.emit('session:request', data);
    }
  };

  // Accept session request
  const acceptSession = (sessionId) => {
    if (socket && isConnected) {
      socket.emit('session:accept', { sessionId });
    }
  };

  // Decline session request
  const declineSession = (sessionId) => {
    if (socket && isConnected) {
      socket.emit('session:decline', { sessionId });
    }
  };

  // Join user's room for profile updates
  const joinUserRoom = (userId) => {
    if (socket && isConnected) {
      socket.emit('join:user', { userId });
    }
  };

  // Leave user's room
  const leaveUserRoom = (userId) => {
    if (socket && isConnected) {
      socket.emit('leave:user', { userId });
    }
  };

  return {
    socket,
    isConnected,
    connectionStatus,
    reconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    updateStatus,
    requestSession,
    acceptSession,
    declineSession,
    joinUserRoom,
    leaveUserRoom,
  };
};

export default useSocket; 