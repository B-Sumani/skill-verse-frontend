import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { adminAPI } from '../../api/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // User management filters
  const [userFilters, setUserFilters] = useState({
    search: '',
    role: '',
    isActive: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      loadUsers();
    } else if (activeTab === 2) {
      loadAnalytics();
    }
  }, [activeTab, userFilters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers(userFilters);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics({ period: 30 });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics');
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await adminAPI.updateUserRole(userId, role);
      setNotification({ open: true, message: 'User role updated successfully', severity: 'success' });
      loadUsers();
    } catch (error) {
      setNotification({ open: true, message: 'Failed to update user role', severity: 'error' });
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.toggleUserStatus(userId, isActive);
      setNotification({ 
        open: true, 
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, 
        severity: 'success' 
      });
      loadUsers();
    } catch (error) {
      setNotification({ open: true, message: 'Failed to update user status', severity: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setNotification({ open: true, message: 'User deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
      loadUsers();
    } catch (error) {
      setNotification({ open: true, message: 'Failed to delete user', severity: 'error' });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'moderator': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircleIcon color="success" /> : <BlockIcon color="error" />;
  };

  const renderDashboardTab = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {dashboardStats?.users?.total || 0}
                </Typography>
              </Box>
              <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4">
                  {dashboardStats?.users?.active || 0}
                </Typography>
              </Box>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  New This Month
                </Typography>
                <Typography variant="h4">
                  {dashboardStats?.users?.newThisMonth || 0}
                </Typography>
              </Box>
              <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Sessions
                </Typography>
                <Typography variant="h4">
                  {dashboardStats?.sessions?.total || 0}
                </Typography>
              </Box>
              <VideoCallIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Signups */}
                      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Signups
            </Typography>
            <Box maxHeight={300} overflow="auto">
              {dashboardStats?.recentSignups?.map((user, index) => (
                <Box key={user._id} display="flex" alignItems="center" py={1}>
                  <Avatar sx={{ mr: 2 }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold">
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Chip 
                    label={user.role} 
                    size="small" 
                    color={getRoleColor(user.role)}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* User Roles Distribution */}
                      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Roles Distribution
            </Typography>
            <Box>
              {dashboardStats?.users?.roles?.map((role, index) => (
                <Box key={role._id} display="flex" justifyContent="space-between" py={1}>
                  <Typography variant="body2">
                    {role._id.charAt(0).toUpperCase() + role._id.slice(1)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {role.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderUsersTab = () => (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search Users"
                value={userFilters.search}
                onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value })}
                placeholder="Search by name, email, or username"
              />
            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={userFilters.role}
                  onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={userFilters.isActive}
                  onChange={(e) => setUserFilters({ ...userFilters, isActive: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setUserFilters({ search: '', role: '', isActive: '', page: 1, limit: 20 })}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {user.username}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small" 
                    color={getRoleColor(user.role)}
                  />
                </TableCell>
                <TableCell>
                  {getStatusIcon(user.isActive)}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleUserStatus(user._id, !user.isActive)}
                    >
                      {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Skills
            </Typography>
            {analytics?.topSkills?.map((skill, index) => (
              <Box key={skill._id} display="flex" justifyContent="space-between" py={1}>
                <Typography variant="body2">
                  {skill._id}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {skill.count} users
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Interests
            </Typography>
            {analytics?.topInterests?.map((interest, index) => (
              <Box key={interest._id} display="flex" justifyContent="space-between" py={1}>
                <Typography variant="body2">
                  {interest._id}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {interest.count} users
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage users, monitor system performance, and view analytics
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<PeopleIcon />} label="User Management" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderDashboardTab()}
      {activeTab === 1 && renderUsersTab()}
      {activeTab === 2 && renderAnalyticsTab()}

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => handleUpdateUserRole(selectedUser._id, e.target.value)}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedUser.isActive}
                    onChange={(e) => handleToggleUserStatus(selectedUser._id, e.target.checked)}
                  />
                }
                label="Active Account"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.username}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteUser(selectedUser?._id)} 
            color="error" 
            variant="contained"
          >
            Delete
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
    </Container>
  );
};

export default AdminDashboard; 