import { AppState, type AppStateStatus } from 'react-native';
import { useEffect, useRef } from 'react';

interface UseAppLifecycleArgs {
  onBackground: () => void;
  onForeground?: () => void;
}

export function useAppLifecycle({
  onBackground,
  onForeground,
}: UseAppLifecycleArgs): void {
  const currentState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const prevState = currentState.current;

      if (prevState === 'active' && nextState.match(/inactive|background/)) {
        onBackground();
      }

      if (
        prevState.match(/inactive|background/) &&
        nextState === 'active' &&
        onForeground
      ) {
        onForeground();
      }

      currentState.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [onBackground, onForeground]);
}
