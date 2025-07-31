import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  Avatar,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { userAPI } from '../../api/api';

// Validation schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  bio: Yup.string()
    .max(500, 'Bio must be less than 500 characters'),
  linkedin: Yup.string()
    .url('Please enter a valid LinkedIn URL')
    .optional(),
  skills: Yup.array()
    .min(1, 'Please select at least one skill to teach'),
  interests: Yup.array()
    .min(1, 'Please select at least one skill to learn'),
});

// Skills list
const skillsList = [
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'Java',
  'C++',
  'C#',
  'PHP',
  'Ruby',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'TypeScript',
  'Angular',
  'Vue.js',
  'Django',
  'Flask',
  'Express.js',
  'Spring Boot',
  'Laravel',
  'ASP.NET',
  'GraphQL',
  'REST API',
  'Database Design',
  'DevOps',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Mobile Development',
  'Game Development',
  'Blockchain',
  'Cybersecurity',
  'Testing',
  'Agile',
  'Project Management',
];

const EditProfile = ({ profile, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.profile?.avatar || null);

  const formik = useFormik({
    initialValues: {
      firstName: profile?.profile?.firstName || '',
      lastName: profile?.profile?.lastName || '',
      bio: profile?.profile?.bio || '',
      linkedin: profile?.profile?.linkedin || '',
      skills: profile?.profile?.skills || [],
      interests: profile?.profile?.interests || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await userAPI.updateProfile({
          profile: {
            firstName: values.firstName,
            lastName: values.lastName,
            bio: values.bio,
            linkedin: values.linkedin,
            skills: values.skills,
            interests: values.interests,
            avatar: avatarPreview,
          },
        });

        onSave(response.data.user);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to update profile');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSkillChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue('skills', typeof value === 'string' ? value.split(',') : value);
  };

  const handleInterestChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue('interests', typeof value === 'string' ? value.split(',') : value);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSkill = (skillToRemove) => {
    formik.setFieldValue('skills', formik.values.skills.filter(skill => skill !== skillToRemove));
  };

  const removeInterest = (interestToRemove) => {
    formik.setFieldValue('interests', formik.values.interests.filter(interest => interest !== interestToRemove));
  };

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit}>
        {/* Avatar Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Picture
          </Typography>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={avatarPreview}
              sx={{ 
                width: 100, 
                height: 100,
                fontSize: '2.5rem',
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              }}
            >
              {formik.values.firstName?.charAt(0) || profile?.username?.charAt(0)}
            </Avatar>
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                >
                  Upload Photo
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                JPG, PNG or GIF. Max size 5MB.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Basic Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>

                            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="bio"
                name="bio"
                label="Bio"
                multiline
                rows={4}
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bio && Boolean(formik.errors.bio)}
                helperText={
                  (formik.touched.bio && formik.errors.bio) ||
                  `${formik.values.bio.length}/500 characters`
                }
              />
            </Grid>

                            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="linkedin"
                name="linkedin"
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formik.values.linkedin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
                helperText={formik.touched.linkedin && formik.errors.linkedin}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Skills Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Skills & Interests
          </Typography>
          
          <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="skills-label">Skills I Can Teach</InputLabel>
                <Select
                  labelId="skills-label"
                  id="skills"
                  multiple
                  value={formik.values.skills}
                  onChange={handleSkillChange}
                  input={<OutlinedInput label="Skills I Can Teach" />}
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
                {formik.touched.skills && formik.errors.skills && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {formik.errors.skills}
                  </Typography>
                )}
              </FormControl>
              
              {/* Selected Skills Display */}
              {formik.values.skills.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Selected Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formik.values.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => removeSkill(skill)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="interests-label">Skills I Want to Learn</InputLabel>
                <Select
                  labelId="interests-label"
                  id="interests"
                  multiple
                  value={formik.values.interests}
                  onChange={handleInterestChange}
                  input={<OutlinedInput label="Skills I Want to Learn" />}
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
                {formik.touched.interests && formik.errors.interests && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {formik.errors.interests}
                  </Typography>
                )}
              </FormControl>
              
              {/* Selected Interests Display */}
              {formik.values.interests.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Selected Interests:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formik.values.interests.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        onDelete={() => removeInterest(interest)}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={<SaveIcon />}
            sx={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
              },
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile; 