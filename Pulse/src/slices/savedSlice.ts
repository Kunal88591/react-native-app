import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

export interface SavedState {
  byId: Record<number, Product>;
}

const initialState: SavedState = {
  byId: {},
};

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    toggleSaved(state, action: PayloadAction<Product>) {
      const product = action.payload;

      if (state.byId[product.id]) {
        delete state.byId[product.id];
      } else {
        state.byId[product.id] = product;
      }
    },
    removeSaved(state, action: PayloadAction<number>) {
      delete state.byId[action.payload];
    },
    hydrateSaved(state, action: PayloadAction<SavedState>) {
      return action.payload;
    },
  },
});

export const { toggleSaved, removeSaved, hydrateSaved } = savedSlice.actions;
export default savedSlice.reducer;
