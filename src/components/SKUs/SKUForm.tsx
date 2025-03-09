import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addSKU } from '../../redux/slices/skuSlice';
import { saveSKUs } from '../../services/localStorage.service';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  InputAdornment,
} from '@mui/material';
import { SKU } from '../../types/sku.types';

interface SKUFormProps {
  open: boolean;
  onClose: () => void;
  skus: SKU[];
}

const SKUForm: React.FC<SKUFormProps> = ({ open, onClose, skus }) => {
  const [id, setId] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const dispatch = useAppDispatch();
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!id) newErrors.id = 'SKU ID is required';
    else if (skus.some(sku => sku.id === id)) newErrors.id = 'SKU ID must be unique';
    
    if (!label) newErrors.label = 'SKU label is required';
    if (!className) newErrors.className = 'Class is required';
    if (!department) newErrors.department = 'Department is required';
    
    if (!price) newErrors.price = 'Price is required';
    else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) newErrors.price = 'Price must be a positive number';
    
    if (!cost) newErrors.cost = 'Cost is required';
    else if (isNaN(parseFloat(cost)) || parseFloat(cost) < 0) newErrors.cost = 'Cost must be a positive number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      const newSKU: SKU = {
        id,
        label,
        class: className,
        department,
        price: parseFloat(price),
        cost: parseFloat(cost)
      };
      
      dispatch(addSKU(newSKU));
      saveSKUs([...skus, newSKU]);
      handleClose();
    }
  };
  
  const handleClose = () => {
    setId('');
    setLabel('');
    setClassName('');
    setDepartment('');
    setPrice('');
    setCost('');
    setErrors({});
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New SKU</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="skuId"
                label="SKU ID"
                name="skuId"
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
                label="SKU Label"
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
                id="className"
                label="Class"
                name="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                error={!!errors.className}
                helperText={errors.className}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="department"
                label="Department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                error={!!errors.department}
                helperText={errors.department}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="price"
                label="Price"
                name="price"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="cost"
                label="Cost"
                name="cost"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                error={!!errors.cost}
                helperText={errors.cost}
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

export default SKUForm;