import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Skeleton,
  Alert,
  Snackbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Rating,
  Tabs,
  Tab,
  Slider,
  FormControlLabel,
  Checkbox,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Send as SendIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  EmojiEvents as EmojiEventsIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../api/api';
import useSocket from '../../hooks/useSocket';
import VideoRequestForm from '../VideoSession/VideoRequestForm';

const SkillSearch = () => {
  const { user: currentUser } = useAuth();
  const { socket, isConnected, requestSession } = useSocket();
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState([0, 5]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeTab, setActiveTab] = useState(0);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [videoRequestDialogOpen, setVideoRequestDialogOpen] = useState(false);
  const [selectedVideoRecipient, setSelectedVideoRecipient] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Refs
  const searchTimeoutRef = useRef(null);

  // Skills list
  const skillsList = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go',
    'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask',
    'Express.js', 'Spring Boot', 'Laravel', 'ASP.NET', 'GraphQL', 'REST API',
    'Database Design', 'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
    'Machine Learning', 'Data Science', 'UI/UX Design', 'Mobile Development',
    'Game Development', 'Blockchain', 'Cybersecurity', 'Testing', 'Agile', 'Project Management'
  ];

  // Mock users for development
  const mockUsers = [
    {
      id: 'user1',
      username: 'john_doe',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
        bio: 'Full-stack developer passionate about React and Node.js',
        skills: ['React', 'JavaScript', 'Node.js', 'Python'],
        interests: ['Machine Learning', 'Web Development', 'Open Source'],
        location: 'San Francisco, CA',
        rating: 4.8,
        isOnline: true,
        isVerified: true,
      },
      compatibility: 95,
    },
    {
      id: 'user2',
      username: 'jane_smith',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        avatar: null,
        bio: 'Data scientist and Python expert',
        skills: ['Python', 'Machine Learning', 'Data Science', 'SQL'],
        interests: ['AI', 'Data Visualization', 'Research'],
        location: 'New York, NY',
        rating: 4.9,
        isOnline: false,
        isVerified: true,
      },
      compatibility: 88,
    },
    {
      id: 'user3',
      username: 'mike_wilson',
      profile: {
        firstName: 'Mike',
        lastName: 'Wilson',
        avatar: null,
        bio: 'Mobile developer specializing in React Native',
        skills: ['React Native', 'JavaScript', 'iOS', 'Android'],
        interests: ['Mobile Development', 'UI/UX', 'Startups'],
        location: 'Austin, TX',
        rating: 4.7,
        isOnline: true,
        isVerified: false,
      },
      compatibility: 82,
    },
  ];

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No authentication token found, using mock data');
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        return;
      }
      
      // Use actual API call to fetch real users
      console.log('Sending search request with params:', {
        query: searchQuery,
        skills: selectedSkills,
        interests: selectedInterests,
        location: locationFilter,
        rating: ratingFilter,
        availability: availabilityFilter,
        onlineOnly,
        verifiedOnly,
        sortBy,
      });
      
      const response = await userAPI.searchUsers({
        query: searchQuery,
        skills: selectedSkills,
        interests: selectedInterests,
        location: locationFilter,
        rating: ratingFilter,
        availability: availabilityFilter,
        onlineOnly,
        verifiedOnly,
        sortBy,
      });
      
      console.log('Users fetched from API:', response);
      console.log('Response data:', response.data);
      console.log('Response data.users:', response.data.users);
      
      // Check if response has the expected structure
      if (!response || !response.data || !response.data.users) {
        console.error('Unexpected API response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      console.log('Number of users in response:', response.data.users.length);
      
      // Transform the API response to match our component's expected format
      const transformedUsers = response.data.users.map(user => ({
        id: user._id,
        username: user.username,
        profile: {
          firstName: user.profile?.firstName || user.username,
          lastName: user.profile?.lastName || '',
          avatar: user.profile?.avatar || null,
          bio: user.profile?.bio || '',
          skills: user.profile?.skills || [],
          interests: user.profile?.interests || [],
          location: user.profile?.location || '',
          rating: user.profile?.rating || 0,
          isOnline: user.profile?.isOnline || false,
          isVerified: user.profile?.isVerified || false,
        },
        compatibility: calculateCompatibility(user),
      }));
      
      console.log('Transformed users:', transformedUsers);
      console.log('Setting users state with:', transformedUsers.length, 'users');
      
      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        console.log('Authentication error, redirecting to login');
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        window.location.href = '/login';
        return;
      }
      
      // Fallback to mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback mock data due to API error');
        let filteredMockUsers = mockUsers;
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredMockUsers = filteredMockUsers.filter(user => 
            user.profile.firstName.toLowerCase().includes(query) ||
            user.profile.lastName.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query) ||
            user.profile.skills.some(skill => skill.toLowerCase().includes(query))
          );
        }
        
        if (selectedSkills.length > 0) {
          filteredMockUsers = filteredMockUsers.filter(user =>
            selectedSkills.some(skill => user.profile.skills.includes(skill))
          );
        }
        
        if (onlineOnly) {
          filteredMockUsers = filteredMockUsers.filter(user => user.profile.isOnline);
        }
        
        if (verifiedOnly) {
          filteredMockUsers = filteredMockUsers.filter(user => user.profile.isVerified);
        }
        
        setUsers(filteredMockUsers);
        setFilteredUsers(filteredMockUsers);
      } else {
        setError('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedSkills, selectedInterests, locationFilter, ratingFilter, availabilityFilter, onlineOnly, verifiedOnly, sortBy]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedInterests([]);
    setLocationFilter('');
    setRatingFilter([0, 5]);
    setAvailabilityFilter('all');
    setOnlineOnly(false);
    setVerifiedOnly(false);
    setSortBy('relevance');
  };

  // Send skill exchange request
  const sendSkillExchangeRequest = async () => {
    if (!selectedUser || !requestMessage.trim()) return;

    try {
      setSendingRequest(true);
      
      // Send via WebSocket if connected
      if (isConnected) {
        requestSession({
          recipientId: selectedUser.id,
          message: requestMessage,
          type: 'skill_exchange',
          skillsOffered: currentUser.profile?.skills || [],
          skillsWanted: selectedUser.profile?.skills || [],
        });
      }

      // Also send via API
      await userAPI.sendSkillExchangeRequest({
        recipientId: selectedUser.id,
        message: requestMessage,
        skillsOffered: currentUser.profile?.skills || [],
        skillsWanted: selectedUser.profile?.skills || [],
      });

      setNotification({
        open: true,
        message: 'Skill exchange request sent successfully!',
        severity: 'success'
      });
      
      setRequestDialogOpen(false);
      setRequestMessage('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error sending request:', error);
      setNotification({
        open: true,
        message: 'Failed to send request. Please try again.',
        severity: 'error'
      });
    } finally {
      setSendingRequest(false);
    }
  };

  // Calculate compatibility score
  const calculateCompatibility = (user) => {
    if (!currentUser?.profile?.skills || !user.profile?.skills) return 0;
    
    const userSkills = new Set(user.profile.skills);
    const userInterests = new Set(user.profile.interests || []);
    const currentUserSkills = new Set(currentUser.profile.skills);
    const currentUserInterests = new Set(currentUser.profile.interests || []);
    
    // Skills match (user can teach what current user wants to learn)
    const skillsMatch = [...currentUserInterests].filter(skill => userSkills.has(skill)).length;
    
    // Interests match (current user can teach what user wants to learn)
    const interestsMatch = [...userInterests].filter(skill => currentUserSkills.has(skill)).length;
    
    const totalPossible = Math.max(currentUserInterests.size, userInterests.size);
    return totalPossible > 0 ? Math.round(((skillsMatch + interestsMatch) / (totalPossible * 2)) * 100) : 0;
  };

  // Render user card
  const renderUserCard = (user) => {
    const compatibility = calculateCompatibility(user);
    const isOnline = user.onlineStatus === 'online';
    
    return (
      <Card key={user.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box sx={{ position: 'relative' }}>
                  {user.verified && (
                    <EmojiEventsIcon sx={{ fontSize: 16, color: 'gold' }} />
                  )}
                  {isOnline && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        border: '2px solid white',
                      }}
                    />
                  )}
                </Box>
              }
            >
              <Avatar
                src={user.profile?.avatar}
                sx={{ 
                  width: 60, 
                  height: 60,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                }}
              >
                {user.profile?.firstName?.charAt(0) || user.username?.charAt(0)}
              </Avatar>
            </Badge>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user.profile?.firstName} {user.profile?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Rating value={user.rating || 0} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({user.sessionsCompleted || 0} sessions)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Compatibility Score */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Compatibility Score
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${compatibility}%`,
                    height: '100%',
                    bgcolor: compatibility > 70 ? 'success.main' : compatibility > 40 ? 'warning.main' : 'error.main',
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 35 }}>
                {compatibility}%
              </Typography>
            </Box>
          </Box>

          {/* Skills */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Can Teach
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {user.profile?.skills?.slice(0, 3).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
              {user.profile?.skills?.length > 3 && (
                <Chip
                  label={`+${user.profile.skills.length - 3}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Wants to Learn */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Wants to Learn
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {user.profile?.interests?.slice(0, 3).map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              ))}
              {user.profile?.interests?.length > 3 && (
                <Chip
                  label={`+${user.profile.interests.length - 3}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Location and Availability */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {user.profile?.location && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {user.profile.location}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {isOnline ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MessageIcon />}
            onClick={() => navigate(`/chat?user=${user.id}`)}
            fullWidth
          >
            Message
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<SendIcon />}
            onClick={() => {
              setSelectedUser(user);
              setRequestDialogOpen(true);
            }}
            fullWidth
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
              },
            }}
          >
            Exchange Request
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VideoCallIcon />}
            onClick={() => {
              setSelectedVideoRecipient(user);
              setVideoRequestDialogOpen(true);
            }}
            fullWidth
            sx={{ mt: 1 }}
          >
            Video Call
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Find Skill Partners
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover users who can teach you new skills and learn from your expertise
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Search Bar */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Search by name, username, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          {/* Sort By */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="compatibility">Compatibility</MenuItem>
                <MenuItem value="online">Online First</MenuItem>
                <MenuItem value="recent">Recently Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Filter Toggle */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showFilters && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* Skills Filter */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Skills to Learn</InputLabel>
                  <Select
                    multiple
                    value={selectedSkills}
                    onChange={(e) => setSelectedSkills(e.target.value)}
                    input={<OutlinedInput label="Skills to Learn" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {skillsList.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Interests Filter */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Skills to Teach</InputLabel>
                  <Select
                    multiple
                    value={selectedInterests}
                    onChange={(e) => setSelectedInterests(e.target.value)}
                    input={<OutlinedInput label="Skills to Teach" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {skillsList.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Rating Filter */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" gutterBottom>
                  Minimum Rating: {ratingFilter[0]}
                </Typography>
                <Slider
                  value={ratingFilter}
                  onChange={(e, newValue) => setRatingFilter(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                  step={0.5}
                />
              </Grid>

              {/* Availability Filter */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    label="Availability"
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="online">Online Now</MenuItem>
                    <MenuItem value="available">Available for Sessions</MenuItem>
                    <MenuItem value="busy">Busy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Quick Filters */}
              <Grid size={12}>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={onlineOnly}
                        onChange={(e) => setOnlineOnly(e.target.checked)}
                      />
                    }
                    label="Online Only"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                      />
                    }
                    label="Verified Users Only"
                  />
                </Box>
              </Grid>

              {/* Clear Filters */}
              <Grid size={12}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Results */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {loading ? 'Searching...' : `${filteredUsers.length} users found`}
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="rectangular" height={200} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredUsers.length > 0 ? (
          <Grid container spacing={3}>
            {filteredUsers.map(renderUserCard)}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or filters
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Skill Exchange Request Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Skill Exchange Request
          {selectedUser && (
            <Typography variant="body2" color="text.secondary">
              to {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your Skills (What you can teach):
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {currentUser?.profile?.skills?.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" size="small" />
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Skills you want to learn from {selectedUser?.profile?.firstName}:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedUser?.profile?.skills?.map((skill, index) => (
                <Chip key={index} label={skill} color="secondary" size="small" />
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message (optional)"
            placeholder="Introduce yourself and explain what you'd like to learn..."
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={sendSkillExchangeRequest}
            disabled={sendingRequest}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
              },
            }}
          >
            {sendingRequest ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Request Form */}
      <VideoRequestForm
        open={videoRequestDialogOpen}
        onClose={() => {
          setVideoRequestDialogOpen(false);
          setSelectedVideoRecipient(null);
        }}
        recipient={selectedVideoRecipient}
        onSuccess={(request) => {
          setNotification({
            open: true,
            message: `Video request sent to ${selectedVideoRecipient?.profile?.firstName || selectedVideoRecipient?.username}!`,
            severity: 'success'
          });
        }}
      />

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

export default SkillSearch; 