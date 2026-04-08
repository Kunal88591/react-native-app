import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../utils/theme';

const SkeletonCard: React.FC = () => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulse]);

  const bg = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.skeletonBase, colors.skeletonHighlight],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, { backgroundColor: bg }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.lineLarge, { backgroundColor: bg }]} />
        <Animated.View style={[styles.lineSmall, { backgroundColor: bg }]} />
        <Animated.View style={[styles.lineMedium, { backgroundColor: bg }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  image: {
    width: 104,
    height: 104,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  lineLarge: {
    height: 14,
    width: '80%',
    borderRadius: radii.round,
  },
  lineSmall: {
    height: 10,
    width: '90%',
    borderRadius: radii.round,
  },
  lineMedium: {
    height: 10,
    width: '50%',
    borderRadius: radii.round,
  },
});

export default React.memo(SkeletonCard);
