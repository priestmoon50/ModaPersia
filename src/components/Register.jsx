import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Send data to server via Axios
      const response = await axios.post('/api/users/register', data);
      alert('Registration successful!');
      console.log('Server Response:', response.data);
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mb={3}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Enter a valid email',
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            {...register('phoneNumber', {
              pattern: {
                value: /^(\+?\d{1,4}[-.\s]?)?(\d{10})$/,
                message: 'Enter a valid phone number',
              },
            })}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            {...register('address')}
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Birth Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            {...register('birthDate')}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default RegisterForm;



