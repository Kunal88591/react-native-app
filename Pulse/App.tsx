import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from './src/hooks/reduxHooks';
import { useAppLifecycle } from './src/hooks/useAppLifecycle';
import { store } from './src/store';
import { hydrateStore, persistStoreSnapshot } from './src/store/persistence';
import { colors } from './src/utils/theme';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
  },
};

function AppContainer() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(current => current);
  const isHydrated = useAppSelector(current => current.ui.isHydrated);

  useEffect(() => {
    hydrateStore(dispatch).catch(() => {
      // Ignore hydration errors and continue with defaults.
    });
  }, [dispatch]);

  const persistCurrentState = useCallback(() => {
    persistStoreSnapshot(state).catch(() => {
      // Best-effort persistence.
    });
  }, [state]);

  useAppLifecycle({
    onBackground: persistCurrentState,
  });

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeout = setTimeout(() => {
      persistStoreSnapshot(state).catch(() => {
        // Best-effort persistence.
      });
    }, 180);

    return () => {
      clearTimeout(timeout);
    };
  }, [state, isHydrated]);

  if (!isHydrated) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContainer />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loaderScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
