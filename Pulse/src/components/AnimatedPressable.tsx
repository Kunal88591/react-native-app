import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  ...rest
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.timing(scale, {
      toValue,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}> 
      <Pressable
        {...rest}
        onPressIn={event => {
          animateTo(0.97);
          rest.onPressIn?.(event);
        }}
        onPressOut={event => {
          animateTo(1);
          rest.onPressOut?.(event);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(AnimatedPressable);
