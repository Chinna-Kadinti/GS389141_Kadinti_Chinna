// src/pages/SKUsPage.tsx
import React from 'react';
import SKUList from '../components/SKUs/SKUList';
import { Box, Toolbar } from '@mui/material';

const SKUsPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <SKUList />
    </Box>
  );
};

export default SKUsPage;