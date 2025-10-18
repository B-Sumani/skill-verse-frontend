import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Box } from '@mui/material';

const Card = ({ 
  children, 
  title,
  subtitle,
  avatar,
  action,
  actions,
  elevation = 1,
  hover = false,
  gradient = false,
  sx = {},
  ...props 
}) => {
  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: 4,
      overflow: 'hidden',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      transition: 'all 0.3s ease-in-out',
      position: 'relative',
    };

    if (gradient) {
      baseStyles.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
    }

    if (hover) {
      baseStyles['&:hover'] = {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      };
    }

    return baseStyles;
  };

  return (
    <MuiCard
      elevation={elevation}
      sx={{
        ...getCardStyles(),
        ...sx,
      }}
      {...props}
    >
      {title && (
        <CardHeader
          title={title}
          subheader={subtitle}
          avatar={avatar}
          action={action}
          sx={{
            pb: 1,
            '& .MuiCardHeader-title': {
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'text.primary',
            },
            '& .MuiCardHeader-subheader': {
              color: 'text.secondary',
              fontSize: '0.875rem',
              fontWeight: 400,
            },
            '& .MuiCardHeader-avatar': {
              marginRight: 2,
            },
          }}
        />
      )}
      
      <CardContent sx={{ 
        p: 3,
        '&:last-child': {
          pb: 3,
        },
      }}>
        {children}
      </CardContent>
      
      {actions && (
        <CardActions sx={{ 
          p: 3, 
          pt: 0,
          gap: 1,
          flexWrap: 'wrap',
        }}>
          {actions}
        </CardActions>
      )}

      {/* Optional gradient overlay for visual appeal */}
      {gradient && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
            opacity: 0.8,
          }}
        />
      )}
    </MuiCard>
  );
};

export default Card; 