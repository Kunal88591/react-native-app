import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FeedState } from '../slices/feedSlice';
import type { SavedState } from '../slices/savedSlice';
import type { UiState } from '../slices/uiSlice';

const STORAGE_KEY = 'pulse.persistedState.v1';

export interface PersistedState {
  feed: FeedState;
  saved: SavedState;
  ui: UiState;
}

export async function savePersistedState(state: PersistedState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function loadPersistedState(): Promise<PersistedState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}
