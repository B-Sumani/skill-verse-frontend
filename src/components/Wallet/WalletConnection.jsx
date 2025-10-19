import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

const WalletConnection = ({ open, onClose, onConnect, onSkip }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const steps = [
    {
      label: 'Connect Wallet',
      description: 'Connect your Algorand wallet to access blockchain features',
    },
    {
      label: 'Verify Connection',
      description: 'Confirm your wallet connection and address',
    },
    {
      label: 'Complete Setup',
      description: 'Finish setting up your blockchain profile',
    },
  ];

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setConnectionError('');
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock wallet address (in real app, this would come from wallet API)
      const mockAddress = 'ALGORAND' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setActiveStep(1);
    } catch (error) {
      setConnectionError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const handleComplete = () => {
    onConnect(walletAddress);
    onClose();
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setWalletAddress('');
    setIsConnected(false);
    setConnectionError('');
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <WalletIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Connect Your Algorand Wallet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Connect your wallet to access blockchain features like digital credentials, 
              skill verification, and secure transactions.
            </Typography>
            
            <List sx={{ textAlign: 'left', mb: 4 }}>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Secure Authentication"
                  secondary="Your wallet provides secure, decentralized authentication"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <VerifiedIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Digital Credentials"
                  secondary="Receive and manage skill-based NFTs and certificates"
                />
              </ListItem>
            </List>

            {connectionError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {connectionError}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              startIcon={isConnecting ? <CircularProgress size={20} /> : <WalletIcon />}
              sx={{ minWidth: 200 }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Wallet Connected Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your wallet has been connected and verified
              </Typography>
            </Box>

            <Card sx={{ mb: 3, border: '1px solid', borderColor: 'success.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Connected Address
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        fontWeight: 500,
                      }}
                    >
                      {walletAddress}
                    </Typography>
                  </Box>
                  <Tooltip title="Copy Address">
                    <IconButton onClick={handleCopyAddress} size="small">
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>

            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Your wallet is now connected and ready to use blockchain features!
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(0)}
                startIcon={<RefreshIcon />}
              >
                Reconnect
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveStep(2)}
              >
                Continue
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <VerifiedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Setup Complete!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your blockchain profile is ready
              </Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  What's Next?
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Earn Digital Credentials"
                      secondary="Complete skill exchanges to earn verified certificates"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Secure Transactions"
                      secondary="Make secure, blockchain-verified skill exchanges"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Build Your Reputation"
                      secondary="Your blockchain profile builds trust in the community"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleSkip}
                sx={{ minWidth: 120 }}
              >
                Skip for Now
              </Button>
              <Button
                variant="contained"
                onClick={handleComplete}
                sx={{ minWidth: 120 }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WalletIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Wallet Setup
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Connect your wallet to unlock blockchain features
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 600,
                    fontSize: '1rem',
                  },
                }}
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                {renderStepContent(index)}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleSkip}
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          Skip Setup
        </Button>
        {activeStep > 0 && (
          <Button
            onClick={() => setActiveStep(activeStep - 1)}
            variant="outlined"
            sx={{ minWidth: 120 }}
          >
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 && (
          <Button
            onClick={() => setActiveStep(activeStep + 1)}
            variant="contained"
            disabled={!isConnected && activeStep === 0}
            sx={{ minWidth: 120 }}
          >
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button
            onClick={handleComplete}
            variant="contained"
            sx={{ minWidth: 120 }}
          >
            Complete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WalletConnection;

