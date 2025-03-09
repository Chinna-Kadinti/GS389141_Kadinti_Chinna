import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setSKUs, updateSKU, removeSKU } from '../../redux/slices/skuSlice';
import { saveSKUs, getSKUs } from '../../services/localStorage.service';
import { formatCurrency } from '../../utils/formatters';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import SKUForm from './SKUForm';

const SKUList: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const { skus } = useAppSelector((state) => state.skus);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Load SKUs from localStorage on component mount
    const storedSKUs = getSKUs();
    if (storedSKUs.length > 0) {
      dispatch(setSKUs(storedSKUs));
    }
  }, [dispatch]);
  
  const handleOpenForm = () => {
    setOpenForm(true);
  };
  
  const handleCloseForm = () => {
    setOpenForm(false);
  };
  
  const handleRemoveSKU = (id: string) => {
    const updatedSKUs = skus.filter((sku) => sku.id !== id);
    dispatch(removeSKU(id));
    saveSKUs(updatedSKUs);
  };
  
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <h1>SKUs</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add SKU
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU ID</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skus.map((sku) => (
              <TableRow key={sku.id}>
                <TableCell>{sku.id}</TableCell>
                <TableCell>{sku.label}</TableCell>
                <TableCell>{sku.class}</TableCell>
                <TableCell>{sku.department}</TableCell>
                <TableCell>{formatCurrency(sku.price)}</TableCell>
                <TableCell>{formatCurrency(sku.cost)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="Edit">
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleRemoveSKU(sku.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <SKUForm 
        open={openForm} 
        onClose={handleCloseForm} 
        skus={skus} 
      />
    </Box>
  );
};

export default SKUList;