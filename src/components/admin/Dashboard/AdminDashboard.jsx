import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders')
        ]);
        setTotalProducts(productsResponse.data.length);
        setTotalOrders(ordersResponse.data.length);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6">
              Total Products: {totalProducts}
            </Typography>
            <Button component={Link} to="/admin/products" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Manage Products
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6">
              Total Orders: {totalOrders}
            </Typography>
            <Button component={Link} to="/admin/orders" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Manage Orders
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6">
              Add Product
            </Typography>
            <Button component={Link} to="/admin/add-product" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Add New Product
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
