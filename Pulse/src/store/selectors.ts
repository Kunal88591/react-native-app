import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '.';

export const selectFeedItems = (state: RootState) => state.feed.items;
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;

export const selectFilteredFeedItems = createSelector(
  [selectFeedItems, selectSearchQuery],
  (items, query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter(item => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const brand = item.brand?.toLowerCase() ?? '';
      const category = item.category.toLowerCase();

      return (
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        brand.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      );
    });
  },
);

export const selectSavedItems = createSelector(
  [(state: RootState) => state.saved.byId],
  byId => Object.values(byId),
);
