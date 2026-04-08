import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../components/ProductCard';
import ListState from '../components/ListState';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { toggleSaved } from '../slices/savedSlice';
import { selectSavedItems } from '../store/selectors';
import type { RootStackParamList } from '../navigation/types';
import type { Product } from '../types/product';
import { colors, spacing } from '../utils/theme';

type SavedNavigation = NativeStackNavigationProp<RootStackParamList, 'Saved'>;

const SavedScreen: React.FC = () => {
  const navigation = useNavigation<SavedNavigation>();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectSavedItems);

  const handleOpenDetail = useCallback(
    (productId: number) => {
      navigation.navigate('Detail', { productId });
    },
    [navigation],
  );

  const handleToggleSaved = useCallback(
    (product: Product) => {
      dispatch(toggleSaved(product));
    },
    [dispatch],
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isSaved
            onPress={handleOpenDetail}
            onToggleSave={handleToggleSaved}
          />
        )}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <ListState
            title="No bookmarks yet"
            description="Save items from the feed to access them offline."
          />
        }
      />
    </View>
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
});

export default SavedScreen;
