import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  skillToTeach: Yup.string()
    .required('Please select a skill you want to teach'),
  skillToLearn: Yup.string()
    .required('Please select a skill you want to learn'),
  linkedin: Yup.string()
    .url('Please enter a valid LinkedIn URL')
    .optional(),
});

// Common skills list
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

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuth();
  const { showWalletConnection } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      skillToTeach: '',
      skillToLearn: '',
      linkedin: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        clearError();
        
        // Ensure the data is in the correct format for the backend
        const signupData = {
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          skillToTeach: values.skillToTeach,
          skillToLearn: values.skillToLearn,
          linkedin: values.linkedin || '',
        };
        
        await signup(signupData);
        
        // Show wallet connection dialog after successful signup
        setTimeout(() => {
          showWalletConnection();
        }, 1000);
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Signup error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'fadeIn 0.6s ease-in-out',
          }}
        >
          {/* Logo/Brand Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Skill Verse
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Join the community of learners and teachers
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              padding: 4,
              width: '100%',
              maxWidth: 600,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <Typography 
              component="h2" 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              align="center" 
              sx={{ mb: 4 }}
            >
              Fill in your details to get started with Skill Verse
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Full Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="skill-to-teach-label">Skill to Teach</InputLabel>
                    <Select
                      labelId="skill-to-teach-label"
                      id="skillToTeach"
                      name="skillToTeach"
                      value={formik.values.skillToTeach}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.skillToTeach && Boolean(formik.errors.skillToTeach)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {skillsList.map((skill) => (
                        <MenuItem key={skill} value={skill}>
                          {skill}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.skillToTeach && formik.errors.skillToTeach && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {formik.errors.skillToTeach}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="skill-to-learn-label">Skill to Learn</InputLabel>
                    <Select
                      labelId="skill-to-learn-label"
                      id="skillToLearn"
                      name="skillToLearn"
                      value={formik.values.skillToLearn}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.skillToLearn && Boolean(formik.errors.skillToLearn)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {skillsList.map((skill) => (
                        <MenuItem key={skill} value={skill}>
                          {skill}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.skillToLearn && formik.errors.skillToLearn && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {formik.errors.skillToLearn}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="linkedin"
                    name="linkedin"
                    label="LinkedIn Profile (Optional)"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formik.values.linkedin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
                    helperText={formik.touched.linkedin && formik.errors.linkedin}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={isSubmitting}
                sx={{ 
                  mt: 4, 
                  mb: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{ 
                      textDecoration: 'none',
                      color: '#2563eb',
                      fontWeight: 600,
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Additional Info */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupForm; 