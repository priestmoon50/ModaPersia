import React from 'react';
import { Container, Typography } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container>
      <Typography variant="h6" component="h3" sx={{ mt: 4 }}>
        Wellcome you have everything in your profile! but for more security we dont show it in user interface !
      </Typography>
      {/* در اینجا می‌توانید هر محتوای دیگری را اضافه کنید */}
    </Container>
  );
};

export default ProfilePage;
