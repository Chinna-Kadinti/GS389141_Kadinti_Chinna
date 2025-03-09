// src/pages/ChartPage.tsx
import React from 'react';
import StoreChart from '../components/Charts/StoreChart';
import { Box, Toolbar } from '@mui/material';

const ChartPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <StoreChart />
    </Box>
  );
};

export default ChartPage;