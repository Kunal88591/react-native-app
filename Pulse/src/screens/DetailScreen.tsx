import React, { useCallback, useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { toggleSaved } from '../slices/savedSlice';
import ListState from '../components/ListState';
import { colors, radii, spacing } from '../utils/theme';

type DetailRoute = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailRoute>();
  const dispatch = useAppDispatch();

  const product = useAppSelector(state => {
    const fromFeed = state.feed.items.find(item => item.id === route.params.productId);

    if (fromFeed) {
      return fromFeed;
    }

    return state.saved.byId[route.params.productId];
  });

  const isSaved = useAppSelector(state => Boolean(state.saved.byId[route.params.productId]));

  const handleToggleSave = useCallback(() => {
    if (!product) {
      return;
    }

    dispatch(toggleSaved(product));
  }, [dispatch, product]);

  const tags = useMemo(() => product?.tags?.join(' • ') ?? '', [product]);

  if (!product) {
    return (
      <View style={styles.screen}>
        <ListState
          title="Product unavailable"
          description="This item is no longer in your local cache."
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={{ uri: product.thumbnail }} style={styles.heroImage} />
      <View style={styles.card}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.price}>${product.price}</Text>

        <Pressable style={styles.saveButton} onPress={handleToggleSave}>
          <Text style={styles.saveButtonText}>{isSaved ? 'Remove Bookmark' : 'Save Bookmark'}</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.body}>{product.description}</Text>

        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.body}>{`Category: ${product.category}`}</Text>
        <Text style={styles.body}>{`Rating: ${product.rating}`}</Text>
        <Text style={styles.body}>{`Stock: ${product.stock}`}</Text>
        {tags ? <Text style={styles.body}>{`Tags: ${tags}`}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: 260,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  brand: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  price: {
    color: colors.accent,
    fontSize: 28,
    marginTop: spacing.sm,
    fontWeight: '800',
  },
  saveButton: {
    marginTop: spacing.md,
    borderRadius: radii.round,
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.accent,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
});

export default DetailScreen;
