import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setStores, updateStore, removeStore, reorderStores } from '../../redux/slices/storeSlice';
import { saveStores, getStores } from '../../services/localStorage.service';
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
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import StoreForm from './StoreForm';

const StoreList: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const { stores } = useAppSelector((state) => state.stores);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Load stores from localStorage on component mount
    const storedStores = getStores();
    if (storedStores.length > 0) {
      dispatch(setStores(storedStores));
    }
  }, [dispatch]);
  
  const handleOpenForm = () => {
    setOpenForm(true);
  };
  
  const handleCloseForm = () => {
    setOpenForm(false);
  };
  
  const handleRemoveStore = (id: string) => {
    const updatedStores = stores.filter((store) => store.id !== id);
    dispatch(removeStore(id));
    saveStores(updatedStores);
  };
  
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedStores = [...stores];
      // Swap sequence numbers
      const temp = updatedStores[index].seqNo;
      updatedStores[index].seqNo = updatedStores[index - 1].seqNo;
      updatedStores[index - 1].seqNo = temp;
      // Swap positions
      [updatedStores[index], updatedStores[index - 1]] = [updatedStores[index - 1], updatedStores[index]];
      
      dispatch(reorderStores(updatedStores));
      saveStores(updatedStores);
    }
  };
  
  const handleMoveDown = (index: number) => {
    if (index < stores.length - 1) {
      const updatedStores = [...stores];
      // Swap sequence numbers
      const temp = updatedStores[index].seqNo;
      updatedStores[index].seqNo = updatedStores[index + 1].seqNo;
      updatedStores[index + 1].seqNo = temp;
      // Swap positions
      [updatedStores[index], updatedStores[index + 1]] = [updatedStores[index + 1], updatedStores[index]];
      
      dispatch(reorderStores(updatedStores));
      saveStores(updatedStores);
    }
  };
  
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <h1>Stores</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Store
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Store ID</TableCell>
              <TableCell>Store Label</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store, index) => (
              <TableRow key={store.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{store.id}</TableCell>
                <TableCell>{store.label}</TableCell>
                <TableCell>{store.city}</TableCell>
                <TableCell>{store.state}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="Edit">
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleRemoveStore(store.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Move Up">
                      <span>
                        <IconButton 
                          onClick={() => handleMoveUp(index)} 
                          disabled={index === 0}
                        >
                          <ArrowUpIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Move Down">
                      <span>
                        <IconButton 
                          onClick={() => handleMoveDown(index)} 
                          disabled={index === stores.length - 1}
                        >
                          <ArrowDownIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <StoreForm 
        open={openForm} 
        onClose={handleCloseForm} 
        stores={stores} 
      />
    </Box>
  );
};

export default StoreList;