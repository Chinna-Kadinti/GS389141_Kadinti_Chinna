import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addStore } from '../../redux/slices/storeSlice';
import { saveStores } from '../../services/localStorage.service';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';
import { Store } from '../../types/store.types';

interface StoreFormProps {
  open: boolean;
  onClose: () => void;
  stores: Store[];
}

const StoreForm: React.FC<StoreFormProps> = ({ open, onClose, stores }) => {
  const [id, setId] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const dispatch = useAppDispatch();
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!id) newErrors.id = 'Store ID is required';
    else if (stores.some(store => store.id === id)) newErrors.id = 'Store ID must be unique';
    
    if (!label) newErrors.label = 'Store label is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      const newStore: Store = {
        seqNo: 0, // Will be set in the reducer
        id,
        label,
        city,
        state
      };
      
      dispatch(addStore(newStore));
      saveStores([...stores, newStore]);
      handleClose();
    }
  };
  
  const handleClose = () => {
    setId('');
    setLabel('');
    setCity('');
    setState('');
    setErrors({});
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Store</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="storeId"
                label="Store ID"
                name="storeId"
                autoFocus
                value={id}
                onChange={(e) => setId(e.target.value)}
                error={!!errors.id}
                helperText={errors.id}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="label"
                label="Store Label"
                name="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                error={!!errors.label}
                helperText={errors.label}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="state"
                label="State"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreForm;