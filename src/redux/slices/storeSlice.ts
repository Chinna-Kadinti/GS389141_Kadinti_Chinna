import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '../../types/store.types';

interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
}

const initialState: StoreState = {
  stores: [],
  selectedStore: null
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
    addStore: (state, action: PayloadAction<Store>) => {
      // Add store with next sequence number
      const maxSeqNo = state.stores.length > 0 
        ? Math.max(...state.stores.map(store => store.seqNo))
        : 0;
      const newStore = { ...action.payload, seqNo: maxSeqNo + 1 };
      state.stores.push(newStore);
    },
    updateStore: (state, action: PayloadAction<Store>) => {
      const index = state.stores.findIndex(store => store.id === action.payload.id);
      if (index !== -1) {
        state.stores[index] = action.payload;
      }
    },
    removeStore: (state, action: PayloadAction<string>) => {
      state.stores = state.stores.filter(store => store.id !== action.payload);
    },
    reorderStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
    selectStore: (state, action: PayloadAction<Store | null>) => {
      state.selectedStore = action.payload;
    }
  }
});

export const { setStores, addStore, updateStore, removeStore, reorderStores, selectStore } = storeSlice.actions;
export default storeSlice.reducer;