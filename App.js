// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Páginas
import Home from './src/pages/Home';
import Details from './src/pages/Details';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Profile from './src/pages/Profile';
import Settings from './src/pages/Settings';

// Contexts
import { GlobalProvider } from './src/contexts/GlobalContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useThemeContext } from './src/contexts/ThemeContext';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { currentTheme } = useThemeContext();

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="Details" component={Details} options={{ title: 'Detalhes' }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Login' }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Criar Conta' }} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </GlobalProvider>
  );
}