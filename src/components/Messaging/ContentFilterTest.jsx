import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { messageAPI } from '../../api/api';

const ContentFilterTest = () => {
  const [testContent, setTestContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testExamples = [
    {
      title: 'Phone Numbers',
      content: 'My phone number is (123) 456-7890 or you can call me at 987-654-3210',
      description: 'Various phone number formats'
    },
    {
      title: 'Email Addresses',
      content: 'Contact me at john.doe@example.com or support@company.com',
      description: 'Email addresses'
    },
    {
      title: 'Social Media',
      content: 'Follow me on Twitter @johndoe or Instagram @john_doe',
      description: 'Social media handles'
    },
    {
      title: 'Personal Websites',
      content: 'Check out my portfolio at https://johnsportfolio.com or my blog at www.johnsblog.net',
      description: 'Personal website URLs'
    },
    {
      title: 'Mixed Content',
      content: 'Hi! My email is john@example.com and phone is (555) 123-4567. Also check my site: https://johnsportfolio.com',
      description: 'Multiple types of restricted content'
    },
    {
      title: 'Allowed Content',
      content: 'Check out this GitHub repo: https://github.com/username/project and this Stack Overflow post: https://stackoverflow.com/questions/12345',
      description: 'Educational/tech websites (allowed)'
    }
  ];

  const handleTestContent = async () => {
    if (!testContent.trim()) return;

    setLoading(true);
    try {
      const response = await messageAPI.checkContent(testContent);
      setResult(response.data);
    } catch (error) {
      console.error('Error testing content:', error);
      setResult({
        hasViolations: false,
        violations: [],
        sanitizedContent: testContent,
        originalContent: testContent
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseExample = (example) => {
    setTestContent(example.content);
    setResult(null);
  };

  const getViolationIcon = (type) => {
    switch (type) {
      case 'phone_number':
        return <PhoneIcon color="error" />;
      case 'email_address':
        return <EmailIcon color="error" />;
      case 'social_media':
        return <PersonIcon color="error" />;
      case 'personal_website':
        return <LanguageIcon color="error" />;
      default:
        return <WarningIcon color="error" />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Content Filtering Test
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Test the content filtering system to see how it detects and handles restricted content.
      </Typography>

      {/* Test Examples */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Test Examples" />
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click on any example to test the content filtering:
          </Typography>
          <List dense>
            {testExamples.map((example, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  button 
                  onClick={() => handleUseExample(example)}
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemText
                    primary={example.title}
                    secondary={example.description}
                  />
                </ListItem>
                {index < testExamples.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Test Input */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Test Your Own Content" />
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter content to test for restricted information..."
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleTestContent}
            disabled={!testContent.trim() || loading}
          >
            {loading ? 'Testing...' : 'Test Content'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader 
            title="Test Results" 
            action={
              <Alert 
                severity={result.hasViolations ? 'warning' : 'success'}
                icon={result.hasViolations ? <WarningIcon /> : null}
              >
                {result.hasViolations ? 'Violations Found' : 'No Violations'}
              </Alert>
            }
          />
          <CardContent>
            {result.hasViolations ? (
              <>
                <Typography variant="h6" gutterBottom color="warning.main">
                  Detected Violations:
                </Typography>
                <List dense>
                  {result.violations.map((violation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getViolationIcon(violation.type)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={violation.message}
                        secondary={`Found: ${violation.matches.join(', ')}`}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Original Content:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                  <Typography variant="body2">{result.originalContent}</Typography>
                </Paper>

                <Typography variant="h6" gutterBottom>
                  Sanitized Content:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                  <Typography variant="body2">{result.sanitizedContent}</Typography>
                </Paper>
              </>
            ) : (
              <Alert severity="success">
                No restricted content detected. This message would be sent normally.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ContentFilterTest; 