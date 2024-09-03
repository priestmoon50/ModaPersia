// components/pages/HomePage.jsx
import React from 'react';
import { Container, Typography, Box, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme(); // استفاده از تم برای تنظیمات رنگی

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: '12px',
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          color: '#fff',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome Home
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4 }}>
          Explore our exciting products and services.
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.2rem',
            borderRadius: '24px',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
