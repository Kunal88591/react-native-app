import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../utils/theme';
import type { Product } from '../types/product';
import AnimatedPressable from './AnimatedPressable';

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onPress: (productId: number) => void;
  onToggleSave: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved,
  onPress,
  onToggleSave,
}) => {
  return (
    <AnimatedPressable
      style={styles.outer}
      onPress={() => onPress(product.id)}
      accessibilityRole="button"
    >
      <View style={styles.container}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {product.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {product.description}
          </Text>
          <View style={styles.bottomRow}>
            <Text style={styles.price}>${product.price}</Text>
            <Text
              style={[styles.save, isSaved ? styles.saved : undefined]}
              onPress={() => onToggleSave(product)}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  outer: {
    marginBottom: spacing.md,
  },
  container: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    flexDirection: 'row',
  },
  image: {
    width: 104,
    height: 104,
    backgroundColor: colors.cardAlt,
  },
  content: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 13,
  },
  bottomRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  save: {
    color: colors.textSecondary,
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.round,
    overflow: 'hidden',
    backgroundColor: colors.cardAlt,
  },
  saved: {
    color: colors.accent,
    backgroundColor: colors.accentMuted,
  },
});

export default React.memo(ProductCard);
