import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts } from '../services/api';
import type { RootState } from '../store';
import type { Product } from '../types/product';

export interface FeedState {
  items: Product[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  scrollOffset: number;
}

const initialState: FeedState = {
  items: [],
  total: 0,
  limit: 20,
  skip: 0,
  hasMore: true,
  isInitialLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  scrollOffset: 0,
};

interface FetchFeedArgs {
  refresh?: boolean;
}

interface FetchFeedResult {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  refresh: boolean;
}

export const fetchFeed = createAsyncThunk<
  FetchFeedResult,
  FetchFeedArgs | undefined,
  { state: RootState; rejectValue: string }
>('feed/fetchFeed', async (args, thunkApi) => {
  const state = thunkApi.getState().feed;
  const refresh = Boolean(args?.refresh);

  const skip = refresh ? 0 : state.skip;

  try {
    const result = await fetchProducts({
      limit: state.limit,
      skip,
    });

    return {
      ...result,
      refresh,
    };
  } catch (error) {
    if (error instanceof Error) {
      return thunkApi.rejectWithValue(error.message);
    }

    return thunkApi.rejectWithValue('Something went wrong while loading content.');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setScrollOffset(state, action: PayloadAction<number>) {
      state.scrollOffset = action.payload;
    },
    hydrateFeed(state, action: PayloadAction<FeedState>) {
      return action.payload;
    },
    clearFeedError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        const refresh = Boolean(action.meta.arg?.refresh);
        state.error = null;

        if (refresh) {
          state.isRefreshing = true;
          return;
        }

        if (state.items.length === 0) {
          state.isInitialLoading = true;
        } else {
          state.isLoadingMore = true;
        }
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { products, total, skip, refresh } = action.payload;
        const incoming = products ?? [];

        state.total = total;
        state.limit = action.payload.limit;
        state.skip = skip + incoming.length;
        state.hasMore = state.skip < total;
        state.error = null;

        state.items = refresh
          ? incoming
          : dedupeProducts([...state.items, ...incoming]);

        state.isInitialLoading = false;
        state.isRefreshing = false;
        state.isLoadingMore = false;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to load content right now.';
        state.isInitialLoading = false;
        state.isRefreshing = false;
        state.isLoadingMore = false;
      });
  },
});

function dedupeProducts(items: Product[]): Product[] {
  const byId = new Map<number, Product>();

  items.forEach(item => {
    byId.set(item.id, item);
  });

  return Array.from(byId.values());
}

export const { setScrollOffset, hydrateFeed, clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
