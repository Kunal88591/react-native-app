import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  searchQuery: string;
  isHydrated: boolean;
}

const initialState: UiState = {
  searchQuery: '',
  isHydrated: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    hydrateUi(state, action: PayloadAction<UiState>) {
      return action.payload;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
  },
});

export const { setSearchQuery, hydrateUi, setHydrated } = uiSlice.actions;
export default uiSlice.reducer;
