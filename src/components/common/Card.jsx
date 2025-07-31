import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';

const Card = ({ 
  children, 
  title,
  subtitle,
  avatar,
  action,
  actions,
  elevation = 1,
  sx = {},
  ...props 
}) => {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
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
            '& .MuiCardHeader-title': {
              fontWeight: 600,
            },
            '& .MuiCardHeader-subheader': {
              color: 'text.secondary',
            },
          }}
        />
      )}
      
      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
      
      {actions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card; 