// src/App.tsx - Keep only this part
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navigation/Navbar';
import Sidebar from './components/Navigation/Sidebar';
import LoginPage from './pages/LoginPage';
import StoresPage from './pages/StoresPage';
import SKUsPage from './pages/SKUsPage';
import PlanningPage from './pages/PlanningPage';
import ChartPage from './pages/ChartPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import { parseExcelFile } from './services/excel.service';
import { useAppDispatch } from './redux/hooks';
import { setStores } from './redux/slices/storeSlice';
import { setSKUs } from './redux/slices/skuSlice';
import { setWeeks, setPlanningData } from './redux/slices/planningSlice';
import { saveStores, saveSKUs, saveWeeks, savePlanningData } from './services/localStorage.service';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Handle file upload (could be moved to a component or a utility function)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await parseExcelFile(file);
        
        // Update Redux state
        dispatch(setStores(data.stores));
        dispatch(setSKUs(data.skus));
        dispatch(setWeeks(data.weeks));
        dispatch(setPlanningData(data.planningData));
        
        // Update localStorage
        saveStores(data.stores);
        saveSKUs(data.skus);
        saveWeeks(data.weeks);
        savePlanningData(data.planningData);
        
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the console for details.');
      }
    }
  };
  
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar />
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={<Navigate to="/stores" replace />}
            />
            <Route path="/stores" element={
              <>
                <Sidebar />
                <StoresPage />
              </>
            } />
            <Route path="/skus" element={
              <>
                <Sidebar />
                <SKUsPage />
              </>
            } />
            <Route path="/planning" element={
              <>
                <Sidebar />
                <PlanningPage />
              </>
            } />
            <Route path="/chart" element={
              <>
                <Sidebar />
                <ChartPage />
              </>
            } />
          </Route>
        </Routes>
        
        {/* This could be moved to a separate component */}
        <input
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          id="file-upload"
          onChange={handleFileUpload}
        />
      </Box>
    </BrowserRouter>
  );
};

export default App;