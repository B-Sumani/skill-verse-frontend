import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  sx = {},
  ...props 
}) => {
  const getSizeStyles = (size) => {
    switch (size) {
      case 'small':
        return { padding: '6px 16px', fontSize: '0.75rem' };
      case 'large':
        return { padding: '16px 32px', fontSize: '1rem' };
      default:
        return { padding: '12px 24px', fontSize: '0.875rem' };
    }
  };

  const getVariantStyles = (variant, color) => {
    const baseStyles = {
      borderRadius: 3,
      fontWeight: 600,
      letterSpacing: '0.025em',
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
    };

    if (variant === 'contained') {
      return {
        ...baseStyles,
        background: color === 'primary' 
          ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
          : color === 'secondary'
          ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
          : undefined,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      };
    }

    if (variant === 'outlined') {
      return {
        ...baseStyles,
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
          transform: 'translateY(-1px)',
          backgroundColor: color === 'primary' 
            ? 'rgba(37, 99, 235, 0.04)'
            : 'rgba(124, 58, 237, 0.04)',
        },
      };
    }

    if (variant === 'text') {
      return {
        ...baseStyles,
        '&:hover': {
          backgroundColor: color === 'primary' 
            ? 'rgba(37, 99, 235, 0.04)'
            : 'rgba(124, 58, 237, 0.04)',
          transform: 'translateY(-1px)',
        },
      };
    }

    return baseStyles;
  };

  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      type={type}
      sx={{
        ...getSizeStyles(size),
        ...getVariantStyles(variant, color),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
          color="inherit" 
        />
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button; 