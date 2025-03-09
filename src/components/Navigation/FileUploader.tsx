// src/components/Navigation/FileUploader.tsx
import React, { useRef } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { setStores } from '../../redux/slices/storeSlice';
import { setSKUs } from '../../redux/slices/skuSlice';
import { setWeeks, setPlanningData } from '../../redux/slices/planningSlice';
import { parseExcelFile } from '../../services/excel.service';
import { saveStores, saveSKUs, saveWeeks, savePlanningData } from '../../services/localStorage.service';
import { validateFileType } from '../../utils/validators';
import {
  Button,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import {
  Upload as UploadIcon,
  DataObject as DataObjectIcon,
} from '@mui/icons-material';

const FileUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const [loading, setLoading] = React.useState<boolean>(false);
  
  const handleUploadClick = () => {
    // Trigger the hidden file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLoadSampleData = async () => {
    setLoading(true);
    setSnackbar({
      open: true,
      message: 'Loading sample data...',
      severity: 'info',
    });
    
    try {
      // Load the sample data from the public folder
      console.log("Attempting to fetch sample data...");
      const response = await fetch('/data/sample-data.xlsx');
      console.log("Fetch response:", response);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sample data file: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log("Blob created:", blob.size, "bytes");
      const file = new File([blob], 'sample-data.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Process the file using the same function as the file upload
      await handleFile(file);
    } catch (error) {
      console.error('Error loading sample data:', error);
      setSnackbar({
        open: true,
        message: `Error loading sample data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setLoading(true);
      await handleFile(file);
      setLoading(false);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFile = async (file: File) => {
    console.log("Processing file:", file.name, file.type, file.size, "bytes");
    
    if (!validateFileType(file)) {
      setSnackbar({
        open: true,
        message: 'Invalid file type. Please upload an Excel file.',
        severity: 'error',
      });
      return;
    }
    
    try {
      setSnackbar({
        open: true,
        message: 'Parsing Excel data...',
        severity: 'info',
      });
      
      const data = await parseExcelFile(file);
      console.log("Excel data successfully parsed:", data);
      
      if (!data.stores.length || !data.skus.length || !data.weeks.length) {
        throw new Error("The Excel file does not contain all required data");
      }
      
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
      
      console.log("Data successfully imported and saved");
      setSnackbar({
        open: true,
        message: `Data imported successfully! Loaded ${data.stores.length} stores, ${data.skus.length} SKUs, ${data.weeks.length} weeks, and ${data.planningData.length} planning records.`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error importing data:', error);
      setSnackbar({
        open: true,
        message: `Error importing data: ${error instanceof Error ? error.message : 'Unknown format issue'}. Please check console for details.`,
        severity: 'error',
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Button
          color="inherit"
          startIcon={<UploadIcon />}
          onClick={handleUploadClick}
          sx={{ mr: 1 }}
          disabled={loading}
        >
          Import Data
        </Button>
        <Button
          color="inherit"
          startIcon={<DataObjectIcon />}
          onClick={handleLoadSampleData}
          disabled={loading}
        >
          Load Sample
        </Button>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'success' ? 6000 : null}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileUploader;