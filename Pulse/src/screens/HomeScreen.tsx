import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';
import ListState from '../components/ListState';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { clearFeedError, fetchFeed, setScrollOffset } from '../slices/feedSlice';
import { toggleSaved } from '../slices/savedSlice';
import { setSearchQuery } from '../slices/uiSlice';
import { selectFilteredFeedItems } from '../store/selectors';
import type { RootStackParamList } from '../navigation/types';
import type { Product } from '../types/product';
import { colors, spacing } from '../utils/theme';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<Product>,
);

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigation>();
  const listRef = useRef<FlatList<Product>>(null);
  const restoredRef = useRef(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredItems = useAppSelector(selectFilteredFeedItems);
  const feed = useAppSelector(state => state.feed);
  const savedById = useAppSelector(state => state.saved.byId);
  const isHydrated = useAppSelector(state => state.ui.isHydrated);
  const searchQuery = useAppSelector(state => state.ui.searchQuery);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebouncedValue(localQuery, 400);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (feed.items.length === 0 && !feed.isInitialLoading) {
      dispatch(fetchFeed());
    }
  }, [dispatch, feed.isInitialLoading, feed.items.length, isHydrated]);

  useEffect(() => {
    if (!isHydrated || restoredRef.current || feed.scrollOffset <= 0) {
      return;
    }

    if (feed.items.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: feed.scrollOffset,
        animated: false,
      });
      restoredRef.current = true;
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [feed.items.length, feed.scrollOffset, isHydrated]);

  const handleOpenSaved = useCallback(() => {
    navigation.navigate('Saved');
  }, [navigation]);

  const handleLoadMore = useCallback(() => {
    if (
      feed.hasMore &&
      !feed.isLoadingMore &&
      !feed.isInitialLoading &&
      !feed.isRefreshing
    ) {
      dispatch(fetchFeed());
    }
  }, [dispatch, feed.hasMore, feed.isInitialLoading, feed.isLoadingMore, feed.isRefreshing]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchFeed({ refresh: true }));
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(clearFeedError());
    dispatch(fetchFeed({ refresh: feed.items.length > 0 }));
  }, [dispatch, feed.items.length]);

  const onCardPress = useCallback(
    (productId: number) => {
      navigation.navigate('Detail', { productId });
    },
    [navigation],
  );

  const onToggleSave = useCallback(
    (product: Product) => {
      dispatch(toggleSaved(product));
    },
    [dispatch],
  );

  const searchBarAnimatedStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [0, 120],
            outputRange: [0, -6],
            extrapolate: 'clamp',
          }),
        },
      ],
      opacity: scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [1, 0.92],
        extrapolate: 'clamp',
      }),
    }),
    [scrollY],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isSaved={Boolean(savedById[item.id])}
        onPress={onCardPress}
        onToggleSave={onToggleSave}
      />
    ),
    [onCardPress, onToggleSave, savedById],
  );

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  const renderHeader = useCallback(
    () => (
      <SearchBar
        value={localQuery}
        onChangeText={setLocalQuery}
        animatedStyle={searchBarAnimatedStyle}
      />
    ),
    [localQuery, searchBarAnimatedStyle],
  );

  const renderFooter = useCallback(() => {
    if (!feed.isLoadingMore) {
      return <View style={styles.footerSpacer} />;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }, [feed.isLoadingMore]);

  if (feed.isInitialLoading && feed.items.length === 0) {
    return (
      <View style={styles.screen}>
        <SearchBar value={localQuery} onChangeText={setLocalQuery} />
        <View style={styles.listContent}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </View>
      </View>
    );
  }

  if (feed.error && feed.items.length === 0) {
    return (
      <View style={styles.screen}>
        <SearchBar value={localQuery} onChangeText={setLocalQuery} />
        <ListState
          title="Could not refresh feed"
          description="No internet? We will keep your local cache ready."
          ctaLabel="Retry"
          onPressCta={handleRetry}
          danger
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topActionRow}>
        <Text style={styles.resultText}>{`Results: ${filteredItems.length}`}</Text>
        <Text style={styles.savedLink} onPress={handleOpenSaved}>
          Saved
        </Text>
      </View>
      {feed.error && feed.items.length > 0 ? (
        <Text style={styles.inlineError}>Working from cached data. Tap retry anytime.</Text>
      ) : null}
      <AnimatedFlatList
        ref={listRef}
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={handleRefresh}
        refreshing={feed.isRefreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <ListState
            title="No items matched"
            description="Try a different keyword or clear your search query."
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews
        updateCellsBatchingPeriod={40}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={event => {
          dispatch(setScrollOffset(event.nativeEvent.contentOffset.y));
        }}
        onScrollEndDrag={event => {
          dispatch(setScrollOffset(event.nativeEvent.contentOffset.y));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topActionRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  savedLink: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  inlineError: {
    color: colors.danger,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  footerLoader: {
    paddingVertical: spacing.md,
  },
  footerSpacer: {
    height: spacing.xl,
  },
});

export default HomeScreen;
