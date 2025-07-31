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
        navigate('/dashboard');
      } catch (error) {
        console.error('Signup error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            maxWidth: 500,
          }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join Skill Verse to connect with learners and teachers
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={2}>
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
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignupForm; 