import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SKU } from '../../types/sku.types';

interface SKUState {
  skus: SKU[];
}

const initialState: SKUState = {
  skus: []
};

const skuSlice = createSlice({
  name: 'skus',
  initialState,
  reducers: {
    setSKUs: (state, action: PayloadAction<SKU[]>) => {
      state.skus = action.payload;
    },
    addSKU: (state, action: PayloadAction<SKU>) => {
      state.skus.push(action.payload);
    },
    updateSKU: (state, action: PayloadAction<SKU>) => {
      const index = state.skus.findIndex(sku => sku.id === action.payload.id);
      if (index !== -1) {
        state.skus[index] = action.payload;
      }
    },
    removeSKU: (state, action: PayloadAction<string>) => {
      state.skus = state.skus.filter(sku => sku.id !== action.payload);
    }
  }
});

export const { setSKUs, addSKU, updateSKU, removeSKU } = skuSlice.actions;
export default skuSlice.reducer;