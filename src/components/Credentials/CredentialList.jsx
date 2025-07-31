import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
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
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { credentialAPI } from '../../api/api';

const CredentialList = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [error, setError] = useState(null);

  // Mock credentials data
  const mockCredentials = [
    {
      id: 1,
      title: 'React Development Certificate',
      issuer: 'Skill Verse Academy',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'active',
      type: 'certification',
      skill: 'React',
      description: 'Advanced React development skills including hooks, context, and performance optimization',
      algorandAssetId: '123456789',
      algorandTransactionId: 'ABC123DEF456',
      verified: true,
      score: 95,
    },
    {
      id: 2,
      title: 'Python Programming Badge',
      issuer: 'CodeMaster Institute',
      issueDate: '2023-12-01',
      expiryDate: '2024-12-01',
      status: 'active',
      type: 'badge',
      skill: 'Python',
      description: 'Proficiency in Python programming fundamentals and data structures',
      algorandAssetId: '987654321',
      algorandTransactionId: 'XYZ789ABC123',
      verified: true,
      score: 88,
    },
    {
      id: 3,
      title: 'Teaching Excellence Award',
      issuer: 'Skill Verse Community',
      issueDate: '2024-02-01',
      expiryDate: null,
      status: 'active',
      type: 'award',
      skill: 'Teaching',
      description: 'Recognition for outstanding teaching performance and student satisfaction',
      algorandAssetId: '456789123',
      algorandTransactionId: 'DEF456GHI789',
      verified: true,
      score: 100,
    },
  ];

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCredentials(mockCredentials);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to fetch credentials');
      setLoading(false);
    }
  };

  const handleAddCredential = async (credentialData) => {
    try {
      const response = await credentialAPI.createCredential(credentialData);
      setCredentials(prev => [...prev, response.data.credential]);
      setShowAddDialog(false);
    } catch (error) {
      setError('Failed to create credential');
    }
  };

  const handleEditCredential = async (credentialData) => {
    try {
      const response = await credentialAPI.updateCredential(selectedCredential.id, credentialData);
      setCredentials(prev => 
        prev.map(cred => cred.id === selectedCredential.id ? response.data.credential : cred)
      );
      setShowEditDialog(false);
      setSelectedCredential(null);
    } catch (error) {
      setError('Failed to update credential');
    }
  };

  const handleDeleteCredential = async (credentialId) => {
    try {
      await credentialAPI.deleteCredential(credentialId);
      setCredentials(prev => prev.filter(cred => cred.id !== credentialId));
    } catch (error) {
      setError('Failed to delete credential');
    }
  };

  const handleDownloadCredential = (credential) => {
    // TODO: Implement credential download functionality
    console.log('Downloading credential:', credential.id);
  };

  const handleShareCredential = (credential) => {
    // TODO: Implement credential sharing functionality
    console.log('Sharing credential:', credential.id);
  };

  const getCredentialIcon = (type) => {
    switch (type) {
      case 'certification':
        return <SchoolIcon />;
      case 'badge':
        return <StarIcon />;
      case 'award':
        return <WorkIcon />;
      default:
        return <VerifiedIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderCredentialCard = (credential) => (
    <Card key={credential.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {getCredentialIcon(credential.type)}
          </Avatar>
          <Box display="flex" gap={1}>
            {credential.verified && (
              <Chip
                icon={<VerifiedIcon />}
                label="Verified"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            <Chip
              label={credential.status}
              size="small"
              color={getStatusColor(credential.status)}
            />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          {credential.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Issued by {credential.issuer}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {credential.description}
        </Typography>

        <Box display="flex" gap={1} mb={2}>
          <Chip label={credential.skill} size="small" color="primary" />
          <Chip label={`Score: ${credential.score}%`} size="small" variant="outlined" />
        </Box>

        <Typography variant="caption" color="text.secondary" display="block">
          Issued: {new Date(credential.issueDate).toLocaleDateString()}
        </Typography>
        
        {credential.expiryDate && (
          <Typography variant="caption" color="text.secondary" display="block">
            Expires: {new Date(credential.expiryDate).toLocaleDateString()}
          </Typography>
        )}

        {credential.algorandAssetId && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Blockchain ID: {credential.algorandAssetId}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => handleDownloadCredential(credential)}
            title="Download"
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleShareCredential(credential)}
            title="Share"
          >
            <ShareIcon />
          </IconButton>
        </Box>
        
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedCredential(credential);
              setShowEditDialog(true);
            }}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteCredential(credential.id)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading credentials...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Digital Credentials
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your verified skills and achievements
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddDialog(true)}
        >
          Add Credential
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {credentials.length > 0 ? (
        <Grid container spacing={3}>
          {credentials.map(credential => (
                              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={credential.id}>
              {renderCredentialCard(credential)}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No credentials yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start earning credentials by completing sessions and assessments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
          >
            Add Your First Credential
          </Button>
        </Paper>
      )}

      {/* Add Credential Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Credential</DialogTitle>
        <DialogContent>
          <AddCredentialForm onSubmit={handleAddCredential} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Credential Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Credential</DialogTitle>
        <DialogContent>
          <EditCredentialForm 
            credential={selectedCredential} 
            onSubmit={handleEditCredential} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Add Credential Form Component
const AddCredentialForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    type: 'certification',
    skill: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Credential Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Issuer"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label="Type"
            >
              <MenuItem value="certification">Certification</MenuItem>
              <MenuItem value="badge">Badge</MenuItem>
              <MenuItem value="award">Award</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Issue Date"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Expiry Date (Optional)"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
                      <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Skill"
            value={formData.skill}
            onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Add Credential
        </Button>
      </Box>
    </Box>
  );
};

// Edit Credential Form Component
const EditCredentialForm = ({ credential, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: credential?.title || '',
    issuer: credential?.issuer || '',
    issueDate: credential?.issueDate || '',
    expiryDate: credential?.expiryDate || '',
    type: credential?.type || 'certification',
    skill: credential?.skill || '',
    description: credential?.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Credential Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Issuer"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label="Type"
            >
              <MenuItem value="certification">Certification</MenuItem>
              <MenuItem value="badge">Badge</MenuItem>
              <MenuItem value="award">Award</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Issue Date"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Expiry Date (Optional)"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        
                      <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Skill"
            value={formData.skill}
            onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
            required
          />
        </Grid>
        
                      <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Update Credential
        </Button>
      </Box>
    </Box>
  );
};

export default CredentialList; 