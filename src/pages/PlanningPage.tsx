// src/pages/PlanningPage.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setWeeks, setPlanningData } from '../redux/slices/planningSlice';
import { getWeeks, getPlanningData } from '../services/localStorage.service';
import PlanningGrid from '../components/Planning/PlanningGrid';
import { Box, Toolbar } from '@mui/material';

const PlanningPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Load weeks and planning data from localStorage on component mount
    const storedWeeks = getWeeks();
    const storedPlanningData = getPlanningData();
    
    if (storedWeeks.length > 0) {
      dispatch(setWeeks(storedWeeks));
    }
    
    if (storedPlanningData.length > 0) {
      dispatch(setPlanningData(storedPlanningData));
    }
  }, [dispatch]);
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <PlanningGrid />
    </Box>
  );
};

export default PlanningPage;