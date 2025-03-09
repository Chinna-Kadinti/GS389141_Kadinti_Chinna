// src/pages/StoresPage.tsx
import React from 'react';
import StoreList from '../components/Stores/StoreList';
import { Box, Toolbar } from '@mui/material';

const StoresPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <StoreList />
    </Box>
  );
};

export default StoresPage;