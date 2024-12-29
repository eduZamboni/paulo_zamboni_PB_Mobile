import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MyDarkTheme = {
  dark: true,
  colors: {
    background: '#141414',
    card: '#1c1c1c',
    text: '#ffffff',
    border: '#1c1c1c',
    primary: '#E50914', 
  },
};

export const MyLightTheme = {
  dark: false,
  colors: {
    background: '#ffffff',
    card: '#f8f8f8',
    text: '#000000',
    border: '#f8f8f8',
    primary: '#E50914',
  },
};

const ThemeContext = createContext({
  theme: 'dark',
  setThemeMode: (mode) => {},
  colorScheme: 'dark',
  currentTheme: MyDarkTheme,
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [colorScheme, setColorScheme] = useState('dark');
  const [currentTheme, setCurrentTheme] = useState(MyDarkTheme);

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem('themeMode');
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme('dark');
      }
    })();
  }, []);

  useEffect(() => {
    const systemScheme = Appearance.getColorScheme() || 'light';
    if (theme === 'system') {
      setColorScheme(systemScheme);
      if (systemScheme === 'dark') {
        setCurrentTheme(MyDarkTheme);
      } else {
        setCurrentTheme(MyLightTheme);
      }
    } else if (theme === 'light') {
      setColorScheme('light');
      setCurrentTheme(MyLightTheme);
    } else {
      setColorScheme('dark');
      setCurrentTheme(MyDarkTheme);
    }
  }, [theme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        if (colorScheme === 'dark') {
          setCurrentTheme(MyDarkTheme);
          setColorScheme('dark');
        } else {
          setCurrentTheme(MyLightTheme);
          setColorScheme('light');
        }
      }
    });
    return () => subscription.remove();
  }, [theme]);

  const setThemeMode = async (mode) => {
    setTheme(mode);
    if (mode === 'system') {
      await AsyncStorage.removeItem('themeMode');
    } else {
      await AsyncStorage.setItem('themeMode', mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode, colorScheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);