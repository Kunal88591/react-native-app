import type { AppDispatch, RootState } from '.';
import { hydrateFeed } from '../slices/feedSlice';
import { hydrateSaved } from '../slices/savedSlice';
import { hydrateUi, setHydrated } from '../slices/uiSlice';
import { loadPersistedState, savePersistedState } from '../services/storage';

export async function hydrateStore(dispatch: AppDispatch): Promise<void> {
  const persisted = await loadPersistedState();

  if (persisted) {
    dispatch(hydrateFeed(persisted.feed));
    dispatch(hydrateSaved(persisted.saved));
    dispatch(hydrateUi({ ...persisted.ui, isHydrated: true }));
  } else {
    dispatch(setHydrated(true));
  }
}

export async function persistStoreSnapshot(state: RootState): Promise<void> {
  await savePersistedState({
    feed: state.feed,
    saved: state.saved,
    ui: state.ui,
  });
}
